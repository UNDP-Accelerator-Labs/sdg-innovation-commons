#!/usr/bin/env bash
# Script to create Kubernetes secrets and configmaps from .env files
# Each service gets its own ConfigMap and Secret to avoid conflicts
# Usage: ./scripts/create-k8s-secrets-from-env.sh [local|staging|production] [namespace]

set -e

ENVIRONMENT=${1:-local}
NAMESPACE=${2:-sdg-innovation-commons}

echo "════════════════════════════════════════════════════════════"
echo "🔐 Creating Kubernetes Secrets from Environment Files"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "  Environment: $ENVIRONMENT"
echo "  Namespace:   $NAMESPACE"
echo "  Strategy:    Separate ConfigMaps/Secrets per service"
echo ""

# Determine which env files to use
case "$ENVIRONMENT" in
    local)
        NEXTJS_ENV_FILE=".env.local"
        SEMANTIC_ENV_FILE="semantic-search/.env.development"
        echo "📝 Using environment files:"
        echo "   - Next.js/Worker: $NEXTJS_ENV_FILE"
        echo "   - Semantic Search: $SEMANTIC_ENV_FILE"
        if [ -n "$K8S_DB_HOST" ]; then
            echo "🔧 Kubernetes overrides detected:"
            echo "   - Database host: $K8S_DB_HOST (instead of localhost)"
            echo "   - Qdrant host: ${K8S_QDRANT_HOST:-qdrant-service}"
            echo "   - Redis host: ${K8S_REDIS_HOST:-redis-service}"
        fi
        ;;
    staging)
        NEXTJS_ENV_FILE=".env.staging"
        SEMANTIC_ENV_FILE="semantic-search/.env.staging"
        ;;
    production)
        NEXTJS_ENV_FILE=".env.production"
        SEMANTIC_ENV_FILE="semantic-search/.env.production"
        ;;
    *)
        echo "❌ Invalid environment. Use: local, staging, or production"
        exit 1
        ;;
esac

# Check if Next.js env file exists
if [ ! -f "$NEXTJS_ENV_FILE" ]; then
    echo "❌ Next.js environment file not found: $NEXTJS_ENV_FILE"
    echo ""
    if [ "$ENVIRONMENT" = "local" ]; then
        echo "Create it from example:"
        echo "  cp .env.example .env.local"
        echo "  # Edit .env.local with localhost values for development"
        echo "  # K8s deployment will automatically use service names"
    else
        echo "Create it from example:"
        echo "  cp .env.${ENVIRONMENT}.example .env.${ENVIRONMENT}"
        echo "  # Edit .env.${ENVIRONMENT} with your configuration"
    fi
    exit 1
fi

echo "✅ Found Next.js environment file: $NEXTJS_ENV_FILE"

# Check for semantic-search env file
SEMANTIC_EXISTS=false
if [ -f "$SEMANTIC_ENV_FILE" ]; then
    echo "✅ Found Semantic Search environment file: $SEMANTIC_ENV_FILE"
    SEMANTIC_EXISTS=true
else
    echo "⚠️  Warning: $SEMANTIC_ENV_FILE not found"
    if [ "$ENVIRONMENT" = "local" ]; then
        echo "   Create it: cp semantic-search/.env.example semantic-search/.env.development"
        echo "   Edit with localhost values - K8s deployment will use service names automatically"
    fi
    echo "   Semantic Search will use shared ConfigMap/Secrets only"
fi
echo ""

# Create namespace if it doesn't exist
echo "📦 Creating namespace: $NAMESPACE"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f - 2>/dev/null || true
echo ""

