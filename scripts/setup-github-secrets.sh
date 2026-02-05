#!/bin/bash
# Script to set up GitHub Secrets for CI/CD from env files
# Usage: ./scripts/setup-github-secrets.sh [staging|production]

set -e

ENVIRONMENT=${1:-production}

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Invalid environment. Use: staging or production"
    echo "Usage: $0 [staging|production]"
    exit 1
fi

ENV_FILE=".env.${ENVIRONMENT}"

echo "============================================"
echo "GitHub Secrets Setup for ${ENVIRONMENT^^}"
echo "============================================"
echo ""

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Environment file not found: $ENV_FILE"
    echo ""
    echo "Please create it from the example:"
    echo "  cp .env.${ENVIRONMENT}.example $ENV_FILE"
    echo ""
    echo "Then edit $ENV_FILE with your actual values."
    exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo "❌ Not logged in to GitHub CLI."
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready"
echo "✅ Found environment file: $ENV_FILE"
echo ""

# Function to read env file and extract value
get_env_value() {
    local key=$1
    local value=$(grep "^${key}=" "$ENV_FILE" | cut -d '=' -f2- | sed 's/^"//' | sed 's/"$//')
    echo "$value"
}

# Function to set secret with environment prefix
set_secret() {
    local secret_name=$1
    local secret_value=$2
    
    if [ -z "$secret_value" ]; then
        echo "⚠️  Skipping $secret_name (empty value)"
        return
    fi
    
    # Add environment prefix for staging
    if [ "$ENVIRONMENT" = "staging" ]; then
        secret_name="STAGING_${secret_name}"
    fi
    
    echo -n "$secret_value" | gh secret set "$secret_name"
    echo "✅ Set $secret_name"
}

echo "Reading values from $ENV_FILE..."
echo ""
read -p "Continue to set GitHub Secrets? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
fi

echo ""
echo "============================================"
echo "Setting GitHub Secrets from $ENV_FILE"
echo "============================================"
echo ""
prompt_secret "DATABASE_URL" "Enter PostgreSQL connection string (from your .env.local)"

# NextAuth
echo ""
echo "Generate NEXTAUTH_SECRET with: openssl rand -base64 32"
prompt_secret "NEXTAUTH_SECRET" "Enter NEXTAUTH_SECRET"

# App Secret
echo ""
echo "Generate APP_SECRET with: openssl rand -base64 32"
echo ""

# Azure Container Registry
set_secret "ACR_LOGIN_SERVER" "$(get_env_value ACR_LOGIN_SERVER)"
set_secret "ACR_USERNAME" "$(get_env_value ACR_USERNAME)"
set_secret "ACR_PASSWORD" "$(get_env_value ACR_PASSWORD)"

# AKS Configuration
set_secret "AKS_CLUSTER_NAME" "$(get_env_value AKS_CLUSTER_NAME)"
set_secret "AKS_RESOURCE_GROUP" "$(get_env_value AKS_RESOURCE_GROUP)"

# Application Secrets
set_secret "APP_SECRET" "$(get_env_value APP_SECRET)"
set_secret "NEXTAUTH_SECRET" "$(get_env_value NEXTAUTH_SECRET)"

# Database
set_secret "DATABASE_URL" "$(get_env_value DATABASE_URL)"

# Azure Storage
set_secret "AZURE_STORAGE_CONNECTION_STRING" "$(get_env_value AZURE_STORAGE_CONNECTION_STRING)"

# Email/SMTP
set_secret "SMTP_HOST" "$(get_env_value SMTP_HOST)"
set_secret "SMTP_PORT" "$(get_env_value SMTP_PORT)"
set_secret "SMTP_USER" "$(get_env_value SMTP_USER)"
set_secret "SMTP_PASS" "$(get_env_value SMTP_PASS)"
set_secret "ADMIN_EMAILS" "$(get_env_value ADMIN_EMAILS)"

# External APIs
set_secret "OPENCAGE_API" "$(get_env_value OPENCAGE_API)"
set_secret "ACCLAB_PLATFORM_KEY" "$(get_env_value ACCLAB_PLATFORM_KEY)"
set_secret "BLOG_API_TOKEN" "$(get_env_value BLOG_API_TOKEN)"

# Semantic Search / Qdrant
set_secret "QDRANT_HOST" "$(get_env_value QDRANT_HOST)"
set_secret "QDRANT_PORT" "$(get_env_value QDRANT_PORT)"
set_secret "OPENAI_API_KEY" "$(get_env_value OPENAI_API_KEY)"

echo ""
echo "============================================"
echo "✅ SETUP COMPLETE!"
echo "============================================"
echo ""
echo "All ${ENVIRONMENT} secrets have been set in your GitHub repository."
echo ""
echo "Secrets are prefixed with: $([ "$ENVIRONMENT" = "staging" ] && echo "STAGING_" || echo "(none - production)")"
echo ""
echo "Next steps:"
echo "1. Commit and push the workflow file:"
echo "   git add .github/workflows/"
echo "   git commit -m 'Add CI/CD workflows for staging and production'"
echo "   git push origin main"
echo ""
echo "2. Trigger deployment:"
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "   git push origin staging  # or create 'staging' branch"
else
    echo "   git push origin main"
fi
echo ""
echo "3. Monitor deployment at:"
echo "   https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
echo ""
echo "To view all secrets:"
echo "  gh secret list"
echo ""
echo "To set up the other environment, run:"
echo "  $0 $([ "$ENVIRONMENT" = "staging" ] && echo "production" || echo "staging")"
echo ""
