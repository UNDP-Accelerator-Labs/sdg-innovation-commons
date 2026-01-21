# Deployment Guide: Azure App Service with Sidecar Worker

This guide explains how to deploy the SDG Innovation Commons application with a background worker sidecar to Azure App Service.

## Architecture

The deployment consists of two containers:

1. **Web Container**: Main Next.js application serving the web interface
2. **Worker Container**: Background job processor running export tasks

Both containers share the same database and storage configuration but run independently.

## Prerequisites

1. **Azure Container Registry (ACR)** - to host your Docker images
2. **Azure App Service** with multi-container support (Linux plan)
3. **Azure Database for PostgreSQL**
4. **Azure Storage Account**
5. **Docker** installed locally for building images

## Setup Steps

### 1. Configure Azure Container Registry

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name sdg-rg --location eastus

# Create Azure Container Registry
az acr create --resource-group sdg-rg \
  --name sdgregistry --sku Basic

# Login to ACR
az acr login --name sdgregistry

# Enable admin credentials (for App Service to pull images)
az acr update --name sdgregistry --admin-enabled true
```

### 2. Build and Push Docker Images

```bash
# Set your registry name
export DOCKER_REGISTRY="sdgregistry.azurecr.io"
export IMAGE_TAG="v$(date +%Y.%m.%d-%H%M)"

# Build and push web image
docker build -f deploy/Dockerfile -t ${DOCKER_REGISTRY}/sdg-innovation-commons:${IMAGE_TAG} .
docker push ${DOCKER_REGISTRY}/sdg-innovation-commons:${IMAGE_TAG}

# Tag as latest
docker tag ${DOCKER_REGISTRY}/sdg-innovation-commons:${IMAGE_TAG} \
  ${DOCKER_REGISTRY}/sdg-innovation-commons:latest
docker push ${DOCKER_REGISTRY}/sdg-innovation-commons:latest

# Build and push worker image
docker build -f deploy/Dockerfile.worker -t ${DOCKER_REGISTRY}/sdg-innovation-commons-worker:${IMAGE_TAG} .
docker push ${DOCKER_REGISTRY}/sdg-innovation-commons-worker:${IMAGE_TAG}

# Tag as latest
docker tag ${DOCKER_REGISTRY}/sdg-innovation-commons-worker:${IMAGE_TAG} \
  ${DOCKER_REGISTRY}/sdg-innovation-commons-worker:latest
docker push ${DOCKER_REGISTRY}/sdg-innovation-commons-worker:latest
```

### 3. Create App Service with Multi-Container Support

```bash
# Create App Service Plan (Linux, with Docker support)
az appservice plan create --name sdg-plan \
  --resource-group sdg-rg \
  --is-linux \
  --sku B2

# Create Web App with multi-container config
az webapp create --resource-group sdg-rg \
  --plan sdg-plan \
  --name sdg-innovation-commons \
  --multicontainer-config-type compose \
  --multicontainer-config-file deploy/docker-compose.azure.yml
```

### 4. Configure Container Registry Credentials

```bash
# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name sdgregistry --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name sdgregistry --query passwords[0].value -o tsv)

# Configure App Service to use ACR
az webapp config container set --name sdg-innovation-commons \
  --resource-group sdg-rg \
  --docker-registry-server-url https://sdgregistry.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD
```

### 5. Set Environment Variables

```bash
# Database configuration
az webapp config appsettings set --resource-group sdg-rg \
  --name sdg-innovation-commons \
  --settings \
    GENERAL_DB_URL="postgresql://user:pass@acclabs-global-db.postgres.database.azure.com/sdg_db" \
    DB_REQUIRE_SSL="true" \
    AZURE_STORAGE_ACCOUNT_NAME="your-storage-account" \
    AZURE_STORAGE_ACCOUNT_KEY="your-storage-key" \
    APP_SECRET="your-app-secret" \
    NEXTAUTH_SECRET="your-nextauth-secret" \
    NEXTAUTH_URL="https://sdg-innovation-commons.azurewebsites.net" \
    DOCKER_REGISTRY="sdgregistry.azurecr.io" \
    IMAGE_TAG="latest"
```

Or use Azure Portal:

1. Navigate to your App Service
2. Go to **Configuration** → **Application settings**
3. Add all required environment variables

### 6. Deploy Using Docker Compose Config

Create a simplified compose config for Azure (without build context):

```yaml
# Save as deploy/docker-compose.azure-simple.yml
version: "3.8"
services:
  web:
    image: sdgregistry.azurecr.io/sdg-innovation-commons:latest
    ports:
      - "80:3000"
    environment:
      PORT: "3000"
  worker:
    image: sdgregistry.azurecr.io/sdg-innovation-commons-worker:latest
    command: sh -c "node scripts/worker_http.js & node scripts/worker_heartbeat.js & node scripts/run_worker.js"
