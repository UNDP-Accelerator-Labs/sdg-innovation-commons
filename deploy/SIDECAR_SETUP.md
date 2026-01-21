# Sidecar Multi-Container Setup Guide

This guide walks you through setting up multi-container sidecar deployment for **staging only**.

## Prerequisites

- Azure CLI installed: `brew install azure-cli`
- Logged into Azure: `az login`
- Access to your Azure subscription

## Step 1: Get Your Azure Subscription and Resource Group

```bash
# List your subscriptions
az account list --output table

# Set the subscription you want to use
az account set --subscription "<subscription-id>"

# Find your resource group (where staging-sdg-innovation-commons lives)
az group list --output table

# Or find the resource group for your app
az webapp show --name staging-sdg-innovation-commons --query resourceGroup -o tsv
```

**Note down:**

- Subscription ID: `________________________________________`
- Resource Group: `________________________________________`

## Step 2: Create Service Principal for GitHub Actions

Create a service principal with contributor access to your resource group:

```bash
# Replace with your actual values
SUBSCRIPTION_ID="your-subscription-id"
RESOURCE_GROUP="your-resource-group-name"

# Create service principal
az ad sp create-for-rbac \
  --name "github-actions-sdg-sidecar" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
  --sdk-auth
```

This will output JSON like:

```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

**⚠️ IMPORTANT:** Copy this entire JSON output. You'll need it in Step 3.

## Step 3: Add GitHub Secrets

Go to your GitHub repository:

1. Navigate to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**

Add these two secrets:

### Secret 1: `AZURE_CREDENTIALS`

- **Name:** `AZURE_CREDENTIALS`
- **Value:** The entire JSON output from Step 2 (paste as-is)

### Secret 2: `AZURE_RESOURCE_GROUP`

- **Name:** `AZURE_RESOURCE_GROUP`
- **Value:** Your resource group name (e.g., `sdg-innovation-commons-rg`)

## Step 4: Verify Existing Secrets

Make sure you already have these secrets (used by current workflow):

- ✅ `REGISTRY_USERNAME`
- ✅ `REGISTRY_PASSWORD`
- ✅ `AZURE_PUBLISH_PROFILE_STAGING` (still needed for rollback)

## Step 5: Test Sidecar Deployment

Create and push a sidecar tag:

```bash
# Navigate to your project
cd "/Users/adedapoaderemi/UNDP Projects/sdg-innovation-commons"

# Create a sidecar tag
git tag sidecar-v$(date +%Y.%m.%d-%H%M)

# Push the tag
git push origin --tags
```

This will trigger `.github/workflows/sidecar-deployment.yaml` which will:

1. ✅ Build main app image
2. ✅ Build worker image
3. ✅ Push both images to ACR
4. ✅ Deploy to staging as multi-container

## Step 6: Monitor Deployment

### Watch GitHub Actions

1. Go to **Actions** tab in GitHub
2. Click on the running workflow
3. Watch the "Deploy Multi-Container to Staging" job

### Watch Azure Logs

```bash
# In a separate terminal, watch logs in real-time
az webapp log tail \
  --name staging-sdg-innovation-commons \
  --resource-group <your-resource-group>
```

## Step 7: Verify Multi-Container Configuration

Check that Azure configured multi-container correctly:

```bash
# Should show COMPOSE|... in linuxFxVersion
az webapp show \
  --name staging-sdg-innovation-commons \
  --resource-group <your-resource-group> \
  --query 'siteConfig.linuxFxVersion' -o tsv
```

Expected output:

```
COMPOSE|<base64-encoded-docker-compose-file>
```

## Step 8: Test Your Staging App

1. **Test Web App:**

   ```bash
   curl https://staging-sdg-innovation-commons.azurewebsites.net
   ```

2. **Check Worker Health:**
   The worker runs inside the same App Service but isn't directly accessible from outside.

   Check logs for worker activity:

   ```bash
   az webapp log tail \
     --name staging-sdg-innovation-commons \
     --resource-group <your-resource-group> | grep worker
   ```

3. **Verify Both Containers Running:**
   In Azure Portal:
   - Navigate to staging-sdg-innovation-commons App Service
   - Go to **Deployment Center** → Should show multi-container config
   - Go to **Log stream** → Should see logs from both containers

## Troubleshooting

### Issue: "Could not find service principal"

**Solution:** Make sure you're logged into the correct Azure subscription:

```bash
az account show
az login  # if needed
```

### Issue: "Insufficient privileges"

**Solution:** You need Owner or User Access Administrator role to create service principals:

```bash
# Ask your Azure admin to create the service principal, or
# Give you elevated permissions temporarily
```

### Issue: Deployment succeeds but app won't start

**Solution:** Check app settings are configured:

```bash
az webapp config appsettings list \
  --name staging-sdg-innovation-commons \
  --resource-group <your-resource-group> | grep -E "GENERAL_DB|APP_SECRET"
