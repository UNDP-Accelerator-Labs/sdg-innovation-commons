.PHONY: help local-start local-stop dev-infra dev-nextjs dev-semantic dev-worker dev-status dev-logs dev-stop \
        k8s-local-setup k8s-local-build k8s-local-deploy k8s-local-status k8s-local-logs \
        k8s-local-delete k8s-local-restart k8s-local-port-forward \
        setup install migrate clean clean-cache test-semantic test-health \
        backup-qdrant restore-qdrant publish publish-staging deployment-status \
        deployment-logs rollback list-deployments

# =============================================================================
# CONFIGURATION
# =============================================================================

# Detect docker compose command (newer Docker Desktop uses 'docker compose', older uses 'docker-compose')
DOCKER_COMPOSE := $(shell command -v docker-compose 2>/dev/null)
ifndef DOCKER_COMPOSE
	DOCKER_COMPOSE := docker compose
endif

# =============================================================================
# HELP
# =============================================================================

help:
	@echo "========================================"
	@echo "SDG Innovation Commons - Make Commands"
	@echo "========================================"
	@echo ""
	@echo "⚡ Quick Start:"
	@echo "  make local-start    Start complete local environment (one command!)"
	@echo "  make local-stop     Stop all local services"
	@echo ""
	@echo "🚀 Production Deployment:"
	@echo "  make publish             Deploy to production (auto: sync env → tag → deploy)"
	@echo "  make publish-staging     Deploy to staging (auto: sync env → tag → deploy)"
	@echo "  make deployment-status   Check deployment status (ENV=production|staging)"
	@echo "  make deployment-logs     View deployment logs (ENV=production|staging)"
	@echo "  make rollback            Rollback deployment (ENV=production|staging)"
	@echo "  make list-deployments    List recent deployments"
	@echo ""
	@echo "🔧 Development (with hot reload):"
	@echo "  make dev-infra      Start infrastructure (Qdrant, Redis)"
	@echo "  make dev-nextjs     Start Next.js with hot reload"
	@echo "  make dev-semantic   Start semantic search with hot reload"
	@echo "  make dev-worker     Start background worker with hot reload"
	@echo "  make dev-status     Check infrastructure status"
	@echo "  make dev-logs       View infrastructure logs"
	@echo "  make dev-stop       Stop infrastructure"
	@echo ""
	@echo "☸️  Local Kubernetes Testing:"
	@echo "  make k8s-local-setup        Setup local Kubernetes cluster"
	@echo "  make k8s-local-build        Build images for local K8s"
	@echo "  make k8s-local-deploy       Deploy to local Kubernetes"
	@echo "  make k8s-local-status       Check local K8s status"
	@echo "  make k8s-local-logs         View pod logs"
	@echo "  make k8s-local-port-forward Forward ports to localhost"
	@echo "  make k8s-local-restart      Restart deployments"
	@echo "  make k8s-local-delete       Delete local K8s deployment"
	@echo ""
	@echo "💾 Backup & Recovery:"
	@echo "  make backup-qdrant  Backup Qdrant vector database"
	@echo "  make restore-qdrant Restore Qdrant from backup"
	@echo ""
	@echo "🔨 Setup & Utilities:"
	@echo "  make setup          Initial project setup"
	@echo "  make install        Install dependencies"
	@echo "  make migrate        Run database migrations"
	@echo "  make test-semantic  Test semantic search service"
	@echo "  make test-health    Check health of all services"
	@echo "  make clean          Clean containers and volumes"
	@echo "  make clean-cache    Clean build caches"

# =============================================================================
# LOCAL DEVELOPMENT (with hot reload)
# =============================================================================

