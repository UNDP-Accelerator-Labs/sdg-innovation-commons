#!/bin/bash
# Local development script for embedding worker
# Processes documents from Redis queue and generates embeddings

set -e

cd "$(dirname "$0")"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Starting Embedding Worker (Development Mode)${NC}"
echo ""

# Check if .env.development exists, fallback to .env
if [ -f ".env.development" ]; then
    echo -e "${BLUE}Using .env.development${NC}"
    export $(grep -v '^#' .env.development | xargs)
elif [ -f ".env" ]; then
    echo -e "${BLUE}Using .env${NC}"
    export $(grep -v '^#' .env | xargs)
else
    echo -e "${YELLOW}No .env file found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env with your configuration${NC}"
    exit 1
fi

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

# Install/update dependencies if needed
if [ ! -f "venv/.deps_installed" ]; then
    echo -e "${BLUE}Installing dependencies...${NC}"
    pip install -q --upgrade pip
    pip install -q -r requirements.txt
    touch venv/.deps_installed
fi

# Check if Qdrant is accessible
echo -e "${BLUE}Checking Qdrant connection...${NC}"
if ! curl -s -f -H "api-key: ${QDRANT_API_KEY}" "http://${QDRANT_HOST}:6333/" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Qdrant not accessible at ${QDRANT_HOST}:6333${NC}"
    echo -e "${YELLOW}   Start infrastructure: docker-compose -f ../docker-compose.dev.yml up -d${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Qdrant is running${NC}"

# Check if Redis is accessible
echo -e "${BLUE}Checking Redis connection...${NC}"
if ! redis-cli -h ${REDIS_HOST} -p ${REDIS_PORT:-6379} -a "${REDIS_PASSWORD:-devpassword}" --no-auth-warning ping > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Redis not accessible at ${REDIS_HOST}:${REDIS_PORT:-6379}${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Redis is running${NC}"

echo ""
echo -e "${GREEN}Starting embedding worker...${NC}"
echo -e "${BLUE}Worker will process jobs from Redis queue: ${QUEUE_NAME:-embedding_jobs}${NC}"
echo -e "${BLUE}Queue length: $(redis-cli -h ${REDIS_HOST} -p ${REDIS_PORT:-6379} -a "${REDIS_PASSWORD:-devpassword}" --no-auth-warning llen embedding_jobs 2>/dev/null || echo "unknown")${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Run the worker
python worker.py
