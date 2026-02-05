#!/bin/bash
# Qdrant Restore Script
# Restores Qdrant collections from a backup

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "Qdrant Restore Script"
echo "======================================"

# Configuration
QDRANT_HOST="${QDRANT_HOST:-localhost}"
QDRANT_PORT="${QDRANT_PORT:-6333}"
COLLECTION_VEC="${COLLECTION_VEC:-sdg_documents_vec}"
COLLECTION_DATA="${COLLECTION_DATA:-sdg_documents_data}"

# Check for backup file
if [ -z "${BACKUP_FILE:-}" ]; then
  echo -e "${YELLOW}Usage: BACKUP_FILE=path/to/backup.tar.gz ./scripts/qdrant-restore.sh${NC}"
  echo ""
  echo "Available backups:"
  if [ -d "./backups/qdrant" ]; then
    ls -lh ./backups/qdrant/*.tar.gz 2>/dev/null || echo "  No backups found"
  else
    echo "  No backup directory found"
  fi
  exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
  echo -e "${RED}ERROR: Backup file not found: ${BACKUP_FILE}${NC}"
  exit 1
fi

echo "Configuration:"
echo "  Qdrant Host: ${QDRANT_HOST}:${QDRANT_PORT}"
echo "  Collections: ${COLLECTION_VEC}, ${COLLECTION_DATA}"
echo "  Backup File: ${BACKUP_FILE}"
echo ""

# Warning
echo -e "${YELLOW}WARNING: This will DELETE and RECREATE the collections!${NC}"
echo -e "${YELLOW}All existing data in Qdrant will be lost!${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "Restore cancelled"
  exit 0
fi

# Check Qdrant health
echo ""
echo "Checking Qdrant health..."
if ! curl -sf "http://${QDRANT_HOST}:${QDRANT_PORT}/health" > /dev/null; then
  echo -e "${RED}ERROR: Qdrant is not reachable at ${QDRANT_HOST}:${QDRANT_PORT}${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Qdrant is healthy${NC}"

# Extract backup
echo ""
echo "Extracting backup..."
TEMP_DIR=$(mktemp -d)
trap "rm -rf ${TEMP_DIR}" EXIT

tar -xzf "${BACKUP_FILE}" -C "${TEMP_DIR}"

# Find snapshot directories
SNAPSHOT_DIR=$(find "${TEMP_DIR}" -name "snapshots-*" -type d | head -1)
if [ -z "${SNAPSHOT_DIR}" ]; then
  echo -e "${RED}ERROR: No snapshot directory found in backup${NC}"
  exit 1
fi

# Display backup metadata
if [ -f "${SNAPSHOT_DIR}/backup-metadata.json" ]; then
  echo ""
  echo "Backup metadata:"
  cat "${SNAPSHOT_DIR}/backup-metadata.json" | jq .
  echo ""
fi

# Function to restore collection from snapshot
restore_collection() {
  local collection=$1
  local snapshot_dir="${SNAPSHOT_DIR}/${collection}"
  
  if [ ! -d "${snapshot_dir}" ]; then
    echo -e "${RED}ERROR: Snapshot directory not found for ${collection}${NC}"
    return 1
  fi
  
  local snapshot_file=$(find "${snapshot_dir}" -name "*.snapshot" | head -1)
  if [ -z "${snapshot_file}" ] || [ ! -f "${snapshot_file}" ]; then
    echo -e "${RED}ERROR: No snapshot file found for ${collection}${NC}"
    return 1
  fi
  
  echo "Restoring collection: ${collection}"
  
  # Delete existing collection (if it exists)
  echo "  Deleting existing collection (if exists)..."
  curl -sf -X DELETE \
    "http://${QDRANT_HOST}:${QDRANT_PORT}/collections/${collection}" \
    ${QDRANT_API_KEY:+-H "api-key: ${QDRANT_API_KEY}"} > /dev/null 2>&1 || true
  
  sleep 2
  
  # Upload snapshot
  echo "  Uploading snapshot..."
  local response=$(curl -sf -X POST \
    "http://${QDRANT_HOST}:${QDRANT_PORT}/collections/${collection}/snapshots/upload" \
    ${QDRANT_API_KEY:+-H "api-key: ${QDRANT_API_KEY}"} \
    -H "Content-Type: application/octet-stream" \
    --data-binary "@${snapshot_file}")
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to upload snapshot for ${collection}${NC}"
    return 1
  fi
  
  # Wait for restore to complete
  echo "  Waiting for restore to complete..."
  for i in {1..30}; do
    sleep 2
    if curl -sf "http://${QDRANT_HOST}:${QDRANT_PORT}/collections/${collection}" \
      ${QDRANT_API_KEY:+-H "api-key: ${QDRANT_API_KEY}"} > /dev/null 2>&1; then
      break
    fi
    if [ $i -eq 30 ]; then
      echo -e "${RED}ERROR: Timeout waiting for restore to complete${NC}"
      return 1
    fi
  done
  
  # Get collection info
  local info=$(curl -sf "http://${QDRANT_HOST}:${QDRANT_PORT}/collections/${collection}" \
    ${QDRANT_API_KEY:+-H "api-key: ${QDRANT_API_KEY}"})
  
  local points_count=$(echo "$info" | jq -r '.result.points_count // 0')
  
  echo -e "${GREEN}  ✓ Restored: ${collection} (${points_count} points)${NC}"
  
  return 0
}

# Restore collections
echo "Starting restore process..."
echo ""

SUCCESS=true

if ! restore_collection "${COLLECTION_VEC}"; then
  SUCCESS=false
fi
echo ""

if ! restore_collection "${COLLECTION_DATA}"; then
  SUCCESS=false
fi
echo ""

if [ "$SUCCESS" = false ]; then
  echo -e "${RED}ERROR: Failed to restore one or more collections${NC}"
  exit 1
fi

echo "======================================"
echo -e "${GREEN}✓ Restore completed successfully!${NC}"
echo ""
echo "Verify the data:"
echo "  curl http://${QDRANT_HOST}:${QDRANT_PORT}/collections/${COLLECTION_VEC}"
echo "  curl http://${QDRANT_HOST}:${QDRANT_PORT}/collections/${COLLECTION_DATA}"
echo "======================================"
