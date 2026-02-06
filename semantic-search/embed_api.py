"""
Embedding API - Document indexing endpoints with dual authentication

This module provides REST API endpoints for submitting documents to the embedding queue.
All endpoints require both JWT token (from Next.js) and API key for security.

Endpoints:
- POST /api/embed - Submit single document for embedding
- POST /api/embed/batch - Submit multiple documents for embedding
- GET /api/embed/status/{job_id} - Get job status
- GET /api/embed/stats - Get queue statistics
- POST /api/embed/trigger - Trigger bulk database embedding (admin only)
"""

import logging
import asyncio
import psycopg2
import json
import uuid
from typing import Optional, Dict, Any, List, Union
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Header, Query, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field

from config import settings
from queue_client import QueueClient
from security import require_dual_auth, require_auth

logger = logging.getLogger(__name__)

# Initialize router and dependencies
router = APIRouter(prefix="/api/embed", tags=["embedding"])
queue_client = QueueClient()


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class EmbedDocumentRequest(BaseModel):
    """Single document embedding request"""
    main_id: str = Field(..., description="Document ID in format 'base:doc_id' (e.g., 'solution:123')")
    title: Optional[str] = Field(None, description="Document title (fetched from DB if not provided)", min_length=1, max_length=500)
    content: Optional[str] = Field(None, description="Document content (fetched from DB if not provided)", min_length=1)
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")


class EmbedBatchRequest(BaseModel):
    """Batch document embedding request"""
    documents: List[EmbedDocumentRequest] = Field(..., description="List of documents to embed", min_items=1, max_items=100)


class EmbedResponse(BaseModel):
    """Embedding request response"""
    success: bool
    job_id: str
    message: str
    queued_at: str


class BatchEmbedResponse(BaseModel):
    """Batch embedding request response"""
    success: bool
    batch_job_id: str
    message: str
    total_documents: int
    queued_at: str


class JobStatusResponse(BaseModel):
    """Job status response"""
    job_id: str
    status: str  # queued, processing, completed, failed
    created_at: str
    completed_at: Optional[str] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class QueueStatsResponse(BaseModel):
    """Queue statistics response"""
    queued_jobs: int
    failed_jobs: int
    queue_health: str


class TriggerEmbeddingRequest(BaseModel):
    """Trigger database embedding request"""
    base: Union[str, List[str]] = Field(..., description="Database base(s) to embed: single string or array of ['solution', 'experiment', 'actionplan', 'blog']. Use 'all' for all types.")
    batch_size: int = Field(10, description="Number of documents to process per batch", ge=1, le=100)


class TriggerEmbeddingResponse(BaseModel):
    """Trigger database embedding response"""
    success: bool
    message: str
    batch_job_id: str
    total_documents: int
    estimated_time_minutes: int


class RemoveDocumentRequest(BaseModel):
    """Remove document request"""
    main_id: str = Field(..., description="Document ID in format 'base:doc_id' (e.g., 'solution:123')")


class RemoveDocumentResponse(BaseModel):
    """Remove document response"""
    success: bool
    job_id: str
    message: str
    queued_at: str


# ============================================================================
# DATABASE HELPERS
# ============================================================================

def get_db_connection(use_blogs_db: bool = False):
    """Get database connection"""
    if use_blogs_db and settings.blogs_db_host:
        return psycopg2.connect(
            host=settings.blogs_db_host,
            port=settings.blogs_db_port,
            user=settings.blogs_db_user,
            password=settings.blogs_db_password,
            database=settings.blogs_db_name
        )
    else:
        return psycopg2.connect(
            host=settings.db_host,
            port=settings.db_port,
            user=settings.db_user,
            password=settings.db_password,
            database=settings.db_name
        )


def parse_main_id(main_id: str) -> tuple[str, str]:
    """
    Parse main_id in format 'base:doc_id'
    
    Args:
        main_id: ID in format 'solution:123', 'sm:123', 'blog:456', etc.
    
    Returns:
        Tuple of (base_full_name, doc_id)
    
    Raises:
        ValueError: If format is invalid
    """
    if ":" not in main_id:
        raise ValueError(f"Invalid main_id format. Expected 'base:doc_id', got '{main_id}'")
    
    parts = main_id.split(":", 1)
    base = parts[0].lower()
    doc_id = parts[1]
    
    # Map shortkeys to full names
    shortkey_to_full = {
        "sm": "solution",
        "exp": "experiment",
        "ap": "actionplan",
        "blog": "blog"
    }
    
    # Convert shortkey to full name if needed
    base_full = shortkey_to_full.get(base, base)
    
    valid_bases = ["solution", "experiment", "actionplan", "blog"]
    if base_full not in valid_bases:
        raise ValueError(f"Invalid base '{base}'. Must be one of: {valid_bases} or their shortkeys (sm, exp, ap)")
    
    return base_full, doc_id


