"""
Queue Management API

Endpoints for submitting embedding jobs to the queue and monitoring status.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
import json
from fastapi import APIRouter, HTTPException, Depends
import redis
from pydantic import BaseModel, Field
import structlog

from config import settings
from security import require_auth

logger = structlog.get_logger()

router = APIRouter(prefix="/api/queue", tags=["queue"])


# Models
class DocumentJob(BaseModel):
    """Single document embedding job."""
    id_db: str = Field(..., description="Unique document identifier (format: doc_id-db_id)")
    title: str = Field(..., description="Document title")
    full_text: str = Field(..., description="Full document text")
    base: str = Field(default="solution", description="Document base/type")
    language: str = Field(default="en", description="Document language code")
    created_date: Optional[str] = Field(None, description="Document creation date (ISO format)")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class BatchJobRequest(BaseModel):
    """Batch embedding job request."""
    documents: List[DocumentJob] = Field(..., description="List of documents to process")
    priority: int = Field(default=5, ge=1, le=10, description="Job priority (1=highest, 10=lowest)")


class JobSubmitResponse(BaseModel):
    """Response after submitting a job."""
    job_id: str
    status: str
    queue: str
    submitted_at: str
    estimated_wait_time: Optional[int] = None  # seconds


class JobStatusResponse(BaseModel):
    """Job status information."""
    job_id: str
    status: str
    worker_id: Optional[str] = None
    submitted_at: Optional[str] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    updated_at: Optional[str] = None
    error: Optional[str] = None
    result: Optional[Dict[str, Any]] = None


class QueueStatsResponse(BaseModel):
    """Queue statistics."""
    single_queue_size: int
    batch_queue_size: int
    processing_count: int
    dlq_size: int
    total_pending: int


# Redis Queue Client
class QueueClient:
    """Redis queue client for job submission and monitoring."""
    
    def __init__(self):
        """Initialize Redis connection."""
        import os
        self.redis_client = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", "6379")),
            db=int(os.getenv("REDIS_DB", "0")),
            password=os.getenv("REDIS_PASSWORD"),
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=10,
        )
        
        self.queue_name = os.getenv("EMBEDDING_QUEUE_NAME", "embedding_jobs")
        self.batch_queue_name = os.getenv("BATCH_QUEUE_NAME", "embedding_batch_jobs")
        self.dlq_name = os.getenv("DLQ_NAME", "embedding_dlq")
        self.processing_queue = f"{self.queue_name}:processing"
    
    def submit_job(self, job_data: Dict[str, Any], is_batch: bool = False) -> str:
        """Submit a job to the queue."""
        job_id = str(uuid.uuid4())
        
        job_data['job_id'] = job_id
        job_data['submitted_at'] = datetime.utcnow().isoformat()
        job_data['retry_count'] = 0
        
        queue = self.batch_queue_name if is_batch else self.queue_name
        
        try:
            job_json = json.dumps(job_data)
            self.redis_client.lpush(queue, job_json)
            
            # Set initial status
            self.set_job_status(job_id, 'queued')
            
            logger.info("Job submitted", 
                       job_id=job_id, 
                       queue=queue,
                       is_batch=is_batch)
            
            return job_id
            
        except Exception as e:
            logger.error("Failed to submit job", error=str(e))
            raise HTTPException(status_code=500, detail=f"Failed to submit job: {str(e)}")
    
    def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get job status from Redis."""
        try:
            key = f"job:{job_id}:status"
            data = self.redis_client.get(key)
            
            if data:
                return json.loads(data)
            return None
            
        except Exception as e:
            logger.error("Failed to get job status", job_id=job_id, error=str(e))
            return None
    
    def set_job_status(self, job_id: str, status: str, details: Optional[Dict] = None):
        """Set job status in Redis."""
        from datetime import timedelta
        key = f"job:{job_id}:status"
        data = {
            'job_id': job_id,
            'status': status,
            'updated_at': datetime.utcnow().isoformat()
        }
        if details:
            data.update(details)
        
        try:
            # Keep status for 24 hours
            self.redis_client.setex(key, timedelta(hours=24), json.dumps(data))
        except Exception as e:
            logger.error("Failed to set job status", job_id=job_id, error=str(e))
    
    def get_queue_stats(self) -> Dict[str, int]:
        """Get queue statistics."""
        try:
            return {
                'single_queue_size': self.redis_client.llen(self.queue_name),
                'batch_queue_size': self.redis_client.llen(self.batch_queue_name),
                'processing_count': self.redis_client.llen(self.processing_queue),
                'dlq_size': self.redis_client.llen(self.dlq_name),
            }
        except Exception as e:
            logger.error("Failed to get queue stats", error=str(e))
            return {
                'single_queue_size': 0,
                'batch_queue_size': 0,
                'processing_count': 0,
                'dlq_size': 0,
            }
    
    def health_check(self) -> bool:
        """Check if Redis is healthy."""
        try:
            self.redis_client.ping()
            return True
        except Exception:
            return False


