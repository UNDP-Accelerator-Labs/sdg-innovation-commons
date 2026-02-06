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
    OrderBy,
    Direction,
    PayloadSchemaType,
)
from qdrant_client.http import models as rest
import structlog

from config import settings
from models import SearchFilters, ResultChunk
from utils import get_main_uuid, flatten_metadata, unflatten_metadata, compute_chunk_hash

logger = structlog.get_logger()


class QdrantService:
    """Service for interacting with Qdrant vector database.
    
    Uses dual-collection architecture matching NLP API:
    - {collection}_vec: Snippet embeddings
    - {collection}_data: Document metadata
    """
    
    def __init__(self):
        self.client: Optional[QdrantClient] = None
        self.collection_name = settings.qdrant_collection_name
        self.vec_collection = settings.vec_collection_name
        self.data_collection = settings.data_collection_name
        
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
        Ensure both collections exist with proper configuration.
        
        Creates dual collections matching NLP API architecture:
        - _vec: Snippet-level embeddings with metadata
        - _data: Document-level metadata and embeddings
        
        Args:
            dimension: Vector dimension (default 384 for MiniLM)
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            collections = self.client.get_collections().collections
            collection_names = [c.name for c in collections]
            
            # Create vector collection (snippets)
            if self.vec_collection not in collection_names:
                logger.info(
                    "Creating vector collection for snippets",
                    collection=self.vec_collection,
                    dimension=dimension
                )
                
                self.client.create_collection(
                    collection_name=self.vec_collection,
                    vectors_config=VectorParams(
                        size=dimension,
                        distance=Distance.DOT,  # Matches NLP API
                        on_disk=True,
                    ),
                    hnsw_config=HnswConfigDiff(
                        m=64,  # Higher for better accuracy
                        ef_construct=512,
                        full_scan_threshold=10000,
                        on_disk=True,
                    ),
                    optimizers_config=OptimizersConfigDiff(
                        deleted_threshold=0.2,
                        vacuum_min_vector_number=1000,
                        default_segment_number=0,
                        memmap_threshold=20000,
                        indexing_threshold=20000,
                        flush_interval_sec=60,
                        max_optimization_threads=4,
                    ),
                    on_disk_payload=True,
                    shard_number=2,
                    timeout=600,
                )
                
                self._create_payload_indices(self.vec_collection)
                logger.info("Vector collection created", collection=self.vec_collection)
            else:
                logger.info("Vector collection already exists", collection=self.vec_collection)
            
            # Create data collection (document metadata)
            if self.data_collection not in collection_names:
                logger.info(
                    "Creating data collection for metadata",
                    collection=self.data_collection,
                    dimension=dimension
                )
                
                self.client.create_collection(
                    collection_name=self.data_collection,
                    vectors_config=VectorParams(
                        size=dimension,
                        distance=Distance.DOT,
                        on_disk=True,
                    ),
                    hnsw_config=HnswConfigDiff(
                        m=64,
                        ef_construct=512,
                        full_scan_threshold=10000,
                        on_disk=True,
                    ),
                    optimizers_config=OptimizersConfigDiff(
                        deleted_threshold=0.2,
                        vacuum_min_vector_number=1000,
                        default_segment_number=0,
                        memmap_threshold=20000,
                        indexing_threshold=20000,
                        flush_interval_sec=60,
                        max_optimization_threads=4,
                    ),
                    on_disk_payload=True,
                    shard_number=2,
                    timeout=600,
                )
                
                self._create_payload_indices(self.data_collection)
                logger.info("Data collection created", collection=self.data_collection)
            else:
                logger.info("Data collection already exists", collection=self.data_collection)
            
        except Exception as e:
            logger.error("Failed to ensure collections", error=str(e))
            raise
    
    def _create_payload_indices(self, collection_name: str):
        """
        Create indices on payload fields for efficient filtering.
        
        Uses flattened metadata fields (meta_*) for indexing.
        Note: Updated field uses INTEGER index for timestamp to support order_by.
        
        Args:
            collection_name: Name of the collection to index
        """
        if self.client is None:
            return
        
        # Index fields used in filters (flattened metadata)
        # Note: 'updated' uses INTEGER for timestamp to support order_by queries
        index_fields = [
            ("base", PayloadSchemaType.KEYWORD),
            ("doc_id", PayloadSchemaType.INTEGER),
            ("main_id", PayloadSchemaType.KEYWORD),
            ("main_uuid", PayloadSchemaType.KEYWORD),
            ("meta_status", PayloadSchemaType.KEYWORD),
            ("meta_language", PayloadSchemaType.KEYWORD),
            ("meta_doc_type", PayloadSchemaType.KEYWORD),
            ("meta_iso3", PayloadSchemaType.KEYWORD),
            ("meta_date", PayloadSchemaType.DATETIME),
            ("updated", PayloadSchemaType.DATETIME),  # Datetime string for order_by support
        ]
        
        for field_name, field_type in index_fields:
            try:
                self.client.create_payload_index(
                    collection_name=collection_name,
                    field_name=field_name,
                    field_schema=field_type,
                )
            except Exception as e:
                # Ignore if index already exists
                if "already exists" not in str(e).lower():
                    logger.warning("Failed to create index", collection=collection_name, field=field_name, error=str(e))
    
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
        Search for similar documents using dual-collection architecture.
        
        Uses search_groups on snippet collection (_vec) to find best snippets,
        then aggregates by document (matching NLP API behavior).
        
        Args:
            query_vector: Query embedding
            limit: Number of documents to return
            offset: Result offset for pagination
            filters: Optional search filters (doc_type, status, language, iso3)
            score_threshold: Minimum similarity score (DOT product)
            hit_limit: Maximum snippets per document (default 3)
            
        Returns:
            Tuple of (search results, total count after filtering)
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            start_time = time.time()
            
            # Calculate total limit including offset (matching NLP API)
            # Request a large batch to ensure we get enough results for pagination
            real_offset = offset if offset else 0
            
            # Request more results than needed to properly implement pagination
            # This ensures we can accurately determine if there are more pages
            batch_size = 1000  # Large batch to get accurate total count
            
            logger.info(
                "Searching with groups (dual collection mode)",
                offset=real_offset,
                limit=limit,
                batch_size=batch_size
            )
            
            # Build Qdrant filter from search filters
            qdrant_filter = self._build_qdrant_filter(filters)
            
            # Use search_groups to group snippets by document
            # Request a large batch to get accurate total count
            search_result = self.client.search_groups(
                collection_name=self.vec_collection,
                query_vector=query_vector,
                group_by="main_uuid",  # Group by document UUID
                limit=batch_size,  # Request large batch
                group_size=hit_limit,  # Max snippets per document
                score_threshold=score_threshold or 0.0,
                query_filter=qdrant_filter,  # Apply filters at Qdrant level
                with_payload=True,
                with_vectors=False,
                with_lookup=WithLookup(
                    collection=self.data_collection,  # Lookup document metadata
                    with_payload=True
                )
            )
            
            search_time = time.time() - start_time
            all_groups = search_result.groups if hasattr(search_result, 'groups') else []
            
            # Get the total count of all matching results (before filtering invalid)
            total_count_raw = len(all_groups)
            
            logger.info(
                "Search groups completed",
                total_groups_count=total_count_raw,
                search_time=round(search_time, 3)
            )
            
            # Filter out invalid records FIRST, then paginate
            # This ensures we always return valid records only
            valid_groups = []
            skipped_invalid = 0
            
            for group in all_groups:
                # Extract document metadata from lookup
                doc_data = {}
                if hasattr(group, 'lookup') and group.lookup and group.lookup.payload:
                    doc_data = group.lookup.payload
                
                # Validate record - skip invalid/corrupt records
                doc_id = doc_data.get("doc_id", 0)
                base = doc_data.get("base", "")
                
                if not base or not doc_id or doc_id == 0:
                    skipped_invalid += 1
                    logger.warning(
                        "Skipping invalid record in search results",
                        doc_id=doc_id,
                        base=base,
                        main_id=doc_data.get("main_id", ""),
                        group_id=str(group.id)
                    )
                    continue
                
                valid_groups.append(group)
            
            # Sort valid groups by relevance score (descending) and then by meta_date (descending)
            # This ensures most relevant AND most recent documents appear first
            def get_sort_key(group):
                # Get best score from hits
                best_score = max((hit.score for hit in group.hits if hit.score), default=0.0)
                
                # Get meta_date from lookup payload
                meta_date = ""
                if hasattr(group, 'lookup') and group.lookup and group.lookup.payload:
                    meta_date = group.lookup.payload.get("meta_date", "")
                
                # Return tuple for sorting:
                # - Score as-is (will use reverse=True for descending)
                # - Date as-is (ISO format strings sort correctly, will use reverse=True for descending)
                # - Use empty string for missing dates so they sort last (empty < any date string)
                date_sortable = meta_date if meta_date else ""
                return (best_score, date_sortable)
            
            # Sort with reverse=True to get highest scores and newest dates first
            valid_groups.sort(key=get_sort_key, reverse=True)
            
            # Update total count to reflect only valid records
            total_count = len(valid_groups)
            
            # Now paginate the VALID groups only
            page_end = real_offset + limit
            page_groups = valid_groups[real_offset:page_end]
            
            # Convert groups to result format
            results = []
            
            for group in page_groups:
                # Extract document metadata from lookup
                doc_data = {}
                if hasattr(group, 'lookup') and group.lookup and group.lookup.payload:
                    doc_data = group.lookup.payload
                
                # Extract snippets from hits
                snippets = []
                best_score = 0.0
                for hit in group.hits:
                    if hit.payload and "snippet" in hit.payload:
                        snippets.append(hit.payload["snippet"])
                    if hit.score and hit.score > best_score:
                        best_score = hit.score
                
                # Build result
                meta = unflatten_metadata(doc_data)
                base = doc_data.get("base", "")
                doc_id = doc_data.get("doc_id", 0)
                
                result = {
                    "id": str(group.id),
                    "score": best_score,
                    "payload": {
                        "main_id": doc_data.get("main_id", ""),
                        "base": base,
                        "doc_id": doc_id,
                        "url": doc_data.get("url", ""),
                        "title": doc_data.get("title", ""),
                        "updated": doc_data.get("updated", ""),
                        "snippets": snippets,
                        "meta": meta,
                        # Include fields for compatibility
                        "status": meta.get("status", ""),
                        "language": meta.get("language", []),
                        "doc_type": meta.get("doc_type", ""),
                        "iso3": meta.get("iso3", []),
                        "date": meta.get("date", ""),
                    }
                }
                results.append(result)
            
            if skipped_invalid > 0:
                logger.warning(f"Skipped {skipped_invalid} invalid records from raw results (total_raw={total_count_raw}, total_valid={total_count})")
            
            logger.info(
                "Search completed",
                total_matching_results=total_count,
                total_raw_results=total_count_raw,
                page_results=len(results),
                skipped_invalid=skipped_invalid,
                offset=real_offset,
                limit=limit,
                has_more=total_count > page_end
            )
            
            return results, total_count
            
        except Exception as e:
            logger.error("Search failed", error=str(e))
            raise
    
    def _build_qdrant_filter(self, filters: Optional[SearchFilters]) -> Optional[Filter]:
        """
        Build Qdrant filter from search filters for vec collection.
        
        Args:
            filters: Search filters to convert
            
        Returns:
            Qdrant Filter object or None
        """
        if not filters:
            return None
        
        conditions = []
        
        # Filter by doc_type (on vec collection, uses meta_doc_type from snippet payload)
        if filters.doc_type:
            conditions.append(
                FieldCondition(
                    key="meta_doc_type",
                    match=MatchAny(any=filters.doc_type)
                )
            )
        
        # Filter by status
        if filters.status:
            conditions.append(
                FieldCondition(
                    key="meta_status",
                    match=MatchAny(any=filters.status)
                )
            )
        
        # Filter by language
        if filters.language:
            conditions.append(
                FieldCondition(
                    key="meta_language",
                    match=MatchAny(any=filters.language)
                )
            )
        
        # Filter by iso3
        if filters.iso3:
            conditions.append(
                FieldCondition(
                    key="meta_iso3",
                    match=MatchAny(any=filters.iso3)
                )
            )
        
        if not conditions:
            return None
        
        return Filter(must=conditions)
    
    def _build_data_collection_filter(self, filters: Optional[SearchFilters]) -> Optional[Filter]:
        """
        Build Qdrant filter for data collection (same as vec collection filter).
        
        Args:
            filters: Search filters to convert
            
        Returns:
            Qdrant Filter object or None
        """
        # Same logic as _build_qdrant_filter since both collections have flattened metadata
        return self._build_qdrant_filter(filters)
    
    def _passes_filters(self, doc_data: Dict[str, Any], filters: Optional[SearchFilters]) -> bool:
        """
        Check if document passes filter criteria.
        
        Expects flattened metadata fields (meta_doc_type, meta_status, etc.)
        as stored in the data collection.
        
        Args:
            doc_data: Document payload data with flattened metadata
            filters: Search filters to apply
            
        Returns:
            True if document passes all filters
        """
        if not filters:
            return True
        
        # Check doc_type filter (use meta_doc_type or base)
        if filters.doc_type:
            doc_type = doc_data.get("meta_doc_type") or doc_data.get("base")
            if not doc_type or doc_type not in filters.doc_type:
                return False
        
        # Check status filter
        if filters.status:
            status = doc_data.get("meta_status")
            if not status or status not in filters.status:
                return False
        
        # Check language filter
        if filters.language:
            language = doc_data.get("meta_language")
            if not language or language not in filters.language:
                return False
        
        # Check iso3 filter
        if filters.iso3:
            iso3 = doc_data.get("meta_iso3")
            if not iso3 or iso3 not in filters.iso3:
                return False
        
        return True
    
    def add_document(
        self,
        doc_id: str,
        vector: List[float],
        payload: Dict[str, Any]
    ) -> bool:
        """
        Add or update a document using dual-collection architecture.
        
        Stores snippets with embeddings in vec collection and metadata in data collection.
        Matches NLP API architecture for consistency.
        
        Args:
            doc_id: Unique document identifier (main_id)
            vector: Document embedding (average of snippets)
            payload: Document metadata including snippets and snippet_embeddings
            
        Returns:
            True if successful
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            main_uuid = get_main_uuid(doc_id)
            snippets = payload.get("snippets", [])
            snippet_embeddings = payload.get("snippet_embeddings", [])
            
            # Prepare base metadata
            base_meta = {
                "main_id": doc_id,
                "base": payload.get("base", ""),
                "doc_id": payload.get("doc_id", 0),
                "url": payload.get("url", ""),
                "title": payload.get("title", ""),
                "updated": payload.get("updated", ""),
                "main_uuid": main_uuid,
            }
            
            # Add metadata fields (flattened with meta_ prefix)
            meta = payload.get("meta", {})
            base_meta.update(flatten_metadata(meta))
            
            # Compute chunk hash for change detection
            chunk_hash, chunk_count = compute_chunk_hash(snippets)
            base_meta["hash"] = chunk_hash
            base_meta["count"] = chunk_count
            
            # Check if document changed
            prev_data = self._get_document_hash(main_uuid)
            if prev_data and prev_data.get("hash") == chunk_hash:
                logger.info("Document unchanged, skipping update", main_id=doc_id)
                return True
            
            # 1. Add document metadata to data collection
            self.client.upsert(
                collection_name=self.data_collection,
                points=[
                    PointStruct(
                        id=main_uuid,
                        vector=vector,  # Document-level embedding
                        payload=base_meta
                    )
                ]
            )
            
            # 2. Add snippet embeddings to vec collection
            if snippets and snippet_embeddings:
                # First, remove old snippets for this document
                self._remove_document_snippets(main_uuid)
                
                # Then add new snippets
                snippet_points = []
                for idx, (snippet, embedding) in enumerate(zip(snippets, snippet_embeddings)):
                    snippet_id = f"{doc_id}:{idx}"
                    snippet_uuid = get_main_uuid(snippet_id)
                    
                    snippet_payload = {
                        "main_uuid": main_uuid,  # Reference to parent document
                        "snippet": snippet,
                        "chunk_id": idx,
                        "base": base_meta["base"],
                    }
                    
                    # Add flattened metadata to snippets for filtering
                    snippet_payload.update(flatten_metadata(meta))
                    
                    snippet_points.append(
                        PointStruct(
                            id=snippet_uuid,
                            vector=embedding,
                            payload=snippet_payload
                        )
                    )
                
                # Batch insert snippets
                if snippet_points:
                    batch_size = 20
                    for i in range(0, len(snippet_points), batch_size):
                        batch = snippet_points[i:i + batch_size]
                        self.client.upsert(
                            collection_name=self.vec_collection,
                            points=batch,
                            wait=False
                        )
            
            return True
            
        except Exception as e:
            logger.error("Failed to add document", doc_id=doc_id, error=str(e))
            return False
    
    def _get_document_hash(self, main_uuid: str) -> Optional[Dict[str, Any]]:
        """Get document hash to check if content changed."""
        try:
            results = self.client.scroll(
                collection_name=self.data_collection,
                scroll_filter=Filter(
                    must=[FieldCondition(key="main_uuid", match=MatchValue(value=main_uuid))]
                ),
                limit=1,
                with_payload=["hash", "count"],
                with_vectors=False
            )
            if results[0]:
                return results[0][0].payload
        except Exception as e:
            logger.warning("Failed to get document hash", error=str(e))
        return None
    
    def _remove_document_snippets(self, main_uuid: str):
        """Remove all snippets for a document from vec collection."""
        try:
            self.client.delete(
                collection_name=self.vec_collection,
                points_selector=Filter(
                    must=[FieldCondition(key="main_uuid", match=MatchValue(value=main_uuid))]
                )
            )
        except Exception as e:
            logger.warning("Failed to remove old snippets", error=str(e))
    
    def get_recent_documents(
        self,
        limit: int = 10,
        offset: int = 0,
        filters: Optional[SearchFilters] = None,
        hit_limit: int = 3,
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Get recent documents from the data collection (without vector search).
        
        Used when query is empty. Returns documents sorted by date/updated field
        in descending order, with snippets fetched from the vec collection.
        
        Args:
            limit: Number of documents to return
            offset: Result offset for pagination
            filters: Optional search filters
            hit_limit: Maximum snippets per document
            
        Returns:
            Tuple of (results, total count)
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            # Build filter
            qdrant_filter = self._build_data_collection_filter(filters)
            
            # Calculate total limit (matching NLP API pattern)
            real_offset = offset if offset else 0
            total_limit = real_offset + limit
            
            logger.info(
                "Getting recent documents with order_by",
                offset=real_offset,
                limit=limit,
                total_limit=total_limit
            )
            
            # Scroll through data collection ordered by meta_date (descending)
            # This matches the NLP API's query_docs behavior
            scroll_result = self.client.scroll(
                collection_name=self.data_collection,
                scroll_filter=qdrant_filter,
                limit=total_limit,
                order_by=OrderBy(
                    key="meta_date",  # Sort by meta_date field
                    direction=Direction.DESC  # Most recent first
                ),
                with_payload=True,
                with_vectors=False
            )
            
            all_points = scroll_result[0] if scroll_result else []
            
            # DEBUG: Log what we got from Qdrant
            logger.info(
                "RAW scroll result from Qdrant",
                raw_points_count=len(all_points),
                has_filter=qdrant_filter is not None,
                filter_details=str(qdrant_filter) if qdrant_filter else None,
                requested_limit=total_limit
            )
            
            # Apply pagination by slicing (matching NLP API)
            page_points = all_points[real_offset:total_limit]
            
            # For each document, fetch snippets from vec collection
            results = []
            for point in page_points:
                doc_data = point.payload or {}
                main_uuid = doc_data.get("main_uuid", "")
                
                # Fetch snippets for this document
                snippets = []
                if main_uuid:
                    try:
                        snippet_results = self.client.scroll(
                            collection_name=self.vec_collection,
                            scroll_filter=Filter(
                                must=[FieldCondition(key="main_uuid", match=MatchValue(value=main_uuid))]
                            ),
                            limit=hit_limit,
                            with_payload=["snippet"],
                            with_vectors=False
                        )
                        
                        if snippet_results and snippet_results[0]:
                            snippets = [
                                sp.payload.get("snippet", "") 
                                for sp in snippet_results[0] 
                                if sp.payload and "snippet" in sp.payload
                            ]
                    except Exception as e:
                        logger.warning("Failed to fetch snippets", main_uuid=main_uuid, error=str(e))
                
                # Build result in same format as search()
                meta = unflatten_metadata(doc_data)
                
                result = {
                    "id": str(point.id),
                    "score": 1.0,  # Score of 1.0 for non-semantic results (matches NLP API)
                    "payload": {
                        "main_id": doc_data.get("main_id", ""),
                        "base": doc_data.get("base", ""),
                        "doc_id": doc_data.get("doc_id", 0),
                        "url": doc_data.get("url", ""),
                        "title": doc_data.get("title", ""),
                        "updated": doc_data.get("updated", ""),
                        "snippets": snippets,
                        "meta": meta,
                        "status": meta.get("status", ""),
                        "language": meta.get("language", []),
                        "doc_type": meta.get("doc_type", ""),
                        "iso3": meta.get("iso3", []),
                        "date": meta.get("date", ""),
                    }
                }
                results.append(result)
            
            total_count = len(all_points)
            
            logger.info(
                "Recent documents retrieved",
                total_count=total_count,
                page_results=len(results),
                offset=real_offset,
                limit=limit
            )
            
            return results, total_count
            
        except Exception as e:
            logger.error("Failed to get recent documents", error=str(e))
            raise
    
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
            # Get collection info from data collection
            collection_info = self.client.get_collection(self.data_collection)
            
            # For stats, get data from data collection and filter manually
            stats_limit = 50000  # High limit for comprehensive stats
            
            if filters:
                # Get data from data collection with manual filtering
                scroll_result = self.client.scroll(
                    collection_name=self.data_collection,
                    limit=stats_limit,
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
                # No filters, get total count from data collection
                doc_count = collection_info.points_count
                
                # Get sample from data collection for aggregations
                # Use higher limit for accurate aggregations
                aggregation_limit = min(stats_limit, collection_info.points_count)
                scroll_result = self.client.scroll(
                    collection_name=self.data_collection,
                    limit=aggregation_limit,
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
        Remove a document from the vector database using dual-collection architecture.
        
        Removes from both data collection (metadata) and vec collection (snippets).
        
        Args:
            doc_id: Document identifier to remove (main_id)
            
        Returns:
            Dict with success status, count of removed documents, and message
        """
        if self.client is None:
            raise RuntimeError("Qdrant client not connected")
        
        try:
            # Convert doc_id to main_uuid
            main_uuid = get_main_uuid(doc_id) if ":" in doc_id else doc_id
            
            removed_count = 0
            
            # Remove from data collection
            try:
                self.client.delete(
                    collection_name=self.data_collection,
                    points_selector=[main_uuid]
                )
                removed_count += 1
            except Exception as e:
                logger.warning("Failed to remove from data collection", error=str(e))
            
            # Remove snippets from vec collection
            try:
                result = self.client.delete(
                    collection_name=self.vec_collection,
                    points_selector=Filter(
                        must=[FieldCondition(key="main_uuid", match=MatchValue(value=main_uuid))]
                    )
                )
                if hasattr(result, 'operation_id'):
                    removed_count += 1
            except Exception as e:
                logger.warning("Failed to remove from vec collection", error=str(e))
            
            logger.info("Document removed", doc_id=doc_id, removed_count=removed_count)
            
            return {
                "success": removed_count > 0,
                "removed_count": removed_count,
                "message": f"Successfully removed document: {doc_id}" if removed_count > 0 else "No documents found"
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
