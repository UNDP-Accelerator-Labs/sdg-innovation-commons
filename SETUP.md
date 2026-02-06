# SDG Innovation Commons - Complete Setup & Deployment Guide

**One comprehensive guide for local development, environment configuration, and production deployment.**

> **⚠️ IMPORTANT - Deprecated Deployment Methods**
>
> The following deployment methods are **deprecated** and should not be used:
>
> - ❌ Old GitHub Actions workflows (`app.yaml`, `hotfix.yaml`, `staging-only.yaml`) - moved to [.github/workflows/deprecated/](.github/workflows/deprecated/)
> - ❌ Manual Kubernetes commands (`make k8s-build`, `make k8s-push`, etc.)
> - ❌ Docker Compose for production (`make prod-build`, `make prod-up`, etc.)
> - ❌ Azure Web Apps deployment
>
> **✅ USE THIS INSTEAD:**
>
> - `make publish` - Deploy to production (automated: sync env → tag → deploy)
> - `make publish-staging` - Deploy to staging (automated: sync env → tag → deploy)
>
> See [CI/CD Automation](#cicd-automation) for the recommended deployment process.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Environment Variables](#environment-variables)
4. [Local Development Setup](#local-development-setup)
5. [Production Deployment](#production-deployment)
6. [CI/CD Automation](#cicd-automation)
7. [Domain & SSL Configuration](#domain--ssl-configuration)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose
- GitHub CLI (`brew install gh`)
- Azure CLI (`brew install azure-cli`)
- kubectl (`brew install kubectl`)

### 5-Minute Local Development Setup

```bash
# 1. Clone and install
git clone https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons.git
cd sdg-innovation-commons
pnpm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# 3. Start local development (all services with one command)
make local-start
# Visit http://localhost:3000
```

### Local Kubernetes Testing

For testing Kubernetes deployments locally before production:

```bash
# 1. Setup local Kubernetes (Docker Desktop or Minikube)
make k8s-local-setup

# 2. Build container images
make k8s-local-build

# 3. Create environment files if not already done
cp .env.example .env.local
cp semantic-search/.env.example semantic-search/.env.development
# Edit with your configuration

# 4. Deploy to local Kubernetes (automatically loads environment variables)
make k8s-local-deploy

# 5. Access services via port forwarding
make k8s-local-port-forward
# Then visit http://localhost:3000
```

**How Environment Variables Work:**

- Each service gets its own ConfigMap and Secret in Kubernetes
- Next.js/Worker use: `nextjs-config` and `nextjs-secrets` (from `.env.local`)
- Semantic Search uses: `semantic-search-config` and `semantic-search-secrets` (from `semantic-search/.env.development`)
- **No conflicts or overwrites** - services are isolated
- Script automatically categorizes variables as ConfigMap (non-sensitive) or Secret (sensitive)

For **production deployment**, skip to [CI/CD Automation](#cicd-automation).

---

## Architecture Overview

The SDG Innovation Commons consists of **three interconnected services**:

```
┌─────────────────────────────────────────────────────────────────┐
│                     SDG Innovation Commons                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐      ┌──────────────────┐      ┌───────────┐  │
│  │   Next.js   │◄────►│ Semantic Search  │◄────►│  Qdrant   │  │
│  │   Web App   │      │  (Python/FastAPI)│      │  (Vector  │  │
│  │             │      │                  │      │    DB)    │  │
│  └──────┬──────┘      └──────────────────┘      └───────────┘  │
│         │                                                        │
│         │             ┌──────────────────┐                      │
│         ├────────────►│     Worker       │                      │
│         │             │  (Background     │                      │
│         │             │   Processing)    │                      │
│         │             └──────────────────┘                      │
│         │                                                        │
│         │             ┌──────────────────┐                      │
│         └────────────►│   PostgreSQL     │                      │
│                       │   (Azure Managed)│                      │
│                       └──────────────────┘                      │
│                                                                  │
│                       ┌──────────────────┐                      │
│                       │   Azure Blob     │                      │
│                       │   Storage        │                      │
│                       └──────────────────┘                      │
│                                                                  │
│                       ┌──────────────────┐                      │
│                       │     Redis        │                      │
│                       │   (Cache/Queue)  │                      │
│                       └──────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

### Components

| Component            | Purpose                                      | Technology                             | Environment File                                                       |
| -------------------- | -------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------- |
| **Next.js App**      | Main web application, API routes, admin UI   | Next.js 14, React                      | `.env.local` (dev) or `..env.production` (CI/CD)                       |
| **Semantic Search**  | Vector-based search using embeddings         | Python, FastAPI, sentence-transformers | `semantic-search/.env.development` (dev) or `..env.production` (CI/CD) |
| **Embedding Worker** | Background embedding processor (queue-based) | Python, Redis queue                    | Same as Semantic Search (shares env)                                   |
| **Worker**           | Background job processing (exports, emails)  | Node.js, Bull queues                   | Same as Next.js (shares env)                                           |
| **Qdrant**           | Vector database for semantic search          | Qdrant (Rust)                          | No env needed (configured via Semantic Search)                         |
| **PostgreSQL**       | Primary database (Azure managed)             | PostgreSQL 14+                         | Connection string in Next.js env                                       |
| **Redis**            | Cache and job queue                          | Redis 7+                               | URL in Next.js env                                                     |
| **Azure Blob**       | File storage for uploads and backups         | Azure Storage                          | Connection string in Next.js env                                       |

---

## Semantic Search System

### Overview

The semantic search system provides vector-based search capabilities using sentence transformers and Qdrant vector database. It consists of three main components:

1. **Semantic Search API (FastAPI)**: REST API for search operations and document indexing
2. **Embedding Worker**: Background service that processes document embedding jobs from a Redis queue
3. **Qdrant Vector Database**: Stores document embeddings and performs similarity search

### Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Semantic Search System                       │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐         ┌──────────────┐                    │
│  │   Next.js    │────────▶│  Semantic    │                    │
│  │     App      │  API    │  Search API  │                    │
│  │              │◀────────│  (FastAPI)   │                    │
│  └──────────────┘         └──────┬───────┘                    │
│         │                        │                             │
│         │ Trigger                │ Submit Jobs                 │
│         │ Indexing               ▼                             │
│         │                 ┌──────────────┐                    │
│         │                 │    Redis     │                    │
│         │                 │    Queue     │                    │
│         │                 └──────┬───────┘                    │
│         │                        │                             │
│         │                        │ Poll for Jobs               │
│         │                        ▼                             │
│         │                 ┌──────────────┐                    │
│         │                 │  Embedding   │                    │
│         │                 │   Worker     │                    │
│         │                 │ (1-10 pods)  │                    │
│         │                 └──────┬───────┘                    │
│         │                        │                             │
│         │                        │ Store Embeddings            │
│         │                        ▼                             │
│         │                 ┌──────────────┐                    │
│         └────────────────▶│   Qdrant     │                    │
│           Fetch from      │   Vector     │                    │
│           PostgreSQL      │   Database   │                    │
│                           └──────────────┘                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Features

- **Queue-Based Processing**: Documents are queued in Redis and processed asynchronously by workers
- **Auto-Scaling**: Embedding workers scale from 0-10 based on queue depth (Kubernetes HPA)
- **Dual Authentication**: API endpoints require both JWT token and API key for security
- **Status Tracking**: Monitor embedding job status via API
- **Admin Operations**: Bulk re-indexing from database (admin only)
- **Graceful Shutdown**: Workers handle shutdown signals without losing jobs

### API Endpoints

#### Search Endpoints

```bash
# Search documents
POST /api/search
{
  "query": "sustainable development",
  "limit": 10,
  "filters": {"base": ["solution"], "status": ["public"]}
}

# Get recent documents
GET /api/recent?limit=10&base=solution&status=public
```

#### Embedding Endpoints (Require JWT + API Key)

```bash
# Submit single document for embedding
POST /api/embed
{
  "main_id": "solution:123",
  "title": "Document title",
  "content": "Document content...",
  "metadata": {"country": "Kenya"}
}

# Submit batch of documents
POST /api/embed/batch
{
  "documents": [
    {"main_id": "solution:123", "title": "...", "content": "..."},
    {"main_id": "solution:124", "title": "...", "content": "..."}
  ]
}

# Check job status
GET /api/embed/status/{job_id}

# Get queue statistics
GET /api/embed/stats

# Trigger database re-indexing (Admin only)
POST /api/embed/trigger
{
  "base": "solution",  # or ["solution", "blog"] or "all"
  "batch_size": 10
}

# Remove document from index
DELETE /api/embed
{
  "main_id": "solution:123"
}
```

#### Health Check

```bash
# API health
GET /health

# Embedding API health
GET /api/embed/health
```

### Document Types (Bases)

The system indexes four types of documents from PostgreSQL:

| Base         | Table    | Status Filter  | Description                                     |
| ------------ | -------- | -------------- | ----------------------------------------------- |
| `solution`   | pads     | status >= 2    | Solution documents (status 2=preview, 3=public) |
| `experiment` | pads     | status >= 2    | Experiment documents                            |
| `actionplan` | pads     | status >= 2    | Action plan documents                           |
| `blog`       | articles | relevance >= 2 | Blogs and Publications (all status is public)   |

**Main ID Format**: `base:doc_id` (e.g., `solution:123`, `blog:456`)

### Status Mapping

Documents have a `meta_status` field in Qdrant for filtering:

- **Pads** (solution/experiment/actionplan):
  - status 2 → `meta_status: "preview"` (visible to authenticated users)
  - status 3 → `meta_status: "public"` (visible to all)
- **Blogs**:
  - All indexed blogs → `meta_status: "public"`

**Search Filtering**:

- Unauthenticated users: Only see documents with `status: ["public"]`
- Authenticated users: See documents with `status: ["preview", "public"]`

### Local Development

#### Start Semantic Search Services

```bash
# Terminal 1: Start infrastructure (Qdrant, Redis)
make dev-infra

# Terminal 2: Start Semantic Search API
cd semantic-search
source venv/bin/activate
./dev.sh
# Runs on http://localhost:8000

# Terminal 3: Start Embedding Worker
cd semantic-search
source venv/bin/activate
./dev-worker.sh
# Processes jobs from Redis queue
```

#### Test the System

```bash
# Get JWT token from Next.js (login via browser, check network tab)
JWT_TOKEN="your-jwt-token-here"
API_KEY="your-api-key-from-env"

# Submit a document for embedding
curl -X POST "http://localhost:8000/api/embed" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "main_id": "solution:123"
  }'

# Check job status
curl "http://localhost:8000/api/embed/status/{job_id}" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "X-API-Key: $API_KEY"

# Trigger bulk re-indexing (admin only)
curl -X POST "http://localhost:8000/api/embed/trigger" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "base": "solution",
    "batch_size": 10
  }'
```

### Production Deployment

The semantic search system is automatically deployed via CI/CD:

#### Components Deployed

1. **Semantic Search API**:

   - 2 replicas (auto-scales 2-5 based on CPU)
   - Health checks on `/health` endpoint
   - ConfigMap: `semantic-search-config`
   - Secrets: `semantic-search-secrets`

2. **Embedding Worker**:

   - Starts at 1 replica
   - Auto-scales 0-10 based on queue depth
   - Processes jobs from Redis queue
   - ConfigMap: `embedding-worker-config`
   - Secrets: `embedding-worker-secrets`

3. **Qdrant**:

   - Single replica (StatefulSet)
   - Persistent storage (50Gi)
   - Daily backups to Azure Blob Storage

4. **Redis**:
   - Single replica (StatefulSet)
   - Persistent storage (10Gi)
   - Used for queue and cache

#### Environment Variables

The CI/CD pipeline creates separate ConfigMaps and Secrets for each service:

**Semantic Search API** (`semantic-search-config` + `semantic-search-secrets`):

```yaml
# ConfigMap (non-sensitive)
QDRANT_HOST=qdrant-service
QDRANT_PORT=6333
REDIS_HOST=redis-service
REDIS_PORT=6379
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LOG_LEVEL=INFO
SERVICE_PORT=8000

# Secrets (sensitive)
QDRANT_API_KEY=<from-github-secrets>
REDIS_PASSWORD=<from-github-secrets>
GENERAL_DB_HOST=<from-github-secrets>
GENERAL_DB_PASSWORD=<from-github-secrets>
BLOGS_DB_HOST=<from-github-secrets>
BLOGS_DB_PASSWORD=<from-github-secrets>
API_SECRET_KEY=<from-github-secrets>
```

**Embedding Worker** (`embedding-worker-config` + `embedding-worker-secrets`):

```yaml
# ConfigMap (non-sensitive)
WORKER_CONCURRENCY=2
WORKER_BATCH_SIZE=10
LOG_LEVEL=INFO
DEVICE=cpu
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
REDIS_HOST=redis-service
QDRANT_HOST=qdrant-service
SEMANTIC_SEARCH_URL=http://semantic-search-service:8000
APP_BASE_URL=<from-github-secrets>

# Secrets (sensitive)
QDRANT_API_KEY=<from-github-secrets>
REDIS_PASSWORD=<from-github-secrets>
GENERAL_DB_PASSWORD=<from-github-secrets>
BLOGS_DB_PASSWORD=<from-github-secrets>
```

#### Monitoring

```bash
# Check semantic search pods
kubectl get pods -l app=semantic-search

# Check embedding worker pods
kubectl get pods -l app=embedding-worker

# View semantic search logs
kubectl logs -f deployment/semantic-search

# View worker logs
kubectl logs -f deployment/embedding-worker

# Check queue statistics
kubectl exec -it deployment/semantic-search -- \
  curl http://localhost:8000/api/embed/stats

# Check auto-scaling status
kubectl get hpa
```

### Troubleshooting

#### Semantic Search API Not Responding

```bash
# Check if pods are running
kubectl get pods -l app=semantic-search

# Check logs
kubectl logs -f deployment/semantic-search

# Check Qdrant connection
kubectl exec -it deployment/semantic-search -- \
  curl http://qdrant-service:6333/health

# Check Redis connection
kubectl exec -it deployment/semantic-search -- \
  python -c "import redis; r=redis.Redis(host='redis-service', port=6379); print(r.ping())"
```

#### Worker Not Processing Jobs

```bash
# Check if worker pods are running
kubectl get pods -l app=embedding-worker

# Check worker logs
kubectl logs -f deployment/embedding-worker

# Check queue depth in Redis
kubectl exec -it deployment/redis -- \
  redis-cli LLEN embedding_jobs

# Manually scale workers if needed
kubectl scale deployment/embedding-worker --replicas=5
```

#### Jobs Failing

```bash
# Check dead letter queue for failed jobs
kubectl exec -it deployment/redis -- \
  redis-cli LRANGE embedding_dlq 0 -1

# Check job status
curl "http://<api-url>/api/embed/status/{job_id}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-API-Key: $API_KEY"

# Retry failed jobs (requires admin access)
# Jobs automatically retry up to 3 times before moving to DLQ
```

#### Search Returning No Results

```bash
# Check if Qdrant has documents
kubectl exec -it deployment/qdrant -- \
  curl http://localhost:6333/collections/main_dot_data

# Check document count
kubectl exec -it deployment/semantic-search -- \
  curl http://localhost:8000/health

# Trigger re-indexing (admin only)
curl -X POST "http://<api-url>/api/embed/trigger" \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"base": "all", "batch_size": 10}'
```

### Performance Tuning

#### Worker Scaling

The embedding worker auto-scales based on queue depth:

```yaml
# Default HPA configuration (in 12-embedding-worker.yaml)
minReplicas: 1
maxReplicas: 10
metrics:
  - type: External
    external:
      metric:
        name: redis_queue_length
      target:
        type: AverageValue
        averageValue: "50" # Scale when > 50 jobs per pod
```

**Adjust scaling parameters:**

```bash
# Edit the HPA
kubectl edit hpa embedding-worker-hpa

# Or manually scale
kubectl scale deployment/embedding-worker --replicas=5
```

#### Batch Size

Control how many documents are processed per batch:

```bash
# Update worker config
kubectl set env deployment/embedding-worker WORKER_BATCH_SIZE=20

# Or edit ConfigMap
kubectl edit configmap embedding-worker-config
# Then restart: kubectl rollout restart deployment/embedding-worker
```

#### Throughput Expectations

| Setup            | Workers | Throughput       | Notes                 |
| ---------------- | ------- | ---------------- | --------------------- |
| Local Dev        | 1       | ~10 docs/sec     | No resource limits    |
| K8s (1 worker)   | 1       | ~8-10 docs/sec   | 2 CPU, 2GB per worker |
| K8s (5 workers)  | 5       | ~40-50 docs/sec  | Default max for HPA   |
| K8s (10 workers) | 10      | ~80-100 docs/sec | Max workers           |

**Full re-index time (11K documents)**:

- 1 worker: ~18-20 minutes
- 5 workers: ~3-4 minutes
- 10 workers: ~2-3 minutes

---

## Environment Variables

### Philosophy: **Separation by Service**

Each service has its **own environment file** for clarity and isolation:

```
Project Root
├── .env.local                      # Next.js + Worker (local dev)
├── .env.production                 # All services (production CI/CD) - GITIGNORED
├── .env.staging                    # All services (staging CI/CD) - GITIGNORED
└── semantic-search/
    ├── .env.development            # Semantic search (local dev)
    ├── .env.staging                # Semantic search (staging) - GITIGNORED
    └── .env.production             # Semantic search (production) - GITIGNORED
```

**Why separate?**

- ✅ Clear boundaries between services
- ✅ Easier debugging (know which service config is wrong)
- ✅ Independent configuration (semantic search can use different settings)
- ✅ Security (services only see their own secrets)

### Next.js + Worker Environment (`.env.local` for dev)

The Next.js app and Worker share the same environment configuration:

```bash
# ============================================
# APPLICATION
# ============================================
APP_ID='exp'
APP_SUITE='secret_app_suite_name'
APP_SECRET='generate_with_openssl_rand_base64_32'
APP_SESSION_KEY='secret_session_key_here'
AUTH_URL='http://localhost:3000/api/auth'
NODE_ENV='development'

# ============================================
# NEXTAUTH (v5 / Auth.js)
# ============================================
NEXTAUTH_URL='http://localhost:3000'
NEXTAUTH_SECRET='generate_with_openssl_rand_base64_32'

# ============================================
# DATABASE (Azure PostgreSQL)
# ============================================
DATABASE_URL='postgresql://user:password@server.postgres.database.azure.com:5432/dbname?sslmode=require'

# Or individual parameters:
GENERAL_DB_HOST='server.postgres.database.azure.com'
GENERAL_DB_USER='dbuser'
GENERAL_DB_PASSWORD='dbpassword'
GENERAL_DB_NAME='postgres'
GENERAL_DB_PORT=5432
DB_REQUIRE_SSL=true

# Other platform DBs (optional)
BLOG_DB_HOST='server.postgres.database.azure.com'
BLOG_DB_USER='blog_user'
# ... (see .env.example for all options)

# ============================================
# AZURE BLOB STORAGE
# ============================================
AZURE_STORAGE_CONNECTION_STRING='DefaultEndpointsProtocol=https;AccountName=youraccountname;AccountKey=yourkey;EndpointSuffix=core.windows.net'

# ============================================
# EMAIL (SMTP)
# ============================================
SMTP_HOST='smtp.example.com'
SMTP_PORT=587
SMTP_USER='no-reply@example.org'
SMTP_PASS='your_smtp_password'
SMTP_SERVICE=''  # Optional: 'Outlook365', 'Gmail'
ADMIN_EMAILS='admin1@example.org;admin2@example.org'

# ============================================
# EXTERNAL APIs
# ============================================
OPENCAGE_API='your_opencage_api_key'
ACCLAB_PLATFORM_KEY='your_acclab_platform_key'
BLOG_API_TOKEN='your_blog_api_token'

# ============================================
# FEATURE FLAGS
# ============================================
NEXT_PUBLIC_ENABLE_UNDP_SSO='true'
NEXT_PUBLIC_ENABLE_EMAIL_AUTH='true'
```

**Generate secure secrets:**

```bash
openssl rand -base64 32  # For APP_SECRET, NEXTAUTH_SECRET
```

### Semantic Search Environment (`semantic-search/.env.development`)

For local development, the semantic search service uses its own environment file:

```bash
# ============================================
# QDRANT VECTOR DATABASE
# ============================================
QDRANT_HOST='localhost'  # or 'qdrant-service' in Kubernetes
QDRANT_PORT=6333
QDRANT_API_KEY=''  # Optional: for production

# ============================================
# EMBEDDING MODEL
# ============================================
# Options: 'openai' or 'sentence-transformers'
EMBEDDING_PROVIDER='sentence-transformers'

# If using OpenAI:
OPENAI_API_KEY='your_openai_api_key'
OPENAI_MODEL='text-embedding-ada-002'

# If using sentence-transformers (default):
SENTENCE_TRANSFORMER_MODEL='all-MiniLM-L6-v2'

# ============================================
# API CONFIGURATION
# ============================================
API_HOST='0.0.0.0'
API_PORT=8000
LOG_LEVEL='INFO'  # DEBUG, INFO, WARNING, ERROR

# ============================================
# SEARCH SETTINGS
# ============================================
DEFAULT_SEARCH_LIMIT=10
MAX_SEARCH_LIMIT=100
SEARCH_SCORE_THRESHOLD=0.7
```

**Create this file:**

```bash
cp semantic-search/.env.example semantic-search/.env.development
# Edit with your local configuration
```

### Production CI/CD Environment Files

For production deployment, create **consolidated environment files** that the CI/CD script reads:

#### `..env.production` (gitignored)

```bash
# Azure Container Registry
ACR_LOGIN_SERVER=yourregistry.azurecr.io
ACR_USERNAME=your-acr-username
ACR_PASSWORD=your-acr-password

# Azure Kubernetes Service
AKS_CLUSTER_NAME=your-aks-cluster-name
AKS_RESOURCE_GROUP=your-resource-group

# Application Secrets
APP_SECRET=your_production_app_secret
NEXTAUTH_SECRET=your_production_nextauth_secret

# Database
DATABASE_URL=postgresql://user:password@server.postgres.database.azure.com:5432/dbname?sslmode=require

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net

# Email/SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=no-reply@example.org
SMTP_PASS=your_smtp_password
ADMIN_EMAILS=admin@example.org

# External APIs
OPENCAGE_API=your_opencage_api_key
ACCLAB_PLATFORM_KEY=your_acclab_platform_key
BLOG_API_TOKEN=your_blog_api_token

# Semantic Search
QDRANT_HOST=qdrant-service
QDRANT_PORT=6333
OPENAI_API_KEY=your_openai_api_key_for_embeddings
```

Copy template:

```bash
cp ..env.production.example ..env.production
# Edit with actual production values
```

#### `..env.staging` (gitignored)

Same structure as `..env.production` but with staging credentials.

### Environment Variables Flow

```
┌─────────────────────────────────────────────────────────────┐
│ DEVELOPMENT (Local)                                          │
├─────────────────────────────────────────────────────────────┤
│  .env.local                    → Next.js + Worker           │
│  semantic-search/.env.development → Semantic Search service  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRODUCTION (CI/CD)                                           │
├─────────────────────────────────────────────────────────────┤
│  ..env.production → GitHub Secrets → Kubernetes Secrets       │
│                                                              │
│  GitHub Actions reads ..env.production → Creates K8s secrets: │
│    • app-secrets (Next.js + Worker)                         │
│    • semantic-search-secrets (Semantic Search)               │
│    • acr-secret (Docker registry)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Local Development Setup

### 1. Install Dependencies

```bash
# Install Node.js dependencies
pnpm install

# Install Python dependencies for semantic search
cd semantic-search
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Set Up Environment Files

```bash
# Next.js environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# Semantic Search environment
cp semantic-search/.env.example semantic-search/.env.development
# Edit with your Qdrant and embedding model settings
```

### 3. Start Infrastructure Services

**Option A: Using Docker Compose** (Recommended)

```bash
# Start Qdrant, Redis (PostgreSQL optional if using Azure)
make dev-infra
# or: docker-compose -f deploy/docker-compose.dev.yml up -d
```

**Option B: Install Locally**

```bash
# Qdrant
docker run -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant

# Redis
brew install redis
redis-server
```

### 4. Run Database Migrations

```bash
# Make sure DATABASE_URL is set in .env.local
pnpm run migrate
```

### 5. Start Development Servers

**Terminal 1: Next.js**

```bash
pnpm run dev
# Runs on http://localhost:3000
```

**Terminal 2: Semantic Search**

```bash
cd semantic-search
source venv/bin/activate
./dev.sh  # or: uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Runs on http://localhost:8000
```

**Terminal 3: Worker (Optional)**

```bash
pnpm run worker
# Processes background jobs
```

### 6. Verify Setup

```bash
# Check Next.js
curl http://localhost:3000/api/health

# Check Semantic Search
curl http://localhost:8000/health

# Check Qdrant
curl http://localhost:6333/health
```

### Development Workflow

```bash
# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Build for production (test)
pnpm build
```

---

## Production Deployment

### Local Kubernetes Testing (Before Production)

Before deploying to production, you can test the complete Kubernetes setup locally using Docker Desktop Kubernetes or Minikube.

#### Prerequisites

- Docker Desktop with Kubernetes enabled, OR
- Minikube installed (`brew install minikube`)

#### Setup Process

```bash
# 1. Enable Kubernetes (Docker Desktop)
# Docker Desktop → Settings → Kubernetes → Enable Kubernetes

# OR start Minikube
minikube start --driver=docker

# 2. Verify cluster is running
kubectl cluster-info
kubectl get nodes

# 3. Create your local environment file
cp .env.example .env.local
# Edit .env.local with your local/test configuration

# Create semantic search environment file
cp semantic-search/.env.example semantic-search/.env.development
# Edit semantic-search/.env.development with semantic search settings

# 4. Build Docker images for local Kubernetes
make k8s-local-build

# 5. Deploy everything (automatically loads ALL env vars from .env.local)
make k8s-local-deploy
```

**What happens during `make k8s-local-deploy`:**

1. Creates namespace `sdg-innovation-commons`
2. **Automatically reads `.env.local` AND `semantic-search/.env.development` and creates:**
   - ConfigMap `sdg-app-config` (non-sensitive config from both files)
   - Secret `sdg-app-secrets` (sensitive credentials from both files)
3. Deploys infrastructure: Qdrant, Redis
4. Deploys applications: Next.js, Semantic Search, Worker
5. **All pods automatically receive ALL environment variables via `envFrom`**

#### Accessing Services Locally

```bash
# Option 1: Port forwarding (recommended)
make k8s-local-port-forward
# Then follow the instructions to forward ports

# Option 2: Manual port forwarding
kubectl port-forward -n sdg-innovation-commons svc/nextjs-service 3000:3000 &
kubectl port-forward -n sdg-innovation-commons svc/semantic-search-service 8000:8000 &

# Access services
open http://localhost:3000          # Next.js app
open http://localhost:8000/docs     # Semantic Search API docs
```

#### Verifying Environment Variables

```bash
# Check if ConfigMap was created
kubectl get configmap sdg-app-config -n sdg-innovation-commons -o yaml

# Check if Secrets were created (keys only, values are base64 encoded)
kubectl get secret sdg-app-secrets -n sdg-innovation-commons -o jsonpath='{.data}' | jq 'keys'

# Verify pod has environment variables
POD=$(kubectl get pods -n sdg-innovation-commons -l app=nextjs -o jsonpath='{.items[0].metadata.name}')
kubectl exec -it $POD -n sdg-innovation-commons -- env | grep DATABASE_URL
```

#### Managing Local Kubernetes

```bash
# Check deployment status
make k8s-local-status

# View logs
make k8s-local-logs

# Restart deployments (after updating .env.local)
./scripts/create-k8s-secrets-from-env.sh local sdg-innovation-commons
make k8s-local-restart

# Clean up everything
make k8s-local-delete
```

#### Environment Variable Management

The `scripts/create-k8s-secrets-from-env.sh` script automatically:

- Parses your `.env.local` file (for Next.js/Worker)
- Parses `semantic-search/.env.development` (for Semantic Search)
- Separates variables into **ConfigMap** (non-sensitive) and **Secret** (sensitive)
- Creates/updates Kubernetes resources

**For local development, you need both files:**

```bash
.env.local                              # Main app config
semantic-search/.env.development        # Semantic search config
```

**ConfigMap variables** (non-sensitive):

- NODE_ENV, PORT, LOG_LEVEL
- Service hostnames and ports
- Model configurations
- Public settings

**Secret variables** (sensitive):

- DATABASE_URL, passwords
- API keys and tokens
- SMTP credentials
- Storage connection strings

**All Kubernetes deployments use `envFrom`** to automatically load all variables:

```yaml
containers:
  - name: nextjs
    envFrom:
      - configMapRef:
          name: sdg-app-config
      - secretRef:
          name: sdg-app-secrets
```

This means **you only need to maintain your `.env.local` and `semantic-search/.env.development` files** - the script handles everything else!

---

### Option 1: Automated CI/CD (Recommended)

See [CI/CD Automation](#cicd-automation) section below.

### Option 2: Manual Kubernetes Deployment

#### Prerequisites

- Azure AKS cluster provisioned
- Azure Container Registry (ACR) created
- Azure PostgreSQL database configured
- Azure Blob Storage account created
- kubectl configured for your cluster

#### Step 1: Build and Push Docker Images

```bash
# Login to ACR
az acr login --name yourregistry

# Build images
docker build -t yourregistry.azurecr.io/sdg-nextjs:latest -f deploy/Dockerfile .
docker build -t yourregistry.azurecr.io/sdg-semantic-search:latest -f semantic-search/Dockerfile semantic-search
docker build -t yourregistry.azurecr.io/sdg-worker:latest -f deploy/Dockerfile.worker .

# Push images
docker push yourregistry.azurecr.io/sdg-nextjs:latest
docker push yourregistry.azurecr.io/sdg-semantic-search:latest
docker push yourregistry.azurecr.io/sdg-worker:latest
```

#### Step 2: Create Kubernetes Secrets

```bash
# Application secrets
kubectl create secret generic app-secrets \
  --from-literal=DATABASE_URL="postgresql://..." \
  --from-literal=APP_SECRET="..." \
  --from-literal=NEXTAUTH_SECRET="..." \
  --from-literal=AZURE_STORAGE_CONNECTION_STRING="..." \
  --from-literal=SMTP_HOST="..." \
  --from-literal=SMTP_PORT="587" \
  --from-literal=SMTP_USER="..." \
  --from-literal=SMTP_PASS="..." \
  --from-literal=ADMIN_EMAILS="..." \
  --from-literal=OPENCAGE_API="..." \
  --from-literal=ACCLAB_PLATFORM_KEY="..." \
  --from-literal=BLOG_API_TOKEN="..."

# Semantic search secrets
kubectl create secret generic semantic-search-secrets \
  --from-literal=QDRANT_HOST="qdrant-service" \
  --from-literal=QDRANT_PORT="6333" \
  --from-literal=OPENAI_API_KEY="..."

# Docker registry secret
kubectl create secret docker-registry acr-secret \
  --docker-server=yourregistry.azurecr.io \
  --docker-username=<acr-username> \
  --docker-password=<acr-password>
```

#### Step 3: Deploy Infrastructure

```bash
# Deploy in order
kubectl apply -f deploy/kubernetes/02-storage.yaml      # Persistent volumes
kubectl apply -f deploy/kubernetes/03-redis.yaml        # Redis cache
kubectl apply -f deploy/kubernetes/04-qdrant.yaml       # Qdrant vector DB

# Wait for stateful services
kubectl wait --for=condition=ready pod -l app=redis --timeout=300s
kubectl wait --for=condition=ready pod -l app=qdrant --timeout=300s
```

#### Step 4: Deploy Applications

```bash
kubectl apply -f deploy/kubernetes/05-nextjs.yaml
kubectl apply -f deploy/kubernetes/06-semantic-search.yaml
kubectl apply -f deploy/kubernetes/07-worker.yaml
kubectl apply -f deploy/kubernetes/08-qdrant-backup.yaml  # Backup CronJob
```

#### Step 5: Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get svc

# Get application URL (LoadBalancer)
kubectl get svc nextjs-service

# Check logs
kubectl logs -f deployment/nextjs
kubectl logs -f deployment/semantic-search
kubectl logs -f deployment/worker
```

### Data Persistence Strategy

| Component      | Storage Method            | Backup Strategy                       |
| -------------- | ------------------------- | ------------------------------------- |
| **PostgreSQL** | Azure Managed Database    | Automated Azure backups (7-35 days)   |
| **Qdrant**     | Azure Managed Disk (50Gi) | Daily snapshots to Azure Blob Storage |
| **Redis**      | Azure Managed Disk (10Gi) | Non-critical, can rebuild from source |
| **Uploads**    | Azure Blob Storage        | Built-in redundancy (LRS/GRS)         |

**Qdrant Backup**: Daily CronJob runs at 2 AM UTC, creates snapshot, uploads to Azure Blob Storage (7-day retention).

---

## CI/CD Automation

### Overview

The CI/CD system uses **GitHub Actions** with environment-specific configuration files:

- Push to `main` → Deploy to **Production**
- Push to `staging` or `develop` → Deploy to **Staging**

### Setup (One-Time)

#### 1. Create Environment Files

```bash
# Production
cp .env.production.example .env.production
# Edit with actual production values

# Staging
cp .env.staging.example .env.staging
# Edit with actual staging values
```

**Required values:**

- Azure Container Registry credentials
- AKS cluster name and resource group
- Database connection strings
- Azure Storage connection strings
- SMTP credentials
- External API keys
- Application secrets

#### 2. Upload Secrets to GitHub (One-Time)

```bash
# Install GitHub CLI
brew install gh

# Login
gh auth login

# Upload production secrets
./scripts/setup-github-secrets.sh production

# Upload staging secrets (prefixed with STAGING_)
./scripts/setup-github-secrets.sh staging

# Verify
gh secret list
```

**What the script does:**

- Reads `.env.production` or `.env.staging`
- Creates GitHub Secrets for each variable
- Prefixes staging secrets with `STAGING_`

#### 3. Deploy with One Command

Now you can deploy with a single command that:

- ✅ Automatically syncs environment variables to GitHub Secrets
- ✅ Creates a deployment tag
- ✅ Pushes to trigger GitHub Actions
- ✅ No manual steps required

**Deploy to Production:**

```bash
make publish
```

**Deploy to Staging:**

```bash
make publish-staging
```

**What happens automatically:**

1. Validates `.env.production` or `.env.staging` exists
2. Syncs environment variables to GitHub Secrets
3. Creates a deployment tag (e.g., `v1.2.3` or `staging-20260204-abc123`)
4. Pushes tag to trigger deployment
5. GitHub Actions builds and deploys automatically

#### 4. Monitor Deployment

```bash
# Check deployment status
make deployment-status ENV=production
# or
make deployment-status ENV=staging

# View logs
make deployment-logs ENV=production

# Rollback if needed
make rollback ENV=production

# List recent deployments
make list-deployments
```

### How It Works

```
Developer pushes code
         ↓
GitHub Actions triggered (branch-based)
         ↓
├─ main → deploy-production.yml
│    ├─ Uses: ACR_LOGIN_SERVER, DATABASE_URL (no prefix)
│    ├─ Deploys to: default namespace
│    └─ Tags images: latest
│
└─ staging → deploy-staging.yml
     ├─ Uses: STAGING_ACR_LOGIN_SERVER, STAGING_DATABASE_URL
     ├─ Deploys to: staging namespace
     └─ Tags images: staging-latest
         ↓
Build Docker images (Next.js, Semantic Search, Worker)
         ↓
Push to Azure Container Registry
         ↓
Login to AKS cluster
         ↓
Create/Update Kubernetes ConfigMaps & Secrets (per service)
  ├─ Next.js: nextjs-config + nextjs-secrets
  ├─ Semantic Search: semantic-search-config + semantic-search-secrets
  └─ Worker: Uses nextjs-config + nextjs-secrets (shares with Next.js)
         ↓
Deploy infrastructure (Redis, Qdrant)
         ↓
Deploy applications
         ↓
Verify rollout success
         ↓
✅ Deployment complete!
```

### Monitoring Deployments

1. **GitHub Actions**: `https://github.com/YOUR_ORG/YOUR_REPO/actions`
2. **Kubernetes**: `kubectl get pods -w`
3. **Logs**: `kubectl logs -f deployment/nextjs`

### Updating Secrets

```bash
# 1. Edit environment file
nano .env.production

# 2. Re-upload to GitHub
./scripts/setup-github-secrets.sh production

# 3. Restart deployments (for immediate effect)
kubectl rollout restart deployment/nextjs
kubectl rollout restart deployment/semantic-search
kubectl rollout restart deployment/worker
```

### Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/nextjs
kubectl rollout undo deployment/semantic-search
kubectl rollout undo deployment/worker

# Rollback to specific revision
kubectl rollout undo deployment/nextjs --to-revision=2

# Check rollout history
kubectl rollout history deployment/nextjs
```

---

## Domain & SSL Configuration

### Overview

The application supports both **IP-based access** (immediate after deployment) and **domain-based access** (with automatic HTTPS via Let's Encrypt).

### Access Methods

#### Without Domain (IP-based - Default)

After deployment, get your LoadBalancer IP:

```bash
kubectl get service ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Access services:

- **Main App**: `http://<LoadBalancer-IP>`
- **Semantic Search API**: `http://<LoadBalancer-IP>/api/semantic`
- **Qdrant Dashboard**: `http://<LoadBalancer-IP>/qdrant`

#### With Domain (Subdomain routing - Optional)

Configure GitHub Secrets with your domain, and services become:

- **Main App**: `https://yourdomain.com` or `https://www.yourdomain.com`
- **Semantic Search API**: `https://api.yourdomain.com`
- **Qdrant Dashboard**: `https://qdrant.yourdomain.com`

### Domain Configuration

#### Step 1: Add Domain to GitHub Secrets

**Production domain:**

```bash
# Add to GitHub Secrets (via web UI or CLI)
gh secret set DOMAIN --body "sdg-innovation-commons.org"
```

**Staging domain** (recommended: use subdomain):

```bash
gh secret set STAGING_DOMAIN --body "staging.sdg-innovation-commons.org"
```

#### Step 2: Configure DNS

Create **A records** pointing to your LoadBalancer IP:

**For production (example: sdg-innovation-commons.org)**:

```
Type    Name                           Value
A       @                             <LoadBalancer-IP>
A       www                           <LoadBalancer-IP>
A       api                           <LoadBalancer-IP>
A       qdrant                        <LoadBalancer-IP>
```

**Or use wildcard DNS** (simpler, covers all subdomains):

```
Type    Name                           Value
A       @                             <LoadBalancer-IP>
A       *                             <LoadBalancer-IP>
```

**For staging (example: staging.sdg-innovation-commons.org)**:

```
Type    Name                           Value
A       staging                       <LoadBalancer-IP>
A       *.staging                     <LoadBalancer-IP>
```

#### Step 3: Deploy

```bash
# Production
make publish

# Staging
make publish-staging
```

**What happens automatically:**

1. CI/CD detects `DOMAIN` or `STAGING_DOMAIN` secret
2. Updates ingress configuration with your domain
3. Enables TLS/SSL configuration
4. cert-manager automatically issues Let's Encrypt certificate
5. Certificate covers all subdomains (wildcard cert)

### SSL Certificates

**Automatic Certificate Management:**

- ✅ Let's Encrypt certificates issued automatically (2-3 minutes after DNS propagation)
- ✅ Auto-renewal 30 days before expiration (certificates valid 90 days)
- ✅ Wildcard certificates cover all subdomains
- ✅ No manual intervention required

**Check certificate status:**

```bash
# View all certificates
kubectl get certificate -n sdg-innovation-commons

# View details
kubectl describe certificate sdg-tls-wildcard -n sdg-innovation-commons

# Check cert-manager logs if issues
kubectl logs -n cert-manager deployment/cert-manager -f
```

**Common certificate issues:**

```bash
# DNS not propagated yet
nslookup yourdomain.com
dig yourdomain.com

# Check certificate challenges
kubectl get challenges -n sdg-innovation-commons
```

### Subdomain Examples

**Production setup (root domain)**:

- Domain: `sdg-innovation-commons.org`
- Main app: `https://sdg-innovation-commons.org`
- API: `https://api.sdg-innovation-commons.org`
- Qdrant: `https://qdrant.sdg-innovation-commons.org`

**Staging setup (subdomain)**:

- Domain: `staging.sdg-innovation-commons.org`
- Main app: `https://staging.sdg-innovation-commons.org`
- API: `https://api.staging.sdg-innovation-commons.org`
- Qdrant: `https://qdrant.staging.sdg-innovation-commons.org`

### Accessing Individual Services

#### Next.js (Main Application)

- **Users' entry point** - the public-facing web application
- Without domain: `http://<LoadBalancer-IP>`
- With domain: `https://yourdomain.com`

#### Semantic Search API

- **Internal/programmatic access** - used by Next.js internally
- Without domain: `http://<LoadBalancer-IP>/api/semantic`
- With domain: `https://api.yourdomain.com`

Example API request:

```bash
curl -X POST https://api.yourdomain.com/search \
  -H "Content-Type: application/json" \
  -d '{"query": "sustainable development", "limit": 10}'
```

#### Qdrant Dashboard

- **Admin access only** - for managing vector database
- Without domain: `http://<LoadBalancer-IP>/qdrant`
- With domain: `https://qdrant.yourdomain.com`
- **Authentication**: Requires `QDRANT_API_KEY` from your environment secrets

**Browser access:**

1. Install browser extension like "ModHeader" or "Requestly"
2. Add header: `api-key: <your-QDRANT_API_KEY>`
3. Visit dashboard URL

**Command line access:**

```bash
# Upload collection snapshot
curl -X POST https://qdrant.yourdomain.com/collections/my_collection/snapshots/upload \
  -H "api-key: YOUR_API_KEY" \
  -F "snapshot=@snapshot.snapshot"
```

**Development access (port-forward):**

```bash
# Forward Qdrant port locally
kubectl port-forward -n sdg-innovation-commons service/qdrant-service 6333:6333

# Access at http://localhost:6333/dashboard (no header needed locally)
```

### Infrastructure Components

The CI/CD pipeline automatically installs and configures:

1. **NGINX Ingress Controller** - Routes traffic to services
2. **cert-manager** - Manages Let's Encrypt certificates
3. **Ingress resources** - Defines routing rules

No manual setup required - everything is automated!

### Switching Between IP and Domain Access

**Start with IP, add domain later:**

1. Deploy without `DOMAIN` secret → Access via IP immediately
2. Configure DNS records
3. Add `DOMAIN` secret to GitHub
4. Redeploy → HTTPS with Let's Encrypt automatically configured

**Remove domain, use IP only:**

1. Delete `DOMAIN` secret from GitHub
2. Redeploy → Reverts to IP-based access

---

## Troubleshooting

### Local Development Issues

#### "Cannot connect to database"

```bash
# Check DATABASE_URL in .env.local
echo $DATABASE_URL

# Test connection
psql "$DATABASE_URL"

# If using Azure PostgreSQL, ensure SSL is enabled
# DATABASE_URL should end with ?sslmode=require
```

#### "Qdrant connection failed"

```bash
# Check if Qdrant is running
docker ps | grep qdrant

# Or check locally
curl http://localhost:6333/health

# Restart Qdrant
make dev-infra
```

#### "Semantic Search service not responding"

```bash
# Check Python virtual environment
cd semantic-search
source venv/bin/activate
pip list | grep fastapi

# Check environment variables
cat .env.development

# Restart service with debug logs
LOG_LEVEL=DEBUG uvicorn main:app --reload
```

### Production Issues

#### "Pods are in CrashLoopBackOff"

```bash
# Check pod logs
kubectl logs <pod-name>

# Check events
kubectl describe pod <pod-name>

# Common causes:
# 1. Missing secrets - check: kubectl get secrets
# 2. Image pull errors - check: kubectl describe pod
# 3. Database connection - check DATABASE_URL in secrets
```

#### "Application is slow"

```bash
# Check pod resources
kubectl top pods

# Check HPA status
kubectl get hpa

# Check node resources
kubectl top nodes

# Scale manually if needed
kubectl scale deployment nextjs --replicas=5
```

#### "Qdrant data lost after restart"

```bash
# Check PersistentVolumeClaim
kubectl get pvc

# Check PersistentVolume
kubectl get pv

# Restore from backup
# See deploy/kubernetes/08-qdrant-backup.yaml for restore job
```

### Environment Variable Issues

#### "Secret not found in GitHub"

```bash
# List all secrets
gh secret list

# Check if secret has correct name
# Production: DATABASE_URL
# Staging: STAGING_DATABASE_URL

# Re-upload if missing
./scripts/setup-github-secrets.sh production
```

#### "Kubernetes secret not updated"

```bash
# Delete and recreate secret
kubectl delete secret app-secrets
# Re-run GitHub Actions workflow to recreate

# Or manually update
kubectl create secret generic app-secrets \
  --from-literal=DATABASE_URL="new-value" \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart pods to pick up new secret
kubectl rollout restart deployment/nextjs
```

### Common Errors

| Error                       | Cause                       | Solution                                                       |
| --------------------------- | --------------------------- | -------------------------------------------------------------- |
| `ECONNREFUSED`              | Service not running         | Check `kubectl get pods`, restart service                      |
| `401 Unauthorized`          | Missing/invalid credentials | Check secrets with `kubectl get secrets`                       |
| `404 Not Found`             | Wrong endpoint URL          | Verify service names in K8s: `kubectl get svc`                 |
| `500 Internal Server Error` | Application error           | Check logs: `kubectl logs -f deployment/nextjs`                |
| `ImagePullBackOff`          | Can't pull Docker image     | Check ACR credentials: `kubectl get secret acr-secret -o yaml` |

---

## Additional Resources

- **API Documentation**: `http://localhost:3000/api-docs` (Swagger UI)
- **Kubernetes Manifests**: [`deploy/kubernetes/`](deploy/kubernetes/)
- **Docker Compose Files**: [`deploy/`](deploy/)
- **GitHub Actions Workflows**: [`.github/workflows/`](.github/workflows/)

---

## Security Checklist

### Environment Files Security

- [ ] All `.env.local`, `.env.production`, `.env.staging` files are in `.gitignore`
- [ ] **Never commit `.env` files to version control**
- [ ] Use `.env.example` as a template (no real secrets)
- [ ] Rotate secrets periodically (quarterly recommended)

### GitHub Secrets Management

- [ ] Secrets are stored in **GitHub Secrets**, not in code or workflows
- [ ] Use the `setup-github-secrets.sh` script to upload secrets securely
- [ ] Production secrets have **no prefix** (e.g., `DATABASE_URL`)
- [ ] Staging secrets use **`STAGING_` prefix** (e.g., `STAGING_DATABASE_URL`)
- [ ] **Individual secrets** per variable for granular access control
- [ ] Limit repository access to authorized personnel only

### Kubernetes Secrets Security

- [ ] Kubernetes secrets are created via **CI/CD automation** (GitHub Actions)
- [ ] For local testing, secrets are created from `.env.local` (never committed)
- [ ] Secrets use **`envFrom`** for automatic loading (no hardcoded values in manifests)
- [ ] ConfigMaps separate **non-sensitive** config from **sensitive** secrets
- [ ] Pods only have access to secrets in their namespace

### Database & Network Security

- [ ] Database connections use **SSL** (`?sslmode=require` in DATABASE_URL)
- [ ] Azure Blob Storage uses **HTTPS only**
- [ ] SMTP credentials are secured in GitHub Secrets/Kubernetes Secrets
- [ ] Azure PostgreSQL firewall rules limit access to known IPs

### Best Practices

1. **Principle of Least Privilege**: Services only receive secrets they need
2. **Environment Separation**: Different credentials for local, staging, production
3. **Secret Rotation**: Update API keys and passwords quarterly
4. **Audit & Monitoring**: Review deployment logs and pod logs regularly
5. **Backup & Recovery**: Keep encrypted backups of environment files (secure location only)

---

## Support

For issues or questions:

- Check the [Troubleshooting](#troubleshooting) section above
- Review logs: `kubectl logs -f deployment/<service-name>`
- Check GitHub Actions runs: `https://github.com/YOUR_ORG/YOUR_REPO/actions`

---

**Last Updated**: February 2026  
**Maintained By**: UNDP Accelerator Labs
