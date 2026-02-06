"""Core semantic search functionality."""
import time
from typing import List, Optional, Dict, Any
import structlog

from models import SearchRequest, SearchResponse, ResultChunk, SearchFilters
from embeddings import embedding_service
from qdrant_service import qdrant_service
from config import settings

logger = structlog.get_logger()


def snippify_text(text: str, chunk_size: Optional[int] = None, chunk_padding: Optional[int] = None) -> List[str]:
    """
    Split text into overlapping chunks (snippets).
    
    Uses configurable chunk parameters matching NLP API.
    
    Args:
        text: Input text to split
        chunk_size: Size of each chunk (uses config default if None)
        chunk_padding: Overlap between chunks (uses config default if None)
        
    Returns:
        List of text snippets
    """
    if not text:
        return []
    
    # Use config values if not specified
    chunk_size = chunk_size or settings.chunk_size
    chunk_padding = chunk_padding or settings.chunk_padding
    
    snippets = []
    start = 0
    text_length = len(text)
    
    while start < text_length:
        end = start + chunk_size
        snippet = text[start:end]
        
        if snippet.strip():
            snippets.append(snippet.strip())
        
        start = end - chunk_padding
        
        # Prevent infinite loop
        if start >= text_length:
            break
    
    return snippets


def refine_snippets(
    snippets: List[str],
    query_embedding: List[float],
    limit: int = 3
) -> List[str]:
    """
    Refine snippets by re-ranking based on similarity to query.
    
    Args:
        snippets: List of snippet texts
        query_embedding: Query vector
        limit: Maximum number of snippets to return
        
    Returns:
        Top snippets re-ranked by similarity
    """
    if not snippets or not query_embedding:
        return snippets[:limit]
    
    try:
        # Generate embeddings for snippets
        snippet_embeddings = embedding_service.generate_embeddings(snippets)
        
        # Calculate cosine similarities
        scored_snippets = []
        for snippet, embedding in zip(snippets, snippet_embeddings):
            if embedding is None:
                continue
            
            # Cosine similarity
            import numpy as np
            similarity = np.dot(query_embedding, embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(embedding)
            )
            scored_snippets.append((similarity, snippet))
        
        # Sort by similarity and return top snippets
        scored_snippets.sort(key=lambda x: x[0], reverse=True)
        return [snippet for _, snippet in scored_snippets[:limit]]
        
    except Exception as e:
        logger.warning("Failed to refine snippets", error=str(e))
        return snippets[:limit]


async def semantic_search(request: SearchRequest) -> SearchResponse:
    """
    Perform semantic search on the vector database.
    
    Args:
        request: Search request parameters
        
    Returns:
        Search response with results
    """
    start_time = time.time()
    
    try:
        # Handle empty query - return recent documents
        if not request.input or not request.input.strip():
            logger.info("Empty query, returning recent documents")
            
            # Use get_recent_documents instead of semantic search
            search_results, total_count = qdrant_service.get_recent_documents(
                limit=request.limit,
                offset=request.offset,
                filters=request.filters,
                hit_limit=request.hit_limit,
            )
            
            # Convert results to response format
            hits = []
            for result in search_results:
                payload = result["payload"]
                
                # Validate record has required fields
                doc_id = payload.get("doc_id", 0)
                base = payload.get("base", "")
                
                if not base or not doc_id or doc_id == 0:
                    logger.warning(
                        "Skipping invalid record in recent documents",
                        doc_id=doc_id,
                        base=base,
                        main_id=payload.get("main_id", "")
                    )
                    continue
                
                chunk = ResultChunk(
                    main_id=payload.get("main_id", ""),
                    score=result.get("score", 0.0),
                    base=base,
                    doc_id=doc_id,
                    url=payload.get("url", ""),
                    title=payload.get("title", ""),
                    updated=payload.get("updated", ""),
                    snippets=payload.get("snippets", []),
                    meta=payload.get("meta", {})
                )
                hits.append(chunk)
            
            total_time = time.time() - start_time
            
            logger.info(
                "Recent documents retrieved",
                hits_count=len(hits),
                total_count=total_count,
                offset=request.offset,
                total_time=round(total_time, 3)
            )
            
            return SearchResponse(
                hits=hits,
                status="ok",
                total=total_count
            )
        
        # Generate query embedding
        embed_start = time.time()
        query_embedding = embedding_service.generate_embedding(request.input)
        embed_time = time.time() - embed_start
        
        if query_embedding is None:
            logger.error("Failed to generate query embedding")
            return SearchResponse(
                hits=[],
                status="error",
                message="Failed to generate embedding for query"
            )
        
        # Search vector database using search_groups
        search_start = time.time()
        search_results, total_count = qdrant_service.search(
            query_vector=query_embedding,
            limit=request.limit,
            offset=request.offset,
            filters=request.filters,
            score_threshold=request.score_threshold,
            hit_limit=request.hit_limit,
        )
        search_time = time.time() - search_start
        
        # Convert search results to response format
        hits = []
        for result in search_results:
            payload = result["payload"]
            
            # Extract snippets from payload  
            snippets = payload.get("snippets", [])
            
            # Refine snippets if enabled
            if request.short_snippets and snippets:
                snippets = refine_snippets(
                    snippets,
                    query_embedding,
                    limit=request.hit_limit
                )
            else:
                snippets = snippets[:request.hit_limit]
            
            # Validate record has required fields
            doc_id = payload.get("doc_id", 0)
            base = payload.get("base", "")
            
            # Skip records with invalid data (doc_id=0 or empty base)
            if not base or not doc_id or doc_id == 0:
                logger.warning(
                    "Skipping invalid record in search results",
                    doc_id=doc_id,
                    base=base,
                    main_id=payload.get("main_id", "")
                )
                continue
            
            # Build result chunk
            chunk = ResultChunk(
                main_id=payload.get("main_id", f"{base}:{doc_id}"),
                score=result["score"],
                base=base,
                doc_id=doc_id,
                url=payload.get("url", ""),
                title=payload.get("title", ""),
                updated=payload.get("updated", ""),
                snippets=snippets,
                meta=payload.get("meta", {})
            )
            hits.append(chunk)
        
        total_time = time.time() - start_time
        
        logger.info(
            "Search completed",
            query=request.input[:50],
            hits_count=len(hits),
            total_count=total_count,
            limit=request.limit,
            offset=request.offset,
            total_time=round(total_time, 3),
            embed_time=round(embed_time, 3),
            search_time=round(search_time, 3)
        )
        
        return SearchResponse(
            hits=hits,
            status="ok",
            total=total_count
        )
        
    except Exception as e:
        logger.error("Search failed", error=str(e), query=request.input[:50])
        return SearchResponse(
            hits=[],
            status="error",
            message=f"Search failed: {str(e)}"
        )