```

If missing, add them:

```bash
az webapp config appsettings set \
  --name staging-sdg-innovation-commons \
  --resource-group <your-resource-group> \
  --settings \
    GENERAL_DB_URL="postgresql://..." \
    APP_SECRET="your-secret"
```

### Issue: Worker not processing jobs

**Solution:** Check worker logs specifically:

```bash
az webapp log tail \
  --name staging-sdg-innovation-commons \
  --resource-group <your-resource-group> 2>&1 | grep -E "worker|heartbeat|export"
```

Worker should show:

- ✅ "Started HTTP health server"
- ✅ "Started heartbeat"
- ✅ "Starting main worker (process_exports.cjs)"

### Issue: Want to rollback to separate containers

**Solution:** Just push a regular `staging-v*` tag:

```bash
git tag staging-v$(date +%Y.%m.%d-%H%M)
git push origin --tags
```

This triggers the original `staging-only.yaml` workflow which deploys to separate App Services.

## Rollback Plan

If multi-container doesn't work well, you can easily rollback:

### Option 1: Deploy with original workflow

```bash
# Use staging-v tag (not sidecar-v)
git tag staging-v$(date +%Y.%m.%d-%H%M)
git push origin --tags
```

This will deploy to the separate `sdg-innovation-commons-worker` App Service again.

### Option 2: Manual rollback via Azure CLI

```bash
# Revert to single container
az webapp config container set \
  --name staging-sdg-innovation-commons \
  --resource-group <your-resource-group> \
  --docker-custom-image-name acclabdocker.azurecr.io/sdginnovationcommons:latest \
  --docker-registry-server-url https://acclabdocker.azurecr.io
```

## Monitoring Multi-Container

### Check Container Status

```bash
# View current container configuration
az webapp config show \
  --name staging-sdg-innovation-commons \
  --resource-group <your-resource-group> \
  --query 'siteConfig'
```

### View All Logs

```bash
# Stream all logs (both containers)
az webapp log tail \
  --name staging-sdg-innovation-commons \
  --resource-group <your-resource-group>
```

### Download Logs for Analysis

```bash
# Download last hour of logs
az webapp log download \
  --name staging-sdg-innovation-commons \
  --resource-group <your-resource-group> \
  --log-file staging-logs.zip

unzip staging-logs.zip
# Look for docker logs in the extracted files
```

### Check Resource Usage

```bash
# CPU and Memory metrics
az monitor metrics list \
  --resource "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/staging-sdg-innovation-commons" \
  --metric "CpuPercentage" \
  --start-time $(date -u -v-1H +%Y-%m-%dT%H:%M:%SZ) \
  --interval PT1M \
  --aggregation Average
```

## Production Deployment

**Note:** Production (`acclabs`) will continue using separate App Services for now. Only staging uses multi-container sidecar.

To deploy production, use the regular tags:

```bash
# Production still uses separate containers
git tag v$(date +%Y.%m.%d-%H%M)
git push origin --tags
```

This keeps production stable while you test sidecar in staging.

## Next Steps

After testing sidecar in staging for a few weeks:

1. **Monitor Performance:**

   - CPU usage patterns
   - Memory consumption
   - Worker job completion rates
   - Web app response times

2. **Compare with Separate Containers:**

   - Is resource contention an issue?
   - Are logs harder to debug?
   - Does worker affect web performance?

3. **Decide:**

   - ✅ Keep sidecar if it works well
   - ✅ Rollback if separate containers are better

4. **Consider Production:**
   - Only migrate production to sidecar if staging proves stable
   - Production reliability > cost savings

## Summary

- ✅ Staging uses **sidecar multi-container** (testing)
- ✅ Production uses **separate App Services** (stable)
- ✅ Can easily switch between both by using different tag prefixes
- ✅ `sidecar-v*` tags → Multi-container workflow
- ✅ `staging-v*` tags → Separate containers workflow
- ✅ `v*` tags → Production (unchanged)
