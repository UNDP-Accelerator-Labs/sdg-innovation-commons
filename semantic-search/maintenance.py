"""
Qdrant index maintenance functionality.

Provides functions to clean stale documents from Qdrant collections.
"""
import time
import uuid
from typing import Set, Tuple, List, Dict, Any
import structlog
import psycopg2
from qdrant_client.models import Filter, FieldCondition, MatchValue

from config import settings
from qdrant_service import qdrant_service

logger = structlog.get_logger()

# UUID namespace for Qdrant (must match nlpapi)
QDRANT_UUID = uuid.UUID("5c349547-396f-47e1-b0fb-22ed665bc112")

# Map of base (platform) to db_id
DB_ID_MAP = {
    "solution": 4,
    "experiment": 3,
    "actionplan": 2,
    "action plan": 2,
}


def get_valid_id_dbs_from_db() -> Set[str]:
    """
    Load all valid id_db values from PostgreSQL pads table.
    
    Returns:
        Set of valid id_db strings
    """
    logger.info("Loading valid IDs from PostgreSQL")
    
    conn = psycopg2.connect(
        host=settings.db_host,
        port=settings.db_port,
        user=settings.db_user,
        password=settings.db_password,
        database=settings.db_name,
        connect_timeout=10
    )
    
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT DISTINCT id_db FROM pads WHERE id_db IS NOT NULL AND id_db != ''"
        )
        results = cursor.fetchall()
        valid_ids = {row[0] for row in results}
        
        logger.info("Loaded valid IDs from database", count=len(valid_ids))
        return valid_ids
        return valid_ids
        
    finally:
        cursor.close()
        conn.close()


def scan_and_identify_stale_documents(
    valid_ids: Set[str],
    batch_size: int = 100
) -> Tuple[List[Tuple[str, str]], List[Dict[str, Any]], int]:
    """
    Scan data collection and identify stale documents.
    
    Args:
        valid_ids: Set of valid id_db values from database
        batch_size: Number of documents to process per batch
        
    Returns:
        Tuple of (stale_items, stale_details, total_scanned)
        where stale_items is List of (main_uuid, main_id) tuples
    """
    logger.info("Scanning data collection for stale documents", collection=qdrant_service.data_collection)
    
    stale_items = []
    stale_details = []
    offset = None
    total_scanned = 0
    
    while True:
        scroll_result = qdrant_service.client.scroll(
            collection_name=qdrant_service.data_collection,
            limit=batch_size,
            offset=offset,
            with_payload=["main_id", "base", "doc_id", "main_uuid"],
            with_vectors=False
        )
        
        points, next_offset = scroll_result
        
        if not points:
            break
        
        for point in points:
            total_scanned += 1
            payload = point.payload or {}
            
            base = payload.get("base", "")
            doc_id = payload.get("doc_id", 0)
            main_uuid = payload.get("main_uuid", "")
            main_id = payload.get("main_id", "")
            
            # Construct id_db format: {doc_id}-{db_id}
            db_id = DB_ID_MAP.get(base)
            if db_id is None:
                logger.warning("Unknown base for document", base=base, doc_id=doc_id)
                continue
            
            id_db = f"{doc_id}-{db_id}"
            
            # Check if this id_db exists in database
            if id_db not in valid_ids:
                # Generate main_uuid from main_id (matching nlpapi logic)
                generated_uuid = str(uuid.uuid5(QDRANT_UUID, main_id))
                stale_items.append((generated_uuid, main_id))
                stale_details.append({
                    "main_uuid": generated_uuid,
                    "main_id": main_id,
                    "base": base,
                    "doc_id": doc_id,
                    "id_db": id_db
                })
        
        # Progress logging
        if total_scanned % 1000 == 0:
            logger.info("Scan progress", scanned=total_scanned, stale_found=len(stale_items))
        
        if next_offset is None:
            break
        
        offset = next_offset
    
    logger.info(
        "Scan complete",
        total_scanned=total_scanned,
        stale_found=len(stale_items)
    )
    
    return stale_items, stale_details, total_scanned


def delete_stale_documents(
    stale_items: List[Tuple[str, str]]
) -> Tuple[int, int]:
    """
    Delete stale documents from both Qdrant collections.
    
    Args:
        stale_items: List of (main_uuid, main_id) tuples to remove
        
    Returns:
        Tuple of (data_removed_count, vec_removed_count)
    """
    if not stale_items:
        logger.info("No stale documents to remove")
        return 0, 0
    
    logger.info("Removing stale documents", count=len(stale_items))
    
    data_removed = 0
    vec_removed = 0
    
    # Remove from data collection by point ID (main_uuid)
    # Batch deletions for better performance
    batch_size = 100
    for i in range(0, len(stale_items), batch_size):
        batch = stale_items[i:i + batch_size]
        try:
            # Delete by point IDs (main_uuid values)
            point_ids = [item[0] for item in batch]
            qdrant_service.client.delete(
                collection_name=qdrant_service.data_collection,
                points_selector=point_ids
            )
            data_removed += len(batch)
            logger.info(f"Data collection: removed {data_removed}/{len(stale_items)} documents")
        except Exception as e:
            logger.error("Failed to remove batch from data collection", batch_size=len(batch), error=str(e))
    
    # Remove from vec collection by filtering on main_uuid field
    # Vec collection stores main_uuid in payload to reference data collection
    for main_uuid, main_id in stale_items:
        try:
            qdrant_service.client.delete(
                collection_name=qdrant_service.vec_collection,
                points_selector=Filter(
                    must=[FieldCondition(key="main_uuid", match=MatchValue(value=main_uuid))]
                )
            )
            vec_removed += 1
            if vec_removed % 100 == 0:
                logger.info(f"Vec collection: removed {vec_removed}/{len(stale_items)} snippets")
        except Exception as e:
            logger.error("Failed to remove from vec collection", main_uuid=main_uuid, main_id=main_id, error=str(e))
    
    logger.info(
        "Removal complete",
        data_removed=data_removed,
        vec_removed=vec_removed
    )
    
    return data_removed, vec_removed


def clean_qdrant_index(dry_run: bool = True) -> Dict[str, Any]:
    """
    Clean Qdrant index by removing stale documents.
    
    Args:
        dry_run: If True, only scan without deleting
        
    Returns:
        Dictionary with cleanup results
    """
    start_time = time.time()
    
    try:
        # Step 1: Load valid IDs from database
        valid_ids = get_valid_id_dbs_from_db()
        
        # Step 2: Scan and identify stale documents
        stale_items, stale_details, total_scanned = scan_and_identify_stale_documents(valid_ids)
        
        data_removed = 0
        vec_removed = 0
        
        # Step 3: Delete if not dry run
        if not dry_run and stale_items:
            data_removed, vec_removed = delete_stale_documents(stale_items)
        
        elapsed = time.time() - start_time
        
        result = {
            "success": True,
            "dry_run": dry_run,
            "valid_ids_count": len(valid_ids),
            "documents_scanned": total_scanned,
            "stale_documents_found": len(stale_items),
            "data_collection_removed": data_removed,
            "vec_collection_removed": vec_removed,
            "elapsed_seconds": round(elapsed, 2),
            "stale_details": stale_details[:100] if dry_run else []  # Limit details in response
        }
        
        logger.info("Index cleanup completed", **result)
        
        return result
        
    except Exception as e:
        logger.error("Index cleanup failed", error=str(e))
        return {
            "success": False,
            "error": str(e),
            "elapsed_seconds": round(time.time() - start_time, 2)
        }