# ConfigMap variables (non-sensitive configuration)
CONFIGMAP_KEYS=(
    "NODE_ENV"
    "PORT"
    "LOG_LEVEL"
    "QDRANT_HOST"
    "QDRANT_PORT"
    "QDRANT_GRPC_PORT"
    "QDRANT_COLLECTION_NAME"
    "QDRANT_USE_HTTPS"
    "REDIS_HOST"
    "REDIS_PORT"
    "SEMANTIC_SEARCH_URL"
    "EMBEDDING_MODEL"
    "DEVICE"
    "SERVICE_HOST"
    "SERVICE_PORT"
    "WORKER_CONCURRENCY"
    "WORKER_INTERVAL"
    "NEXTAUTH_URL"
    "APP_ID"
    "AUTH_URL"
    "JWT_AUDIENCE"
    "JWT_ISSUER"
    "NEXT_PUBLIC_ENABLE_UNDP_SSO"
    "NEXT_PUBLIC_ENABLE_EMAIL_AUTH"
    "API_HOST"
    "API_PORT"
    "ALLOWED_ORIGINS"
)

# Function to check if a key should be in ConfigMap
is_configmap_key() {
    local key=$1
    for cm_key in "${CONFIGMAP_KEYS[@]}"; do
        if [ "$key" = "$cm_key" ]; then
            return 0
        fi
    done
    return 1
}

