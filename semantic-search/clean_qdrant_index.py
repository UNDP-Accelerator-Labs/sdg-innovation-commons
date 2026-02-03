#!/usr/bin/env python3
"""
Clean Qdrant index by removing documents that don't exist in PostgreSQL.

This is a CLI wrapper around the maintenance.clean_qdrant_index() function.
For programmatic access, use the API endpoint: POST /api/maintenance/clean-index
"""
import time
from qdrant_service import qdrant_service
from maintenance import clean_qdrant_index


def main():
    """Main function to clean Qdrant index."""
    print("=" * 80)
    print("QDRANT INDEX CLEANER")
    print("=" * 80)
    
    # Ask user for confirmation
    print("\nThis script will remove documents from Qdrant that don't exist in PostgreSQL.")
    print(f"Qdrant collections: {qdrant_service.vec_collection}, {qdrant_service.data_collection}")
    
    mode = input("\nRun in dry-run mode first? (y/n) [y]: ").strip().lower()
    dry_run = mode != 'n'
    
    if not dry_run:
        confirm = input("\n⚠️  WARNING: This will DELETE data from Qdrant! Type 'DELETE' to confirm: ")
        if confirm != "DELETE":
            print("Aborted.")
            return
    
    # Connect to Qdrant
    print("\nConnecting to Qdrant...")
    qdrant_service.connect()
    print(f"✓ Connected to Qdrant")
    
    # Run cleanup
    print(f"\n{'[DRY RUN] ' if dry_run else ''}Starting cleanup...\n")
    result = clean_qdrant_index(dry_run=dry_run)
    
    # Display results
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    if result.get("success"):
        print(f"Mode: {'DRY RUN' if dry_run else 'LIVE DELETE'}")
        print(f"Valid IDs in database: {result['valid_ids_count']}")
        print(f"Documents scanned: {result['documents_scanned']}")
        print(f"Stale documents found: {result['stale_documents_found']}")
        
        if not dry_run:
            print(f"Data collection removed: {result['data_collection_removed']}")
            print(f"Vec collection removed: {result['vec_collection_removed']}")
        
        print(f"Time elapsed: {result['elapsed_seconds']} seconds")
        
        if dry_run and result.get('stale_details'):
            print(f"\nSample stale documents (first 10):")
            for detail in result['stale_details'][:10]:
                print(f"  - {detail['base']}:{detail['doc_id']} (id_db={detail['id_db']})")
        
        if dry_run:
            print("\n💡 Run with 'n' to perform actual deletion.")
            print("💡 Or use the API endpoint: POST /api/maintenance/clean-index?dry_run=false")
        else:
            print("\n✓ Qdrant index cleaned successfully!")
    else:
        print(f"❌ Error: {result.get('error')}")
        print(f"Time elapsed: {result.get('elapsed_seconds', 0)} seconds")


if __name__ == "__main__":
    main()
