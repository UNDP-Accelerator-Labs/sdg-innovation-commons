#!/bin/bash
# Deploy main app and worker as multi-container sidecar to Azure App Service

set -e

# Configuration
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-sdg-innovation-commons-rg}"
APP_NAME="${AZURE_APP_NAME:-sdg-innovation-commons}"
LOCATION="${AZURE_LOCATION:-eastus}"
ACR_NAME="${AZURE_ACR_NAME:-sdginnovationacr}"
IMAGE_TAG="${IMAGE_TAG:-$(date +%Y.%m.%d-%H%M)}"

echo "=========================================="
echo "Multi-Container Deployment to Azure"
echo "=========================================="
echo "Resource Group: $RESOURCE_GROUP"
echo "App Name: $APP_NAME"
echo "ACR: $ACR_NAME"
echo "Image Tag: $IMAGE_TAG"
echo "=========================================="

# Step 1: Build and push main app image
echo ""
echo "📦 Building main app image..."
docker build -f deploy/Dockerfile -t $ACR_NAME.azurecr.io/sdg-innovation-commons:$IMAGE_TAG .
docker tag $ACR_NAME.azurecr.io/sdg-innovation-commons:$IMAGE_TAG $ACR_NAME.azurecr.io/sdg-innovation-commons:latest

echo ""
echo "🚀 Pushing main app image to ACR..."
docker push $ACR_NAME.azurecr.io/sdg-innovation-commons:$IMAGE_TAG
docker push $ACR_NAME.azurecr.io/sdg-innovation-commons:latest

# Step 2: Build and push worker image
echo ""
echo "📦 Building worker image..."
docker build -f deploy/Dockerfile.worker -t $ACR_NAME.azurecr.io/sdg-innovation-commons-worker:$IMAGE_TAG .
docker tag $ACR_NAME.azurecr.io/sdg-innovation-commons-worker:$IMAGE_TAG $ACR_NAME.azurecr.io/sdg-innovation-commons-worker:latest

echo ""
echo "🚀 Pushing worker image to ACR..."
docker push $ACR_NAME.azurecr.io/sdg-innovation-commons-worker:$IMAGE_TAG
docker push $ACR_NAME.azurecr.io/sdg-innovation-commons-worker:latest

# Step 3: Create docker-compose config with actual values
echo ""
echo "📝 Creating docker-compose configuration..."
export DOCKER_REGISTRY="$ACR_NAME.azurecr.io"
export IMAGE_TAG="$IMAGE_TAG"

cat > docker-compose.deploy.yml <<EOF
version: '3.8'

services:
  web:
    image: ${DOCKER_REGISTRY}/sdg-innovation-commons:${IMAGE_TAG}
    ports:
      - "80:3000"
      - "443:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
      - HOSTNAME=0.0.0.0
    restart: always

  worker:
    image: ${DOCKER_REGISTRY}/sdg-innovation-commons-worker:${IMAGE_TAG}
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
      - PORT=80
      - WEBJOB_HEARTBEAT_FILE=/app/scripts/worker.heartbeat.json
    restart: always
    depends_on:
      - web
EOF

# Step 4: Configure Azure App Service for multi-container
echo ""
echo "⚙️  Configuring Azure App Service for multi-container..."

# Enable container logging
az webapp log config --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --docker-container-logging filesystem

# Configure multi-container with docker-compose
az webapp config container set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --multicontainer-config-type compose \
  --multicontainer-config-file docker-compose.deploy.yml

# Step 5: Configure container registry credentials
echo ""
echo "🔐 Configuring ACR credentials..."
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

az webapp config container set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --docker-registry-server-url https://$ACR_NAME.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password "$ACR_PASSWORD"

# Step 6: Restart the app
echo ""
echo "🔄 Restarting App Service..."
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP

# Step 7: Show deployment status
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Deployment Details:"
echo "  Main App Image: $ACR_NAME.azurecr.io/sdg-innovation-commons:$IMAGE_TAG"
echo "  Worker Image: $ACR_NAME.azurecr.io/sdg-innovation-commons-worker:$IMAGE_TAG"
echo ""
echo "🌐 App URL: https://$APP_NAME.azurewebsites.net"
echo ""
echo "📝 View logs:"
echo "  az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo ""
echo "🔍 View container status:"
echo "  az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query 'siteConfig.linuxFxVersion'"

# Cleanup temp file
rm -f docker-compose.deploy.yml
