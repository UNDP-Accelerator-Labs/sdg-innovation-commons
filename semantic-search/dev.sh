#!/bin/bash
# Local development script for semantic search service
# Supports hot reload with uvicorn --reload

set -e

cd "$(dirname "$0")"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Starting Semantic Search Service (Development Mode)${NC}"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}No .env file found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env with your configuration${NC}"
    exit 1
fi

# Source environment variables
export $(grep -v '^#' .env | xargs)

# Use localhost for development
export QDRANT_HOST=${QDRANT_HOST:-localhost}
export REDIS_HOST=${REDIS_HOST:-localhost}

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
source venv/bin/activate

# Install/update dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Check if Qdrant is accessible
echo -e "${BLUE}Checking Qdrant connection...${NC}"
if ! curl -s -f "http://${QDRANT_HOST}:6333/health" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Qdrant not accessible at ${QDRANT_HOST}:6333${NC}"
    echo -e "${YELLOW}   Start infrastructure: docker-compose -f ../docker-compose.dev.yml up -d${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Qdrant is running${NC}"

echo ""
echo -e "${GREEN}Starting uvicorn with hot reload...${NC}"
echo -e "${BLUE}Service will be available at: http://localhost:${SERVICE_PORT:-8000}${NC}"
echo -e "${BLUE}API docs: http://localhost:${SERVICE_PORT:-8000}/docs${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Run with hot reload
uvicorn main:app \
    --host ${SERVICE_HOST:-0.0.0.0} \
    --port ${SERVICE_PORT:-8000} \
    --reload \
    --reload-dir . \
    --log-level ${LOG_LEVEL:-info}
