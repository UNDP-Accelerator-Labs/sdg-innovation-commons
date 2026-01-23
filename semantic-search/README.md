# Semantic Search Service

> **📖 Complete Guide: [docs/SEMANTIC_SEARCH.md](docs/SEMANTIC_SEARCH.md)**

Internal semantic search service for SDG Innovation Commons - replaces the external NLP API.

## Quick Start

```bash
# Initial setup
make setup

# Start infrastructure
make dev-infra

# Start semantic search with hot reload
make dev-semantic
```

## Documentation

All documentation is in the `docs/` folder:

- **[docs/SEMANTIC_SEARCH.md](docs/SEMANTIC_SEARCH.md)** - Complete guide

## Key Features

- 🔍 Semantic search using sentence transformers
- 🤖 384-dim embeddings (all-MiniLM-L6-v2)
- 🗄️ Qdrant vector database
- 🔒 JWT + API key authentication
- 🚀 FastAPI with async support
- 🔥 Hot reload for development

## API Endpoints

- `POST /api/search` - Semantic search (public)
- `POST /api/query_embed` - Get embeddings (auth)
- `GET /api/stats` - Statistics (auth)
- `GET /health` - Health check

**API Docs**: http://localhost:8000/docs

## Tech Stack

- FastAPI 0.115.0
- Sentence Transformers 3.3.1
- Qdrant Client 1.12.1
- Python 3.9+
