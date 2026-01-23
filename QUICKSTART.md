# Quick Start Guide - SDG Innovation Commons

This guide helps you get up and running quickly with the SDG Innovation Commons application.

## Choose Your Path

### 🔧 Local Development
**Best for**: Contributing to the codebase, feature development, debugging

**Time to setup**: ~10 minutes

```bash
# Run the automated setup script
./scripts/setup-dev.sh

# Then start your services:
# Terminal 1: Next.js
pnpm run dev

# Terminal 2: Semantic Search
cd semantic-search && ./dev.sh

# Access: http://localhost:3000
```

See [Local Development Guide](#local-development) below for details.

---

### 🐳 Docker Compose (Simple Deployment)
**Best for**: Testing full stack, staging environments, single-server deployments

**Time to setup**: ~15 minutes

```bash
# 1. Configure environment
cp .env.production .env
nano .env  # Update with your values

# 2. Build and start
make prod-build
make prod-up

# Access: http://localhost:3000
```

See [DEPLOYMENT.md](DEPLOYMENT.md#docker-compose-deployment) for details.

---

### ☸️ Kubernetes (Production Deployment)
**Best for**: Production environments, high availability, auto-scaling

**Time to setup**: ~30 minutes (with existing cluster)

```bash
# 1. Build and push images
make k8s-build k8s-push

# 2. Configure secrets
# See DEPLOYMENT.md for details

# 3. Deploy
make k8s-deploy

# Access: https://yourdomain.com (after DNS setup)
```

See [DEPLOYMENT.md](DEPLOYMENT.md#kubernetes-deployment) for details.

---

## Local Development

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm** - `npm install -g pnpm`
- **Python 3.9+** - [Download](https://python.org/)
- **Docker Desktop** - [Download](https://docker.com/)
- **Git**

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons.git
   cd sdg-innovation-commons
   ```

2. **Automated Setup** (Recommended)
   ```bash
   ./scripts/setup-dev.sh
   ```
   
   This script will:
   - Check prerequisites
   - Install Node.js and Python dependencies
   - Create environment files
   - Start infrastructure services (PostgreSQL, Qdrant, Redis)
   - Run database migrations

3. **Manual Setup** (Alternative)
   ```bash
   # Install dependencies
   pnpm install
   
   # Setup environment
   cp .env.development .env
   cp semantic-search/.env.development semantic-search/.env
   
   # Start infrastructure
   make dev-infra
   
   # Run migrations
   pnpm run migrate
   ```

4. **Start Development Servers**
   
   Open 3 terminal windows:
   
   **Terminal 1 - Next.js**
   ```bash
   pnpm run dev
   ```
   
   **Terminal 2 - Semantic Search**
   ```bash
   cd semantic-search
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ./dev.sh
   ```
   
   **Terminal 3 - Background Worker** (Optional)
   ```bash
   ./scripts/dev-worker.sh
   ```

5. **Access Application**
   - **Next.js App**: http://localhost:3000
   - **Semantic Search API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs
   - **Qdrant Dashboard**: http://localhost:6333/dashboard

### Development Workflow

```bash
# Start infrastructure only (once)
make dev-infra

# Start Next.js (with hot reload)
pnpm run dev

# Start Semantic Search (with hot reload)
make dev-semantic

# View infrastructure logs
make dev-logs

# Check infrastructure status
make dev-status

# Stop infrastructure
make dev-stop

# Clean everything (removes all data)
make clean
```

### Common Tasks

**Running Database Migrations**
```bash
pnpm run migrate
```

**Testing Semantic Search**
```bash
# Check health
curl http://localhost:8000/health

# Test search
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "climate action", "limit": 5}'
```

**Checking Qdrant**
```bash
# Health check
curl http://localhost:6333/health

# List collections
curl http://localhost:6333/collections
```

### Troubleshooting

**Port already in use**
```bash
# Check what's using the port
lsof -i :3000  # or :8000, :6333, etc.

# Kill the process
kill -9 <PID>
```

**Docker services won't start**
```bash
# Check Docker is running
docker ps

# Restart Docker Desktop

# Check logs
make dev-logs
```

**Database connection errors**
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection
psql postgres://postgres:postgres@localhost:5432/postgres
```

**Qdrant connection errors**
```bash
# Check Qdrant is running
docker ps | grep qdrant

# Check logs
docker logs sdg-qdrant-dev
```

**Module not found errors**
```bash
# Reinstall dependencies
pnpm install

# For Python
cd semantic-search
source venv/bin/activate
pip install -r requirements.txt
```

## Environment Variables

### Required for Development

```env
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

# Authentication
APP_SECRET=dev-secret
NEXTAUTH_SECRET=dev-secret

# Semantic Search
SEMANTIC_SEARCH_URL=http://localhost:8000
SEMANTIC_SEARCH_API_KEY=dev-api-key

# Qdrant
QDRANT_API_KEY=dev-secret-key

# Redis
REDIS_PASSWORD=devpassword
```

### Optional

```env
# External APIs (for full functionality)
OPENCAGE_API=your-key
ACCLAB_PLATFORM_KEY=your-key

# SMTP (for email features)
SMTP_HOST=smtp.office365.com
SMTP_USER=your-email
SMTP_PASS=your-password
```

## Project Structure

```
sdg-innovation-commons/
├── app/                      # Next.js application
│   ├── api/                  # API routes
│   ├── lib/                  # Server utilities
│   └── (pages)/              # Page components
├── semantic-search/          # Python semantic search service
│   ├── main.py               # FastAPI app
│   ├── search.py             # Search logic
│   └── qdrant_client.py      # Vector DB client
├── deploy/                   # Deployment configurations
│   ├── docker-compose.yml    # Production compose
│   ├── docker-compose.dev.yml # Dev compose
│   ├── Dockerfile            # Next.js image
│   └── kubernetes/           # K8s manifests
├── scripts/                  # Utility scripts
└── public/                   # Static assets
```

## Available Make Commands

```bash
# Development
make dev-infra        # Start infrastructure services
make dev-nextjs       # Start Next.js
make dev-semantic     # Start semantic search
make dev-status       # Check service status
make dev-logs         # View logs
make dev-stop         # Stop services

# Production (Docker Compose)
make prod-build       # Build images
make prod-up          # Start all services
make prod-down        # Stop services
make prod-logs        # View logs

# Kubernetes
make k8s-build        # Build container images
make k8s-push         # Push to registry
make k8s-deploy       # Deploy to cluster
make k8s-status       # Check deployment
make k8s-logs         # View pod logs

# Utilities
make setup            # Initial setup
make install          # Install dependencies
make migrate          # Run DB migrations
make test-health      # Health checks
make backup-qdrant    # Backup vector DB
make clean            # Clean everything
```

## Next Steps

1. **Configure your environment** - Update `.env` with your credentials
2. **Run migrations** - `pnpm run migrate`
3. **Start developing** - Make changes and see them live!
4. **Read the docs** - Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment info

## Need Help?

- **Documentation**: See [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Docs**: http://localhost:8000/docs (when running)
- **Issues**: https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons/issues

## Key Features

- 🔍 **Semantic Search** - Vector-based search using sentence transformers
- 🗄️ **Data Persistence** - Qdrant and PostgreSQL with persistent storage
- 🔄 **Hot Reload** - Fast development with automatic reloading
- 🐳 **Containerized** - Run anywhere with Docker
- ☸️ **Kubernetes Ready** - Production-ready K8s manifests
- 📊 **Monitoring** - Health checks and observability
- 🔒 **Secure** - Authentication and API security built-in

Happy coding! 🚀
