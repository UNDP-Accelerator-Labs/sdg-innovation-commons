"""Main FastAPI application for semantic search service."""
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog

from config import settings
from models import (
    SearchRequest,
    SearchResponse,
    StatsRequest,
    StatsResponse,
    AddDocumentRequest,
    AddDocumentResponse,
    HealthResponse,
)
from security import verify_api_key, optional_auth
from embeddings import embedding_service
from qdrant_service import qdrant_service
from search import semantic_search, add_document

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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    # Startup
    logger.info("Starting semantic search service")
    
    try:
        # Load embedding model
        embedding_service.load_model()
        
        # Connect to Qdrant
        qdrant_service.connect()
        qdrant_service.ensure_collection_exists(
            dimension=embedding_service.get_dimension()
        )
        
        logger.info("Service initialized successfully")
        
    except Exception as e:
        logger.error("Failed to initialize service", error=str(e))
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down semantic search service")
    qdrant_service.close()


# Initialize FastAPI app
app = FastAPI(
    title="SDG Commons Semantic Search API",
    description="Internal semantic search service for SDG Innovation Commons",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint."""
    return {
        "service": "semantic-search",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    
    Returns service status and connection health.
    """
    return HealthResponse(
        status="healthy",
        qdrant_connected=qdrant_service.health_check(),
        embedding_model_loaded=embedding_service.is_loaded(),
    )


@app.post("/api/search", response_model=SearchResponse, tags=["Search"])
async def search_endpoint(
    request: SearchRequest,
    auth: Optional[dict] = Security(optional_auth)
):
    """
    Public semantic search endpoint (optional authentication).
    
    - If authenticated, can access all documents based on user permissions
    - If not authenticated, only public documents are returned
    
    Args:
        request: Search request parameters
        auth: Optional authentication credentials
        
    Returns:
        Search results
    """
    # Apply security filter for unauthenticated requests
    if auth is None:
        if request.filters is None:
            request.filters = SearchFilters(status=["public"])
        else:
            request.filters.status = ["public"]
    
    logger.info(
        "Search request",
        query=request.input[:50] if request.input else "",
        authenticated=auth is not None,
        filters=request.filters.dict() if request.filters else None
    )
    
    return await semantic_search(request)


@app.post("/api/query_embed", response_model=SearchResponse, tags=["Search"])
async def query_embed_endpoint(
    request: SearchRequest,
    auth: dict = Depends(verify_api_key)
):
    """
    Authenticated semantic search endpoint.
    
    Requires API key or JWT token.
    Can access documents based on authentication level.
    
    Args:
        request: Search request parameters
        auth: Authentication credentials (required)
        
    Returns:
        Search results
    """
    logger.info(
        "Authenticated search request",
        query=request.input[:50] if request.input else "",
        auth_type=auth.get("type", "jwt")
    )
    
    return await semantic_search(request)


@app.post("/api/stats", response_model=StatsResponse, tags=["Statistics"])
async def stats_endpoint(
    request: StatsRequest,
    auth: Optional[dict] = Security(optional_auth)
):
    """
    Get document statistics.
    
    Returns counts and field distributions for documents matching filters.
    
    Args:
        request: Statistics request parameters
        auth: Optional authentication credentials
        
    Returns:
        Statistics response
    """
    # Apply security filter for unauthenticated requests
    if auth is None:
        if request.filters is None:
            request.filters = SearchFilters(status=["public"])
        else:
            request.filters.status = ["public"]
    
    try:
        stats = qdrant_service.get_stats(filters=request.filters)
        
        return StatsResponse(
            doc_count=stats.get("filtered_documents", 0),
            fields={},  # TODO: Implement field aggregations
            status="ok"
        )
        
    except Exception as e:
        logger.error("Stats request failed", error=str(e))
        return StatsResponse(
            doc_count=0,
            fields={},
            status="error"
        )


@app.post("/api/add_document", response_model=AddDocumentResponse, tags=["Documents"])
async def add_document_endpoint(
    request: AddDocumentRequest,
    auth: dict = Depends(verify_api_key)
):
    """
    Add or update a document in the vector database.
    
    Requires authentication.
    
    Args:
        request: Document data
        auth: Authentication credentials (required)
        
    Returns:
        Add document response
    """
    logger.info(
        "Add document request",
        base=request.base,
        doc_id=request.doc_id,
        content_length=len(request.content)
    )
    
    result = await add_document(
        base=request.base,
        doc_id=request.doc_id,
        url=request.url,
        content=request.content,
        title=request.title,
        meta=request.meta
    )
    
    return AddDocumentResponse(**result)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    logger.error(
        "Unhandled exception",
        error=str(exc),
        path=request.url.path,
        method=request.method
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal server error",
            "detail": str(exc) if settings.log_level == "DEBUG" else None
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.service_host,
        port=settings.service_port,
        reload=True,
        log_level=settings.log_level.lower()
    )
