#!/bin/bash
# Local development script for background worker
# Supports hot reload with nodemon

set -e

cd "$(dirname "$0")/.."

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Starting Background Worker (Development Mode)${NC}"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}No .env file found${NC}"
    exit 1
fi

# Source environment variables
export $(grep -v '^#' .env | xargs)

# Use localhost for development
export GENERAL_DB_HOST=${GENERAL_DB_HOST:-localhost}
export REDIS_HOST=${REDIS_HOST:-localhost}

# Check if nodemon is installed
if ! command -v nodemon &> /dev/null; then
    echo -e "${YELLOW}Installing nodemon for hot reload...${NC}"
    npm install -g nodemon
fi

echo -e "${GREEN}Starting worker with nodemon...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Run worker with hot reload
nodemon \
    --watch scripts \
    --ext js,cjs,ts \
    --exec "node scripts/run_worker.js"
