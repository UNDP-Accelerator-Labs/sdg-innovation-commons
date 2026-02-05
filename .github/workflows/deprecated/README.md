# ⚠️ DEPRECATED WORKFLOWS

These workflows are **deprecated** and no longer used. They have been replaced by the new automated deployment system.

## Old Workflows (Deprecated)

- `app.yaml` - Old Azure Web App deployment (replaced)
- `hotfix.yaml` - Old hotfix deployment (replaced)
- `staging-only.yaml` - Old staging-only deployment (replaced)

## New Workflows (Use These Instead)

Use the new workflows in the parent directory:

- **Production**: `.github/workflows/deploy-production.yml`
- **Staging**: `.github/workflows/deploy-staging.yml`

## New Deployment Method

### Deploy to Production

```bash
make publish
```

### Deploy to Staging

```bash
make publish-staging
```

These commands automatically:

- ✅ Sync environment variables to GitHub Secrets
- ✅ Create deployment tags
- ✅ Trigger GitHub Actions
- ✅ Deploy to Azure Kubernetes Service (AKS)

## Migration Notes

The old workflows deployed to Azure Web Apps. The new workflows deploy to:

- **Azure Kubernetes Service (AKS)** - Production infrastructure
- **Azure PostgreSQL** - Managed database
- **Azure Blob Storage** - File storage
- **Qdrant** - Vector search (containerized on AKS)
- **Redis** - Cache (containerized on AKS)

See [SETUP.md](../../../SETUP.md) for complete documentation.