```

Update the web app:

```bash
az webapp config container set --name sdg-innovation-commons \
  --resource-group sdg-rg \
  --multicontainer-config-type compose \
  --multicontainer-config-file deploy/docker-compose.azure-simple.yml
```

## Alternative: Using WebJobs Instead of Sidecar

If you prefer a simpler setup, you can use Azure WebJobs instead of multi-container:

1. Deploy only the main web app
2. Package worker scripts as a WebJob
3. Upload to App Service via Azure Portal or FTP

```bash
# Create WebJob package
cd scripts
zip -r ../worker.zip run_worker.js worker_heartbeat.js worker_http.js process_exports.cjs

# Deploy via Azure CLI (requires Kudu)
az webapp deployment source config-zip \
  --resource-group sdg-rg \
  --name sdg-innovation-commons \
  --src worker.zip
```

## Monitoring

### View Container Logs

```bash
# Web container logs
az webapp log tail --name sdg-innovation-commons \
  --resource-group sdg-rg \
  --container web

# Worker container logs
az webapp log tail --name sdg-innovation-commons \
  --resource-group sdg-rg \
  --container worker
```

### Health Checks

- Web: `https://sdg-innovation-commons.azurewebsites.net/api/health`
- Worker: Health check runs internally via Docker healthcheck

### Database Worker Health Table

The worker writes heartbeats to the `worker_health` table. You can query it:

```sql
SELECT * FROM worker_health ORDER BY last_seen DESC;
```

## Updating Deployment

```bash
# Build new images with updated tag
export IMAGE_TAG="v$(date +%Y.%m.%d-%H%M)"

# Build and push
docker build -f deploy/Dockerfile -t ${DOCKER_REGISTRY}/sdg-innovation-commons:${IMAGE_TAG} .
docker push ${DOCKER_REGISTRY}/sdg-innovation-commons:${IMAGE_TAG}

docker build -f deploy/Dockerfile.worker -t ${DOCKER_REGISTRY}/sdg-innovation-commons-worker:${IMAGE_TAG} .
docker push ${DOCKER_REGISTRY}/sdg-innovation-commons-worker:${IMAGE_TAG}

# Update App Service environment variable
az webapp config appsettings set --resource-group sdg-rg \
  --name sdg-innovation-commons \
  --settings IMAGE_TAG="${IMAGE_TAG}"

# Restart the app
az webapp restart --name sdg-innovation-commons --resource-group sdg-rg
```

## Troubleshooting

### Container Won't Start

- Check logs: `az webapp log tail`
- Verify ACR credentials are correct
- Ensure environment variables are set
- Check that images exist in ACR: `az acr repository list --name sdgregistry`

### Worker Not Processing Jobs

- Check worker container logs
- Verify database connectivity from worker
- Check `worker_health` table for heartbeats
- Ensure shared storage is accessible

### Database Connection Issues

- Verify PostgreSQL firewall allows Azure services
- Check SSL is enabled: `DB_REQUIRE_SSL=true`
- Test connection string format
- Ensure database migrations have run

## Cost Optimization

- Use **B1** or **B2** tier for development/staging
- Use **P1V2** or higher for production
- Consider Azure Container Instances for worker instead of sidecar for better scaling
- Enable auto-scaling based on CPU/memory metrics

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Build and push Docker images
  run: |
    docker build -f deploy/Dockerfile -t ${{ secrets.ACR_LOGIN_SERVER }}/sdg-innovation-commons:${{ github.sha }} .
    docker push ${{ secrets.ACR_LOGIN_SERVER }}/sdg-innovation-commons:${{ github.sha }}

    docker build -f deploy/Dockerfile.worker -t ${{ secrets.ACR_LOGIN_SERVER }}/sdg-innovation-commons-worker:${{ github.sha }} .
    docker push ${{ secrets.ACR_LOGIN_SERVER }}/sdg-innovation-commons-worker:${{ github.sha }}

- name: Deploy to Azure
  run: |
    az webapp config appsettings set \
      --resource-group sdg-rg \
      --name sdg-innovation-commons \
      --settings IMAGE_TAG="${{ github.sha }}"

    az webapp restart --name sdg-innovation-commons --resource-group sdg-rg
```
