.PHONY: help dev-infra dev-nextjs dev-semantic dev-worker dev-status dev-logs dev-stop \
        prod-up prod-down prod-build prod-logs prod-status prod-restart \
        k8s-build k8s-push k8s-deploy k8s-status k8s-logs k8s-delete k8s-restart \
        setup install migrate clean clean-cache test-semantic test-health \
        backup-qdrant restore-qdrant

# =============================================================================
# HELP
# =============================================================================

help:
	@echo "========================================"
	@echo "SDG Innovation Commons - Make Commands"
	@echo "========================================"
	@echo ""
	@echo "🔧 Development (with hot reload):"
	@echo "  make dev-infra      Start infrastructure (Postgres, Qdrant, Redis)"
	@echo "  make dev-nextjs     Start Next.js with hot reload"
	@echo "  make dev-semantic   Start semantic search with hot reload"
	@echo "  make dev-worker     Start background worker with hot reload"
	@echo "  make dev-status     Check infrastructure status"
	@echo "  make dev-logs       View infrastructure logs"
	@echo "  make dev-stop       Stop infrastructure"
	@echo ""
	@echo "🚀 Production Deployment (Docker Compose):"
	@echo "  make prod-build     Build all production images"
	@echo "  make prod-up        Start all production services"
	@echo "  make prod-down      Stop all production services"
	@echo "  make prod-restart   Restart all production services"
	@echo "  make prod-logs      View production logs"
	@echo "  make prod-status    Check production service status"
	@echo ""
	@echo "☸️  Kubernetes Deployment:"
	@echo "  make k8s-build      Build container images for K8s"
	@echo "  make k8s-push       Push images to container registry"
	@echo "  make k8s-deploy     Deploy to Kubernetes cluster"
	@echo "  make k8s-status     Check K8s deployment status"
	@echo "  make k8s-logs       View K8s pod logs"
	@echo "  make k8s-restart    Restart K8s deployments"
	@echo "  make k8s-delete     Delete K8s deployment"
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
	@echo ""
	@echo "📦 Legacy Commands:"
	@echo "  make build          Build docker image (legacy)"
	@echo "  make publish        Deploy next version (legacy)"
	@echo "  make run-web        Run webserver (legacy)"
	@echo ""

# =============================================================================
# LOCAL DEVELOPMENT (with hot reload)
# =============================================================================

dev-infra: ## Start only infrastructure (Postgres, Qdrant, Redis)
	@echo "🚀 Starting infrastructure services..."
	@docker-compose -f deploy/docker-compose.dev.yml up -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 5
	@echo "✅ Infrastructure ready!"
	@echo "   - PostgreSQL: localhost:5432"
	@echo "   - Qdrant: localhost:6333"
	@echo "   - Redis: localhost:6379"

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
	@docker-compose -f deploy/docker-compose.dev.yml ps

dev-logs: ## View logs from infrastructure services
	@docker-compose -f deploy/docker-compose.dev.yml logs -f

dev-stop: ## Stop all development infrastructure
	@echo "🛑 Stopping infrastructure services..."
	@docker-compose -f deploy/docker-compose.dev.yml down

# =============================================================================
# PRODUCTION DEPLOYMENT
# =============================================================================

prod-build: ## Build all production images
	@echo "🔨 Building production images..."
	@docker-compose -f deploy/docker-compose.yml build --parallel

prod-up: ## Start all production services
	@echo "🚀 Starting production services..."
	@docker-compose -f deploy/docker-compose.yml up -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 10
	@$(MAKE) prod-status

prod-down: ## Stop all production services
	@echo "🛑 Stopping production services..."
	@docker-compose -f deploy/docker-compose.yml down

prod-restart: ## Restart all production services
	@$(MAKE) prod-down
	@$(MAKE) prod-up

prod-logs: ## View production logs
	@docker-compose -f deploy/docker-compose.yml logs -f

prod-status: ## Check status of production services
	@echo "📊 Production Services Status:"
	@docker-compose -f deploy/docker-compose.yml ps

# =============================================================================
# KUBERNETES DEPLOYMENT
# =============================================================================

# Configuration - Override these with environment variables
REGISTRY ?= yourregistry.azurecr.io
IMAGE_TAG ?= latest
NAMESPACE ?= sdg-innovation-commons

k8s-build: ## Build container images for Kubernetes
	@echo "🔨 Building container images..."
	@docker build -t $(REGISTRY)/sdg-nextjs:$(IMAGE_TAG) -f deploy/Dockerfile .
	@docker build -t $(REGISTRY)/sdg-semantic-search:$(IMAGE_TAG) -f semantic-search/Dockerfile semantic-search
	@docker build -t $(REGISTRY)/sdg-worker:$(IMAGE_TAG) -f deploy/Dockerfile.worker .
	@echo "✅ Images built successfully"

