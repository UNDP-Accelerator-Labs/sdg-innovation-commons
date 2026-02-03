"""Utility functions for semantic search service."""
import hashlib
import uuid
from typing import List, Dict, Any
import structlog

logger = structlog.get_logger()

# UUID namespace for generating consistent UUIDs (matches NLP API)
QDRANT_UUID = uuid.UUID('12345678-1234-5678-1234-567812345678')


def compute_chunk_hash(snippets: List[str]) -> tuple[str, int]:
    """
    Compute hash of snippet content to detect changes.
    
    Matches NLP API chunk hashing approach.
    
    Args:
        snippets: List of snippet texts
        
    Returns:
        Tuple of (hash_hex_string, snippet_count)
    """
    blake = hashlib.blake2b(digest_size=32)
    blake.update(f"{len(snippets)}:".encode("utf-8"))
    for snippet in snippets:
        blake.update(f"{len(snippet)}:".encode("utf-8"))
        blake.update(snippet.encode("utf-8"))
    return (blake.hexdigest(), len(snippets))


def get_main_uuid(main_id: str) -> str:
    """
    Create a consistent UUID for a document.
    
    Args:
        main_id: Document identifier (e.g., "blog:123")
        
    Returns:
        UUID string
    """
    return str(uuid.uuid5(QDRANT_UUID, main_id))


def flatten_metadata(meta: Dict[str, Any]) -> Dict[str, Any]:
    """
    Flatten metadata fields for efficient Qdrant indexing.
    
    Converts nested metadata to prefixed flat structure.
    Example: {"doc_type": "blog"} -> {"meta_doc_type": "blog"}
    
    Args:
        meta: Original metadata dictionary
        
    Returns:
        Flattened metadata dictionary
    """
    flattened = {}
    for key, value in meta.items():
        flattened[f"meta_{key}"] = value
    return flattened


def unflatten_metadata(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Unflatten metadata from Qdrant payload.
    
    Converts prefixed flat structure back to nested metadata.
    Example: {"meta_doc_type": "blog"} -> {"doc_type": "blog"}
    
    Args:
        payload: Qdrant payload with flattened metadata
        
    Returns:
        Unflattened metadata dictionary
    """
    meta = {}
    for key, value in payload.items():
        if key.startswith("meta_"):
            meta_key = key[5:]  # Remove "meta_" prefix
            meta[meta_key] = value
    return meta


def merge_snippet_payloads(
    base_payload: Dict[str, Any],
    snippet: str,
    chunk_id: int
) -> Dict[str, Any]:
    """
    Create snippet-level payload for vector collection.
    
    Args:
        base_payload: Base metadata payload
        snippet: Snippet text
        chunk_id: Chunk identifier
        
    Returns:
        Complete snippet payload
    """
    return {
        **base_payload,
        "snippet": snippet,
        "chunk_id": chunk_id,
    }
