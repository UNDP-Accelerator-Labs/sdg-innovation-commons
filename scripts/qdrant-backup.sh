#!/bin/bash
# Manual Qdrant Backup Script (for local/Docker Compose deployments)
# For Kubernetes deployments, use the CronJob instead

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "Qdrant Manual Backup Script"
echo "Started at: $(date -Iseconds)"
echo "======================================"

# Configuration
QDRANT_HOST="${QDRANT_HOST:-localhost}"
QDRANT_PORT="${QDRANT_PORT:-6333}"
COLLECTION_VEC="${COLLECTION_VEC:-sdg_documents_vec}"
COLLECTION_DATA="${COLLECTION_DATA:-sdg_documents_data}"
BACKUP_DIR="${BACKUP_DIR:-./backups/qdrant}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/qdrant-backup-${TIMESTAMP}.tar.gz"

# Azure Blob Storage (optional)
AZURE_UPLOAD="${AZURE_UPLOAD:-false}"
AZURE_STORAGE_ACCOUNT="${AZURE_STORAGE_ACCOUNT:-}"
AZURE_CONTAINER="${AZURE_CONTAINER:-qdrant-backups}"

echo "Configuration:"
echo "  Qdrant Host: ${QDRANT_HOST}:${QDRANT_PORT}"
echo "  Collections: ${COLLECTION_VEC}, ${COLLECTION_DATA}"
echo "  Backup Directory: ${BACKUP_DIR}"
echo "  Azure Upload: ${AZURE_UPLOAD}"
echo ""

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Function to create and download snapshot
create_snapshot() {
  local collection=$1
  local snapshot_dir="${BACKUP_DIR}/snapshots-${TIMESTAMP}"
  
  echo "Creating snapshot for collection: ${collection}"
  
  # Create snapshot via API
  local response=$(curl -s -X POST \
    "http://${QDRANT_HOST}:${QDRANT_PORT}/collections/${collection}/snapshots" \
    ${QDRANT_API_KEY:+-H "api-key: ${QDRANT_API_KEY}"})
  
  local snapshot_name=$(echo "$response" | jq -r '.result.name // empty')
  
  if [ -z "$snapshot_name" ] || [ "$snapshot_name" = "null" ]; then
    echo -e "${RED}ERROR: Failed to create snapshot for ${collection}${NC}"
    echo "Response: $response"
    return 1
  fi
  
  echo -e "${GREEN}  ✓ Snapshot created: ${snapshot_name}${NC}"
  
  # Download snapshot
  mkdir -p "${snapshot_dir}/${collection}"
  local snapshot_file="${snapshot_dir}/${collection}/${snapshot_name}"
  
  echo "  Downloading snapshot..."
  if ! curl -sf -o "${snapshot_file}" \
    "http://${QDRANT_HOST}:${QDRANT_PORT}/collections/${collection}/snapshots/${snapshot_name}" \
    ${QDRANT_API_KEY:+-H "api-key: ${QDRANT_API_KEY}"}; then
    echo -e "${RED}ERROR: Failed to download snapshot${NC}"
    return 1
  fi
  
  local file_size=$(du -h "${snapshot_file}" | cut -f1)
  echo -e "${GREEN}  ✓ Downloaded: ${snapshot_file} (${file_size})${NC}"
  
  # Optionally delete snapshot from Qdrant to save space
  if [ "${DELETE_SNAPSHOT:-false}" = "true" ]; then
    curl -s -X DELETE \
      "http://${QDRANT_HOST}:${QDRANT_PORT}/collections/${collection}/snapshots/${snapshot_name}" \
      ${QDRANT_API_KEY:+-H "api-key: ${QDRANT_API_KEY}"} > /dev/null
    echo "  ✓ Snapshot deleted from Qdrant"
  fi
  
  return 0
}

# Check Qdrant health
echo "Checking Qdrant health..."
if ! curl -sf "http://${QDRANT_HOST}:${QDRANT_PORT}/health" > /dev/null; then
  echo -e "${RED}ERROR: Qdrant is not reachable at ${QDRANT_HOST}:${QDRANT_PORT}${NC}"
  echo "Make sure Qdrant is running and the host/port are correct"
  exit 1
fi
echo -e "${GREEN}✓ Qdrant is healthy${NC}"
echo ""

# Create snapshots
echo "Creating snapshots..."
SNAPSHOT_DIR="${BACKUP_DIR}/snapshots-${TIMESTAMP}"
SUCCESS=true

if ! create_snapshot "${COLLECTION_VEC}"; then
  SUCCESS=false
fi
echo ""

if ! create_snapshot "${COLLECTION_DATA}"; then
  SUCCESS=false
fi
echo ""

if [ "$SUCCESS" = false ]; then
  echo -e "${RED}ERROR: Failed to create one or more snapshots${NC}"
  exit 1
fi

# Create metadata file
echo "Creating backup metadata..."
cat > "${SNAPSHOT_DIR}/backup-metadata.json" <<EOF
{
  "timestamp": "$(date -Iseconds)",
  "unix_timestamp": $(date +%s),
  "qdrant_host": "${QDRANT_HOST}:${QDRANT_PORT}",
  "collections": ["${COLLECTION_VEC}", "${COLLECTION_DATA}"],
  "backup_type": "manual",
  "created_by": "${USER:-unknown}"
}
EOF

# Compress backup
echo "Compressing backup..."
tar -czf "${BACKUP_FILE}" -C "${BACKUP_DIR}" "snapshots-${TIMESTAMP}"
rm -rf "${SNAPSHOT_DIR}"

BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo -e "${GREEN}✓ Backup compressed: ${BACKUP_FILE} (${BACKUP_SIZE})${NC}"

# Upload to Azure Blob Storage (optional)
if [ "${AZURE_UPLOAD}" = "true" ]; then
  if [ -z "${AZURE_STORAGE_ACCOUNT}" ]; then
    echo -e "${YELLOW}Warning: AZURE_STORAGE_ACCOUNT not set, skipping Azure upload${NC}"
  else
    echo ""
    echo "Uploading to Azure Blob Storage..."
    
    if ! command -v az &> /dev/null; then
      echo -e "${YELLOW}Warning: Azure CLI not installed, skipping upload${NC}"
    else
      BLOB_NAME="manual-backups/qdrant-backup-${TIMESTAMP}.tar.gz"
      
      if az storage blob upload \
        --account-name "${AZURE_STORAGE_ACCOUNT}" \
        --container-name "${AZURE_CONTAINER}" \
        --name "${BLOB_NAME}" \
        --file "${BACKUP_FILE}" \
        --overwrite true \
        --tier Hot \
        --output none; then
        echo -e "${GREEN}✓ Uploaded to Azure: ${AZURE_CONTAINER}/${BLOB_NAME}${NC}"
      else
        echo -e "${YELLOW}Warning: Failed to upload to Azure Blob Storage${NC}"
      fi
    fi
  fi
fi

echo ""
echo "======================================"
echo -e "${GREEN}✓ Backup completed successfully!${NC}"
echo ""
echo "Backup file: ${BACKUP_FILE}"
echo "Backup size: ${BACKUP_SIZE}"
echo ""
echo "To restore this backup:"
echo "  BACKUP_FILE=${BACKUP_FILE} ./scripts/qdrant-restore.sh"
echo "======================================"