# Function to parse env file and create kubectl args
parse_env_file() {
    local file=$1
    local configmap_args=()
    local secret_args=()
    local seen_keys=()
    
    # Read file in reverse to get last occurrence of duplicate keys
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip comments and empty lines
        [[ "$line" =~ ^[[:space:]]*# ]] && continue
        [[ -z "$line" ]] && continue
        [[ "$line" =~ ^[[:space:]]*$ ]] && continue
        
        # Extract key and value (everything after first =)
        if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
            key="${BASH_REMATCH[1]}"
            value="${BASH_REMATCH[2]}"
            
            # Trim whitespace from key
            key=$(echo "$key" | xargs)
            
            # Skip if key is empty
            [[ -z "$key" ]] && continue
            
            # Skip if we've already seen this key (keeps last occurrence)
            local already_seen=false
            for seen in "${seen_keys[@]}"; do
                if [ "$seen" = "$key" ]; then
                    already_seen=true
                    break
                fi
            done
            if [ "$already_seen" = true ]; then
                continue
            fi
            seen_keys+=("$key")
            
            # Remove surrounding quotes from value (single or double)
            if [[ "$value" =~ ^\"(.*)\"$ ]] || [[ "$value" =~ ^\'(.*)\'$ ]]; then
                value="${BASH_REMATCH[1]}"
            fi
            
            # Skip empty values
            [[ -z "$value" ]] && continue
            
            # Skip multiline values
            [[ "$value" =~ $'\n' ]] && continue
            
            # Categorize as ConfigMap or Secret
            if is_configmap_key "$key"; then
                configmap_args+=("--from-literal=${key}=${value}")
            else
                secret_args+=("--from-literal=${key}=${value}")
            fi
        fi
    done < <(tac "$file" 2>/dev/null || tail -r "$file" 2>/dev/null || cat "$file")
    
    # Return arrays as newline-separated strings
    printf "%s\n" "${configmap_args[@]}"
    echo "---SEPARATOR---"
    printf "%s\n" "${secret_args[@]}"
}

# Parse Next.js environment
echo "🔍 Parsing Next.js/Worker environment variables from $NEXTJS_ENV_FILE"
echo ""

NEXTJS_RESULT=$(parse_env_file "$NEXTJS_ENV_FILE")
NEXTJS_CONFIGMAP_ARGS=()
NEXTJS_SECRET_ARGS=()
reading_configmap=true

while IFS= read -r line; do
    if [ "$line" = "---SEPARATOR---" ]; then
        reading_configmap=false
        continue
    fi
    if [ "$reading_configmap" = true ]; then
        [ -n "$line" ] && NEXTJS_CONFIGMAP_ARGS+=("$line")
    else
        [ -n "$line" ] && NEXTJS_SECRET_ARGS+=("$line")
    fi
done <<< "$NEXTJS_RESULT"

echo "  📋 ConfigMap variables: ${#NEXTJS_CONFIGMAP_ARGS[@]}"
echo "  🔐 Secret variables: ${#NEXTJS_SECRET_ARGS[@]}"

# Apply Kubernetes-specific overrides for local deployment
if [ "$ENVIRONMENT" = "local" ] && [ -n "$K8S_DB_HOST" ]; then
    echo "  🔧 Applying K8s overrides..."
    # Override database host for Minikube access
    for i in "${!NEXTJS_SECRET_ARGS[@]}"; do
        if [[ "${NEXTJS_SECRET_ARGS[$i]}" =~ ^--from-literal=GENERAL_DB_HOST= ]]; then
            NEXTJS_SECRET_ARGS[$i]="--from-literal=GENERAL_DB_HOST=$K8S_DB_HOST"
            echo "     - GENERAL_DB_HOST → $K8S_DB_HOST"
        fi
    done
    
    # Override semantic search URL for K8s service discovery
    for i in "${!NEXTJS_CONFIGMAP_ARGS[@]}"; do
        if [[ "${NEXTJS_CONFIGMAP_ARGS[$i]}" =~ ^--from-literal=SEMANTIC_SEARCH_URL= ]]; then
            NEXTJS_CONFIGMAP_ARGS[$i]="--from-literal=SEMANTIC_SEARCH_URL=http://semantic-search-service:8000"
            echo "     - SEMANTIC_SEARCH_URL → http://semantic-search-service:8000"
        fi
    done
fi

echo ""

# Parse Semantic Search environment if it exists
SEMANTIC_CONFIGMAP_ARGS=()
SEMANTIC_SECRET_ARGS=()

if [ "$SEMANTIC_EXISTS" = true ]; then
    echo "🔍 Parsing Semantic Search environment variables from $SEMANTIC_ENV_FILE"
    echo ""
    
    SEMANTIC_RESULT=$(parse_env_file "$SEMANTIC_ENV_FILE")
    reading_configmap=true
    
    while IFS= read -r line; do
        if [ "$line" = "---SEPARATOR---" ]; then
            reading_configmap=false
            continue
        fi
        if [ "$reading_configmap" = true ]; then
            [ -n "$line" ] && SEMANTIC_CONFIGMAP_ARGS+=("$line")
        else
            [ -n "$line" ] && SEMANTIC_SECRET_ARGS+=("$line")
        fi
    done <<< "$SEMANTIC_RESULT"
    
    echo "  📋 ConfigMap variables: ${#SEMANTIC_CONFIGMAP_ARGS[@]}"
    echo "  🔐 Secret variables: ${#SEMANTIC_SECRET_ARGS[@]}"
    
    # Apply Kubernetes-specific overrides for local deployment
    if [ "$ENVIRONMENT" = "local" ]; then
        echo "  🔧 Applying K8s overrides..."
        # Override service hostnames
        for i in "${!SEMANTIC_CONFIGMAP_ARGS[@]}"; do
            if [[ "${SEMANTIC_CONFIGMAP_ARGS[$i]}" =~ ^--from-literal=QDRANT_HOST= ]]; then
                SEMANTIC_CONFIGMAP_ARGS[$i]="--from-literal=QDRANT_HOST=${K8S_QDRANT_HOST:-qdrant-service}"
                echo "     - QDRANT_HOST → ${K8S_QDRANT_HOST:-qdrant-service}"
            elif [[ "${SEMANTIC_CONFIGMAP_ARGS[$i]}" =~ ^--from-literal=REDIS_HOST= ]]; then
                SEMANTIC_CONFIGMAP_ARGS[$i]="--from-literal=REDIS_HOST=${K8S_REDIS_HOST:-redis-service}"
                echo "     - REDIS_HOST → ${K8S_REDIS_HOST:-redis-service}"
            fi
        done
        # Override database host
        for i in "${!SEMANTIC_SECRET_ARGS[@]}"; do
            if [[ "${SEMANTIC_SECRET_ARGS[$i]}" =~ ^--from-literal=GENERAL_DB_HOST= ]] && [ -n "$K8S_DB_HOST" ]; then
                SEMANTIC_SECRET_ARGS[$i]="--from-literal=GENERAL_DB_HOST=$K8S_DB_HOST"
                echo "     - GENERAL_DB_HOST → $K8S_DB_HOST"
            fi
        done
    fi
    
    echo ""
fi

# Create Next.js ConfigMap
echo "════════════════════════════════════════════════════════════"
echo "📦 Creating ConfigMap: nextjs-config"
echo "════════════════════════════════════════════════════════════"

if [ ${#NEXTJS_CONFIGMAP_ARGS[@]} -eq 0 ]; then
    echo "⚠️  No ConfigMap variables found for Next.js"
else
    kubectl create configmap nextjs-config \
        "${NEXTJS_CONFIGMAP_ARGS[@]}" \
        --namespace=$NAMESPACE \
        --dry-run=client -o yaml | kubectl apply -f -
    
    echo "✅ ConfigMap created with ${#NEXTJS_CONFIGMAP_ARGS[@]} variables"
fi

echo ""

# Create Next.js Secret
echo "════════════════════════════════════════════════════════════"
echo "🔐 Creating Secret: nextjs-secrets"
echo "════════════════════════════════════════════════════════════"

if [ ${#NEXTJS_SECRET_ARGS[@]} -eq 0 ]; then
    echo "⚠️  No Secret variables found for Next.js"
else
    kubectl create secret generic nextjs-secrets \
        "${NEXTJS_SECRET_ARGS[@]}" \
        --namespace=$NAMESPACE \
        --dry-run=client -o yaml | kubectl apply -f -
    
    echo "✅ Secret created with ${#NEXTJS_SECRET_ARGS[@]} variables"
fi

echo ""

# Create Semantic Search ConfigMap
if [ "$SEMANTIC_EXISTS" = true ]; then
    echo "════════════════════════════════════════════════════════════"
    echo "📦 Creating ConfigMap: semantic-search-config"
    echo "════════════════════════════════════════════════════════════"
    
    if [ ${#SEMANTIC_CONFIGMAP_ARGS[@]} -eq 0 ]; then
        echo "⚠️  No ConfigMap variables found for Semantic Search"
    else
        kubectl create configmap semantic-search-config \
            "${SEMANTIC_CONFIGMAP_ARGS[@]}" \
            --namespace=$NAMESPACE \
            --dry-run=client -o yaml | kubectl apply -f -
        
        echo "✅ ConfigMap created with ${#SEMANTIC_CONFIGMAP_ARGS[@]} variables"
    fi
    
    echo ""
    
    # Create Semantic Search Secret
    echo "════════════════════════════════════════════════════════════"
    echo "🔐 Creating Secret: semantic-search-secrets"
    echo "════════════════════════════════════════════════════════════"
    
    if [ ${#SEMANTIC_SECRET_ARGS[@]} -eq 0 ]; then
        echo "⚠️  No Secret variables found for Semantic Search"
    else
        kubectl create secret generic semantic-search-secrets \
            "${SEMANTIC_SECRET_ARGS[@]}" \
            --namespace=$NAMESPACE \
            --dry-run=client -o yaml | kubectl apply -f -
        
        echo "✅ Secret created with ${#SEMANTIC_SECRET_ARGS[@]} variables"
    fi
    
    echo ""
fi

# Summary
echo "════════════════════════════════════════════════════════════"
echo "✅ Kubernetes Resources Created Successfully!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📋 Summary:"
echo "  • Namespace: $NAMESPACE"
echo "  • Next.js ConfigMap: nextjs-config (${#NEXTJS_CONFIGMAP_ARGS[@]} vars)"
echo "  • Next.js Secret: nextjs-secrets (${#NEXTJS_SECRET_ARGS[@]} vars)"
if [ "$SEMANTIC_EXISTS" = true ]; then
    echo "  • Semantic Search ConfigMap: semantic-search-config (${#SEMANTIC_CONFIGMAP_ARGS[@]} vars)"
    echo "  • Semantic Search Secret: semantic-search-secrets (${#SEMANTIC_SECRET_ARGS[@]} vars)"
fi
echo ""
echo "💡 Each service has its own ConfigMap and Secret - no conflicts!"
echo ""
echo "🔍 Verify with:"
echo "  kubectl get configmap -n $NAMESPACE"
echo "  kubectl get secret -n $NAMESPACE"
echo ""
