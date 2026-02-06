"""
Queue Client - Interface for Redis job queue

Provides methods to submit jobs, check status, and get queue statistics.
Used by both API endpoints and worker processes.
"""

import json
import uuid
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
import redis.asyncio as redis

from config import settings

logger = logging.getLogger(__name__)


class QueueClient:
    """
    Client for interacting with Redis job queue
    
    Manages three Redis lists:
    - embedding_jobs: Queue of pending jobs
    - embedding_batch_jobs: Queue of batch jobs
    - embedding_dlq: Dead letter queue for failed jobs
    
    And a hash for job metadata:
    - embedding_job_status:{job_id}: Job status and metadata
    """
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self.job_queue_key = "embedding_jobs"
        self.batch_queue_key = "embedding_batch_jobs"
        self.dlq_key = "embedding_dlq"
        self.job_status_prefix = "embedding_job_status:"
    
    async def _get_redis(self) -> redis.Redis:
        """Get or create Redis connection"""
        if not self.redis_client:
            self.redis_client = await redis.from_url(
                f"redis://{settings.redis_host}:{settings.redis_port}",
                password=settings.redis_password if settings.redis_password else None,
                decode_responses=True,
                encoding="utf-8"
            )
        return self.redis_client
    
    async def submit_document(
        self,
        main_id: str,
        title: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Submit a single document to the queue
        
        Args:
            main_id: Document ID in format 'base:doc_id'
            title: Document title
            content: Document content
            metadata: Additional metadata
        
        Returns:
            Job ID
        """
        job_id = str(uuid.uuid4())
        
        job_data = {
            "job_id": job_id,
            "main_id": main_id,
            "title": title,
            "content": content,
            "metadata": metadata or {},
            "created_at": datetime.utcnow().isoformat(),
            "status": "queued"
        }
        
        r = await self._get_redis()
        
        # Store job data
        await r.hset(
            f"{self.job_status_prefix}{job_id}",
            mapping={
                "job_data": json.dumps(job_data),
                "status": "queued",
                "created_at": job_data["created_at"]
            }
        )
        
        # Add to queue
        await r.rpush(self.job_queue_key, json.dumps(job_data))
        
        logger.info(f"Queued job {job_id} for document {main_id}")
        return job_id
    
    async def submit_batch(
        self,
        documents: List[Dict[str, Any]]
    ) -> str:
        """
        Submit a batch of documents to the queue
        
        Args:
            documents: List of document dicts with main_id, title, content, metadata
        
        Returns:
            Batch job ID
        """
        batch_job_id = str(uuid.uuid4())
        
        # Create individual jobs for each document
        job_ids = []
        r = await self._get_redis()
        
        for doc in documents:
            job_id = str(uuid.uuid4())
            job_ids.append(job_id)
            
            job_data = {
                "job_id": job_id,
                "batch_job_id": batch_job_id,
                "document": {
                    "main_id": doc["main_id"],
                    "title": doc["title"],
                    "content": doc["content"],
                    "metadata": doc.get("metadata", {})
                },
                "created_at": datetime.utcnow().isoformat(),
                "status": "queued"
            }
            
            # Store job data
            await r.hset(
                f"{self.job_status_prefix}{job_id}",
                mapping={
                    "job_data": json.dumps(job_data),
                    "status": "queued",
                    "created_at": job_data["created_at"]
                }
            )
            
            # Add to queue
            await r.rpush(self.job_queue_key, json.dumps(job_data))
        
        # Store batch metadata
        batch_data = {
            "batch_job_id": batch_job_id,
            "total_documents": len(documents),
            "job_ids": job_ids,
            "created_at": datetime.utcnow().isoformat(),
            "status": "queued"
        }
        
        await r.hset(
            f"{self.job_status_prefix}{batch_job_id}",
            mapping={
                "batch_data": json.dumps(batch_data),
                "status": "queued",
                "created_at": batch_data["created_at"]
            }
        )
        
        logger.info(f"Queued batch {batch_job_id} with {len(documents)} documents")
        return batch_job_id
    
    async def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        """
        Get status of a job
        
        Args:
            job_id: Job or batch job ID
        
        Returns:
            Dict with job status info, or None if not found
        """
        r = await self._get_redis()
        
        job_info = await r.hgetall(f"{self.job_status_prefix}{job_id}")
        
        if not job_info:
            return None
        
        # Parse job data
        if "job_data" in job_info:
            job_data = json.loads(job_info["job_data"])
        elif "batch_data" in job_info:
            job_data = json.loads(job_info["batch_data"])
        else:
            return None
        
        return {
            "job_id": job_id,
            "status": job_info.get("status", "unknown"),
            "created_at": job_info.get("created_at"),
            "completed_at": job_info.get("completed_at"),
            "error": job_info.get("error"),
            "metadata": job_data.get("metadata", {})
        }
    
    async def get_queue_stats(self) -> Dict[str, Any]:
        """
        Get queue statistics
        
        Returns:
            Dict with queue stats (queued and failed counts only)
        """
        r = await self._get_redis()
        
        # Get queue lengths
        queued_jobs = await r.llen(self.job_queue_key)
        failed_jobs = await r.llen(self.dlq_key)
        
        stats = {
            "queued_jobs": queued_jobs,
            "failed_jobs": failed_jobs,
            "queue_health": "healthy" if failed_jobs < 100 else "degraded"
        }
        
        return stats
    
    async def health_check(self) -> bool:
        """
        Check if Redis connection is healthy
        
        Returns:
            True if healthy, False otherwise
        """
        try:
            r = await self._get_redis()
            await r.ping()
            return True
        except Exception as e:
            logger.error(f"Redis health check failed: {e}")
            return False
    
    async def close(self):
        """Close Redis connection"""
        if self.redis_client:
            await self.redis_client.close()
            self.redis_client = None