async def add_document(
    base: str,
    doc_id: int,
    url: str,
    content: str,
    title: Optional[str] = None,
    meta: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Add or update a document in the vector database.
    
    Enhanced to support dual-collection architecture with snippet-level embeddings.
    
    Args:
        base: Platform type (solution, experiment, etc.)
        doc_id: Document ID
        url: Document URL
        content: Full document text
        title: Document title
        meta: Additional metadata
        
    Returns:
        Result dictionary with success status and details
    """
    start_time = time.time()
    
    # Validate input - prevent adding documents with invalid data
    if not base or not base.strip():
        logger.error("Attempted to add document with empty base", doc_id=doc_id, url=url)
        return {
            "success": False,
            "main_id": f":{doc_id}",
            "snippets_added": 0,
            "message": "Invalid base: base cannot be empty"
        }
    
    if not doc_id or doc_id == 0:
        logger.error("Attempted to add document with invalid doc_id", base=base, doc_id=doc_id, url=url)
        return {
            "success": False,
            "main_id": f"{base}:0",
            "snippets_added": 0,
            "message": "Invalid doc_id: doc_id must be a non-zero integer"
        }
    
    main_id = f"{base}:{doc_id}"
    
    try:
        # Generate snippets from content
        snippets = snippify_text(content)
        
        if not snippets:
            logger.warning("No snippets generated", main_id=main_id)
            return {
                "success": False,
                "main_id": main_id,
                "snippets_added": 0,
                "message": "No content to index"
            }
        
        # Generate embeddings for snippets
        snippet_embeddings = embedding_service.generate_embeddings(snippets)
        
        # Filter out failed embeddings
        valid_snippets = []
        valid_embeddings = []
        for snippet, embedding in zip(snippets, snippet_embeddings):
            if embedding is not None:
                valid_snippets.append(snippet)
                valid_embeddings.append(embedding)
        
        if not valid_embeddings:
            logger.error("Failed to generate any embeddings", main_id=main_id)
            return {
                "success": False,
                "main_id": main_id,
                "snippets_added": 0,
                "message": "Failed to generate embeddings"
            }
        
        # Calculate document-level embedding (average of snippet embeddings)
        import numpy as np
        doc_embedding = np.mean(valid_embeddings, axis=0).tolist()
        
        # Prepare payload
        payload = {
            "main_id": main_id,
            "base": base,
            "doc_id": doc_id,
            "url": url,
            "title": title or url,
            "updated": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
            "snippets": valid_snippets,
            "snippet_embeddings": valid_embeddings,  # Include for dual collection mode
            "meta": meta or {}
        }
        
        # Add document to Qdrant (handles both single and dual collection modes)
        success = qdrant_service.add_document(
            doc_id=main_id,
            vector=doc_embedding,
            payload=payload
        )
        
        total_time = time.time() - start_time
        
        logger.info(
            "Document added",
            main_id=main_id,
            snippets_count=len(valid_snippets),
            time_seconds=round(total_time, 2),
            mode="dual"
        )
        
        return {
            "success": success,
            "main_id": main_id,
            "snippets_added": len(valid_snippets),
            "message": "Document added successfully" if success else "Failed to add document"
        }
        
    except Exception as e:
        logger.error("Failed to add document", main_id=main_id, error=str(e))
        return {
            "success": False,
            "main_id": main_id,
            "snippets_added": 0,
            "message": f"Error: {str(e)}"
        }