k8s-push: ## Push images to container registry
	@echo "📤 Pushing images to registry..."
	@docker push $(REGISTRY)/sdg-nextjs:$(IMAGE_TAG)
	@docker push $(REGISTRY)/sdg-semantic-search:$(IMAGE_TAG)
	@docker push $(REGISTRY)/sdg-worker:$(IMAGE_TAG)
	@echo "✅ Images pushed successfully"

k8s-deploy: ## Deploy to Kubernetes cluster
	@echo "☸️  Deploying to Kubernetes..."
	@kubectl apply -f deploy/kubernetes/01-namespace-config.yaml
	@kubectl apply -f deploy/kubernetes/02-storage.yaml
	@echo "⏳ Waiting for PVCs to be bound..."
	@sleep 5
	@kubectl apply -f deploy/kubernetes/03-qdrant.yaml
	@kubectl apply -f deploy/kubernetes/04-redis.yaml
	@echo "⏳ Waiting for infrastructure to be ready..."
	@sleep 10
	@kubectl apply -f deploy/kubernetes/05-semantic-search.yaml
	@kubectl apply -f deploy/kubernetes/06-nextjs.yaml
	@kubectl apply -f deploy/kubernetes/07-worker.yaml
	@kubectl apply -f deploy/kubernetes/08-ingress.yaml
	@echo "✅ Deployment complete!"
	@echo ""
	@$(MAKE) k8s-status

k8s-status: ## Check Kubernetes deployment status
	@echo "📊 Kubernetes Deployment Status:"
	@echo ""
	@echo "Namespace:"
	@kubectl get namespace $(NAMESPACE)
	@echo ""
	@echo "Pods:"
	@kubectl get pods -n $(NAMESPACE)
	@echo ""
	@echo "Services:"
	@kubectl get svc -n $(NAMESPACE)
	@echo ""
	@echo "Persistent Volume Claims:"
	@kubectl get pvc -n $(NAMESPACE)
	@echo ""
	@echo "Ingress:"
	@kubectl get ingress -n $(NAMESPACE)

k8s-logs: ## View Kubernetes pod logs
	@echo "📋 Recent logs from all pods:"
	@kubectl logs -n $(NAMESPACE) -l app=nextjs --tail=50 --prefix=true || true
	@kubectl logs -n $(NAMESPACE) -l app=semantic-search --tail=50 --prefix=true || true
	@kubectl logs -n $(NAMESPACE) -l app=worker --tail=50 --prefix=true || true

k8s-restart: ## Restart Kubernetes deployments (rolling restart)
	@echo "🔄 Restarting deployments..."
	@kubectl rollout restart deployment -n $(NAMESPACE)
	@echo "✅ Restart initiated. Use 'make k8s-status' to check progress"

k8s-delete: ## Delete Kubernetes deployment
	@echo "⚠️  This will delete all resources. Ctrl+C to cancel..."
	@sleep 3
	@kubectl delete -f deploy/kubernetes/08-ingress.yaml || true
	@kubectl delete -f deploy/kubernetes/07-worker.yaml || true
	@kubectl delete -f deploy/kubernetes/06-nextjs.yaml || true
	@kubectl delete -f deploy/kubernetes/05-semantic-search.yaml || true
	@kubectl delete -f deploy/kubernetes/04-redis.yaml || true
	@kubectl delete -f deploy/kubernetes/03-qdrant.yaml || true
	@echo "⚠️  Keeping storage (PVCs). To delete: kubectl delete -f deploy/kubernetes/02-storage.yaml"
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
	@docker-compose -f deploy/docker-compose.yml stop qdrant || true
	@docker-compose -f deploy/docker-compose.dev.yml stop qdrant || true
	@echo "Restoring from $(BACKUP_FILE)..."
	@docker run --rm \
		-v sdg-qdrant-storage:/target \
		-v $$(pwd)/$$(dirname $(BACKUP_FILE)):/backup \
		alpine sh -c "cd /target && rm -rf * && tar xzf /backup/$$(basename $(BACKUP_FILE))"
	@echo "Starting Qdrant..."
	@docker-compose -f deploy/docker-compose.yml start qdrant || docker-compose -f deploy/docker-compose.dev.yml start qdrant
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
	@docker-compose -f deploy/docker-compose.yml down -v
	@docker-compose -f deploy/docker-compose.dev.yml down -v
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
	@git describe --abbrev=10 --tags HEAD

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

publish:
	@./sh/deploy.sh

azlogin:
	@./sh/azlogin.sh

dockerpush:
	@./sh/dockerpush.sh
