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
            logger.info("No filters provided")
            return None
        
        must_conditions = []
        
        # Log the incoming filters for debugging
        logger.info(
            "Building filter conditions", 
            filters_dict=filters.dict() if filters else None
        )
        
        # Status filter (applied to lookup collection)
        if filters.status:
            logger.info(f"Adding status filter: {filters.status}")
            must_conditions.append(
                FieldCondition(
                    key="meta_status",
                    match=MatchAny(any=filters.status)
                )
            )
        
        # Language filter
        if filters.language:
            logger.info(f"Adding language filter: {filters.language}")
            must_conditions.append(
                FieldCondition(
                    key="meta_language",
                    match=MatchAny(any=filters.language)
                )
            )
        
        # Document type filter
        if filters.doc_type:
            logger.info(f"Adding doc_type filter: {filters.doc_type}")
            must_conditions.append(
                FieldCondition(
                    key="meta_doc_type",
                    match=MatchAny(any=filters.doc_type)
                )
            )
        
        # Country (ISO3) filter
        if filters.iso3:
            logger.info(f"Adding iso3 filter: {filters.iso3}")
            must_conditions.append(
                FieldCondition(
                    key="meta_iso3",
                    match=MatchAny(any=filters.iso3)
                )
            )
        
        # Date range filter
        if filters.date and len(filters.date) == 2:
            try:
                must_conditions.append(
                    FieldCondition(
                        key="meta_date",
                        range=DatetimeRange(
                            gte=filters.date[0],
                            lte=filters.date[1]
                        )
                    )
                )
            except Exception as e:
                logger.warning("Invalid date filter", error=str(e), dates=filters.date)
        
        if not must_conditions:
            logger.info("No filter conditions to apply")
            return None
        
        filter_obj = Filter(must=must_conditions)
        logger.info(f"Built filter with {len(must_conditions)} conditions")
        return filter_obj
    
    def _get_doc_type_count(self, doc_types: Optional[List[str]] = None) -> int:
        """
        Get total count of documents matching the specified doc_types.
        
        Args:
            doc_types: List of document types to count. If None, returns total count.
            
        Returns:
            Total count of matching documents
        """
        try:
            if not doc_types:
                # No doc_type filter, get total document count from vector collection
                collection_info = self.client.get_collection(self.collection_name)
                return collection_info.points_count
            
            # Get document counts by type from stats
            stats = self.get_stats()
            doc_type_counts = stats.get("field_aggregations", {}).get("doc_type", {})
            
            total_count = 0
            for doc_type in doc_types:
                # Handle actionplan mapping
                mapped_type = "action plan" if doc_type == "actionplan" else doc_type
                count = doc_type_counts.get(mapped_type, 0)
                total_count += count
                
            logger.info(
                "Calculated doc_type count", 
                doc_types=doc_types, 
                total_count=total_count,
                available_types=list(doc_type_counts.keys())
            )
            
            return total_count
            
        except Exception as e:
            logger.warning("Failed to get doc_type count, using fallback", error=str(e))
            # Fallback to reasonable default
            return 5000

    def search(
        self,
        query_vector: List[float],
        limit: int = 10,
        offset: int = 0,
        filters: Optional[SearchFilters] = None,
        score_threshold: Optional[float] = None,
        hit_limit: int = 3,
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Search for similar vectors using search_groups to group by document.
        
        Args:
            query_vector: Query embedding
            limit: Number of documents
            offset: Result offset  
            filters: Search filters
            score_threshold: Minimum similarity score
            hit_limit: Max snippets per document
            
        Returns:
            Tuple of (search results grouped by document, total count after filtering)
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            start_time = time.time()
            
            # Calculate optimal initial limit based on doc_type filters
            # This ensures we search through ALL documents of the requested type(s)
            requested_doc_types = filters.doc_type if filters and filters.doc_type else None
            total_doc_type_count = self._get_doc_type_count(requested_doc_types)
            logger.info(
                "Total documents for requested doc_types",
                requested_doc_types=requested_doc_types,
                total_doc_type_count=total_doc_type_count
            )
            
            # Use the full document type count to ensure we get all relevant results
            # Add some buffer for edge cases but don't go below the doc type count
            initial_limit = max(total_doc_type_count, 1000)
            
            logger.info(
                "Using doc_type-aware search limit",
                requested_doc_types=requested_doc_types,
                total_doc_type_count=total_doc_type_count,
                initial_limit=initial_limit,
                user_requested_limit=limit
            )
            
            # Use search_groups to group snippets by document (main_uuid)
            # Note: We'll apply filters post-search since they need to be applied to lookup data
            # To follow NLP API approach: get all documents of requested type(s) to ensure complete results
            search_result = self.client.search_groups(
                collection_name=self.collection_name,
                query_vector=query_vector,
                group_by="main_uuid",  # Group by document UUID
                limit=initial_limit,  # Get a large set before filtering
                group_size=hit_limit,  # Max snippets per document
                score_threshold=score_threshold or 0.0,  # Lower threshold for broader results
                with_payload=True,
                with_vectors=False,
                with_lookup=WithLookup(
                    collection="main_dot_data",  # Lookup document metadata
                    with_payload=True
                )
            )
            
            search_time = time.time() - start_time
            
            # Get all groups for filtering
            all_groups = search_result.groups if hasattr(search_result, 'groups') else []
            
            logger.info(
                "Search groups completed",
                raw_groups_count=len(all_groups),
                search_time=round(search_time, 3)
            )
            
            # Convert groups to result format with filtering
            results = []
            filtered_count = 0
            processed_count = 0
            
            for group in all_groups:
                processed_count += 1
                
                # Extract document metadata from lookup
                doc_data = {}
                if hasattr(group, 'lookup') and group.lookup and group.lookup.payload:
                    doc_data = group.lookup.payload
                
                # Debug: Log first few documents to understand data structure
                if processed_count <= 5:
                    logger.info(
                        f"Document {processed_count} metadata",
                        doc_data_keys=list(doc_data.keys()) if doc_data else "No data",
                        meta_doc_type=doc_data.get("meta_doc_type"),
                        meta_status=doc_data.get("meta_status"),
                        has_lookup=hasattr(group, 'lookup'),
                        lookup_payload_keys=list(group.lookup.payload.keys()) if hasattr(group, 'lookup') and group.lookup and group.lookup.payload else "No lookup payload"
                    )
                
                # Apply filters to lookup data if they exist
                should_include = True
                filter_reason = ""
                
                if filters:
                    # Check doc_type filter - must match if filter is specified
                    if filters.doc_type:
                        # Try both meta_doc_type and base fields
                        doc_type = doc_data.get("meta_doc_type") or doc_data.get("base")
                        if not doc_type or doc_type not in filters.doc_type:
                            should_include = False
                            filter_reason = f"doc_type mismatch: got '{doc_type}' (from meta_doc_type={doc_data.get('meta_doc_type')} or base={doc_data.get('base')}), required: {filters.doc_type}"
                    
                    # Check status filter - must match if filter is specified
                    if should_include and filters.status:
                        status = doc_data.get("meta_status")
                        if not status or status not in filters.status:
                            should_include = False
                            filter_reason = f"status mismatch: got '{status}', required: {filters.status}"
                    
                    # Check language filter
                    if should_include and filters.language:
                        language = doc_data.get("meta_language")
                        if not language or language not in filters.language:
                            should_include = False
                            filter_reason = f"language mismatch: got '{language}', required: {filters.language}"
                    
                    # Check iso3 filter
                    if should_include and filters.iso3:
                        iso3 = doc_data.get("meta_iso3")
                        if not iso3 or iso3 not in filters.iso3:
                            should_include = False
                            filter_reason = f"iso3 mismatch: got '{iso3}', required: {filters.iso3}"
                
                if not should_include:
                    # logger.info(f"Filtering out document: {filter_reason}")
                    filtered_count += 1
                    continue
                
                # Extract snippets from hits
                snippets = []
                best_score = 0.0
                for hit in group.hits:
                    if hit.payload and "snippet" in hit.payload:
                        snippets.append(hit.payload["snippet"])
                    if hit.score and hit.score > best_score:
                        best_score = hit.score
                
                # Build result
                result = {
                    "id": str(group.id),
                    "score": best_score,
                    "payload": {
                        "main_id": doc_data.get("main_id", ""),
                        "base": doc_data.get("base", ""),
                        "doc_id": doc_data.get("doc_id", 0),
                        "url": doc_data.get("url", ""),
                        "title": doc_data.get("title", ""),
                        "updated": doc_data.get("updated", ""),
                        "snippets": snippets,
                        # Meta fields with consistent naming
                        "status": doc_data.get("meta_status", ""),
                        "language": doc_data.get("meta_language", []),
                        "doc_type": doc_data.get("meta_doc_type", ""),
                        "iso3": doc_data.get("meta_iso3", []),
                        "date": doc_data.get("meta_date", ""),
                    }
                }
                results.append(result)
            
            # Apply offset and limit after filtering
            total_after_filtering = len(results)
            results = results[offset:offset + limit]
            
            logger.info(
                "Filtering completed",
                processed_documents=processed_count,
                filtered_out=filtered_count,
                total_after_filtering=total_after_filtering,
                final_results=len(results),
                offset=offset,
                limit=limit
            )
            
            return results, total_after_filtering
            
        except Exception as e:
            logger.error("Search groups failed", error=str(e))
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
        Get collection statistics with field aggregations.
        
        Args:
            filters: Optional filters to apply
            
        Returns:
            Statistics dictionary with doc_count and field_aggregations
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            collection_info = self.client.get_collection(self.collection_name)
            
            # For stats, we need to get data from both collections and filter manually
            # since the filters apply to the lookup collection data
            if filters:
                # Get data from lookup collection with manual filtering
                scroll_result = self.client.scroll(
                    collection_name="main_dot_data",  # Get from data collection
                    limit=10000,  # Get more data for accurate stats
                    with_payload=True,
                    with_vectors=False
                )
                
                # Apply manual filtering
                filtered_points = []
                for point in scroll_result[0]:
                    payload = point.payload or {}
                    should_include = True
                    
                    if filters.doc_type:
                        doc_type = payload.get("meta_doc_type")
                        if not doc_type or doc_type not in filters.doc_type:
                            should_include = False
                    
                    if should_include and filters.status:
                        status = payload.get("meta_status")
                        if not status or status not in filters.status:
                            should_include = False
                    
                    if should_include and filters.language:
                        language = payload.get("meta_language")
                        if not language or language not in filters.language:
                            should_include = False
                    
                    if should_include and filters.iso3:
                        iso3 = payload.get("meta_iso3")
                        if not iso3 or iso3 not in filters.iso3:
                            should_include = False
                    
                    if should_include:
                        filtered_points.append(point)
                
                doc_count = len(filtered_points)
                points_to_aggregate = filtered_points
                
            else:
                # No filters, get total count from vector collection
                doc_count = collection_info.points_count
                
                # Get sample from data collection for aggregations
                scroll_result = self.client.scroll(
                    collection_name="main_dot_data",
                    limit=1000,
                    with_payload=True,
                    with_vectors=False
                )
                points_to_aggregate = scroll_result[0]
            
            # Build field aggregations
            aggregations = {
                "doc_type": {},
                "language": {},
                "iso3": {},
                "status": {}
            }
            
            for point in points_to_aggregate:
                payload = point.payload or {}
                
                # Aggregate doc_type
                doc_type = payload.get("meta_doc_type")
                if doc_type:
                    aggregations["doc_type"][doc_type] = aggregations["doc_type"].get(doc_type, 0) + 1
                
                # Aggregate status
                status = payload.get("meta_status")
                if status:
                    aggregations["status"][status] = aggregations["status"].get(status, 0) + 1
                
                # Aggregate languages (can be multiple)
                language = payload.get("meta_language", [])
                if isinstance(language, list):
                    for lang in language:
                        if lang:
                            aggregations["language"][lang] = aggregations["language"].get(lang, 0) + 1
                elif language:
                    aggregations["language"][language] = aggregations["language"].get(language, 0) + 1
                
                # Aggregate iso3 codes (can be multiple)
                iso3 = payload.get("meta_iso3", [])
                if isinstance(iso3, list):
                    for country in iso3:
                        if country:
                            aggregations["iso3"][country] = aggregations["iso3"].get(country, 0) + 1
                elif iso3:
                    aggregations["iso3"][iso3] = aggregations["iso3"].get(iso3, 0) + 1
            
            return {
                "doc_count": doc_count,
                "field_aggregations": aggregations,
                "total_documents": collection_info.points_count,
                "status": "ok"
            }
            
        except Exception as e:
            logger.error("Failed to get stats", error=str(e))
            return {
                "doc_count": 0,
                "field_aggregations": {
                    "doc_type": {},
                    "language": {},
                    "iso3": {},
                    "status": {}
                },
                "total_documents": 0,
                "status": "error",
                "error": str(e)
            }
    
    def remove_document(self, doc_id: str) -> Dict[str, Any]:
        """
        Remove a document from the vector database by doc_id.
        
        This method searches for documents with the specified doc_id
        and removes all matching points from the vector database.
        
        Args:
            doc_id: Document identifier to remove
            
        Returns:
            Dict with success status, count of removed documents, and message
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            # First, find points with this doc_id
            filter_condition = Filter(
                must=[
                    FieldCondition(
                        key="doc_id",
                        match=MatchValue(value=doc_id)
                    )
                ]
            )
            
            # Search for matching points
            search_result = self.client.scroll(
                collection_name=self.collection_name,
                scroll_filter=filter_condition,
                limit=1000,  # Handle multiple chunks for same document
                with_payload=True,
                with_vectors=False
            )
            
            points_to_delete = [point.id for point in search_result[0]]
            
            if not points_to_delete:
                logger.info("No documents found to remove", doc_id=doc_id)
                return {
                    "success": True,
                    "removed_count": 0,
                    "message": f"No documents found with doc_id: {doc_id}"
                }
            
            # Delete the found points
            self.client.delete(
                collection_name=self.collection_name,
                points_selector=points_to_delete
            )
            
            logger.info(
                "Document removed successfully", 
                doc_id=doc_id, 
                removed_count=len(points_to_delete)
            )
            
            return {
                "success": True,
                "removed_count": len(points_to_delete),
                "message": f"Successfully removed {len(points_to_delete)} chunks for doc_id: {doc_id}"
            }
            
        except Exception as e:
            logger.error("Failed to remove document", doc_id=doc_id, error=str(e))
            return {
                "success": False,
                "removed_count": 0,
                "message": f"Error removing document: {str(e)}"
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
