# Semantic Search Service

> **📖 Complete Guide: [docs/SEMANTIC_SEARCH.md](docs/SEMANTIC_SEARCH.md)**

Internal semantic search service for SDG Innovation Commons - replaces the external NLP API with dual-collection architecture.

## Quick Start

```bash
# Initial setup
make setup

# Start infrastructure
make dev-infra

# Start semantic search with hot reload
make dev-semantic
```

## Architecture

### Dual-Collection Design (Matches NLP API)

The service uses **two Qdrant collections** for optimal performance:

- **`{collection}_vec`**: Stores individual snippet embeddings with metadata
- **`{collection}_data`**: Stores document-level metadata and aggregated embeddings

This architecture enables:

- ✅ Snippet-level semantic search with document grouping
- ✅ Efficient filtering on metadata fields
- ✅ Better scalability for large document collections
- ✅ Exact parity with NLP API behavior

## Key Features

### 🔍 Enhanced Search

- Dual-collection architecture using `search_groups`
- Snippet-level vector search with document aggregation
- Configurable chunk size and padding
- Score-based result ranking

### 🤖 Embedding Generation

- 384-dim embeddings (all-MiniLM-L6-v2)
- Batch processing for efficiency
- Document-level and snippet-level embeddings
- Caching support

### 🗄️ Qdrant Vector Database

- Dual collection architecture
- Flattened metadata (meta\_\*) for efficient indexing
- Automatic index creation
- On-disk storage for large datasets

### 🔒 Security

- JWT authentication (Next.js integration)
- API key for service-to-service calls
- Dual authentication for write operations
- Public/authenticated access levels

### ⚡ Performance

- Chunk hashing to avoid re-indexing unchanged documents
- Batch operations for bulk updates
- Optimized HNSW configuration
- Configurable timeouts and limits

### 🚀 Developer Experience

- FastAPI with async support
- Structured logging
- Hot reload for development
- Comprehensive error handling

## Documentation

Complete API documentation available at:

- **[docs/SEMANTIC_SEARCH.md](docs/SEMANTIC_SEARCH.md)** - API guide and deployment

## Configuration

Key environment variables:

```bash
# Architecture
QDRANT_COLLECTION_NAME=sdg_documents  # Base collection name (adds _vec and _data suffixes)

# Performance
ENABLE_CHUNK_HASHING=true             # Skip unchanged documents

# Chunking (matches NLP API)
CHUNK_SIZE=500                        # Snippet size in characters
CHUNK_PADDING=50                      # Overlap between snippets

# Collections
QDRANT_COLLECTION_NAME=sdg_documents  # Base name
# Creates: sdg_documents_vec and sdg_documents_data
```

## API Endpoints

### Public

- `POST /api/search` - Semantic search (public/authenticated)
- `GET /health` - Health check with architecture info

### Authenticated

- `POST /api/stats` - Document statistics
- `POST /api/add_embed` - Add/update document (dual auth)
- `POST /api/remove` - Remove document (dual auth)

### Maintenance (Dual Auth Required)

- `POST /api/maintenance/clean-index?dry_run=true` - Clean stale documents from Qdrant

**API Docs**: http://localhost:8000/docs

## Index Maintenance

The Qdrant index may accumulate stale documents (exist in Qdrant but deleted from PostgreSQL). Clean them using:

### Via API (Recommended for Automation)

```bash
# Dry run (check what would be deleted)
curl -X POST "http://localhost:8000/api/maintenance/clean-index?dry_run=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-API-Key: YOUR_API_KEY"

# Actual deletion
curl -X POST "http://localhost:8000/api/maintenance/clean-index?dry_run=false" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-API-Key: YOUR_API_KEY"
```

### Via CLI Script

```bash
python clean_qdrant_index.py
# Follow prompts for dry-run or live deletion
```

**Schedule periodic cleanup** (e.g., nightly via cron) to keep the index synchronized.

See [QDRANT_MAINTENANCE.md](QDRANT_MAINTENANCE.md) for detailed documentation.

## Migration

To migrate from single to dual collection:

```bash
# Dry run first
python migrate_to_dual_collections.py --dry-run

# Run migration
python migrate_to_dual_collections.py

# Update .env
USE_DUAL_COLLECTIONS=true

# Restart service
```

See [Migration Guide](docs/MIGRATION_GUIDE.md) for details.

## Tech Stack

- FastAPI 0.115.0
- Sentence Transformers 3.3.1
- Qdrant Client 1.12.1
- Python 3.9+
- Structured Logging

## Performance

### Search Speed

- Dual-collection mode: ~100-300ms per query
- Legacy mode: ~200-500ms per query
- Handles 1000+ documents efficiently

### Indexing

- With chunk hashing: ~70% reduction in re-indexing
- Batch processing: up to 100 documents/minute
- Automatic change detection