# Global queue client
queue_client = QueueClient()


# Endpoints

@router.post("/submit", response_model=JobSubmitResponse, dependencies=[Depends(require_auth)])
async def submit_document(document: DocumentJob):
    """
    Submit a single document for embedding processing.
    
    The document will be processed asynchronously by a worker.
    Use the returned job_id to check status.
    """
    job_data = {
        'document': document.model_dump()
    }
    
    job_id = queue_client.submit_job(job_data, is_batch=False)
    
    # Estimate wait time based on queue size
    stats = queue_client.get_queue_stats()
    estimated_wait = stats['single_queue_size'] * 2  # ~2 seconds per document
    
    return JobSubmitResponse(
        job_id=job_id,
        status='queued',
        queue='embedding_jobs',
        submitted_at=datetime.utcnow().isoformat(),
        estimated_wait_time=estimated_wait
    )


@router.post("/submit-batch", response_model=JobSubmitResponse, dependencies=[Depends(require_auth)])
async def submit_batch(batch: BatchJobRequest):
    """
    Submit a batch of documents for embedding processing.
    
    All documents in the batch will be processed by the same worker.
    Use the returned job_id to check overall batch status.
    """
    if not batch.documents:
        raise HTTPException(status_code=400, detail="Batch must contain at least one document")
    
    if len(batch.documents) > 1000:
        raise HTTPException(status_code=400, detail="Batch size cannot exceed 1000 documents")
    
    job_data = {
        'documents': [doc.model_dump() for doc in batch.documents],
        'priority': batch.priority,
        'count': len(batch.documents)
    }
    
    job_id = queue_client.submit_job(job_data, is_batch=True)
    
    # Estimate wait time based on queue size and batch size
    stats = queue_client.get_queue_stats()
    estimated_wait = stats['batch_queue_size'] * 5 + len(batch.documents) * 2
    
    return JobSubmitResponse(
        job_id=job_id,
        status='queued',
        queue='embedding_batch_jobs',
        submitted_at=datetime.utcnow().isoformat(),
        estimated_wait_time=estimated_wait
    )


@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    """
    Get the status of a submitted job.
    
    Status can be: queued, processing, completed, failed
    """
    status_data = queue_client.get_job_status(job_id)
    
    if not status_data:
        raise HTTPException(status_code=404, detail="Job not found or expired")
    
    return JobStatusResponse(**status_data)


@router.get("/stats", response_model=QueueStatsResponse, dependencies=[Depends(require_auth)])
async def get_queue_stats():
    """
    Get current queue statistics.
    
    Shows number of pending jobs in each queue.
    """
    stats = queue_client.get_queue_stats()
    
    return QueueStatsResponse(
        single_queue_size=stats['single_queue_size'],
        batch_queue_size=stats['batch_queue_size'],
        processing_count=stats['processing_count'],
        dlq_size=stats['dlq_size'],
        total_pending=stats['single_queue_size'] + stats['batch_queue_size']
    )


@router.get("/health")
async def queue_health():
    """Check if the queue system is healthy."""
    is_healthy = queue_client.health_check()
    
    if not is_healthy:
        raise HTTPException(status_code=503, detail="Queue system unavailable")
    
    return {"status": "healthy", "queue": "redis"}


@router.delete("/job/{job_id}", dependencies=[Depends(require_auth)])
async def cancel_job(job_id: str):
    """
    Cancel a queued job (not supported for jobs already processing).
    
    Returns success if job was found and removed from queue.
    """
    # This is a simplified version - full implementation would need to:
    # 1. Search through the queue for the job
    # 2. Remove it if found and not yet processing
    # 3. Update status to 'cancelled'
    
    raise HTTPException(
        status_code=501, 
        detail="Job cancellation not yet implemented. Jobs expire after 24 hours."
    )


@router.post("/dlq/retry/{job_id}", dependencies=[Depends(require_auth)])
async def retry_dlq_job(job_id: str):
    """
    Retry a failed job from the dead letter queue.
    
    Moves the job back to the appropriate queue for reprocessing.
    """
    raise HTTPException(
        status_code=501, 
        detail="DLQ retry not yet implemented. Check logs for failed job details."
    )
