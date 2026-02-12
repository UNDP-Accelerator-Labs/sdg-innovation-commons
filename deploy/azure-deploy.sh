#!/bin/bash
# Azure multi-container deployment script

set -e

# Configuration
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-sdg-rg}"
ACR_NAME="${AZURE_ACR_NAME:-sdgregistry}"
WEBAPP_NAME="${AZURE_WEBAPP_NAME:-sdg-innovation-commons}"
IMAGE_TAG="${IMAGE_TAG:-v$(date +%Y.%m.%d-%H%M)}"

echo "🚀 Starting Azure deployment..."
echo "Resource Group: $RESOURCE_GROUP"
echo "ACR: $ACR_NAME"
echo "Web App: $WEBAPP_NAME"
echo "Image Tag: $IMAGE_TAG"

# Login to Azure (if not already logged in)
echo "📝 Checking Azure login..."
az account show > /dev/null 2>&1 || az login

# Login to ACR
echo "🔐 Logging in to Azure Container Registry..."
az acr login --name $ACR_NAME

# Get ACR server URL
ACR_SERVER=$(az acr show --name $ACR_NAME --query loginServer -o tsv)
echo "ACR Server: $ACR_SERVER"

# Build and push web image
echo "🏗️  Building web container..."
docker build -f deploy/Dockerfile -t ${ACR_SERVER}/sdg-innovation-commons:${IMAGE_TAG} .

echo "⬆️  Pushing web container..."
docker push ${ACR_SERVER}/sdg-innovation-commons:${IMAGE_TAG}

# Tag and push as latest
docker tag ${ACR_SERVER}/sdg-innovation-commons:${IMAGE_TAG} ${ACR_SERVER}/sdg-innovation-commons:latest
docker push ${ACR_SERVER}/sdg-innovation-commons:latest

# Build and push worker image
echo "🏗️  Building worker container..."
docker build -f deploy/Dockerfile.worker -t ${ACR_SERVER}/sdg-innovation-commons-worker:${IMAGE_TAG} .

echo "⬆️  Pushing worker container..."
docker push ${ACR_SERVER}/sdg-innovation-commons-worker:${IMAGE_TAG}

# Tag and push as latest
docker tag ${ACR_SERVER}/sdg-innovation-commons-worker:${IMAGE_TAG} ${ACR_SERVER}/sdg-innovation-commons-worker:latest
docker push ${ACR_SERVER}/sdg-innovation-commons-worker:latest

# Update App Service settings
echo "⚙️  Updating App Service configuration..."

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv)

# Update container settings
az webapp config container set --name $WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --docker-registry-server-url https://${ACR_SERVER} \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD \
  --multicontainer-config-type compose \
  --multicontainer-config-file deploy/docker-compose.azure-simple.yml

# Update environment variables with new image tag
az webapp config appsettings set --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --settings \
    DOCKER_REGISTRY_SERVER="${ACR_SERVER}" \
    IMAGE_TAG="${IMAGE_TAG}"

# Restart the app
echo "🔄 Restarting Web App..."
az webapp restart --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP

echo "✅ Deployment complete!"
echo "🌐 URL: https://${WEBAPP_NAME}.azurewebsites.net"
echo "📊 Logs: az webapp log tail --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP"
