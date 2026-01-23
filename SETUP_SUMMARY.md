# Development & Deployment Setup - Summary

This document summarizes the complete development and deployment infrastructure created for the SDG Innovation Commons application.

## What Has Been Created

### 1. Docker Infrastructure

#### Development Environment (`deploy/docker-compose.dev.yml`)

- **PostgreSQL** with persistent volume (optional, can use Azure PostgreSQL)
- **Qdrant** vector database with persistent storage (CRITICAL for data persistence)
- **Redis** cache with persistent storage
- Configured for hot-reload development workflow
- Named volumes ensure data survives container restarts

#### Production Environment (`deploy/docker-compose.yml`)

- All services with production-ready configurations
- Resource limits and health checks
- Support for both local and Azure PostgreSQL
- Persistent volumes with explicit names for easy backup
- Production-grade security settings

### 2. Kubernetes Manifests (`deploy/kubernetes/`)

Complete production-ready Kubernetes setup:

- **01-namespace-config.yaml** - Namespace, ConfigMaps, and Secrets
- **02-storage.yaml** - PersistentVolumeClaims for all services
- **03-qdrant.yaml** - Qdrant deployment with persistent storage
- **04-redis.yaml** - Redis cache deployment
- **05-semantic-search.yaml** - Python FastAPI service with HPA
- **06-nextjs.yaml** - Next.js application with HPA
- **07-worker.yaml** - Background worker deployment
- **08-ingress.yaml** - Ingress with SSL/TLS (cert-manager)

Features:

- High availability with multiple replicas
- Horizontal Pod Autoscaling (HPA)
- Persistent volumes for critical data
- Health checks and liveness/readiness probes
- Resource limits and requests
- SSL/TLS certificate management

### 3. Docker Images

#### Semantic Search (`semantic-search/Dockerfile`)

- Multi-stage build for optimized image size
- Pre-cached embedding models in image
- Production-ready with non-root user
- Health checks included
- Optimized for CPU (can be adapted for GPU)

### 4. Development Tools

#### Setup Script (`scripts/setup-dev.sh`)

Automated development environment setup:

- Prerequisites checking
- Dependency installation
- Environment file creation
- Infrastructure startup
- Database migrations
- Clear instructions for next steps

### 5. Documentation

#### DEPLOYMENT.md

Comprehensive deployment guide covering:

- Architecture overview
- Local development setup
- Docker Compose deployment
- Kubernetes deployment
- Data persistence strategies
- Database configuration (Azure PostgreSQL)
- Backup and recovery procedures
- Monitoring and health checks
- Troubleshooting guide
- Best practices

#### QUICKSTART.md

Quick reference guide for:

- Fast local setup
- Common commands
- Troubleshooting
- Project structure
- Environment variables

### 6. Environment Templates

Created environment templates for all environments:

- **`.env.development`** - Local development settings
- **`.env.staging`** - Staging environment
- **`.env.production`** - Production settings
- **`semantic-search/.env.development`** - Semantic search dev config
- **`semantic-search/.env.production`** - Semantic search prod config

### 7. Enhanced Makefile

Added comprehensive Make commands:

**Development:**

- `make dev-infra` - Start infrastructure
- `make dev-nextjs` - Start Next.js
- `make dev-semantic` - Start semantic search
- `make dev-status` - Check status
- `make dev-logs` - View logs
- `make dev-stop` - Stop services

**Production (Docker Compose):**

- `make prod-build` - Build images
- `make prod-up` - Start all services
- `make prod-down` - Stop services
- `make prod-restart` - Restart services
- `make prod-logs` - View logs
- `make prod-status` - Check status

**Kubernetes:**

- `make k8s-build` - Build container images
- `make k8s-push` - Push to registry
- `make k8s-deploy` - Deploy to K8s
- `make k8s-status` - Check deployment
- `make k8s-logs` - View pod logs
- `make k8s-restart` - Rolling restart
- `make k8s-delete` - Delete deployment

**Backup & Recovery:**

- `make backup-qdrant` - Backup Qdrant data
- `make restore-qdrant` - Restore from backup

**Utilities:**

- `make setup` - Initial setup
- `make install` - Install dependencies
- `make migrate` - Run DB migrations
- `make test-health` - Health checks
- `make clean` - Clean everything

## Key Features

### Data Persistence (CRITICAL)

**Qdrant Vector Database:**

- ✅ Named Docker volumes in both dev and prod
- ✅ PersistentVolumeClaims in Kubernetes
- ✅ Separate volumes for storage and snapshots
- ✅ Backup and restore commands
- ✅ Data survives container/pod restarts, deletions, and node failures

**PostgreSQL:**

- ✅ Support for local PostgreSQL (development)
- ✅ Support for Azure PostgreSQL (recommended for production)
- ✅ Connection string configuration for both
- ✅ SSL/TLS support for Azure

**Redis:**

- ✅ AOF persistence enabled
- ✅ Persistent volumes
- ✅ Password protection

### Security

- ✅ Secret management (environment variables, K8s secrets)
- ✅ API key authentication
- ✅ Non-root containers
- ✅ SSL/TLS support (cert-manager)
- ✅ Network isolation
- ✅ Resource limits

### Scalability

- ✅ Horizontal Pod Autoscaling (HPA)
- ✅ Multiple replicas for stateless services
- ✅ Load balancing
- ✅ Resource requests and limits

### Observability

- ✅ Health check endpoints
- ✅ Liveness and readiness probes
- ✅ Structured logging
- ✅ Log aggregation support
- ✅ Metrics ready (Prometheus compatible)

## Deployment Workflows

### Local Development Workflow

