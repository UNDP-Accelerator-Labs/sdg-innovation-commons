"""
Embedding Worker Service

Processes documents from Redis queue and generates embeddings for Qdrant.
Similar to nlpapi architecture but designed for Kubernetes auto-scaling.

Features:
- Queue-based processing (Redis)
- Batch and single document support
- Auto-scaling via HPA/KEDA
- Graceful shutdown
- Dead letter queue for failures
- Progress tracking
"""

import os
import sys
import time
import signal
import json
import logging
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import redis
from redis.exceptions import RedisError
import structlog

# Import from semantic-search modules
from config import settings
from embeddings import embedding_service
from qdrant_service import qdrant_service
from search import add_document

# Configure structured logging
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.dev.ConsoleRenderer()
    ]
)

logger = structlog.get_logger()

# Worker Configuration
QUEUE_NAME = os.getenv("EMBEDDING_QUEUE_NAME", "embedding_jobs")
BATCH_QUEUE_NAME = os.getenv("BATCH_QUEUE_NAME", "embedding_batch_jobs")
DLQ_NAME = os.getenv("DLQ_NAME", "embedding_dlq")
PROCESSING_QUEUE = f"{QUEUE_NAME}:processing"

WORKER_ID = os.getenv("HOSTNAME", f"worker-{os.getpid()}")
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))
JOB_TIMEOUT = int(os.getenv("JOB_TIMEOUT", "300"))  # 5 minutes
BATCH_SIZE = int(os.getenv("WORKER_BATCH_SIZE", "10"))
POLL_INTERVAL = float(os.getenv("POLL_INTERVAL", "1.0"))  # seconds

# Graceful shutdown flag
shutdown_requested = False


def signal_handler(signum, frame):
    """Handle shutdown signals gracefully."""
    global shutdown_requested
    logger.info("Shutdown signal received", signal=signum)
    shutdown_requested = True


# Register signal handlers
signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)


class RedisQueue:
    """Redis queue client for job management."""
    
    def __init__(self):
        """Initialize Redis connection."""
        self.redis_client = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", "6379")),
            db=int(os.getenv("REDIS_DB", "0")),
            password=os.getenv("REDIS_PASSWORD"),
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=10,
        )
        logger.info("Redis connection initialized", 
                   host=self.redis_client.connection_pool.connection_kwargs['host'])
    
    def push_job(self, queue: str, job_data: Dict[str, Any]) -> bool:
        """Push a job to the queue."""
        try:
            job_json = json.dumps(job_data)
            self.redis_client.lpush(queue, job_json)
            return True
        except Exception as e:
            logger.error("Failed to push job", error=str(e), queue=queue)
            return False
    
    def pop_job(self, queue: str, timeout: int = 0) -> Optional[Dict[str, Any]]:
        """Pop a job from the queue (blocking)."""
        try:
            result = self.redis_client.brpop(queue, timeout=timeout)
            if result:
                _, job_json = result
                return json.loads(job_json)
            return None
        except Exception as e:
            logger.error("Failed to pop job", error=str(e), queue=queue)
            return None
    
    def move_to_dlq(self, job_data: Dict[str, Any], error: str):
        """Move failed job to dead letter queue."""
        job_data['error'] = error
        job_data['failed_at'] = datetime.utcnow().isoformat()
        job_data['worker_id'] = WORKER_ID
        self.push_job(DLQ_NAME, job_data)
        logger.warning("Job moved to DLQ", job_id=job_data.get('job_id'), error=error)
    
    def get_queue_size(self, queue: str) -> int:
        """Get current queue size."""
        try:
            return self.redis_client.llen(queue)
        except Exception:
            return 0
    
    def set_job_status(self, job_id: str, status: str, details: Optional[Dict] = None):
        """Update job status in Redis - matches queue_client format."""
        logger.info(f"set_job_status called", job_id=job_id, status=status)
        key = f"embedding_job_status:{job_id}"
        
        try:
            # Update the status field in the hash
            result = self.redis_client.hset(key, "status", status)
            
            # Optionally store additional details as JSON
            if details:
                self.redis_client.hset(key, "details", json.dumps(details))
            
            # Update timestamp
            self.redis_client.hset(key, "updated_at", datetime.utcnow().isoformat())
            self.redis_client.hset(key, "worker_id", WORKER_ID)
            
        except Exception as e:
            logger.error("Failed to set job status", job_id=job_id, error=str(e), exc_info=True)
    
    def health_check(self) -> bool:
        """Check if Redis is healthy."""
        try:
            self.redis_client.ping()
            return True
        except Exception:
            return False


