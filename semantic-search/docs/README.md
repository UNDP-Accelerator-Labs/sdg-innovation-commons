# 🔍 Semantic Search - Complete Guide

A comprehensive guide to set up, use, and deploy the internal semantic search service for SDG Innovation Commons.

---

## 📋 Table of Contents

1. [What is This?](#what-is-this)
2. [Quick Start](#quick-start)
3. [Development Setup](#development-setup)
4. [Production Deployment](#production-deployment)
5. [Data Import](#data-import)
6. [Using the API](#using-the-api)
7. [Integration with Next.js](#integration-with-nextjs)
8. [Troubleshooting](#troubleshooting)
9. [Architecture](#architecture)

---

## What is This?

This is an **internal semantic search service** that replaces the external NLP API. It allows you to:

- 🔎 Search through documents using natural language
- 🤖 Generate embeddings using sentence-transformers
- 📊 Store and query vectors using Qdrant database
- 🔒 Secure API with authentication
- 🚀 Scale independently from the main app

**Technology Stack:**

- **FastAPI** (Python) - API service
- **Sentence Transformers** - ML model for embeddings
- **Qdrant** - Vector database
- **Docker** - Containerization

---

## Quick Start

### Prerequisites

✅ Docker & Docker Compose  
✅ Python 3.9+  
✅ Node.js 18+ with pnpm  
✅ 4GB+ RAM

### 1️⃣ Initial Setup (2 minutes)

```bash
# Generate API keys and create .env files
make setup
```

This automatically:

- Creates `semantic-search/.env` with secure API keys
- Sets up environment configuration

### 2️⃣ Start Development (1 minute)

```bash
# Terminal 1: Start infrastructure (Postgres, Qdrant, Redis)
make dev-infra

# Terminal 2: Start semantic search with hot reload
make dev-semantic

# Terminal 3: (Optional) Start Next.js
make dev-nextjs
```

### 3️⃣ Test It Works

```bash
# Check health
curl http://localhost:8000/health

# Try a search
curl -X POST "http://localhost:8000/api/search" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "sustainable development",
    "limit": 5
  }'
```

✅ **Done!** Your semantic search is running at `http://localhost:8000`

---

## Development Setup

### Option A: Using Make Commands (Recommended)

```bash
# Start infrastructure only
make dev-infra

# Run semantic search with hot reload
make dev-semantic

# Run Next.js with hot reload
make dev-nextjs

# Check status
make dev-status

# View logs
make dev-logs

# Stop everything
make dev-stop
```

**Benefits:**

- ✨ Hot reload - changes apply instantly
- 🐛 Easy debugging with source maps
- 📊 Real-time logs
- ⚡ Fast iteration

### Option B: Manual Setup

```bash
# 1. Start infrastructure
docker-compose -f docker-compose.dev.yml up -d

# 2. Setup Python environment
cd semantic-search
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 4. Run service with hot reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables

Edit `semantic-search/.env`:

```env
# Qdrant Database
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_API_KEY=<your-generated-key>

# Service Configuration
API_SECRET_KEY=<your-generated-key>
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Model Settings
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
DEVICE=cpu  # or 'cuda' for GPU

# Service
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8000
LOG_LEVEL=INFO
```

### Available Make Commands

```bash
make help              # Show all commands
make dev-infra         # Start infrastructure
make dev-semantic      # Start semantic search (hot reload)
make dev-nextjs        # Start Next.js (hot reload)
make dev-worker        # Start background worker (hot reload)
make dev-status        # Check service status
make dev-logs          # View logs
make dev-stop          # Stop infrastructure
make test-semantic     # Run tests
make test-health       # Check health of all services
make clean             # Clean up containers/volumes
```

---

## Production Deployment

### Using Docker Compose (Recommended)

```bash
# 1. Build all images
make prod-build

# 2. Start all services
make prod-up

# 3. Check status
make prod-status

# 4. View logs
make prod-logs
```

This starts **6 services**:

- `postgres` - Database (port 5432)
- `qdrant` - Vector database (ports 6333, 6334)
- `redis` - Cache (port 6379)
- `semantic-search` - Search API (port 8000)
- `nextjs` - Web app (port 3000)
- `worker` - Background jobs

### Manual Production Deployment

```bash
# 1. Configure environment
export QDRANT_API_KEY=$(openssl rand -hex 32)
export API_SECRET_KEY=$(openssl rand -hex 32)

# 2. Start services
docker-compose up -d

# 3. Check health
curl http://your-domain.com:8000/health
```

### Environment Variables for Production

```env
# In production, set these via your deployment platform
QDRANT_API_KEY=<secure-key>
API_SECRET_KEY=<secure-key>
ALLOWED_ORIGINS=https://your-domain.com
QDRANT_HOST=qdrant  # Docker service name
DATABASE_URL=postgresql://user:pass@postgres:5432/dbname
```

### Scaling

```bash
# Scale semantic search to 3 instances
docker-compose up -d --scale semantic-search=3

# Or use make command
make prod-scale service=semantic-search count=3
```

---

## Data Import

### From External NLP API

If you have data in the old external NLP API, import it:

#### Method 1: Qdrant Snapshot (Recommended)

```bash
# 1. Create snapshot on old server
curl -X POST "https://nlpapi.sdg-innovation-commons.org/qdrant/collections/sdg_documents/snapshots" \
  -H "api-key: YOUR_OLD_API_KEY"

# Response: {"snapshot_name": "sdg_documents-2026-01-22.snapshot"}

# 2. Download snapshot
curl -O "https://nlpapi.sdg-innovation-commons.org/qdrant/collections/sdg_documents/snapshots/sdg_documents-2026-01-22.snapshot" \
  -H "api-key: YOUR_OLD_API_KEY"

# 3. Upload to new Qdrant
docker cp sdg_documents-2026-01-22.snapshot sdg-qdrant:/qdrant/snapshots/

# 4. Restore via Qdrant API
curl -X POST "http://localhost:6333/collections/sdg_documents/snapshots/upload" \
  -H "api-key: YOUR_QDRANT_API_KEY" \
  -F "snapshot=@sdg_documents-2026-01-22.snapshot"
```

#### Method 2: Export/Import via API

```bash
# 1. Export from old API (you'll need a script for pagination)
curl "https://nlpapi.sdg-innovation-commons.org/api/export" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o export.json

# 2. Import to new service
curl -X POST "http://localhost:8000/api/add_document" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_NEW_TOKEN" \
  -d @export.json
```

### Add New Documents

```bash
curl -X POST "http://localhost:8000/api/add_document" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "doc_id": "doc123",
    "url": "https://example.com/doc",
    "title": "Sustainable Agriculture Practices",
    "snippets": ["Text content here..."],
    "base": "practices",
    "meta": {"category": "agriculture"}
  }'
```

---

## Using the API

### Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://your-domain.com`

### Authentication

Most endpoints require authentication:

```bash
# Option 1: API Key (service-to-service)
-H "X-API-Key: your-api-secret-key"

# Option 2: JWT Token (user requests)
-H "Authorization: Bearer your-jwt-token"
```

### Endpoints

#### 1. Health Check (Public)

```bash
GET /health

# Response
{
  "status": "healthy",
  "service": "semantic-search",
  "qdrant_connected": true,
  "embedding_model_loaded": true
}
```

#### 2. Search (Public)

```bash
POST /api/search
Content-Type: application/json

{
  "input": "search query here",
  "limit": 10,
  "filters": {
    "base": "practices"
  }
}

# Response
{
  "results": [
    {
      "main_id": 1,
      "score": 0.85,
      "base": "practices",
      "doc_id": "doc123",
      "url": "https://example.com/doc",
      "title": "Document Title",
      "snippets": ["Relevant text..."],
      "meta": {"category": "agriculture"}
    }
  ]
}
```

#### 3. Get Query Embedding (Authenticated)

```bash
POST /api/query_embed
Authorization: Bearer your-token
Content-Type: application/json

{
  "input": "sustainability"
}

# Response
{
  "embedding": [0.123, -0.456, ...],
  "dimension": 384
}
```

#### 4. Statistics (Authenticated)

```bash
GET /api/stats
Authorization: Bearer your-token

# Response
{
  "collections": [
    {
      "name": "sdg_documents",
      "vectors_count": 1500,
      "points_count": 1500
    }
  ]
}
```

#### 5. Add Document (Authenticated)

```bash
POST /api/add_document
Authorization: Bearer your-token
Content-Type: application/json

{
  "doc_id": "doc123",
  "url": "https://example.com",
  "title": "Title",
  "snippets": ["Content..."],
  "base": "practices",
  "meta": {}
}
```

### API Documentation

Interactive API docs available at:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## Integration with Next.js

### TypeScript Client

Use the built-in TypeScript client:

```typescript
import { semanticSearch } from "@/lib/services/semantic-search-client";

// In your component or API route
const results = await semanticSearch({
  input: "sustainable agriculture",
  limit: 10,
  filters: { base: "practices" },
});
```

### Environment Variables

Add to your `.env` file (project root):

```env
SEMANTIC_SEARCH_URL=http://localhost:8000
SEMANTIC_SEARCH_API_KEY=your-api-secret-key
```

### Example Usage

```typescript
// app/api/search/route.ts
import { semanticSearch } from "@/lib/services/semantic-search-client";

export async function POST(request: Request) {
  const { query } = await request.json();

  const results = await semanticSearch({
    input: query,
    limit: 20,
  });

  return Response.json(results);
}
```

### Client Functions

```typescript
// Search
semanticSearch({ input, limit, filters });

// Get stats
getSemanticStats();

// Health check
checkSemanticSearchHealth();
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check what's using the ports
lsof -ti:8000,6333

# Kill processes on those ports
kill -9 $(lsof -ti:8000)

# Clean and restart
make clean
make dev-infra
make dev-semantic
```

### Qdrant Connection Failed

```bash
# Check Qdrant is running
curl http://localhost:6333/health

# Check API key is correct
echo $QDRANT_API_KEY

# Restart Qdrant
docker-compose restart qdrant
```

### Model Not Loading

```bash
# Check model files
ls -la ~/.cache/huggingface/

# Download manually
python3 -c "
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
print('Model loaded successfully')
"
```

### Hot Reload Not Working

```bash
# Python: Check uvicorn is running with --reload
ps aux | grep uvicorn

# Restart dev script
cd semantic-search && ./dev.sh

# Check file watchers
ulimit -n  # Should be > 1024
```

### Search Returns No Results

```bash
# Check collection exists
curl "http://localhost:6333/collections" \
  -H "api-key: $QDRANT_API_KEY"

# Check data is indexed
curl "http://localhost:6333/collections/sdg_documents" \
  -H "api-key: $QDRANT_API_KEY"

# Test embedding generation
curl -X POST "http://localhost:8000/api/query_embed" \
  -H "Authorization: Bearer $API_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input": "test"}'
```

### High Memory Usage

```bash
# Check memory usage
docker stats

# Limit resources in docker-compose.yml
semantic-search:
  deploy:
    resources:
      limits:
        memory: 2G
        cpus: '1.0'
```

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────┐
│            Next.js Application              │
│  ┌─────────────────────────────────────┐   │
│  │  semantic-search-client.ts          │   │
│  │  - semanticSearch()                 │   │
│  │  - Authentication handling          │   │
│  └──────────────┬──────────────────────┘   │
│                 │ HTTP                       │
└─────────────────┼─────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│      Semantic Search Service (FastAPI)      │
│  ┌─────────────────────────────────────┐   │
│  │  /api/search - Search endpoint      │   │
│  │  /api/query_embed - Get embeddings  │   │
│  │  /api/stats - Statistics            │   │
│  └──────────┬──────────────────────────┘   │
│             │                                │
│  ┌──────────▼──────────────────────────┐   │
│  │  Sentence Transformers              │   │
│  │  - all-MiniLM-L6-v2 (384-dim)      │   │
│  │  - Batch embedding generation       │   │
│  └──────────┬──────────────────────────┘   │
│             │                                │
└─────────────┼─────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│           Qdrant Vector Database            │
│  ┌─────────────────────────────────────┐   │
│  │  Collection: sdg_documents          │   │
│  │  - Cosine similarity                │   │
│  │  - HNSW indexing                    │   │
│  │  - API key authentication           │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Development Architecture

```
Infrastructure (Docker):      Services (Local - Hot Reload):
┌──────────────────────┐     ┌──────────────────────┐
│  PostgreSQL :5432    │◄────│  Next.js :3000       │
│  Qdrant :6333        │◄────│  pnpm dev            │
│  Redis :6379         │◄────│                      │
└──────────────────────┘     └──────────────────────┘
         ▲                   ┌──────────────────────┐
         └───────────────────│  Semantic :8000      │
                             │  uvicorn --reload    │
                             └──────────────────────┘
                             ┌──────────────────────┐
                             │  Worker              │
                             │  nodemon             │
                             └──────────────────────┘
```

### Production Architecture

```
All Services in Docker:
┌─────────────────────────────────────────┐
│  PostgreSQL ───┐                        │
│  Qdrant ───────┼─► Next.js :3000        │
│  Redis ────────┘                        │
│                                          │
│  Semantic Search :8000 ◄───────────────┘│
│  Worker (background jobs)               │
└─────────────────────────────────────────┘
```

### Key Components

1. **FastAPI Service** (`semantic-search/main.py`)

   - REST API endpoints
   - Authentication middleware
   - Lifespan management

2. **Embedding Service** (`semantic-search/embeddings.py`)

   - Loads sentence-transformers model
   - Batch embedding generation
   - Caching support

3. **Qdrant Client** (`semantic-search/qdrant_client.py`)

   - Vector database operations
   - Collection management
   - Search with filters

4. **Search Logic** (`semantic-search/search.py`)

   - Semantic search implementation
   - Snippet extraction
   - Result ranking

5. **TypeScript Client** (`app/lib/services/semantic-search-client.ts`)
   - Type-safe API calls
   - Authentication handling
   - Error handling

---

## Additional Resources

### File Structure

```
semantic-search/
├── main.py              # FastAPI app entry point
├── config.py            # Configuration management
├── models.py            # Pydantic data models
├── security.py          # Authentication logic
├── embeddings.py        # ML model management
├── qdrant_client.py     # Vector DB client
├── search.py            # Search implementation
├── requirements.txt     # Python dependencies
├── Dockerfile           # Production container
├── dev.sh              # Development script
├── test-service.sh     # Test suite
└── .env.example        # Environment template

docker-compose.yml       # Production deployment
docker-compose.dev.yml   # Dev infrastructure
Makefile                 # Build commands
```

### Commands Cheat Sheet

```bash
# Development
make setup               # Initial setup
make dev-infra          # Start infrastructure
make dev-semantic       # Start semantic search
make dev-nextjs         # Start Next.js
make dev-status         # Check status
make dev-logs           # View logs
make dev-stop           # Stop services

# Production
make prod-build         # Build images
make prod-up            # Start all services
make prod-down          # Stop all services
make prod-logs          # View logs
make prod-status        # Check status

# Testing
make test-semantic      # Run tests
make test-health        # Health check

# Utilities
make clean              # Clean containers/volumes
make clean-cache        # Clean build caches
make migrate            # Run migrations
```

### Support

- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Check Logs**: `make dev-logs` or `make prod-logs`
- **Issues**: Check troubleshooting section above

---

**Last Updated**: January 2026  
**Version**: 1.0.0
