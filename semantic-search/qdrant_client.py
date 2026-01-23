"""Qdrant vector database client and operations."""
import time
from typing import List, Optional, Dict, Any, Tuple
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    MatchAny,
    Range,
    DatetimeRange,
    SearchParams,
    HnswConfigDiff,
    OptimizersConfigDiff,
    PointGroup,
    WithLookup,
)
from qdrant_client.http import models as rest
import structlog

from config import settings
from models import SearchFilters, ResultChunk

logger = structlog.get_logger()


class QdrantService:
    """Service for interacting with Qdrant vector database."""
    
    def __init__(self):
        self.client: Optional[QdrantClient] = None
        self.collection_name = settings.qdrant_collection_name
        
    def connect(self):
        """Connect to Qdrant instance."""
        if self.client is not None:
            logger.info("Qdrant client already connected")
            return
        
        logger.info(
            "Connecting to Qdrant",
            host=settings.qdrant_host,
            port=settings.qdrant_port
        )
        
        try:
            self.client = QdrantClient(
                host=settings.qdrant_host,
                port=settings.qdrant_port,
                grpc_port=settings.qdrant_grpc_port,
                api_key=settings.qdrant_api_key,
                https=settings.qdrant_use_https,
                timeout=settings.timeout,
                prefer_grpc=True  # Better performance
            )
            
            # Test connection
            collections = self.client.get_collections()
            logger.info("Connected to Qdrant", collections_count=len(collections.collections))
            
        except Exception as e:
            logger.error("Failed to connect to Qdrant", error=str(e))
            raise
    
    def ensure_collection_exists(self, dimension: int = 384):
        """
        Ensure the collection exists with proper configuration.
        
        Args:
            dimension: Vector dimension (default 384 for MiniLM)
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            # Check if collection exists
            collections = self.client.get_collections().collections
            collection_names = [c.name for c in collections]
            
            if self.collection_name in collection_names:
                logger.info("Collection already exists", collection=self.collection_name)
                return
            
            # Create collection with optimized settings
            logger.info(
                "Creating collection",
                collection=self.collection_name,
                dimension=dimension
            )
            
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=dimension,
                    distance=Distance.COSINE,
                ),
                hnsw_config=HnswConfigDiff(
                    m=16,
                    ef_construct=100,
                ),
                optimizers_config=OptimizersConfigDiff(
                    indexing_threshold=10000,
                )
            )
            
            # Create payload indices for filtering
            self._create_payload_indices()
            
            logger.info("Collection created successfully", collection=self.collection_name)
            
        except Exception as e:
            logger.error("Failed to ensure collection", error=str(e))
            raise
    
    def _create_payload_indices(self):
        """Create indices on payload fields for efficient filtering."""
        if self.client is None:
            return
        
        # Index fields used in filters
        index_fields = [
            ("base", "keyword"),
            ("doc_id", "integer"),
            ("status", "keyword"),
            ("language", "keyword"),
            ("doc_type", "keyword"),
            ("iso3", "keyword"),
            ("updated", "datetime"),
        ]
        
        for field_name, field_type in index_fields:
            try:
                self.client.create_payload_index(
                    collection_name=self.collection_name,
                    field_name=field_name,
                    field_schema=field_type,
                )
                logger.debug("Created payload index", field=field_name, type=field_type)
            except Exception as e:
                logger.warning("Failed to create index", field=field_name, error=str(e))
    
    def _build_filter(self, filters: Optional[SearchFilters]) -> Optional[Filter]:
        """
        Build Qdrant filter from search filters.
        
        Args:
            filters: Search filters
            
        Returns:
            Qdrant Filter object or None
        """
        if not filters:
            return None
        
        must_conditions = []
        
        # Status filter
        if filters.status:
            must_conditions.append(
                FieldCondition(
                    key="status",
                    match=MatchAny(any=filters.status)
                )
            )
        
        # Language filter
        if filters.language:
            must_conditions.append(
                FieldCondition(
                    key="language",
                    match=MatchAny(any=filters.language)
                )
            )
        
        # Document type filter
        if filters.doc_type:
            must_conditions.append(
                FieldCondition(
                    key="doc_type",
                    match=MatchAny(any=filters.doc_type)
                )
            )
        
        # Country (ISO3) filter
        if filters.iso3:
            must_conditions.append(
                FieldCondition(
                    key="iso3",
                    match=MatchAny(any=filters.iso3)
                )
            )
        
        # Date range filter
        if filters.date and len(filters.date) == 2:
            try:
                must_conditions.append(
                    FieldCondition(
                        key="updated",
                        range=DatetimeRange(
                            gte=filters.date[0],
                            lte=filters.date[1]
                        )
                    )
                )
            except Exception as e:
                logger.warning("Invalid date filter", error=str(e), dates=filters.date)
        
        if not must_conditions:
            return None
        
        return Filter(must=must_conditions)
    
    def search(
        self,
        query_vector: List[float],
        limit: int = 10,
        offset: int = 0,
        filters: Optional[SearchFilters] = None,
        score_threshold: Optional[float] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search for similar vectors.
        
        Args:
            query_vector: Query embedding
            limit: Number of results
            offset: Result offset
            filters: Search filters
            score_threshold: Minimum similarity score
            
        Returns:
            List of search results with scores and payloads
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            start_time = time.time()
            
            search_result = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit + offset,  # Get more to handle offset
                query_filter=self._build_filter(filters),
                score_threshold=score_threshold,
                with_payload=True,
                with_vectors=False,
            )
            
            search_time = time.time() - start_time
            
            # Apply offset manually (Qdrant search doesn't have native offset)
            results = search_result[offset:limit + offset]
            
            logger.info(
                "Search completed",
                results_count=len(results),
                total_found=len(search_result),
                time_seconds=round(search_time, 3)
            )
            
            # Convert to dict format
            return [
                {
                    "id": hit.id,
                    "score": hit.score,
                    "payload": hit.payload or {}
                }
                for hit in results
            ]
            
        except Exception as e:
            logger.error("Search failed", error=str(e))
            raise
    
    def add_document(
        self,
        doc_id: str,
        vector: List[float],
        payload: Dict[str, Any]
    ) -> bool:
        """
        Add or update a document in the vector database.
        
        Args:
            doc_id: Unique document identifier
            vector: Document embedding
            payload: Document metadata
            
        Returns:
            True if successful
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            self.client.upsert(
                collection_name=self.collection_name,
                points=[
                    PointStruct(
                        id=doc_id,
                        vector=vector,
                        payload=payload
                    )
                ]
            )
            logger.debug("Document added", doc_id=doc_id)
            return True
            
        except Exception as e:
            logger.error("Failed to add document", doc_id=doc_id, error=str(e))
            return False
    
    def get_stats(self, filters: Optional[SearchFilters] = None) -> Dict[str, Any]:
        """
        Get collection statistics.
        
        Args:
            filters: Optional filters to apply
            
        Returns:
            Statistics dictionary
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            collection_info = self.client.get_collection(self.collection_name)
            
            # Get count with filters if provided
            if filters:
                count = self.client.count(
                    collection_name=self.collection_name,
                    count_filter=self._build_filter(filters),
                    exact=True
                )
                filtered_count = count.count
            else:
                filtered_count = collection_info.points_count
            
            return {
                "total_documents": collection_info.points_count,
                "filtered_documents": filtered_count,
                "vector_dimension": collection_info.config.params.vectors.size,
                "status": "ok"
            }
            
        except Exception as e:
            logger.error("Failed to get stats", error=str(e))
            return {
                "total_documents": 0,
                "filtered_documents": 0,
                "status": "error",
                "error": str(e)
            }
    
    def health_check(self) -> bool:
        """Check if Qdrant connection is healthy."""
        if self.client is None:
            return False
        
        try:
            self.client.get_collections()
            return True
        except Exception as e:
            logger.error("Health check failed", error=str(e))
            return False
    
    def close(self):
        """Close Qdrant connection."""
        if self.client is not None:
            self.client.close()
            self.client = None
            logger.info("Qdrant client closed")


# Global Qdrant service instance
qdrant_service = QdrantService()