class EmbeddingWorker:
    """Worker that processes embedding jobs from queue."""
    
    def __init__(self):
        """Initialize the worker."""
        self.queue = RedisQueue()
        self.stats = {
            'processed': 0,
            'errors': 0,
            'started_at': datetime.utcnow().isoformat()
        }
        
    def initialize(self):
        """Initialize embedding service and Qdrant connection."""
        logger.info("Initializing embedding worker", worker_id=WORKER_ID)
        
        # Load embedding model
        logger.info("Loading embedding model...")
        embedding_service.load_model()
        logger.info("Embedding model loaded", 
                   model=settings.embedding_model,
                   device=settings.device)
        
        # Connect to Qdrant and verify connection
        logger.info("Connecting to Qdrant...")
        qdrant_service.connect()
        try:
            collections = qdrant_service.client.get_collections()
            logger.info("Qdrant connected", collections_count=len(collections.collections))
        except Exception as e:
            logger.error("Failed to connect to Qdrant", error=str(e))
            raise
        
        logger.info("Worker initialization complete", worker_id=WORKER_ID)
    
    def process_document(self, job_data: Dict[str, Any]) -> bool:
        """Process a single document embedding job."""
        job_id = job_data.get('job_id', 'unknown')
        
        try:
            # Extract document data
            doc_data = job_data.get('document', {})
            
            # Handle new document format with main_id
            main_id = doc_data.get('main_id')
            if not main_id:
                raise ValueError("Missing main_id in document")
            
            # Parse main_id (format: "base:doc_id")
            try:
                base, doc_id_str = main_id.split(':', 1)
                doc_id = int(doc_id_str)
            except (ValueError, AttributeError):
                raise ValueError(f"Invalid main_id format: {main_id}. Expected format: 'base:doc_id'")
            
            logger.info("Processing document", job_id=job_id, main_id=main_id, base=base, doc_id=doc_id)
            
            # Update status to processing
            self.queue.set_job_status(job_id, 'processing', {
                'main_id': main_id,
                'started_at': datetime.utcnow().isoformat()
            })
            
            # Process the document (generate embeddings and index)
            # Using updated add_document signature: (base, doc_id, url, content, title, meta)
            from config import settings
            
            # For blogs, use the actual URL from database; for pads, generate the URL
            metadata = doc_data.get('metadata', {})
            if base == 'blog' and metadata.get('url'):
                url = metadata['url']  # Use actual URL from articles table
            else:
                url = f"{settings.app_base_url}/pads/{base}/{doc_id}"  # Generated URL for pads
            
            result = asyncio.run(add_document(
                base=base,
                doc_id=doc_id,
                url=url,
                content=doc_data.get('content', ''),
                title=doc_data.get('title', ''),
                meta=metadata
            ))
            
            # Update status to complete
            self.queue.set_job_status(job_id, 'completed', {
                'main_id': main_id,
                'completed_at': datetime.utcnow().isoformat(),
                'result': result
            })
            
            logger.info("Document processed successfully", 
                       job_id=job_id, 
                       main_id=main_id,
                       snippets=result.get('snippets_added', 0))
            
            self.stats['processed'] += 1
            return True
            
        except Exception as e:
            error_msg = str(e)
            logger.error("Failed to process document", 
                        job_id=job_id, 
                        error=error_msg,
                        exc_info=True)
            
            # Update job status to failed
            self.queue.set_job_status(job_id, 'failed', {
                'error': error_msg,
                'failed_at': datetime.utcnow().isoformat()
            })
            
            self.stats['errors'] += 1
            return False
    
    def process_batch(self, job_data: Dict[str, Any]) -> bool:
        """Process a batch of documents."""
        job_id = job_data.get('job_id', 'unknown')
        documents = job_data.get('documents', [])
        
        logger.info("Processing batch", job_id=job_id, count=len(documents))
        
        success_count = 0
        error_count = 0
        
        for idx, doc_data in enumerate(documents):
            try:
                # Create a sub-job for each document
                sub_job = {
                    'job_id': f"{job_id}-{idx}",
                    'document': doc_data,
                    'batch_id': job_id
                }
                
                if self.process_document(sub_job):
                    success_count += 1
                else:
                    error_count += 1
                    
            except Exception as e:
                logger.error("Batch item failed", 
                           job_id=job_id, 
                           index=idx, 
                           error=str(e))
                error_count += 1
        
        # Update batch status
        self.queue.set_job_status(job_id, 'completed', {
            'total': len(documents),
            'success': success_count,
            'errors': error_count,
            'completed_at': datetime.utcnow().isoformat()
        })
        
        logger.info("Batch processing complete", 
                   job_id=job_id,
                   success=success_count,
                   errors=error_count)
        
        return error_count == 0
    
    def run(self):
        """Main worker loop."""
        logger.info("Worker starting", worker_id=WORKER_ID)
        
        # Initialize services
        try:
            self.initialize()
        except Exception as e:
            logger.error("Initialization failed", error=str(e), exc_info=True)
            sys.exit(1)
        
        logger.info("Worker ready, waiting for jobs...", 
                   queue=QUEUE_NAME,
                   batch_queue=BATCH_QUEUE_NAME)
        
        consecutive_errors = 0
        max_consecutive_errors = 10
        
        while not shutdown_requested:
            try:
                # Check Redis health
                if not self.queue.health_check():
                    logger.error("Redis health check failed, reconnecting...")
                    time.sleep(5)
                    continue
                
                # Try to get a job from either queue (prioritize single jobs)
                job_data = self.queue.pop_job(QUEUE_NAME, timeout=int(POLL_INTERVAL))
                
                if not job_data:
                    # Try batch queue if no single jobs
                    job_data = self.queue.pop_job(BATCH_QUEUE_NAME, timeout=int(POLL_INTERVAL))
                    is_batch = True
                else:
                    is_batch = False
                
                if job_data:
                    # Reset error counter on successful job retrieval
                    consecutive_errors = 0
                    
                    # Process the job
                    job_id = job_data.get('job_id', 'unknown')
                    retry_count = job_data.get('retry_count', 0)
                    
                    logger.info("Processing job", 
                               job_id=job_id, 
                               type='batch' if is_batch else 'single',
                               retry=retry_count)
                    
                    try:
                        if is_batch:
                            success = self.process_batch(job_data)
                        else:
                            success = self.process_document(job_data)
                        
                        if not success and retry_count < MAX_RETRIES:
                            # Retry the job
                            job_data['retry_count'] = retry_count + 1
                            queue_name = BATCH_QUEUE_NAME if is_batch else QUEUE_NAME
                            self.queue.push_job(queue_name, job_data)
                            logger.info("Job requeued for retry", 
                                       job_id=job_id, 
                                       retry=retry_count + 1)
                        elif not success:
                            # Max retries exceeded, move to DLQ
                            self.queue.move_to_dlq(job_data, "Max retries exceeded")
                        
                    except Exception as e:
                        logger.error("Job processing failed", 
                                   job_id=job_id, 
                                   error=str(e),
                                   exc_info=True)
                        
                        if retry_count < MAX_RETRIES:
                            job_data['retry_count'] = retry_count + 1
                            queue_name = BATCH_QUEUE_NAME if is_batch else QUEUE_NAME
                            self.queue.push_job(queue_name, job_data)
                        else:
                            self.queue.move_to_dlq(job_data, str(e))
                
                # Log stats periodically
                if self.stats['processed'] > 0 and self.stats['processed'] % 100 == 0:
                    logger.info("Worker statistics", 
                               worker_id=WORKER_ID,
                               **self.stats)
                
            except RedisError as e:
                consecutive_errors += 1
                logger.error("Redis error", 
                           error=str(e), 
                           consecutive_errors=consecutive_errors)
                
                if consecutive_errors >= max_consecutive_errors:
                    logger.error("Too many consecutive errors, shutting down")
                    break
                
                time.sleep(5)  # Wait before retrying
                
            except Exception as e:
                consecutive_errors += 1
                logger.error("Unexpected error in worker loop", 
                           error=str(e), 
                           consecutive_errors=consecutive_errors,
                           exc_info=True)
                
                if consecutive_errors >= max_consecutive_errors:
                    logger.error("Too many consecutive errors, shutting down")
                    break
                
                time.sleep(2)
        
        # Shutdown
        logger.info("Worker shutting down", 
                   worker_id=WORKER_ID, 
                   **self.stats)
        sys.exit(0)


def main():
    """Main entry point."""
    logger.info("=" * 60)
    logger.info("Embedding Worker Service")
    logger.info(f"Worker ID: {WORKER_ID}")
    logger.info(f"Queue: {QUEUE_NAME}")
    logger.info(f"Batch Queue: {BATCH_QUEUE_NAME}")
    logger.info(f"Model: {settings.embedding_model}")
    logger.info(f"Device: {settings.device}")
    logger.info("=" * 60)
    
    worker = EmbeddingWorker()
    worker.run()


if __name__ == "__main__":
    main()