```bash
# Initial setup (once)
./scripts/setup-dev.sh

# Daily workflow
make dev-infra          # Start infrastructure
pnpm run dev           # Terminal 1: Next.js
make dev-semantic      # Terminal 2: Semantic search

# Development continues with hot reload...

# End of day
make dev-stop          # Stop infrastructure (data persists)
```

### Docker Compose Production Workflow

```bash
# Initial setup
cp .env.production .env
nano .env  # Configure

# Build and deploy
make prod-build
make prod-up

# Monitor
make prod-status
make prod-logs

# Backup
make backup-qdrant

# Update deployment
git pull
make prod-build
make prod-restart
```

### Kubernetes Production Workflow

```bash
# Initial setup
make k8s-build
make k8s-push

# Create secrets
kubectl create secret generic sdg-app-secrets -n sdg-innovation-commons \
  --from-literal=... # See DEPLOYMENT.md

# Deploy
make k8s-deploy

# Monitor
make k8s-status
make k8s-logs

# Update deployment
git pull
make k8s-build
make k8s-push
make k8s-restart  # Rolling update

# Backup
kubectl exec -n sdg-innovation-commons deployment/qdrant -- \
  curl -X POST http://localhost:6333/collections/sdg_documents/snapshots
```

## Database Strategy

### Recommended: Azure PostgreSQL

**Advantages:**

- ✅ Automated backups
- ✅ Point-in-time recovery
- ✅ High availability
- ✅ Automatic updates
- ✅ Better performance
- ✅ SSL/TLS by default

**Setup:**

```bash
az postgres flexible-server create \
  --resource-group your-rg \
  --name sdg-postgres \
  --admin-user sdgadmin \
  --admin-password YourPassword \
  --sku-name Standard_D2s_v3 \
  --storage-size 128 \
  --version 15
```

### Alternative: Containerized PostgreSQL

For development/testing only. Not recommended for production.

- Uses persistent volumes
- Manual backup required
- No built-in HA

## Critical Considerations

### 1. Qdrant Data Persistence

**MUST-HAVE**: Qdrant data contains expensive-to-generate vector embeddings.

✅ **Implemented:**

- Named Docker volumes (dev and prod)
- PersistentVolumeClaims in Kubernetes
- Backup commands
- Snapshot support

❌ **Never do:**

- Run Qdrant without persistent storage
- Delete volumes without backup
- Use ephemeral storage

### 2. PostgreSQL Choice

✅ **Recommended:** Azure PostgreSQL Flexible Server

- Managed service
- Automatic backups
- High availability
- Better for production

✅ **Acceptable:** Containerized PostgreSQL

- Development and testing only
- Must use persistent volumes
- Requires manual backup strategy

### 3. Secrets Management

✅ **Production:**

- Azure Key Vault (recommended)
- Kubernetes Secrets
- AWS Secrets Manager
- HashiCorp Vault

❌ **Never:**

- Commit secrets to Git
- Use default passwords in production
- Share secrets in plain text

## Next Steps

### For Development

1. Run setup script: `./scripts/setup-dev.sh`
2. Update `.env` with your credentials
3. Start developing!

### For Staging Deployment

1. Set up Azure PostgreSQL
2. Configure `.env.staging`
3. Deploy with Docker Compose: `make prod-up`
4. Test thoroughly

### For Production Deployment

1. Set up Kubernetes cluster (AKS recommended)
2. Set up Azure PostgreSQL
3. Configure secrets in Key Vault or K8s
4. Build and push images: `make k8s-build k8s-push`
5. Update K8s manifests with your registry
6. Deploy: `make k8s-deploy`
7. Configure DNS
8. Set up monitoring (Azure Monitor, Prometheus, etc.)
9. Configure backups
10. Test disaster recovery procedures

## Backup Strategy

### Automated Backups

**Qdrant:**

```bash
# Create cron job for daily backups
0 2 * * * cd /path/to/repo && make backup-qdrant
```

**PostgreSQL (Azure):**

- Automatic backups enabled by default
- Point-in-time recovery available
- Configure retention period

**Application Data:**

- Use Azure Storage for uploads/exports
- Configure blob lifecycle management

### Disaster Recovery

1. **Test regularly** - Monthly DR drills
2. **Document procedures** - Keep runbooks updated
3. **Monitor backups** - Verify backup success
4. **Test restores** - Practice restoration procedures

## Monitoring Recommendations

### Essential Monitoring

- **Health Endpoints**: All services have `/health` endpoints
- **Resource Usage**: CPU, memory, disk
- **Database**: Connection pools, query performance
- **Qdrant**: Collection size, query latency
- **Application**: Error rates, response times

### Recommended Tools

- **Azure Monitor** (for AKS deployments)
- **Prometheus + Grafana** (metrics and dashboards)
- **Sentry** (error tracking)
- **Application Insights** (APM)

## Support & Resources

- **Documentation**: [README.md](README.md), [DEPLOYMENT.md](DEPLOYMENT.md), [QUICKSTART.md](QUICKSTART.md)
- **Kubernetes Docs**: [deploy/kubernetes/README.md](deploy/kubernetes/README.md)
- **Issues**: GitHub Issues
- **Community**: UNDP Accelerator Labs

## Success Criteria

✅ **Development:**

- Can start environment in < 10 minutes
- Hot reload works for all services
- Data persists across restarts

✅ **Production:**

- Zero-downtime deployments
- Data never lost
- Auto-scaling works
- Backups automated
- Monitoring in place

✅ **Operations:**

- Clear runbooks
- Disaster recovery tested
- Team trained
- Documentation complete

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Maintained By**: Development Team