async def fetch_single_document_from_db(main_id: str) -> Dict[str, Any]:
    """
    Fetch a single document from database by main_id
    
    Args:
        main_id: Document ID in format 'base:doc_id' (e.g., 'solution:123')
    
    Returns:
        Document dictionary with title, content, and metadata
    
    Raises:
        HTTPException: If document not found or database error
    """
    try:
        base, doc_id = parse_main_id(main_id)
        
        # Fetch from pads table (solution, experiment, actionplan)
        if base in ["solution", "experiment", "actionplan"]:
            conn = get_db_connection(use_blogs_db=False)
            cursor = conn.cursor()
            
            # Map base names to extern_db shortkeys
            base_map = {
                "solution": "sm",
                "experiment": "exp",
                "actionplan": "ap"
            }
            
            query = """
                SELECT p.id, p.title, p.sections, e.db
                FROM pads p
                LEFT JOIN extern_db e ON e.id = p.ordb
                WHERE p.id = %s AND e.db = %s AND p.status >= 2
            """
            cursor.execute(query, (int(doc_id), base_map.get(base, base)))
            row = cursor.fetchone()
            
            cursor.close()
            conn.close()
            
            if not row:
                raise HTTPException(
                    status_code=404,
                    detail=f"Document {main_id} not found or not published (status < 2)"
                )
            
            pad_id, title, sections, db_shortkey = row
            return {
                "title": title or "Untitled",
                "content": sections or "",
                "metadata": {"base": db_shortkey, "source": "pads", "pad_id": pad_id}
            }
        
        # Fetch from articles table (blog)
        elif base == "blog":
            conn = get_db_connection(use_blogs_db=True)
            cursor = conn.cursor()
            
            query = """
                SELECT a.id, a.title, 
                       COALESCE(b.content, c.html_content) as content
                FROM articles a
                LEFT JOIN article_content b ON b.article_id = a.id
                LEFT JOIN article_html_content c ON c.article_id = a.id
                WHERE a.id = %s AND a.relevance >= 2
                  AND COALESCE(b.content, c.html_content) IS NOT NULL
                  AND COALESCE(b.content, c.html_content) != ''
                  AND (a.article_type = 'blog' OR a.article_type = 'publications')
            """
            cursor.execute(query, (int(doc_id),))
            row = cursor.fetchone()
            
            cursor.close()
            conn.close()
            
            if not row:
                raise HTTPException(
                    status_code=404,
                    detail=f"Blog article {main_id} not found or not relevant (relevance < 2)"
                )
            
            doc_id_fetched, title, content = row
            return {
                "title": title or "Untitled Blog",
                "content": content or "",
                "metadata": {"base": "blog", "source": "articles"}
            }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching document {main_id} from database: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