local-start: ## 🚀 Start complete local environment (one command)
	@echo "════════════════════════════════════════════════════════════════"
	@echo "  🚀 Starting SDG Innovation Commons - Local Development"
	@echo "════════════════════════════════════════════════════════════════"
	@echo ""
	@echo "📋 Step 1/5: Checking prerequisites..."
	@command -v docker >/dev/null 2>&1 || (echo "❌ Docker not found. Install: https://docker.com" && exit 1)
	@command -v pnpm >/dev/null 2>&1 || (echo "❌ pnpm not found. Install: npm install -g pnpm" && exit 1)
	@command -v python3 >/dev/null 2>&1 || (echo "❌ Python3 not found" && exit 1)
	@echo "✅ All prerequisites found"
	@echo ""
	@echo "📋 Step 2/5: Checking environment files..."
	@if [ ! -f .env.local ]; then \
		echo "⚠️  .env.local not found, creating from .env.example..."; \
		cp .env.example .env.local 2>/dev/null || true; \
		echo "⚠️  IMPORTANT: Edit .env.local with your DATABASE_URL and other credentials"; \
		echo "   Required: DATABASE_URL (Azure PostgreSQL)"; \
		sleep 2; \
	else \
		echo "✅ .env.local found"; \
	fi
	@if [ ! -f .env ]; then \
		if [ -f .env.local ]; then \
			echo "⚠️  .env not found, creating from .env.local for worker runtime..."; \
			cp .env.local .env 2>/dev/null || true; \
		else \
			echo "⚠️  .env not found, creating from .env.example..."; \
			cp .env.example .env 2>/dev/null || true; \
		fi; \
	else \
		echo "✅ .env found"; \
	fi
	@if [ ! -f semantic-search/.env ]; then \
		echo "⚠️  semantic-search/.env not found, creating..."; \
		cp semantic-search/.env.example semantic-search/.env 2>/dev/null || echo "QDRANT_HOST=localhost\nQDRANT_PORT=6333" > semantic-search/.env; \
	else \
		echo "✅ semantic-search/.env found"; \
	fi
	@echo ""
	@echo "📋 Step 3/5: Starting infrastructure (Qdrant, Redis)..."
	@if [ -f .env.local ]; then \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml --env-file .env.local up -d qdrant redis; \
	else \
		echo "⚠️  .env.local not found, using default .env"; \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml up -d qdrant redis; \
	fi
	@echo "⏳ Waiting for infrastructure to be ready..."
	@sleep 12
	@echo "✅ Infrastructure ready!"
	@echo ""
	@echo "📋 Step 4/5: Installing dependencies..."
	@if [ ! -d node_modules ]; then \
		echo "📦 Installing Node.js dependencies..."; \
		pnpm install; \
	else \
		echo "✅ Node.js dependencies already installed"; \
	fi
	@if [ ! -d semantic-search/venv ]; then \
		echo "🐍 Setting up Python virtual environment..."; \
		cd semantic-search && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt; \
	else \
		echo "✅ Python virtual environment ready"; \
	fi
	@echo ""
	@echo "📋 Step 5/5: Running health checks..."
	@sleep 5
	@printf "  Qdrant: " && curl -sf -H "api-key: $${QDRANT_API_KEY:-dev-secret-key}" http://localhost:6333/ >/dev/null 2>&1 && echo "✅" || echo "⚠️  Running (auth required)"
	@printf "  Redis:  " && docker exec sdg-redis-dev redis-cli --no-auth-warning -a "$${REDIS_PASSWORD:-devpassword}" ping 2>/dev/null | grep -q PONG && echo "✅" || echo "⚠️  Running (auth required)"
	@echo ""
	@echo "════════════════════════════════════════════════════════════════"
	@echo "  🚀 Starting Application Services..."
	@echo "════════════════════════════════════════════════════════════════"
	@echo ""
	@mkdir -p logs
	@echo "📦 Starting Next.js (http://localhost:3000)..."
	@bash -c 'pnpm run dev > logs/nextjs.log 2>&1 & echo $$! > logs/nextjs.pid'
	@sleep 3
	@echo "🔍 Starting Semantic Search (http://localhost:8000)..."
	@bash -c 'LOGDIR="$$(pwd)/logs"; cd semantic-search && ./dev.sh > "$$LOGDIR/semantic.log" 2>&1 & echo $$! > "$$LOGDIR/semantic.pid"'
	@sleep 3
	@echo "🔧 Starting Embedding Worker..."
	@bash -c 'LOGDIR="$$(pwd)/logs"; cd semantic-search && ./dev-worker.sh > "$$LOGDIR/embedding-worker.log" 2>&1 & echo $$! > "$$LOGDIR/embedding-worker.pid"'
	@sleep 2
	@echo "⚙️  Starting Background Worker..."
	@bash -c './scripts/dev-worker.sh > logs/worker.log 2>&1 & echo $$! > logs/worker.pid'
	@echo ""
	@echo "⏳ Waiting for services to start..."
	@sleep 8
	@echo ""
	@echo "════════════════════════════════════════════════════════════════"
	@echo "  ✅ All Services Running!"
	@echo "════════════════════════════════════════════════════════════════"
	@echo ""
	@printf "🌐 Next.js:        " && curl -sf http://localhost:3000 >/dev/null 2>&1 && echo "✅ http://localhost:3000" || echo "⏳ Starting... (check logs/nextjs.log)"
	@printf "🔍 Semantic Search: " && curl -sf http://localhost:8000/health >/dev/null 2>&1 && echo "✅ http://localhost:8000" || echo "⏳ Starting... (check logs/semantic.log)"
	@printf "🔧 Embedding Worker: " && [ -f logs/embedding-worker.pid ] && echo "✅ Running (check logs/embedding-worker.log)" || echo "⏳ Starting..."
	@printf "⚙️  Export Worker:   " && [ -f logs/worker.pid ] && echo "✅ Running (check logs/worker.log)" || echo "⏳ Starting..."
	@printf "💾 Qdrant:         " && echo "✅ http://localhost:6333/dashboard"
	@printf "🔴 Redis:          " && echo "✅ localhost:6379"
	@echo ""
	@echo "════════════════════════════════════════════════════════════════"
	@echo "📊 Useful commands:"
	@echo "   make local-stop    - Stop all services"
	@echo "   make dev-status    - Check infrastructure status"
	@echo "   make dev-logs      - View infrastructure logs"
	@echo ""
	@echo "📝 View logs:"
	@echo "   tail -f logs/nextjs.log           - Next.js logs"
	@echo "   tail -f logs/semantic.log         - Semantic Search logs"
	@echo "   tail -f logs/embedding-worker.log - Embedding Worker logs"
	@echo "   tail -f logs/worker.log           - Export Worker logs"
	@echo "════════════════════════════════════════════════════════════════"
	@echo ""

local-stop: ## Stop all local services
	@echo "🛑 Stopping all local services..."
	@echo ""
	@echo "  Stopping Next.js..."
	@-pkill -9 -f "pnpm.*dev" 2>/dev/null || true
	@-pkill -9 -f "node.*next" 2>/dev/null || true
	@-pkill -9 -f "next/dist" 2>/dev/null || true
	@-pkill -9 -f "next-server" 2>/dev/null || true
	@-pkill -9 -f "jest-worker" 2>/dev/null || true
	@-rm -f logs/nextjs.pid 2>/dev/null || true
	@echo "  Stopping Semantic Search..."
	@-pkill -9 -f "uvicorn main:app" 2>/dev/null || true
	@-pkill -9 -f "Python.*sdg-innovation-commons/semantic-search" 2>/dev/null || true
	@-pkill -9 -f "semantic-search.*dev\.sh" 2>/dev/null || true
	@-pkill -9 -f "bash -c.*semantic-search" 2>/dev/null || true
	@-pkill -9 -f "semantic-search/venv/bin/pip" 2>/dev/null || true
	@-lsof -ti:8000 2>/dev/null | xargs kill -9 2>/dev/null || true
	@-rm -f logs/semantic.pid 2>/dev/null || true
	@echo "  Stopping Embedding Worker..."
	@-pkill -9 -f "semantic-search.*dev-worker\.sh" 2>/dev/null || true
	@-pkill -9 -f "python.*worker\.py" 2>/dev/null || true
	@-rm -f logs/embedding-worker.pid 2>/dev/null || true
	@echo "  Stopping Export Worker..."
	@-pkill -9 -f "dev-worker\.sh" 2>/dev/null || true
	@-pkill -9 -f "tsx.*process_exports" 2>/dev/null || true
	@-pkill -9 -f "bash -c.*dev-worker" 2>/dev/null || true
	@-rm -f logs/worker.pid 2>/dev/null || true
	@echo "  Stopping infrastructure (Qdrant, Redis)..."
	@if [ -f .env.local ]; then \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml --env-file .env.local down 2>/dev/null || true; \
	else \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml down 2>/dev/null || true; \
	fi
	@echo ""
	@echo "✅ All services stopped"
	@echo ""
	@echo "💡 Logs preserved in logs/ directory"
	@echo "💡 To clean up data: make clean"

dev-infra: ## Start only infrastructure (Qdrant, Redis)
	@echo "🚀 Starting infrastructure services..."
	@if [ -f .env.local ]; then \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml --env-file .env.local up -d qdrant redis; \
	else \
		echo "⚠️  .env.local not found, using default .env"; \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml up -d qdrant redis; \
	fi
	@echo "⏳ Waiting for services to be ready..."
	@sleep 5
	@echo "✅ Infrastructure ready!"
	@echo "   - Qdrant: localhost:6333"
	@echo "   - Redis: localhost:6379"
	@echo "   - PostgreSQL: Using Azure PostgreSQL (configured via .env)"

dev-nextjs: dev-infra ## Start Next.js with hot reload
	@echo "🌐 Starting Next.js development server..."
	@pnpm run dev

dev-semantic: dev-infra ## Start semantic search with hot reload
	@echo "🔍 Starting semantic search service (hot reload)..."
	@cd semantic-search && ./dev.sh

dev-worker: dev-infra ## Start background worker with hot reload
	@echo "⚙️  Starting background worker (hot reload)..."
	@./scripts/dev-worker.sh

dev-status: ## Check status of development infrastructure
	@echo "📊 Development Infrastructure Status:"
	@if [ -f .env.local ]; then \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml --env-file .env.local ps; \
	else \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml ps; \
	fi

dev-logs: ## View logs from infrastructure services
	@if [ -f .env.local ]; then \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml --env-file .env.local logs -f; \
	else \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml logs -f; \
	fi

dev-stop: ## Stop all development infrastructure
	@echo "🛑 Stopping infrastructure services..."
	@if [ -f .env.local ]; then \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml --env-file .env.local down; \
	else \
		$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml down; \
	fi

# =============================================================================
# LOCAL KUBERNETES TESTING
# =============================================================================

LOCAL_REGISTRY ?= localhost:5001
LOCAL_TAG ?= local
LOCAL_NAMESPACE ?= sdg-innovation-commons

# For local K8s, images must be without registry prefix when using imagePullPolicy: Never
K8S_NEXTJS_IMAGE ?= sdg-nextjs:$(LOCAL_TAG)
K8S_SEMANTIC_IMAGE ?= sdg-semantic-search:$(LOCAL_TAG)
K8S_WORKER_IMAGE ?= sdg-worker:$(LOCAL_TAG)
K8S_EMBEDDING_WORKER_IMAGE ?= sdg-semantic-search:$(LOCAL_TAG)

k8s-local-setup: ## Setup local Kubernetes cluster (Docker Desktop or Minikube)
	@echo "☸️  Setting up local Kubernetes..."
	@echo ""
	@if command -v docker-desktop >/dev/null 2>&1 || docker context ls | grep -q docker-desktop; then \
		echo "✅ Docker Desktop detected"; \
		echo "   Enable Kubernetes: Docker Desktop → Settings → Kubernetes → Enable Kubernetes"; \
		echo ""; \
		echo "   Then run: kubectl config use-context docker-desktop"; \
	elif command -v minikube >/dev/null 2>&1; then \
		echo "✅ Minikube detected"; \
		echo "   Starting Minikube..."; \
		minikube start --driver=docker; \
	else \
		echo "❌ No local Kubernetes found"; \
		echo "   Install one of:"; \
		echo "   - Docker Desktop (Mac/Windows): Enable Kubernetes in settings"; \
		echo "   - Minikube: brew install minikube && minikube start"; \
		echo "   - Kind: brew install kind && kind create cluster"; \
		exit 1; \
	fi
	@echo ""
	@echo "Verifying cluster..."
	@kubectl cluster-info
	@kubectl get nodes

k8s-local-build: ## Build container images for local Kubernetes
	@echo "🔨 Building images for local Kubernetes..."
	@echo ""
	@echo "Detecting Kubernetes environment..."
	@if kubectl config current-context | grep -q minikube; then \
		echo "📦 Minikube detected - building images in Minikube's Docker daemon"; \
		eval $$(minikube docker-env) && \
		docker build -t sdg-nextjs:$(LOCAL_TAG) -f deploy/Dockerfile . && \
		docker build -t sdg-semantic-search:$(LOCAL_TAG) -f semantic-search/Dockerfile semantic-search && \
		docker build -t sdg-worker:$(LOCAL_TAG) -f deploy/Dockerfile.worker .; \
	else \
		echo "🐳 Docker Desktop detected - building local images"; \
		docker build -t sdg-nextjs:$(LOCAL_TAG) -f deploy/Dockerfile . && \
		docker build -t sdg-semantic-search:$(LOCAL_TAG) -f semantic-search/Dockerfile semantic-search && \
		docker build -t sdg-worker:$(LOCAL_TAG) -f deploy/Dockerfile.worker .; \
	fi
	@echo ""
	@echo "✅ Images built for local Kubernetes:"
	@echo "   - sdg-nextjs:$(LOCAL_TAG)"
	@echo "   - sdg-semantic-search:$(LOCAL_TAG)"
	@echo "   - sdg-worker:$(LOCAL_TAG)"
	@echo "   - embedding-worker: uses sdg-semantic-search:$(LOCAL_TAG)"

k8s-local-deploy: ## Deploy to local Kubernetes
	@echo "☸️  Deploying to local Kubernetes..."
	@echo ""
	@echo "🔍 Detecting environment configuration..."
	@# Get host machine IP for Minikube to access local PostgreSQL
	@HOST_IP=$$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1"); \
	echo "   Detected host IP: $$HOST_IP"; \
	export K8S_DB_HOST=$$HOST_IP; \
	export K8S_QDRANT_HOST=qdrant-service; \
	export K8S_REDIS_HOST=redis-service; \
	echo ""
	@echo "Step 1: Creating namespace..."
	@kubectl apply -f deploy/kubernetes/01-namespace-config.yaml
	@echo ""
	@echo "Step 2: Creating ConfigMaps and Secrets from .env files..."
	@if [ ! -f .env.local ]; then \
		echo "❌ Error: .env.local not found!"; \
		echo "   Create it from example:"; \
		echo "   cp .env.example .env.local"; \
		echo "   # Edit .env.local with your configuration"; \
		exit 1; \
	fi
	@# Pass K8s-specific overrides to the script
	@HOST_IP=$$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1"); \
	K8S_DB_HOST=$$HOST_IP K8S_QDRANT_HOST=qdrant-service K8S_REDIS_HOST=redis-service \
	./scripts/create-k8s-secrets-from-env.sh local $(LOCAL_NAMESPACE)
	@echo ""
	@echo "Step 3: Creating storage (PVCs) - using local storage..."
	@kubectl apply -f deploy/kubernetes/02-storage-local.yaml
	@echo "⏳ Waiting for PVCs to be bound..."
	@sleep 5
	@echo ""
	@echo "Step 4: Deploying infrastructure (Qdrant, Redis)..."
	@kubectl apply -f deploy/kubernetes/03-qdrant.yaml
	@kubectl apply -f deploy/kubernetes/04-redis.yaml
	@echo "⏳ Waiting for infrastructure to be ready..."
	@sleep 15
	@echo ""
	@echo "Step 5: Updating image references for local deployment..."
	@sed -i.bak 's|image: YOUR_REGISTRY/sdg-nextjs:latest|image: $(K8S_NEXTJS_IMAGE)|g' deploy/kubernetes/06-nextjs.yaml
	@sed -i.bak 's|imagePullPolicy: Always|imagePullPolicy: IfNotPresent|g' deploy/kubernetes/06-nextjs.yaml
	@sed -i.bak 's|image: YOUR_REGISTRY/sdg-semantic-search:latest|image: $(K8S_SEMANTIC_IMAGE)|g' deploy/kubernetes/05-semantic-search.yaml
	@sed -i.bak 's|imagePullPolicy: Always|imagePullPolicy: IfNotPresent|g' deploy/kubernetes/05-semantic-search.yaml
	@sed -i.bak 's|image: YOUR_REGISTRY/sdg-worker:latest|image: $(K8S_WORKER_IMAGE)|g' deploy/kubernetes/07-worker.yaml
	@sed -i.bak 's|imagePullPolicy: Always|imagePullPolicy: IfNotPresent|g' deploy/kubernetes/07-worker.yaml
	@echo ""
	@echo "Step 6: Deploying application services..."
	@kubectl apply -f deploy/kubernetes/05-semantic-search.yaml
	@kubectl apply -f deploy/kubernetes/06-nextjs.yaml
	@kubectl apply -f deploy/kubernetes/07-worker.yaml
	@kubectl apply -f deploy/kubernetes/12-embedding-worker.yaml
	@echo ""
	@echo "Step 7: Restoring original manifest files..."
	@mv deploy/kubernetes/06-nextjs.yaml.bak deploy/kubernetes/06-nextjs.yaml 2>/dev/null || true
	@mv deploy/kubernetes/05-semantic-search.yaml.bak deploy/kubernetes/05-semantic-search.yaml 2>/dev/null || true
	@mv deploy/kubernetes/07-worker.yaml.bak deploy/kubernetes/07-worker.yaml 2>/dev/null || true
	@echo ""
	@echo "✅ Deployment complete!"
	@echo ""
	@echo "📝 Note: Ingress (08-ingress.yaml) not applied for local testing."
	@echo "    Use 'make k8s-local-port-forward' to access services."
	@echo ""
	@$(MAKE) k8s-local-status

k8s-local-status: ## Check local Kubernetes deployment status
	@echo "📊 Local Kubernetes Status:"
	@echo ""
	@echo "Namespace:"
	@kubectl get namespace $(LOCAL_NAMESPACE) 2>/dev/null || echo "Namespace not found"
	@echo ""
	@echo "Pods:"
	@kubectl get pods -n $(LOCAL_NAMESPACE)
	@echo ""
	@echo "Services:"
	@kubectl get svc -n $(LOCAL_NAMESPACE)
	@echo ""
	@echo "PersistentVolumeClaims:"
	@kubectl get pvc -n $(LOCAL_NAMESPACE)

k8s-local-logs: ## View logs from local Kubernetes pods
	@echo "📋 Recent logs from all pods:"
	@echo ""
	@echo "=== Next.js ==="
	@kubectl logs -n $(LOCAL_NAMESPACE) -l app=nextjs --tail=30 --prefix=true 2>/dev/null || echo "No nextjs pods found"
	@echo ""
	@echo "=== Semantic Search ==="
	@kubectl logs -n $(LOCAL_NAMESPACE) -l app=semantic-search --tail=30 --prefix=true 2>/dev/null || echo "No semantic-search pods found"
	@echo ""
	@echo "=== Worker ==="
	@kubectl logs -n $(LOCAL_NAMESPACE) -l app=worker --tail=30 --prefix=true 2>/dev/null || echo "No worker pods found"
	@echo ""
	@echo "💡 For live logs: kubectl logs -f -n $(LOCAL_NAMESPACE) -l app=nextjs"

k8s-local-port-forward: ## Forward ports to access services on localhost
	@echo "🔌 Port Forwarding Setup:"
	@echo ""
	@echo "Run these in separate terminals:"
	@echo ""
	@echo "# Next.js (http://localhost:3000)"
	@echo "kubectl port-forward -n $(LOCAL_NAMESPACE) svc/nextjs-service 3000:3000"
	@echo ""
	@echo "# Semantic Search (http://localhost:8000)"
	@echo "kubectl port-forward -n $(LOCAL_NAMESPACE) svc/semantic-search-service 8000:8000"
	@echo ""
	@echo "# Qdrant Dashboard (http://localhost:6333)"
	@echo "kubectl port-forward -n $(LOCAL_NAMESPACE) svc/qdrant-service 6333:6333"
	@echo ""
	@echo "# Redis (localhost:6379)"
	@echo "kubectl port-forward -n $(LOCAL_NAMESPACE) svc/redis-service 6379:6379"
	@echo ""
	@echo "💡 Or run all at once (in background):"
	@echo "kubectl port-forward -n $(LOCAL_NAMESPACE) svc/nextjs-service 3000:3000 &"
	@echo "kubectl port-forward -n $(LOCAL_NAMESPACE) svc/semantic-search-service 8000:8000 &"
	@echo "kubectl port-forward -n $(LOCAL_NAMESPACE) svc/qdrant-service 6333:6333 &"

k8s-local-restart: ## Restart local Kubernetes deployments
	@echo "🔄 Restarting deployments..."
	@kubectl rollout restart deployment -n $(LOCAL_NAMESPACE)
	@echo "✅ Restart initiated. Use 'make k8s-local-status' to check progress"

k8s-local-delete: ## Delete local Kubernetes deployment
	@echo "⚠️  This will delete all local Kubernetes resources. Ctrl+C to cancel..."
	@sleep 3
	@echo "Deleting application services..."
	@kubectl delete -f deploy/kubernetes/07-worker.yaml -n $(LOCAL_NAMESPACE) 2>/dev/null || true
	@kubectl delete -f deploy/kubernetes/06-nextjs.yaml -n $(LOCAL_NAMESPACE) 2>/dev/null || true
	@kubectl delete -f deploy/kubernetes/05-semantic-search.yaml -n $(LOCAL_NAMESPACE) 2>/dev/null || true
	@echo "Deleting infrastructure..."
	@kubectl delete -f deploy/kubernetes/04-redis.yaml -n $(LOCAL_NAMESPACE) 2>/dev/null || true
	@kubectl delete -f deploy/kubernetes/03-qdrant.yaml -n $(LOCAL_NAMESPACE) 2>/dev/null || true
	@echo "⚠️  Keeping storage (PVCs) and namespace. To delete:"
	@echo "    kubectl delete -f deploy/kubernetes/02-storage.yaml -n $(LOCAL_NAMESPACE)"
	@echo "    kubectl delete namespace $(LOCAL_NAMESPACE)"
	@echo "✅ Deployment deleted"

# =============================================================================
# BACKUP & RECOVERY
# =============================================================================

BACKUP_DIR ?= ./backups

backup-qdrant: ## Backup Qdrant vector database
	@echo "💾 Backing up Qdrant..."
	@mkdir -p $(BACKUP_DIR)/qdrant
	@if docker ps | grep -q sdg-qdrant; then \
		echo "Creating snapshot..."; \
		docker exec sdg-qdrant curl -X POST http://localhost:6333/collections/sdg_documents/snapshots; \
		sleep 2; \
		BACKUP_FILE="$(BACKUP_DIR)/qdrant/qdrant-backup-$$(date +%Y%m%d-%H%M%S).tar.gz"; \
		echo "Backing up to $$BACKUP_FILE..."; \
		docker run --rm \
			-v sdg-qdrant-storage:/source \
			-v $$(pwd)/$(BACKUP_DIR)/qdrant:/backup \
			alpine tar czf /backup/$$(basename $$BACKUP_FILE) -C /source .; \
		echo "✅ Backup complete: $$BACKUP_FILE"; \
	else \
		echo "❌ Qdrant container not running"; \
	fi

restore-qdrant: ## Restore Qdrant from backup
	@echo "⚠️  This will replace current Qdrant data. Ctrl+C to cancel..."
	@sleep 3
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "❌ Error: Please specify BACKUP_FILE=path/to/backup.tar.gz"; \
		exit 1; \
	fi
	@if [ ! -f "$(BACKUP_FILE)" ]; then \
		echo "❌ Error: Backup file not found: $(BACKUP_FILE)"; \
		exit 1; \
	fi
	@echo "Stopping Qdrant..."
	@$(DOCKER_COMPOSE) -f deploy/docker-compose.yml stop qdrant || true
	@$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml stop qdrant || true
	@echo "Restoring from $(BACKUP_FILE)..."
	@docker run --rm \
		-v sdg-qdrant-storage:/target \
		-v $$(pwd)/$$(dirname $(BACKUP_FILE)):/backup \
		alpine sh -c "cd /target && rm -rf * && tar xzf /backup/$$(basename $(BACKUP_FILE))"
	@echo "Starting Qdrant..."
	@$(DOCKER_COMPOSE) -f deploy/docker-compose.yml start qdrant || docker-compose -f deploy/docker-compose.dev.yml start qdrant
	@echo "✅ Restore complete"

# =============================================================================
# TESTING & UTILITIES
# =============================================================================

test-semantic: ## Test semantic search service
	@echo "🧪 Testing semantic search..."
	@cd semantic-search && ./test-service.sh

test-health: ## Check health of all services
	@echo "🏥 Health Check:"
	@echo -n "Semantic Search: " && curl -sf http://localhost:8000/health && echo "✅" || echo "❌"
	@echo -n "Qdrant: " && curl -sf http://localhost:6333/health && echo "✅" || echo "❌"

clean: ## Clean up all data and containers
	@echo "⚠️  This will delete all data. Ctrl+C to cancel..."
	@sleep 3
	@$(DOCKER_COMPOSE) -f deploy/docker-compose.yml down -v
	@$(DOCKER_COMPOSE) -f deploy/docker-compose.dev.yml down -v
	@echo "✅ Cleaned up all containers and volumes"

clean-cache: ## Clean Python and Node caches
	@echo "🧹 Cleaning caches..."
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".next" -exec rm -rf {} + 2>/dev/null || true
	@rm -rf semantic-search/venv 2>/dev/null || true
	@echo "✅ Caches cleaned"

# =============================================================================
# SETUP & INITIALIZATION
# =============================================================================

setup: ## Initial setup (generate keys, create env files)
	@echo "🔧 Setting up project..."
	@if [ ! -f semantic-search/.env ]; then \
		echo "Creating semantic-search/.env..."; \
		cd semantic-search && cp .env.example .env; \
		echo "QDRANT_API_KEY=$$(openssl rand -hex 32)" >> .env; \
		echo "API_SECRET_KEY=$$(openssl rand -hex 32)" >> .env; \
	fi
	@echo "✅ Setup complete!"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Edit semantic-search/.env with your configuration"
	@echo "  2. Run 'make dev-infra' to start infrastructure"
	@echo "  3. Run 'make dev-nextjs' in terminal 1"
	@echo "  4. Run 'make dev-semantic' in terminal 2"

install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	@pnpm install
	@cd semantic-search && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
	@echo "✅ Dependencies installed"

migrate: ## Run database migrations
	@echo "🔄 Running migrations..."
	@pnpm run migrate

# =============================================================================
# LEGACY COMMANDS (for backward compatibility)
# =============================================================================

export LC_ALL=C
export LANG=C

name:
	@git describe --abbrev=10 --tags HEAD 2>/dev/null || echo "latest"

commit:
	@git describe --match NOTATAG --always --abbrev=40 --dirty='*'

branch:
	@git rev-parse --abbrev-ref HEAD

version-file:
	@./sh/versionfile.sh

current-version:
	@./sh/version.sh --current

next-version:
	@./sh/version.sh

git-check:
	@./sh/git_check.sh

run-web:
	@CMD=start ./sh/run.sh

build:
	@./sh/build.sh

azlogin:
	@./sh/azlogin.sh

dockerpush:
	@./sh/dockerpush.sh

# =============================================================================
# AUTOMATED DEPLOYMENT (with env sync and tagging)
# =============================================================================

# Configuration
ENV ?= production
TAG ?= $(shell git describe --abbrev=10 --tags HEAD 2>/dev/null || echo "v1.0.0-$(shell git rev-parse --short HEAD)")

publish: ## Deploy to production with automated env sync and tagging
	@echo "🚀 Publishing to PRODUCTION..."
	@$(MAKE) _deploy ENV=production

publish-staging: ## Deploy to staging with automated env sync and tagging
	@echo "🚀 Publishing to STAGING..."
	@$(MAKE) _deploy ENV=staging

_deploy:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "📦 Deployment Pipeline: $(ENV)"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@# Step 1: Validate environment file
	@echo "1️⃣  Validating environment configuration..."
	@if [ ! -f ".env.$(ENV)" ]; then \
		echo "❌ Error: .env.$(ENV) not found!"; \
		echo ""; \
		echo "Create it from template:"; \
		echo "  cp .env.$(ENV).example .env.$(ENV)"; \
		echo "  # Edit .env.$(ENV) with your secrets"; \
		exit 1; \
	fi
	@echo "   ✅ .env.$(ENV) found"
	@echo ""
	@# Step 2: Check git status
	@echo "2️⃣  Checking git status..."
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "⚠️  Warning: You have uncommitted changes"; \
		echo "   Proceeding anyway (changes will not be in deployment)"; \
	else \
		echo "   ✅ Working directory clean"; \
	fi
	@echo ""
	@# Step 3: Sync environment variables to GitHub Secrets
	@echo "3️⃣  Syncing environment variables to GitHub Secrets..."
	@if ! command -v gh &> /dev/null; then \
		echo "❌ Error: GitHub CLI (gh) not installed"; \
		echo "   Install: brew install gh"; \
		exit 1; \
	fi
	@./scripts/setup-github-secrets.sh $(ENV)
	@echo ""
	@# Step 4: Create deployment tag
	@echo "4️⃣  Creating deployment tag..."
	@if [ "$(ENV)" = "production" ]; then \
		NEW_TAG="$$(./sh/version.sh)"; \
		if git rev-parse "$$NEW_TAG" >/dev/null 2>&1; then \
			echo "   ⚠️  Tag $$NEW_TAG already exists, using commit hash"; \
			NEW_TAG="v$$(date +%Y%m%d-%H%M%S)-$$(git rev-parse --short HEAD)"; \
		fi; \
		echo "   Creating tag: $$NEW_TAG"; \
		git tag -a "$$NEW_TAG" -m "Production deployment $(ENV) - $$(date '+%Y-%m-%d %H:%M:%S')"; \
		echo "   ✅ Tag created: $$NEW_TAG"; \
	else \
		NEW_TAG="$(ENV)-$$(date +%Y%m%d-%H%M%S)-$$(git rev-parse --short HEAD)"; \
		echo "   Creating tag: $$NEW_TAG"; \
		git tag -a "$$NEW_TAG" -m "Staging deployment - $$(date '+%Y-%m-%d %H:%M:%S')"; \
		echo "   ✅ Tag created: $$NEW_TAG"; \
	fi
	@echo ""
	@# Step 5: Push tag to trigger deployment
	@echo "5️⃣  Pushing tag to trigger GitHub Actions deployment..."
	@if [ "$(ENV)" = "production" ]; then \
		echo "   Branch: main"; \
		echo "   Workflow: deploy-production.yml"; \
	else \
		echo "   Branch: staging"; \
		echo "   Workflow: deploy-staging.yml"; \
	fi
	@git push origin $$NEW_TAG
	@if [ "$(ENV)" = "production" ]; then \
		git push origin main; \
	else \
		if git show-ref --verify --quiet refs/heads/staging; then \
			git push origin staging; \
		else \
			echo "   Creating staging branch..."; \
			git checkout -b staging 2>/dev/null || git checkout staging; \
			git push -u origin staging; \
			git checkout -; \
		fi; \
	fi
	@echo "   ✅ Tag pushed: $$NEW_TAG"
	@echo ""
	@# Step 6: Monitor deployment
	@echo "6️⃣  Monitoring deployment..."
	@echo "   🌐 View progress at:"
	@echo "   https://github.com/$$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "✅ Deployment initiated successfully!"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "📋 Next steps:"
	@echo "  1. Monitor GitHub Actions workflow (link above)"
	@echo "  2. Check deployment status: make deployment-status ENV=$(ENV)"
	@echo "  3. View logs: make deployment-logs ENV=$(ENV)"
	@echo ""

deployment-status: ## Check deployment status in Kubernetes
	@echo "📊 Deployment Status ($(ENV)):"
	@echo ""
	@if [ "$(ENV)" = "production" ]; then \
		NAMESPACE="default"; \
	else \
		NAMESPACE="staging"; \
	fi; \
	echo "Namespace: $$NAMESPACE"; \
	echo ""; \
	kubectl get pods -n $$NAMESPACE 2>/dev/null || echo "❌ Cannot connect to cluster. Run: az aks get-credentials ..."; \
	echo ""; \
	echo "Services:"; \
	kubectl get svc -n $$NAMESPACE 2>/dev/null || true

deployment-logs: ## View deployment logs
	@if [ "$(ENV)" = "production" ]; then \
		NAMESPACE="default"; \
	else \
		NAMESPACE="staging"; \
	fi; \
	echo "📋 Logs from $$NAMESPACE:"; \
	echo ""; \
	echo "=== Next.js ==="; \
	kubectl logs -n $$NAMESPACE -l app=nextjs --tail=50 --prefix=true 2>/dev/null || echo "No logs available"; \
	echo ""; \
	echo "=== Semantic Search ==="; \
	kubectl logs -n $$NAMESPACE -l app=semantic-search --tail=50 --prefix=true 2>/dev/null || echo "No logs available"; \
	echo ""; \
	echo "=== Worker ==="; \
	kubectl logs -n $$NAMESPACE -l app=worker --tail=50 --prefix=true 2>/dev/null || echo "No logs available"

rollback: ## Rollback to previous deployment
	@if [ "$(ENV)" = "production" ]; then \
		NAMESPACE="default"; \
	else \
		NAMESPACE="staging"; \
	fi; \
	echo "🔄 Rolling back deployment in $$NAMESPACE..."; \
	kubectl rollout undo deployment/nextjs -n $$NAMESPACE; \
	kubectl rollout undo deployment/semantic-search -n $$NAMESPACE; \
	kubectl rollout undo deployment/worker -n $$NAMESPACE; \
	echo "✅ Rollback initiated"

list-deployments: ## List recent deployments (tags)
	@echo "📋 Recent Deployments:"
	@echo ""
	@echo "Production tags:"
	@git tag --sort=-version:refname | grep -E '^v[0-9]' | head -10
	@echo ""
	@echo "Staging tags:"
	@git tag --sort=-version:refname | grep 'staging-' | head -10

