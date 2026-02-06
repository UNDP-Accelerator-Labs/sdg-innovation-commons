#!/bin/bash
# Quick deployment script for embedding worker service

set -e

echo "========================================="
echo "Embedding Worker Deployment Script"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check deployment mode
MODE=${1:-local}

if [ "$MODE" = "local" ]; then
    echo -e "${GREEN}Mode: Local Development${NC}"
    echo ""
    
    # Step 1: Build worker image
    echo "Step 1: Building worker Docker image..."
    cd ../semantic-search
    docker build -f Dockerfile.worker -t sdg-embedding-worker:local .
    cd ../deploy
    echo -e "${GREEN}✓ Worker image built${NC}"
    echo ""
    
    # Step 2: Start services
    echo "Step 2: Starting infrastructure + worker..."
    docker-compose -f docker-compose.dev.yml up -d embedding-worker
    echo -e "${GREEN}✓ Worker started${NC}"
    echo ""
    
    # Step 3: Wait for worker to be ready
    echo "Step 3: Waiting for worker to be ready..."
    sleep 10
    echo -e "${GREEN}✓ Worker should be ready${NC}"
    echo ""
    
    # Step 4: Check status
    echo "Step 4: Checking worker status..."
    docker-compose -f docker-compose.dev.yml ps embedding-worker
    echo ""
    
    # Show logs
    echo -e "${YELLOW}Showing worker logs (Ctrl+C to stop):${NC}"
    docker-compose -f docker-compose.dev.yml logs -f embedding-worker

elif [ "$MODE" = "kubernetes" ] || [ "$MODE" = "k8s" ]; then
    echo -e "${GREEN}Mode: Kubernetes Production${NC}"
    echo ""
    
    # Check if kubectl is available
    if ! command -v kubectl &> /dev/null; then
        echo "Error: kubectl not found. Please install kubectl first."
        exit 1
    fi
    
    # Step 1: Apply deployment
    echo "Step 1: Deploying to Kubernetes..."
    kubectl apply -f kubernetes/12-embedding-worker.yaml
    echo -e "${GREEN}✓ Deployment applied${NC}"
    echo ""
    
    # Step 2: Wait for rollout
    echo "Step 2: Waiting for deployment to be ready..."
    kubectl rollout status deployment/embedding-worker -n sdg-innovation-commons
    echo -e "${GREEN}✓ Deployment ready${NC}"
    echo ""
    
    # Step 3: Check pods
    echo "Step 3: Checking worker pods..."
    kubectl get pods -n sdg-innovation-commons -l app=embedding-worker
    echo ""
    
    # Step 4: Check HPA
    echo "Step 4: Checking HPA status..."
    kubectl get hpa -n sdg-innovation-commons -l app=embedding-worker
    echo ""
    
    # Show logs
    echo -e "${YELLOW}Showing worker logs (Ctrl+C to stop):${NC}"
    kubectl logs -n sdg-innovation-commons -l app=embedding-worker -f --tail=50

elif [ "$MODE" = "test" ]; then
    echo -e "${GREEN}Mode: Test Queue System${NC}"
    echo ""
    
    # Check if jq is available
    if ! command -v jq &> /dev/null; then
        echo "Error: jq not found. Please install jq for JSON parsing."
        exit 1
    fi
    
    # Get JWT token from environment
    if [ -z "$JWT_TOKEN" ]; then
        echo "Warning: JWT_TOKEN not set. Using placeholder."
        JWT_TOKEN="your-jwt-token-here"
    fi
    
    API_URL=${API_URL:-http://localhost:8000}
    
    echo "Step 1: Checking queue health..."
    curl -s "$API_URL/api/queue/health" | jq .
    echo ""
    
    echo "Step 2: Submitting test document..."
    JOB_RESPONSE=$(curl -s -X POST "$API_URL/api/queue/submit" \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "id_db": "test-'$(date +%s)'",
        "title": "Test Document",
        "full_text": "This is a test document for the embedding queue system. It contains enough text to generate meaningful embeddings for testing purposes.",
        "base": "solution",
        "language": "en"
      }')
    
    echo "$JOB_RESPONSE" | jq .
    JOB_ID=$(echo "$JOB_RESPONSE" | jq -r .job_id)
    echo ""
    
    echo "Step 3: Checking job status..."
    sleep 2
    
    for i in {1..10}; do
        STATUS=$(curl -s "$API_URL/api/queue/status/$JOB_ID")
        echo "Attempt $i:"
        echo "$STATUS" | jq .
        
        JOB_STATUS=$(echo "$STATUS" | jq -r .status)
        
        if [ "$JOB_STATUS" = "completed" ]; then
            echo -e "${GREEN}✓ Job completed successfully!${NC}"
            break
        elif [ "$JOB_STATUS" = "failed" ]; then
            echo -e "${YELLOW}✗ Job failed${NC}"
            break
        fi
        
        echo "Waiting 3 seconds..."
        sleep 3
    done
    echo ""
    
    echo "Step 4: Queue statistics..."
    curl -s "$API_URL/api/queue/stats" \
      -H "Authorization: Bearer $JWT_TOKEN" | jq .
    echo ""

else
    echo "Usage: $0 [local|kubernetes|test]"
    echo ""
    echo "Modes:"
    echo "  local      - Deploy worker locally with Docker Compose"
    echo "  kubernetes - Deploy worker to Kubernetes cluster"
    echo "  test       - Test the queue system with a sample document"
    echo ""
    echo "Examples:"
    echo "  $0 local            # Start worker locally"
    echo "  $0 kubernetes       # Deploy to K8s"
    echo "  JWT_TOKEN=xxx $0 test  # Test queue"
    exit 1
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