async def fetch_documents_from_db(base: str, limit: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    Fetch documents from database by base type
    
    Args:
        base: One of 'solution', 'experiment', 'actionplan', 'blog', or 'all'
        limit: Maximum number of documents to fetch
    
    Returns:
        List of document dictionaries with id, title, content
    """
    documents = []
    
    try:
        # Fetch pads (solution, experiment, actionplan)
        if base in ["solution", "experiment", "actionplan", "all"]:
            conn = get_db_connection(use_blogs_db=False)
            cursor = conn.cursor()
            
            # Map base names to extern_db shortkeys
            base_map = {
                "solution": "sm",
                "experiment": "exp",
                "actionplan": "ap"
            }
            
            if base == "all":
                # Fetch all pads with comprehensive metadata
                query = """
                    SELECT p.id, p.title, p.full_text, p.date, p.status, e.db,
                        array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL AND tg.type = 'thematic_area') as thematic_areas,
                        array_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL AND stg.type = 'sdg') as sdgs,
                        array_agg(DISTINCT l.iso3) FILTER (WHERE l.iso3 IS NOT NULL) as iso3,
                        array_agg(DISTINCT l.lat) FILTER (WHERE l.lat IS NOT NULL) as lats,
                        array_agg(DISTINCT l.lng) FILTER (WHERE l.lng IS NOT NULL) as lngs
                    FROM pads p
                    LEFT JOIN extern_db e ON e.id = p.ordb
                    LEFT JOIN tagging tg ON tg.pad = p.id AND tg.type = 'thematic_area'
                    LEFT JOIN tags t ON t.id = tg.tag_id
                    LEFT JOIN tagging stg ON stg.pad = p.id AND stg.type = 'sdg'
                    LEFT JOIN tags s ON s.id = stg.tag_id
                    LEFT JOIN locations l ON l.pad = p.id
                    WHERE p.status >= 2
                    GROUP BY p.id, p.title, p.full_text, p.date, p.status, e.db
                    ORDER BY p.id
                """
                if limit:
                    query += f" LIMIT {limit}"
                cursor.execute(query)
            else:
                # Fetch specific base with metadata
                query = """
                    SELECT p.id, p.title, p.full_text, p.date, p.status, e.db,
                        array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL AND tg.type = 'thematic_area') as thematic_areas,
                        array_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL AND stg.type = 'sdg') as sdgs,
                        array_agg(DISTINCT l.iso3) FILTER (WHERE l.iso3 IS NOT NULL) as iso3,
                        array_agg(DISTINCT l.lat) FILTER (WHERE l.lat IS NOT NULL) as lats,
                        array_agg(DISTINCT l.lng) FILTER (WHERE l.lng IS NOT NULL) as lngs
                    FROM pads p
                    LEFT JOIN extern_db e ON e.id = p.ordb
                    LEFT JOIN tagging tg ON tg.pad = p.id AND tg.type = 'thematic_area'
                    LEFT JOIN tags t ON t.id = tg.tag_id
                    LEFT JOIN tagging stg ON stg.pad = p.id AND stg.type = 'sdg'
                    LEFT JOIN tags s ON s.id = stg.tag_id
                    LEFT JOIN locations l ON l.pad = p.id
                    WHERE e.db = %s AND p.status >= 2
                    GROUP BY p.id, p.title, p.full_text, p.date, p.status, e.db
                    ORDER BY p.id
                """
                if limit:
                    query += f" LIMIT {limit}"
                cursor.execute(query, (base_map.get(base, base),))
            
            rows = cursor.fetchall()
            for row in rows:
                pad_id, title, full_text, date, status, db_shortkey, thematic_areas, sdgs, iso3, lats, lngs = row
                # Map shortkey back to full name for consistent API
                shortkey_to_full = {
                    "sm": "solution",
                    "exp": "experiment",
                    "ap": "actionplan"
                }
                base_full = shortkey_to_full.get(db_shortkey, db_shortkey)
                
                # Map status to meta_status (matches nlpapi STATUS_MAP logic)
                # nlpapi: status 2='preview', 3='public'. Only these statuses (>=2) are indexed.
                status_map = {
                    2: 'preview',
                    3: 'public'
                }
                meta_status = status_map.get(status)
                
                # Build comprehensive metadata
                metadata = {
                    "base": base_full,
                    "db_shortkey": db_shortkey,
                    "source": "pads",
                    "pad_id": pad_id,
                    "status": meta_status,  # Mapped string value for Qdrant filtering
                    "date": date.isoformat() if date else None,
                    "doc_type": base_full,
                    "language": ["en"],  # Default, could be extracted from pad metadata
                }
                
                # Add tags
                if thematic_areas:
                    metadata["thematic_areas"] = [t for t in thematic_areas if t]
                if sdgs:
                    metadata["sdgs"] = [s for s in sdgs if s]
                
                # Add location data
                if iso3:
                    metadata["iso3"] = [i for i in iso3 if i]
                if lats and lngs and len(lats) > 0 and len(lngs) > 0:
                    metadata["coordinates"] = [{"lat": lat, "lng": lng} for lat, lng in zip(lats, lngs)]
                
                documents.append({
                    "main_id": f"{base_full}:{pad_id}",
                    "title": title or "Untitled",
                    "content": full_text or "",
                    "metadata": metadata
                })
            
            cursor.close()
            conn.close()
        
        # Fetch blogs
        if base in ["blog", "all"]:
            conn = get_db_connection(use_blogs_db=True)
            cursor = conn.cursor()
            
            query = """
                SELECT a.id, a.title, a.url,
                       COALESCE(b.content, c.html_content) as content
                FROM articles a
                LEFT JOIN article_content b ON b.article_id = a.id
                LEFT JOIN article_html_content c ON c.article_id = a.id
                WHERE a.relevance >= 2
                  AND COALESCE(b.content, c.html_content) IS NOT NULL
                  AND COALESCE(b.content, c.html_content) != ''
                ORDER BY a.id
            """
            if limit and base != "all":
                query += f" LIMIT {limit}"
            cursor.execute(query)
            
            rows = cursor.fetchall()
            for row in rows:
                doc_id, title, url, content = row
                documents.append({
                    "main_id": f"blog:{doc_id}",
                    "title": title or "Untitled Blog",
                    "content": content or "",
                    "metadata": {
                        "base": "blog",
                        "source": "articles",
                        "status": "public",  # All indexed blogs are public (matches nlpapi logic)
                        "url": url  # Use actual URL from database for blogs
                    }
                })
            
            cursor.close()
            conn.close()
        
        logger.info(f"Fetched {len(documents)} documents from database (base={base})")
        return documents
        
    except Exception as e:
        logger.error(f"Error fetching documents from database: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("", response_model=EmbedResponse)
async def embed_document(
    request: EmbedDocumentRequest,
    http_request: Request
):
    """
    Submit a single document for embedding
    
    Requires both JWT token (Bearer) and X-API-Key header.
    
    You can either:
    1. Provide just main_id - document will be fetched from database
    2. Provide main_id, title, and content - use custom data
    
    Examples:
    ```bash
    # Fetch from database (like nlpapi)
    curl -X POST "https://api.example.com/api/embed" \\
      -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
      -H "X-API-Key: YOUR_API_KEY" \\
      -H "Content-Type: application/json" \\
      -d '{"main_id": "solution:123"}'
    
    # Provide full document data
    curl -X POST "https://api.example.com/api/embed" \\
      -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
      -H "X-API-Key: YOUR_API_KEY" \\
      -H "Content-Type: application/json" \\
      -d '{
        "main_id": "solution:123",
        "title": "Sustainable Agriculture",
        "content": "This solution focuses on...",
        "metadata": {"country": "Kenya"}
      }'
    ```
    """
    # Require BOTH JWT and API key
    auth = await require_dual_auth(http_request)
    try:
        # If title or content not provided, fetch from database
        if not request.title or not request.content:
            logger.info(f"Fetching document {request.main_id} from database")
            db_doc = await fetch_single_document_from_db(request.main_id)
            
            # Use database values, merge metadata
            title = request.title or db_doc["title"]
            content = request.content or db_doc["content"]
            metadata = {**db_doc.get("metadata", {}), **(request.metadata or {})}
        else:
            title = request.title
            content = request.content
            metadata = request.metadata or {}
        
        # Validate we have title and content
        if not title or not content:
            raise HTTPException(
                status_code=400,
                detail="Document must have title and content (provide them or they will be fetched from DB)"
            )
        # Parse and validate main_id
        base, doc_id = parse_main_id(request.main_id)
        
        # Add metadata
        metadata = request.metadata or {}
        metadata.update({
            "base": base,
            "submitted_by": auth.get("user_id"),
            "submitted_at": datetime.utcnow().isoformat()
        })
        
        # Submit to queue
        job_id = await queue_client.submit_document(
            main_id=request.main_id,
            title=title,
            content=content,
            metadata=metadata
        )
        
        logger.info(f"Document {request.main_id} queued with job_id {job_id}")
        
        return EmbedResponse(
            success=True,
            job_id=job_id,
            message=f"Document queued successfully",
            queued_at=datetime.utcnow().isoformat()
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error submitting document: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to queue document: {str(e)}")


@router.post("/batch", response_model=BatchEmbedResponse)
async def embed_batch(
    request: EmbedBatchRequest,
    http_request: Request
):
    """
    Submit multiple documents for embedding as a batch
    
    Requires both JWT token (Bearer) and X-API-Key header.
    Maximum 100 documents per batch.
    
    Example:
    ```bash
    curl -X POST "https://api.example.com/api/embed/batch" \\
      -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
      -H "X-API-Key: YOUR_API_KEY" \\
      -H "Content-Type: application/json" \\
      -d '{
        "documents": [
          {"main_id": "solution:123", "title": "Title 1", "content": "Content 1"},
          {"main_id": "solution:124", "title": "Title 2", "content": "Content 2"}
        ]
      }'
    ```
    """
    # Require BOTH JWT and API key
    auth = await require_dual_auth(http_request)
    try:
        # Validate all main_ids
        documents = []
        for doc in request.documents:
            base, doc_id = parse_main_id(doc.main_id)
            
            metadata = doc.metadata or {}
            metadata.update({
                "base": base,
                "submitted_by": auth.get("user_id")
            })
            
            documents.append({
                "main_id": doc.main_id,
                "title": doc.title,
                "content": doc.content,
                "metadata": metadata
            })
        
        # Submit batch to queue
        batch_job_id = await queue_client.submit_batch(documents)
        
        logger.info(f"Batch of {len(documents)} documents queued with batch_job_id {batch_job_id}")
        
        return BatchEmbedResponse(
            success=True,
            batch_job_id=batch_job_id,
            message=f"Batch of {len(documents)} documents queued successfully",
            total_documents=len(documents),
            queued_at=datetime.utcnow().isoformat()
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error submitting batch: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to queue batch: {str(e)}")


@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def get_job_status(
    job_id: str,
    http_request: Request
):
    """
    Get the status of an embedding job
    
    Requires both JWT token (Bearer) and X-API-Key header.
    
    Example:
    ```bash
    curl "https://api.example.com/api/embed/status/abc123" \\
      -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
      -H "X-API-Key: YOUR_API_KEY"
    ```
    """
    # Require BOTH JWT and API key
    auth = await require_dual_auth(http_request)
    try:
        status_info = await queue_client.get_job_status(job_id)
        
        if not status_info:
            raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
        
        return JobStatusResponse(**status_info)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching job status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get job status: {str(e)}")


@router.get("/stats", response_model=QueueStatsResponse)
async def get_queue_stats(
    http_request: Request
):
    """
    Get queue statistics
    
    Requires both JWT token (Bearer) and X-API-Key header.
    
    Example:
    ```bash
    curl "https://api.example.com/api/embed/stats" \\
      -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
      -H "X-API-Key: YOUR_API_KEY"
    ```
    """
    # Require BOTH JWT and API key
    auth = await require_dual_auth(http_request)
    try:
        stats = await queue_client.get_queue_stats()
        return QueueStatsResponse(**stats)
        
    except Exception as e:
        logger.error(f"Error fetching queue stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get queue stats: {str(e)}")


@router.post("/trigger", response_model=TriggerEmbeddingResponse)
async def trigger_database_embedding(
    request: TriggerEmbeddingRequest,
    http_request: Request
):
    """
    Trigger bulk embedding from database (ADMIN ONLY)
    
    Fetches documents from the database and submits them to the embedding queue.
    Documents with existing IDs will be automatically re-indexed.
    
    This is useful for:
    - Initial indexing of all documents
    - Re-indexing after model changes
    - Batch processing new documents
    
    Requires both JWT token (Bearer) with admin role and X-API-Key header.
    
    Supported bases:
    - solution: Solution documents from pads table
    - experiment: Experiment documents from pads table
    - actionplan: Action plan documents from pads table
    - blog: Blog articles from articles table
    - all: All document types
    
    The base parameter accepts:
    - Single string: "solution"
    - Array of strings: ["solution", "experiment", "blog"]
    - Use "all" to process all document types
    
    Examples:
    ```bash
    # Single base
    curl -X POST "https://api.example.com/api/embed/trigger" \\
      -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \\
      -H "X-API-Key: YOUR_API_KEY" \\
      -H "Content-Type: application/json" \\
      -d '{"base": "solution", "batch_size": 10}'
    
    # Multiple bases
    curl -X POST "https://api.example.com/api/embed/trigger" \\
      -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \\
      -H "X-API-Key: YOUR_API_KEY" \\
      -H "Content-Type: application/json" \\
      -d '{"base": ["solution", "experiment"], "batch_size": 10}'
    ```
    """
    # Require BOTH JWT and API key
    auth = await require_dual_auth(http_request)
    
    # Check for admin role
    jwt_info = auth.get("jwt", {})
    user_rights = jwt_info.get("rights", 0)
    if user_rights < 3:  # 3 = admin
        raise HTTPException(
            status_code=403,
            detail="Admin privileges required for this operation"
        )
    try:
        # Normalize base to list for consistent processing
        bases_to_process = [request.base] if isinstance(request.base, str) else request.base
        
        logger.info(f"Admin {jwt_info.get('email')} triggering database embedding for base={bases_to_process}")
        
        # Validate bases
        valid_bases = ["solution", "experiment", "actionplan", "blog", "all"]
        for base in bases_to_process:
            if base not in valid_bases:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid base '{base}'. Must be one of: {valid_bases}"
                )
        
        # If "all" is in the list, process all bases
        if "all" in bases_to_process:
            bases_to_process = ["all"]
        
        # Fetch documents from database for all requested bases
        all_documents = []
        for base in bases_to_process:
            documents = await fetch_documents_from_db(base)
            all_documents.extend(documents)
        
        if not all_documents:
            return TriggerEmbeddingResponse(
                success=True,
                message=f"No documents found for base(s): {bases_to_process}",
                batch_job_id="none",
                total_documents=0,
                estimated_time_minutes=0
            )
        
        # Submit batch to queue
        batch_job_id = await queue_client.submit_batch(all_documents)
        
        # Estimate processing time (rough: 2 seconds per document)
        estimated_minutes = max(1, (len(all_documents) * 2) // 60)
        
        logger.info(
            f"Triggered embedding for {len(all_documents)} documents from base(s)={bases_to_process}, "
            f"batch_job_id={batch_job_id}"
        )
        
        bases_str = ", ".join(bases_to_process) if len(bases_to_process) > 1 else bases_to_process[0]
        return TriggerEmbeddingResponse(
            success=True,
            message=f"Successfully queued {len(all_documents)} documents from {bases_str}",
            batch_job_id=batch_job_id,
            total_documents=len(all_documents),
            estimated_time_minutes=estimated_minutes
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error triggering database embedding: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to trigger embedding: {str(e)}")


@router.delete("", response_model=RemoveDocumentResponse)
async def remove_document(
    request: RemoveDocumentRequest,
    http_request: Request
):
    """
    Queue document removal from the index
    
    Removes a document from Qdrant by queuing a removal job.
    The worker will process the removal asynchronously.
    
    Requires both JWT token (Bearer) and X-API-Key header.
    
    Example:
    ```bash
    curl -X DELETE "https://api.example.com/api/embed" \\
      -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
      -H "X-API-Key: YOUR_API_KEY" \\
      -H "Content-Type: application/json" \\
      -d '{
        "main_id": "solution:123"
      }'
    ```
    """
    # Require BOTH JWT and API key
    auth = await require_dual_auth(http_request)
    try:
        # Parse and validate main_id
        base, doc_id = parse_main_id(request.main_id)
        
        # Create removal job
        job_id = str(uuid.uuid4())
        
        job_data = {
            "job_id": job_id,
            "type": "remove",
            "main_id": request.main_id,
            "base": base,
            "doc_id": doc_id,
            "submitted_by": auth.get("user_id"),
            "submitted_at": datetime.utcnow().isoformat(),
            "status": "queued"
        }
        
        # Submit to queue (reusing the same queue)
        r = await queue_client._get_redis()
        
        # Store job data
        await r.hset(
            f"{queue_client.job_status_prefix}{job_id}",
            mapping={
                "job_data": json.dumps(job_data),
                "status": "queued",
                "created_at": job_data["submitted_at"]
            }
        )
        
        # Add to queue
        await r.rpush(queue_client.job_queue_key, json.dumps(job_data))
        
        logger.info(f"Document removal {request.main_id} queued with job_id {job_id}")
        
        return RemoveDocumentResponse(
            success=True,
            job_id=job_id,
            message=f"Document removal queued successfully",
            queued_at=datetime.utcnow().isoformat()
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error queuing document removal: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to queue removal: {str(e)}")


# Health check for embedding API
@router.get("/health")
async def health_check():
    """Health check endpoint (no auth required)"""
    try:
        # Check Redis connectivity
        redis_healthy = await queue_client.health_check()
        
        return {
            "status": "healthy" if redis_healthy else "degraded",
            "redis_connected": redis_healthy,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }
