"""
NLP API Compatible Indexing Endpoints

Maintains backward compatibility with external applications using nlpapi endpoints.
Supports the same request/response format as nlpapi for document indexing.
"""

from typing import Literal, Optional, List
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
import structlog
import psycopg2
from psycopg2.extras import RealDictCursor

from config import settings
from security import require_auth
from queue_api import queue_client

logger = structlog.get_logger()

router = APIRouter(prefix="/api", tags=["nlpapi-compat"])


# Models matching nlpapi format
Base = Literal["solution", "experiment", "actionplan", "blog"]
VectorDB = Literal["main", "test"]


class EmbedAddRequest(BaseModel):
    """Request to add documents to vector database (nlpapi compatible)."""
    main_id: Optional[str] = Field(None, description="Document ID in format 'base:doc_id' (e.g., 'solution:123')")
    bases: Optional[List[Base]] = Field(None, description="List of bases to reindex all documents from")
    db: VectorDB = Field(default="main", description="Target vector database")
    
    class Config:
        json_schema_extra = {
            "example": {
                "main_id": "solution:12345",
                "db": "main"
            }
        }


class AddQueueResponse(BaseModel):
    """Response for queue-based operations."""
    enqueued: bool = Field(..., description="Whether items were successfully queued")
    job_ids: Optional[List[str]] = Field(None, description="List of job IDs for tracking")
    total: Optional[int] = Field(None, description="Total number of documents queued")


def get_db_connection():
    """Get PostgreSQL connection."""
    return psycopg2.connect(
        host=settings.db_host,
        port=settings.db_port,
        database=settings.db_name,
        user=settings.db_user,
        password=settings.db_password
    )


def parse_main_id(main_id: str) -> tuple[str, int]:
    """Parse main_id format 'base:doc_id' into components."""
    try:
        base, doc_id_str = main_id.split(":", 1)
        return base.strip(), int(doc_id_str.strip())
    except (ValueError, AttributeError) as e:
        raise ValueError(f"Invalid main_id format: {main_id}. Expected 'base:doc_id'") from e


def map_pad_status_to_meta(status: int) -> Optional[str]:
    """
    Map pad status integer to meta_status string.
    Matches nlpapi STATUS_MAP logic exactly.
    
    Args:
        status: Integer status from pads table
        
    Returns:
        'preview' for status 2, 'public' for status 3, None otherwise
    """
    # Matches nlpapi/app/system/prep/fulltext.py STATUS_MAP
    status_map = {
        2: 'preview',
        3: 'public'
    }
    return status_map.get(status)


def get_pad_document(doc_id: int, base: str) -> Optional[dict]:
    """
    Fetch a pad document from PostgreSQL.
    
    Args:
        doc_id: The pad_id
        base: The base type (solution, experiment, actionplan)
    
    Returns:
        Document data or None if not found/not indexable
    """
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Query pads table (merged solution/experiment/actionplan)
            query = """
                SELECT 
                    p.id,
                    p.pad_id,
                    p.db,
                    p.title,
                    p.full_text,
                    p.status,
                    p.date,
                    p.language,
                    CONCAT(p.pad_id, '-', p.db) as id_db
                FROM pads p
                WHERE p.pad_id = %s
                  AND p.status >= 2  -- Only preview (2) and published (3)
                  AND p.full_text IS NOT NULL
                  AND p.full_text != ''
                LIMIT 1
            """
            cur.execute(query, (doc_id,))
            row = cur.fetchone()
            
            if not row:
                logger.info("Document not found or not indexable", 
                           doc_id=doc_id, base=base)
                return None
            
            return dict(row)
    finally:
        conn.close()


def get_blog_document(doc_id: int) -> Optional[dict]:
    """
    Fetch a blog document from PostgreSQL.
    
    Args:
        doc_id: The article id
    
    Returns:
        Document data or None if not found/not indexable
    """
    # Use blog database settings if configured, otherwise fall back to main database
    blog_host = settings.blogs_db_host or settings.db_host
    blog_port = settings.blogs_db_port
    blog_db = settings.blogs_db_name
    blog_user = settings.blogs_db_user or settings.db_user
    blog_password = settings.blogs_db_password or settings.db_password
    
    conn = None
    try:
        conn = psycopg2.connect(
            host=blog_host,
            port=blog_port,
            database=blog_db,
            user=blog_user,
            password=blog_password
        )
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Query articles table - only relevance >= 2 like nlpapi
            query = """
                SELECT 
                    a.id,
                    a.title,
                    a.relevance,
                    a.language,
                    a.published as date,
                    c.content as full_text
                FROM articles a
                LEFT JOIN article_content c ON c.article_id = a.id
                WHERE a.id = %s
                  AND a.relevance >= 2  -- Only relevant articles (nlpapi logic)
                  AND c.content IS NOT NULL
                  AND c.content != ''
                LIMIT 1
            """
            cur.execute(query, (doc_id,))
            row = cur.fetchone()
            
            if not row:
                logger.info("Blog document not found or not relevant", doc_id=doc_id)
                return None
            
            # Format to match expected structure
            return {
                'id_db': f"{doc_id}-blog",
                'title': row['title'],
                'full_text': row['full_text'],
                'language': row.get('language', 'en'),
                'date': row['date'],
                'relevance': row['relevance']
            }
    except Exception as e:
        logger.error("Failed to fetch blog document", doc_id=doc_id, error=str(e))
        return None
    finally:
        if conn:
            conn.close()


def get_all_documents_from_base(base: Base) -> List[str]:
    """
    Get all main_ids from a base.
    
    Args:
        base: The base to query (solution, experiment, actionplan, blog)
    
    Returns:
        List of main_ids in format 'base:doc_id'
    """
    main_ids = []
    
    if base in ["solution", "experiment", "actionplan"]:
        # All these are in the pads table
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                query = """
                    SELECT pad_id
                    FROM pads
                    WHERE status >= 2  -- preview and published only
                      AND full_text IS NOT NULL
                      AND full_text != ''
                    ORDER BY pad_id
                """
                cur.execute(query)
                for row in cur.fetchall():
                    main_ids.append(f"{base}:{row[0]}")
        finally:
            conn.close()
    
    elif base == "blog":
        # Blogs in separate database
        blog_host = settings.blogs_db_host or settings.db_host
        blog_port = settings.blogs_db_port
        blog_db = settings.blogs_db_name
        blog_user = settings.blogs_db_user or settings.db_user
        blog_password = settings.blogs_db_password or settings.db_password
        
        conn = None
        try:
            conn = psycopg2.connect(
                host=blog_host,
                port=blog_port,
                database=blog_db,
                user=blog_user,
                password=blog_password
            )
            
            with conn.cursor() as cur:
                query = """
                    SELECT a.id
                    FROM articles a
                    LEFT JOIN article_content c ON c.article_id = a.id
                    WHERE a.relevance >= 2  -- Only relevant (nlpapi logic)
                      AND c.content IS NOT NULL
                      AND c.content != ''
                    ORDER BY a.id
                """
                cur.execute(query)
                for row in cur.fetchall():
                    main_ids.append(f"blog:{row[0]}")
        except Exception as e:
            logger.error("Failed to fetch blog documents", error=str(e))
        finally:
            if conn:
                conn.close()
    
    return main_ids


@router.post("/embed/add", response_model=AddQueueResponse, dependencies=[Depends(require_auth)])
async def embed_add(request: EmbedAddRequest):
    """
    Add (or remove) documents to the vector database.
    
    **NLP API Compatible Endpoint**
    
    This endpoint maintains backward compatibility with nlpapi. Documents are queued
    for processing and indexed asynchronously.
    
    ### Usage:
    
    **Index a single document:**
    ```json
    {
      "main_id": "solution:12345",
      "db": "main"
    }
    ```
    
    **Reindex all documents from bases:**
    ```json
    {
      "bases": ["solution", "blog"],
      "db": "main"
    }
    ```
    
    ### Document Bases:
    - **solution**: Solutions from pads table (status >= 2)
    - **experiment**: Experiments from pads table (status >= 2)
    - **actionplan**: Action plans from pads table (status >= 2)
    - **blog**: Blogs from articles table (relevance >= 2)
    
    ### Notes:
    - Documents with empty content are automatically removed from the index
    - Unpublished documents (status < 2 for pads, relevance < 2 for blogs) are removed
    - Must specify either `main_id` OR `bases`, not both
    
    Args:
        request: Embedding request with main_id or bases
    
    Returns:
        AddQueueResponse: Confirmation with job IDs for tracking
    
    Raises:
        HTTPException: 400 if invalid request, 404 if document not found
    """
    # Validate request - exactly one of main_id or bases must be set
    if (request.main_id is None) == (request.bases is None):
        raise HTTPException(
            status_code=400,
            detail="Must specify either 'main_id' or 'bases', not both"
        )
    
    logger.info("Embed add request", 
               main_id=request.main_id, 
               bases=request.bases, 
               db=request.db)
    
    job_ids = []
    total = 0
    
    # Handle single document
    if request.main_id:
        base, doc_id = parse_main_id(request.main_id)
        
        # Validate base
        if base not in ["solution", "experiment", "actionplan", "blog"]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid base: {base}. Must be one of: solution, experiment, actionplan, blog"
            )
        
        # Fetch document
        if base == "blog":
            doc_data = get_blog_document(doc_id)
        else:
            doc_data = get_pad_document(doc_id, base)
        
        if doc_data is None:
            # Document doesn't exist or shouldn't be indexed - this is OK, just remove from index
            logger.info("Document not found, will be removed from index if present",
                       main_id=request.main_id)
            # Submit empty document to trigger removal
            doc_data = {
                'id_db': f"{doc_id}-{base}",
                'title': '',
                'full_text': '',
                'base': base
            }
        
        # Submit to queue
        # Map status to meta_status (matches nlpapi STATUS_MAP logic)
        # nlpapi: status 2='preview', 3='public'. Only these are indexed.
        # Blogs: all indexed are 'public'
        meta_status = None
        if base == 'blog':
            meta_status = 'public'  # All indexed blogs are public (nlpapi hardcodes this)
        elif 'status' in doc_data:
            status_value = doc_data.get('status')
            if status_value is not None:
                meta_status = map_pad_status_to_meta(int(status_value))
        
        job_data = {
            'document': {
                'id_db': doc_data.get('id_db', f"{doc_id}-{base}"),
                'title': doc_data.get('title', ''),
                'full_text': doc_data.get('full_text', ''),
                'base': base,
                'language': doc_data.get('language', 'en'),
                'created_date': doc_data.get('date').isoformat() if doc_data.get('date') else None,
                'metadata': {
                    'main_id': request.main_id,
                    'doc_id': doc_id,
                    'vdb': request.db,
                    'status': meta_status  # Will become meta_status in Qdrant via flatten_metadata()
                }
            }
        }
        
        job_id = queue_client.submit_job(job_data, is_batch=False)
        job_ids.append(job_id)
        total = 1
    
    # Handle multiple bases
    elif request.bases:
        all_main_ids = []
        
        for base in request.bases:
            if base not in ["solution", "experiment", "actionplan", "blog"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid base: {base}. Must be one of: solution, experiment, actionplan, blog"
                )
            
            logger.info("Fetching all documents from base", base=base)
            main_ids = get_all_documents_from_base(base)
            all_main_ids.extend(main_ids)
            logger.info("Found documents in base", base=base, count=len(main_ids))
        
        total = len(all_main_ids)
        
        # Submit in batches of 100
        batch_size = 100
        for i in range(0, len(all_main_ids), batch_size):
            batch = all_main_ids[i:i + batch_size]
            documents = []
            
            for main_id in batch:
                base, doc_id = parse_main_id(main_id)
                
                # Fetch document
                if base == "blog":
                    doc_data = get_blog_document(doc_id)
                else:
                    doc_data = get_pad_document(doc_id, base)
                
                if doc_data:
                    # Map status to meta_status (matches nlpapi STATUS_MAP logic)
                    # nlpapi: status 2='preview', 3='public'. Only these are indexed.
                    # Blogs: all indexed are 'public'
                    meta_status = None
                    if base == 'blog':
                        meta_status = 'public'  # All indexed blogs are public (nlpapi hardcodes this)
                    elif 'status' in doc_data:
                        status_value = doc_data.get('status')
                        if status_value is not None:
                            meta_status = map_pad_status_to_meta(int(status_value))
                    
                    documents.append({
                        'id_db': doc_data.get('id_db', f"{doc_id}-{base}"),
                        'title': doc_data.get('title', ''),
                        'full_text': doc_data.get('full_text', ''),
                        'base': base,
                        'language': doc_data.get('language', 'en'),
                        'created_date': doc_data.get('date').isoformat() if doc_data.get('date') else None,
                        'metadata': {
                            'main_id': main_id,
                            'doc_id': doc_id,
                            'vdb': request.db,
                            'status': meta_status  # Will become meta_status in Qdrant via flatten_metadata()
                        }
                    })
            
            if documents:
                job_data = {
                    'documents': documents,
                    'metadata': {
                        'bases': request.bases,
                        'vdb': request.db,
                        'batch_index': i // batch_size
                    }
                }
                job_id = queue_client.submit_job(job_data, is_batch=True)
                job_ids.append(job_id)
        
        logger.info("All documents queued", 
                   bases=request.bases, 
                   total=total, 
                   batches=len(job_ids))
    
    return AddQueueResponse(
        enqueued=True,
        job_ids=job_ids if job_ids else None,
        total=total
    )


@router.post("/embed/status")
async def embed_status(job_ids: List[str]):
    """
    Check the status of multiple embedding jobs.
    
    This is a helper endpoint for checking multiple job statuses at once.
    
    Args:
        job_ids: List of job IDs to check
    
    Returns:
        Dict with status of each job
    """
    statuses = {}
    
    for job_id in job_ids:
        status_data = queue_client.get_job_status(job_id)
        if status_data:
            statuses[job_id] = status_data
        else:
            statuses[job_id] = {"status": "not_found"}
    
    return statuses
