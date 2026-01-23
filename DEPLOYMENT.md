# Deployment Guide - SDG Innovation Commons

This guide provides comprehensive instructions for deploying the SDG Innovation Commons application in different environments: local development, staging, and production.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Local Development](#local-development)
3. [Production Deployment Options](#production-deployment-options)
   - [Docker Compose (Simple)](#docker-compose-deployment)
   - [Kubernetes (Recommended)](#kubernetes-deployment)
4. [Data Persistence Strategy](#data-persistence-strategy)
5. [Database Configuration](#database-configuration)
6. [Backup and Recovery](#backup-and-recovery)
7. [Monitoring and Health Checks](#monitoring-and-health-checks)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

The application consists of four main components:

1. **Next.js Application** - Main web application
2. **Semantic Search Service** - Python FastAPI service for vector search
3. **Qdrant Vector Database** - Stores embeddings and enables semantic search
4. **Redis Cache** - Caching layer
5. **PostgreSQL Database** - Primary data store (local or Azure PostgreSQL)
6. **Background Worker** - Processes exports and async tasks

### Data Flow

```
User -> Next.js App -> Semantic Search API -> Qdrant (vectors)
         |                                     
         +--> PostgreSQL (data)
         |
         +--> Redis (cache)
         
Background Worker -> PostgreSQL
                  -> Redis
```

## Local Development

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.9+
- Docker and Docker Compose
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons.git
cd sdg-innovation-commons

# Run setup script (automated)
./scripts/setup-dev.sh

# Or manually:
# 1. Install dependencies
pnpm install

# 2. Start infrastructure
make dev-infra

# 3. In separate terminals, start:
# Terminal 1: Next.js
pnpm run dev

# Terminal 2: Semantic Search
cd semantic-search && ./dev.sh

# Terminal 3: Background Worker (optional)
./scripts/dev-worker.sh
```

### Development Environment Details

**Infrastructure Services (Docker)**:
- PostgreSQL: `localhost:5432`
- Qdrant: `localhost:6333` (HTTP), `localhost:6334` (gRPC)
- Redis: `localhost:6379`

**Application Services (Local)**:
- Next.js: `http://localhost:3000`
- Semantic Search: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

**Data Persistence**:
All infrastructure services use named Docker volumes that persist data across container restarts:
- `sdg-postgres-dev-data` - PostgreSQL data
- `sdg-qdrant-dev-storage` - Qdrant vectors (CRITICAL)
- `sdg-qdrant-dev-snapshots` - Qdrant backups
- `sdg-redis-dev-data` - Redis persistence

To completely reset data:
```bash
docker-compose -f deploy/docker-compose.dev.yml down -v
```

## Production Deployment Options

### Docker Compose Deployment

Best for: Single-server deployments, testing, staging environments

#### Prerequisites
- Docker and Docker Compose on production server
- Azure PostgreSQL instance (or local PostgreSQL)
- Domain name and SSL certificate

#### Deployment Steps

1. **Prepare Environment**

```bash
# Clone on production server
git clone https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons.git
cd sdg-innovation-commons

# Copy and configure environment
cp .env.example .env
nano .env  # Update with production values
```

2. **Configure Database**

For Azure PostgreSQL:
```env
# .env
DATABASE_URL=postgres://username:password@your-server.postgres.database.azure.com:5432/dbname?sslmode=require
GENERAL_DB_HOST=your-server.postgres.database.azure.com
GENERAL_DB_USER=username@your-server
GENERAL_DB_PASSWORD=your-password
GENERAL_DB_NAME=dbname
GENERAL_DB_PORT=5432
```

For local PostgreSQL, keep the postgres service enabled in `docker-compose.yml`.

3. **Build and Deploy**

```bash
# Build all images
make prod-build

# Start all services
make prod-up

# Check status
make prod-status

# View logs
make prod-logs
```

4. **SSL/TLS Setup**

Use a reverse proxy (nginx, Caddy, or Traefik) for SSL termination:

```nginx
# /etc/nginx/sites-available/sdg-innovation-commons
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Kubernetes Deployment

Best for: Production environments, high availability, scalability

#### Prerequisites
- Kubernetes cluster (AKS, EKS, GKE, or self-hosted)
- kubectl configured
- Container registry (Azure ACR, AWS ECR, Docker Hub, etc.)
- Azure PostgreSQL or other managed database
- Cert-manager for SSL (optional)
- NGINX Ingress Controller or cloud load balancer

#### Architecture Benefits
- **High Availability**: Multiple replicas of each service
- **Auto-scaling**: HPA scales based on CPU/memory
- **Rolling Updates**: Zero-downtime deployments
- **Self-healing**: Automatic restart of failed pods
- **Data Persistence**: Persistent volumes for Qdrant and Redis

#### Deployment Steps

1. **Build and Push Images**

```bash
# Login to container registry
# For Azure:
az acr login --name yourregistry

# For Docker Hub:
docker login

# Build images
docker build -t yourregistry.azurecr.io/sdg-nextjs:latest -f deploy/Dockerfile .
docker build -t yourregistry.azurecr.io/sdg-semantic-search:latest -f semantic-search/Dockerfile semantic-search
docker build -t yourregistry.azurecr.io/sdg-worker:latest -f deploy/Dockerfile.worker .

# Push images
docker push yourregistry.azurecr.io/sdg-nextjs:latest
docker push yourregistry.azurecr.io/sdg-semantic-search:latest
docker push yourregistry.azurecr.io/sdg-worker:latest
```

2. **Configure Kubernetes Manifests**

Update image references in Kubernetes manifests:
```bash
# deploy/kubernetes/05-semantic-search.yaml
# deploy/kubernetes/06-nextjs.yaml
# deploy/kubernetes/07-worker.yaml

# Replace: YOUR_REGISTRY/sdg-*:latest
# With: yourregistry.azurecr.io/sdg-*:latest
```

3. **Create Secrets**

```bash
# Create namespace
kubectl create namespace sdg-innovation-commons

# Create secrets
kubectl create secret generic sdg-app-secrets \
  -n sdg-innovation-commons \
  --from-literal=APP_SECRET="your-secret" \
  --from-literal=NEXTAUTH_SECRET="your-secret" \
  --from-literal=DATABASE_URL="postgres://..." \
  --from-literal=GENERAL_DB_PASSWORD="your-password" \
  --from-literal=REDIS_PASSWORD="your-password" \
  --from-literal=QDRANT_API_KEY="your-key" \
  --from-literal=SEMANTIC_SEARCH_API_KEY="your-key" \
  --from-literal=SMTP_USER="your-email" \
  --from-literal=SMTP_PASS="your-password" \
  --from-literal=OPENCAGE_API="your-key" \
  --from-literal=ACCLAB_PLATFORM_KEY="your-key" \
  --from-literal=BLOG_API_TOKEN="your-token" \
  --from-literal=AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
```

For Azure, use Azure Key Vault:
```bash
# Install CSI driver
helm repo add csi-secrets-store-provider-azure https://azure.github.io/secrets-store-csi-driver-provider-azure/charts
helm install csi csi-secrets-store-provider-azure/csi-secrets-store-provider-azure
```

4. **Deploy Application**

```bash
# Apply all manifests
kubectl apply -f deploy/kubernetes/01-namespace-config.yaml
kubectl apply -f deploy/kubernetes/02-storage.yaml
kubectl apply -f deploy/kubernetes/03-qdrant.yaml
kubectl apply -f deploy/kubernetes/04-redis.yaml
kubectl apply -f deploy/kubernetes/05-semantic-search.yaml
kubectl apply -f deploy/kubernetes/06-nextjs.yaml
kubectl apply -f deploy/kubernetes/07-worker.yaml
kubectl apply -f deploy/kubernetes/08-ingress.yaml

# Check status
kubectl get all -n sdg-innovation-commons

# Check persistent volumes
kubectl get pvc -n sdg-innovation-commons

# Check pods
kubectl get pods -n sdg-innovation-commons -w
```

5. **Configure DNS**

Point your domain to the LoadBalancer IP:
```bash
kubectl get ingress -n sdg-innovation-commons
```

6. **Install Cert-Manager (for SSL)**

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Update email in deploy/kubernetes/08-ingress.yaml
# Then apply ingress again
kubectl apply -f deploy/kubernetes/08-ingress.yaml
```

## Data Persistence Strategy

### Critical: Qdrant Data Persistence

Qdrant stores vector embeddings that are expensive to regenerate. **Data persistence is MANDATORY**.

#### Docker Compose
- Uses named volumes: `qdrant_storage` and `qdrant_snapshots`
- Survives container stop/restart/removal
- Backed up with volume snapshots

#### Kubernetes
- Uses PersistentVolumeClaims (PVCs)
- Backed by cloud storage (Azure Disk, AWS EBS, GCP PD)
- Survives pod deletions, node failures, cluster restarts
- Can be backed up using cloud snapshots

### Verification

Test data persistence:
```bash
# Docker Compose
docker-compose -f deploy/docker-compose.yml stop qdrant
docker-compose -f deploy/docker-compose.yml up -d qdrant
# Data should still be there

# Kubernetes
kubectl delete pod -n sdg-innovation-commons -l app=qdrant
# Pod will restart, data persists
```

### PostgreSQL Strategy

**Recommended**: Use managed database service
- Azure Database for PostgreSQL
- AWS RDS for PostgreSQL
- Google Cloud SQL for PostgreSQL

Benefits:
- Automatic backups
- Point-in-time recovery
- High availability
- Automated updates
- Better performance

If using containerized PostgreSQL:
- Must use persistent volumes
- Configure regular backups
- Consider replication for HA

## Database Configuration

### Azure PostgreSQL (Recommended)

1. Create Azure PostgreSQL instance:
```bash
az postgres flexible-server create \
  --resource-group your-rg \
  --name sdg-postgres \
  --location eastus \
  --admin-user sdgadmin \
  --admin-password YourPassword \
  --sku-name Standard_D2s_v3 \
  --storage-size 128 \
  --version 15
```

2. Configure firewall:
```bash
# Allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group your-rg \
  --name sdg-postgres \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your IPs (Kubernetes nodes, etc.)
az postgres flexible-server firewall-rule create \
  --resource-group your-rg \
  --name sdg-postgres \
  --rule-name AllowK8sNodes \
  --start-ip-address X.X.X.X \
  --end-ip-address X.X.X.X
```

3. Connection string:
```
postgres://sdgadmin:YourPassword@sdg-postgres.postgres.database.azure.com:5432/postgres?sslmode=require
```

### Local PostgreSQL (Development/Testing)

Included in docker-compose.yml with persistent volume.

## Backup and Recovery

### Qdrant Backup

#### Manual Snapshot
```bash
# Docker Compose
docker exec sdg-qdrant curl -X POST http://localhost:6333/collections/sdg_documents/snapshots

# Copy snapshot
docker cp sdg-qdrant:/qdrant/snapshots ./backups/qdrant/
```

#### Kubernetes Snapshot
```bash
# Create snapshot
kubectl exec -n sdg-innovation-commons deployment/qdrant -- \
  curl -X POST http://localhost:6333/collections/sdg_documents/snapshots

# Copy snapshot
kubectl cp sdg-innovation-commons/qdrant-xxxxx:/qdrant/snapshots ./backups/qdrant/
```

#### Volume Backup
```bash
# Docker
docker run --rm \
  -v sdg-qdrant-storage:/source \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/qdrant-backup-$(date +%Y%m%d).tar.gz -C /source .

# Kubernetes (using Azure Disk Snapshot)
az snapshot create \
  --resource-group your-rg \
  --name qdrant-snapshot-$(date +%Y%m%d) \
  --source /subscriptions/.../qdrant-pv
```

### Qdrant Recovery
```bash
# Restore from volume backup
docker run --rm \
  -v sdg-qdrant-storage:/target \
  -v $(pwd)/backup:/backup \
  alpine sh -c "cd /target && tar xzf /backup/qdrant-backup-YYYYMMDD.tar.gz"
```

### PostgreSQL Backup (if using containerized)

```bash
# Backup
docker exec sdg-postgres pg_dump -U postgres postgres > backup-$(date +%Y%m%d).sql

# Restore
docker exec -i sdg-postgres psql -U postgres postgres < backup-YYYYMMDD.sql
```

### Redis Backup

Redis uses AOF persistence. Backups are automatic with named volume.

## Monitoring and Health Checks

### Health Endpoints

- Next.js: `GET /api/health`
- Semantic Search: `GET /health`
- Qdrant: `GET http://localhost:6333/health`
- Redis: `redis-cli ping`
- PostgreSQL: `pg_isready`

### Monitoring Commands

```bash
# Docker Compose
make prod-status
make prod-logs

# Kubernetes
kubectl get pods -n sdg-innovation-commons
kubectl logs -n sdg-innovation-commons -l app=nextjs --tail=100
kubectl top pods -n sdg-innovation-commons
kubectl describe pod -n sdg-innovation-commons <pod-name>
```

### Recommended Monitoring Tools

- **Prometheus + Grafana**: Metrics and dashboards
- **Azure Monitor**: For AKS deployments
- **Sentry**: Error tracking for Next.js and Python
- **Datadog/New Relic**: Full-stack observability

## Troubleshooting

### Qdrant Data Lost After Restart

**Cause**: Volume not properly configured
**Solution**: Ensure persistent volumes are used
```bash
# Check volumes
docker volume ls | grep qdrant
kubectl get pvc -n sdg-innovation-commons | grep qdrant
```

### Semantic Search Can't Connect to Qdrant

**Cause**: Service networking or API key mismatch
**Solution**:
```bash
# Check Qdrant is running
kubectl get pods -n sdg-innovation-commons -l app=qdrant

# Check service
kubectl get svc -n sdg-innovation-commons qdrant-service

# Check logs
kubectl logs -n sdg-innovation-commons -l app=semantic-search
```

### Database Connection Errors

**Cause**: Firewall rules, wrong credentials, or SSL issues
**Solution**:
```bash
# Test connection
psql "postgres://user:pass@host:5432/db?sslmode=require"

# Check Azure PostgreSQL firewall
az postgres flexible-server firewall-rule list --resource-group your-rg --name sdg-postgres
```

### Pod Crashes (Kubernetes)

```bash
# Check pod status
kubectl describe pod -n sdg-innovation-commons <pod-name>

# Check logs
kubectl logs -n sdg-innovation-commons <pod-name> --previous

# Check events
kubectl get events -n sdg-innovation-commons --sort-by='.lastTimestamp'
```

### Out of Memory Errors

**Solution**: Increase resource limits in deployment manifests or docker-compose

### SSL Certificate Issues

```bash
# Check cert-manager
kubectl get certificates -n sdg-innovation-commons
kubectl describe certificate -n sdg-innovation-commons sdg-tls-secret

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager
```

## Best Practices

1. **Always use persistent volumes** for Qdrant and PostgreSQL
2. **Use managed database services** (Azure PostgreSQL, AWS RDS)
3. **Implement regular backups** for Qdrant snapshots
4. **Use secret management** (Azure Key Vault, AWS Secrets Manager)
5. **Monitor resource usage** and set appropriate limits
6. **Use staging environment** before production deployments
7. **Implement CI/CD** for automated deployments
8. **Test disaster recovery** procedures regularly
9. **Use SSL/TLS** for all production traffic
10. **Keep Docker images updated** for security patches

## Support

For issues or questions:
- GitHub Issues: https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons/issues
- Documentation: See README.md and docs/
