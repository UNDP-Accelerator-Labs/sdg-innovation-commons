"""Core semantic search functionality."""
import time
from typing import List, Optional, Dict, Any
import structlog

from models import SearchRequest, SearchResponse, ResultChunk, SearchFilters
from embeddings import embedding_service
from qdrant_client import qdrant_service

logger = structlog.get_logger()


def snippify_text(text: str, chunk_size: int = 500, chunk_padding: int = 50) -> List[str]:
    """
    Split text into overlapping chunks (snippets).
    
    Args:
        text: Input text to split
        chunk_size: Size of each chunk
        chunk_padding: Overlap between chunks
        
    Returns:
        List of text snippets
    """
    if not text:
        return []
    
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
            # TODO: Implement "recent documents" query without vector search
            # For now, return empty results
            return SearchResponse(
                hits=[],
                status="ok",
                message="Empty query - recent documents not yet implemented",
                total=0
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
        
        logger.info(
            "Generated query embedding",
            query_length=len(request.input),
            embed_time=round(embed_time, 3)
        )
        
        # Search vector database
        search_start = time.time()
        search_results = qdrant_service.search(
            query_vector=query_embedding,
            limit=request.limit,
            offset=request.offset,
            filters=request.filters,
            score_threshold=request.score_threshold,
        )
        search_time = time.time() - search_start
        
        logger.info(
            "Vector search completed",
            results_count=len(search_results),
            search_time=round(search_time, 3)
        )
        
        # Convert results to response format
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
            
            # Build result chunk
            chunk = ResultChunk(
                main_id=payload.get("main_id", f"{payload.get('base')}:{payload.get('doc_id')}"),
                score=result["score"],
                base=payload.get("base", ""),
                doc_id=payload.get("doc_id", 0),
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
            total_time=round(total_time, 3),
            embed_time=round(embed_time, 3),
            search_time=round(search_time, 3)
        )
        
        return SearchResponse(
            hits=hits,
            status="ok",
            total=len(hits)
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
            "meta": meta or {}
        }
        
        # Add document to Qdrant
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
            time_seconds=round(total_time, 2)
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
