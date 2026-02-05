"""Main FastAPI application for semantic search service."""
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, Security, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, APIKeyHeader
from fastapi.openapi.models import SecuritySchemeType
import structlog

from config import settings
from models import (
    SearchRequest,
    SearchResponse,
    SearchFilters,
    StatsRequest,
    StatsResponse,
    AddEmbedRequest,
    AddEmbedResponse,
    RemoveDocumentRequest,
    HealthResponse,
)
from security import get_current_user, require_auth, require_dual_auth
from embeddings import embedding_service
from qdrant_service import qdrant_service
from search import semantic_search, add_document
from maintenance import clean_qdrant_index

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
    swagger_ui_parameters={
        "persistAuthorization": True,
    }
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Configure OpenAPI security schemes for Swagger UI
app.openapi_schema = None  # Reset to regenerate with security

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    from fastapi.openapi.utils import get_openapi
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token (from Next.js authentication)"
        },
        "apiKeyAuth": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-Key",
            "description": "Enter your API key for service-to-service authentication"
        }
    }
    
    # Make all endpoints require either bearer or API key auth
    openapi_schema["security"] = [
        {"bearerAuth": []},
        {"apiKeyAuth": []}
    ]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi


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
    
    Returns service status, connection health, and architecture configuration.
    """
    return HealthResponse(
        status="healthy",
        qdrant_connected=qdrant_service.health_check(),
        embedding_model_loaded=embedding_service.is_loaded(),
        architecture="dual-collection",
        collections={
            "vec": settings.vec_collection_name,
            "data": settings.data_collection_name,
            "legacy": None,
        }
    )


@app.post("/api/search", response_model=SearchResponse, tags=["Search"])
async def search_endpoint(
    request: SearchRequest,
    http_request: Request
):
    """
    Semantic search endpoint with automatic authentication detection.
    
    - No token: returns public documents only
    - Valid JWT: returns full access based on user permissions
    - Invalid JWT: returns 401 Unauthorized
    
    Args:
        request: Search request parameters
        http_request: FastAPI request object for authentication
        
    Returns:
        Search results
        
    Raises:
        HTTPException: 401 if invalid token provided
    """
    try:
        # Get current user from JWT or cookies
        # This will raise HTTPException if token is provided but invalid
        auth = await get_current_user(http_request)
    except HTTPException:
        # Re-raise authentication errors (401 Unauthorized)
        raise
    
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


@app.post("/api/stats", response_model=StatsResponse, tags=["Statistics"])
async def stats_endpoint(
    request: StatsRequest,
    http_request: Request
):
    """
    Get document statistics with automatic authentication detection.
    
    - No token: returns public documents statistics only
    - Valid JWT: returns full statistics based on user permissions
    - Invalid JWT: returns 401 Unauthorized
    
    Args:
        request: Statistics request parameters
        http_request: FastAPI request object for authentication
        
    Returns:
        Statistics response
        
    Raises:
        HTTPException: 401 if invalid token provided
    """
    try:
        # Get current user from JWT or cookies
        # This will raise HTTPException if token is provided but invalid
        auth = await get_current_user(http_request)
    except HTTPException:
        # Re-raise authentication errors (401 Unauthorized)
        raise
    
    # Apply security filter for unauthenticated requests
    if auth is None:
        if request.filters is None:
            request.filters = SearchFilters(status=["public"])
        else:
            request.filters.status = ["public"]
    
    logger.info(
        "Stats request",
        fields=request.fields,
        authenticated=auth is not None
    )
    
    try:
        stats = qdrant_service.get_stats(filters=request.filters)
        
        # Get field aggregations based on requested fields
        field_aggregations = {}
        for field in request.fields:
            if field in ["doc_type", "language", "iso3", "status"]:
                field_data = stats.get("field_aggregations", {}).get(field, {})
                field_aggregations[field] = field_data
        
        return StatsResponse(
            doc_count=stats.get("doc_count", 0),
            fields=field_aggregations,
            status="ok"
        )
        
    except Exception as e:
        logger.error("Stats request failed", error=str(e))
        return StatsResponse(
            doc_count=0,
            fields={},
            status="error"
        )


@app.post("/api/add_embed", response_model=AddEmbedResponse, tags=["Documents"])
async def add_embed_endpoint(
    request: AddEmbedRequest,
    http_request: Request
):
    """
    Add or update a document embedding in the vector database.
    
    Matches the NLP API add_embed endpoint exactly.
    Empty input content removes the document.
    
    Requires DUAL authentication: Both JWT token AND API key must be valid.
    
    Args:
        request: Document embedding data
        http_request: FastAPI request object for authentication
        
    Returns:
        Add embed response
    """
    # Require BOTH JWT and API key for document modification
    auth = await require_dual_auth(http_request)
    
    logger.info(
        "Add embed request",
        doc_id=request.doc_id,
        content_length=len(request.input),
        url=request.url,
        auth_type=auth.get("type"),
        user_id=auth.get("user_id")
    )
    
    try:
        if not request.input.strip():
            # Empty input removes the document (matching NLP API behavior)
            result = qdrant_service.remove_document(str(request.doc_id))
            
            return AddEmbedResponse(
                status="ok" if result["success"] else "error",
                message=result["message"],
                doc_id=request.doc_id,
                snippets_added=0  # 0 since we're removing, not adding
            )
        
        # Extract base from meta or infer from URL
        base = request.meta.get("doc_type", "blog")
        
        result = await add_document(
            base=base,
            doc_id=request.doc_id,
            url=request.url,
            content=request.input,
            title=request.title,
            meta=request.meta
        )
        
        return AddEmbedResponse(
            status="ok" if result["success"] else "error",
            message=result.get("message"),
            doc_id=request.doc_id,
            snippets_added=result.get("snippets_added", 0)
        )
        
    except Exception as e:
        logger.error("Add embed request failed", error=str(e), doc_id=request.doc_id)
        return AddEmbedResponse(
            status="error",
            message=f"Failed to add document: {str(e)}",
            doc_id=request.doc_id
        )


@app.post("/api/remove", response_model=AddEmbedResponse, tags=["Documents"])
async def remove_document_endpoint(
    request: RemoveDocumentRequest,
    http_request: Request
):
    """
    Simple endpoint to remove a document from the vector database.
    
    Only requires document ID. Ultra-secure endpoint protected by DUAL authentication:
    Both JWT token AND API key must be valid.
    
    Args:
        request: Remove document request (doc_id and optional url)
        http_request: FastAPI request object for authentication
        
    Returns:
        Remove operation response
    """
    # Require BOTH JWT and API key for document modification
    auth = await require_dual_auth(http_request)
    
    logger.info(
        "Remove document request",
        doc_id=request.doc_id,
        url=request.url,
        auth_type=auth.get("type"),
        user_id=auth.get("user_id")
    )
    
    try:
        result = qdrant_service.remove_document(str(request.doc_id))
        
        return AddEmbedResponse(
            status="ok" if result["success"] else "error",
            message=result["message"],
            doc_id=request.doc_id,
            snippets_added=0
        )
        
    except Exception as e:
        logger.error("Remove document failed", error=str(e), doc_id=request.doc_id, url=request.url)
        return AddEmbedResponse(
            status="error",
            message=f"Failed to remove document: {str(e)}",
            doc_id=request.doc_id
        )

@app.post("/api/maintenance/clean-index", tags=["Maintenance"])
async def clean_index_endpoint(
    dry_run: bool = True,
    http_request: Request = None
):
    """
    Clean Qdrant index by removing stale documents.
    
    Removes documents that exist in Qdrant but not in PostgreSQL.
    
    **Requires both Bearer token and API key authentication.**
    
    Args:
        dry_run: If True (default), only scan without deleting. Set to False to perform actual deletion.
    
    Returns:
        Dictionary with cleanup results including:
        - success: Whether operation completed successfully
        - dry_run: Whether this was a dry run
        - valid_ids_count: Number of valid documents in database
        - documents_scanned: Total documents scanned in Qdrant
        - stale_documents_found: Number of stale documents identified
        - data_collection_removed: Documents removed from data collection (0 if dry_run)
        - vec_collection_removed: Documents removed from vec collection (0 if dry_run)
        - elapsed_seconds: Time taken for operation
        - stale_details: Sample of stale documents (only in dry_run mode)
    """
    # Require BOTH JWT and API key for maintenance operations
    auth = await require_dual_auth(http_request)
    
    logger.info(
        "Index cleanup requested",
        dry_run=dry_run,
        user_id=auth.get("user_id"),
        rights=auth.get("rights")
    )
    
    result = clean_qdrant_index(dry_run=dry_run)
    
    if not result.get("success"):
        raise HTTPException(
            status_code=500,
            detail=result.get("error", "Index cleanup failed")
        )
    
    return result

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
