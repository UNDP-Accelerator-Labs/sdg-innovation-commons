"""Data models for semantic search API."""
from typing import Dict, List, Optional, Literal, Any
from pydantic import BaseModel, Field


class SearchFilters(BaseModel):
    """Search filters matching NLP API structure."""
    language: Optional[List[str]] = None
    doc_type: Optional[List[str]] = None
    iso3: Optional[List[str]] = None
    status: Optional[List[str]] = Field(default=["public"])
    date: Optional[List[str]] = None  # [start_date, end_date]
    tags: Optional[List[str]] = None
    sdg: Optional[List[int]] = None


class SearchRequest(BaseModel):
    """Search request payload."""
    input: str = Field(default="", description="Search query text")
    limit: int = Field(default=10, ge=1, le=100, description="Number of results")
    offset: int = Field(default=0, ge=0, description="Result offset for pagination")
    filters: Optional[SearchFilters] = None
    hit_limit: int = Field(default=3, ge=1, le=10, description="Number of snippets per result")
    score_threshold: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    short_snippets: bool = Field(default=True)
    vecdb: str = Field(default="main", description="Vector database name")


class ResultMeta(BaseModel):
    """Metadata for search results."""
    date: Optional[str] = None
    language: Optional[List[str]] = None
    doc_type: Optional[List[str]] = None
    iso3: Optional[List[str]] = None
    status: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    sdg: Optional[List[int]] = None


class ResultChunk(BaseModel):
    """Individual search result matching NLP API structure."""
    main_id: str = Field(description="Document identifier (base:doc_id)")
    score: float = Field(description="Similarity score")
    base: str = Field(description="Platform type (solution, experiment, etc.)")
    doc_id: int = Field(description="Document ID")
    url: str = Field(description="Document URL")
    title: str = Field(description="Document title")
    updated: str = Field(description="Last update timestamp")
    snippets: List[str] = Field(default_factory=list, description="Relevant text snippets")
    meta: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class SearchResponse(BaseModel):
    """Search response payload matching NLP API structure."""
    hits: List[ResultChunk] = Field(default_factory=list)
    status: Literal["ok", "error"] = "ok"
    message: Optional[str] = None
    total: Optional[int] = None


class StatsRequest(BaseModel):
    """Statistics request payload."""
    fields: List[str] = Field(description="Fields to get stats for")
    filters: Optional[SearchFilters] = None
    vecdb: str = Field(default="main")


class StatsResponse(BaseModel):
    """Statistics response payload."""
    doc_count: int
    fields: Dict[str, Dict[str, int]] = Field(default_factory=dict)
    status: Literal["ok", "error"] = "ok"


class AddDocumentRequest(BaseModel):
    """Request to add/update a document in the vector database."""
    base: str = Field(description="Platform type")
    doc_id: int = Field(description="Document ID")
    url: str
    title: Optional[str] = None
    content: str = Field(description="Full document text")
    meta: Dict[str, Any] = Field(default_factory=dict)


class AddDocumentResponse(BaseModel):
    """Response after adding a document."""
    success: bool
    main_id: str
    snippets_added: int
    message: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    service: str = "semantic-search"
    qdrant_connected: bool
    embedding_model_loaded: bool
    version: str = "1.0.0"
