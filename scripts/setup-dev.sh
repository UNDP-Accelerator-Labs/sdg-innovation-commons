#!/bin/bash
# Development Setup Script for SDG Innovation Commons
# This script sets up your local development environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}===========================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}===========================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

# Header
print_header "SDG Innovation Commons - Development Setup"

# Check prerequisites
print_header "Checking Prerequisites"

PREREQS_OK=true

if ! check_command "node"; then
    print_warning "Node.js is required. Install from https://nodejs.org/"
    PREREQS_OK=false
fi

if ! check_command "pnpm"; then
    print_warning "pnpm is required. Install with: npm install -g pnpm"
    PREREQS_OK=false
fi

if ! check_command "docker"; then
    print_warning "Docker is required. Install from https://docker.com/"
    PREREQS_OK=false
fi

if ! check_command "docker-compose"; then
    print_warning "Docker Compose is required. Install from https://docs.docker.com/compose/"
    PREREQS_OK=false
fi

if ! check_command "python3"; then
    print_warning "Python 3 is required for semantic search. Install from https://python.org/"
    PREREQS_OK=false
fi

if [ "$PREREQS_OK" = false ]; then
    print_error "Some prerequisites are missing. Please install them and run this script again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi
print_success "Node.js version $(node -v) is sufficient"

# Setup environment files
print_header "Setting Up Environment Files"

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env from .env.example"
        print_warning "Please update .env with your actual credentials"
    else
        print_error ".env.example not found"
    fi
else
    print_info ".env already exists, skipping..."
fi

if [ ! -f "semantic-search/.env" ]; then
    if [ -f "semantic-search/.env.example" ]; then
        cp semantic-search/.env.example semantic-search/.env
        print_success "Created semantic-search/.env from .env.example"
        print_warning "Please update semantic-search/.env with your actual credentials"
    else
        print_warning "semantic-search/.env.example not found, creating basic .env"
        cat > semantic-search/.env << EOF
# Semantic Search Configuration
API_SECRET_KEY=dev-secret-key-$(openssl rand -hex 16)
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_API_KEY=dev-secret-key
REDIS_PASSWORD=devpassword
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
DEVICE=cpu
LOG_LEVEL=INFO
EOF
        print_success "Created basic semantic-search/.env"
    fi
else
    print_info "semantic-search/.env already exists, skipping..."
fi

# Install Node.js dependencies
print_header "Installing Node.js Dependencies"
pnpm install
print_success "Node.js dependencies installed"

# Setup Python environment for semantic search
print_header "Setting Up Semantic Search Python Environment"
cd semantic-search

if [ ! -d "venv" ]; then
    print_info "Creating Python virtual environment..."
    python3 -m venv venv
    print_success "Python virtual environment created"
fi

print_info "Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
print_success "Python dependencies installed"
deactivate

cd ..

# Start infrastructure services
print_header "Starting Infrastructure Services"
print_info "Starting PostgreSQL, Qdrant, and Redis..."
docker-compose -f deploy/docker-compose.dev.yml up -d

print_info "Waiting for services to be ready (15 seconds)..."
sleep 15

# Check if services are running
if docker ps | grep -q sdg-postgres-dev; then
    print_success "PostgreSQL is running"
else
    print_error "PostgreSQL failed to start"
fi

if docker ps | grep -q sdg-qdrant-dev; then
    print_success "Qdrant is running"
else
    print_error "Qdrant failed to start"
fi

if docker ps | grep -q sdg-redis-dev; then
    print_success "Redis is running"
else
    print_error "Redis failed to start"
fi

# Run database migrations
print_header "Running Database Migrations"
if [ -f "scripts/run_migrations.cjs" ]; then
    pnpm run migrate
    print_success "Database migrations completed"
else
    print_warning "Migration script not found, skipping..."
fi

# Final instructions
print_header "Setup Complete! 🎉"
echo ""
print_info "Infrastructure services are running:"
echo "  - PostgreSQL:      localhost:5432"
echo "  - Qdrant:          localhost:6333 (HTTP) / localhost:6334 (gRPC)"
echo "  - Redis:           localhost:6379"
echo ""
print_info "To start development:"
echo ""
echo "  1. Start Next.js (in terminal 1):"
echo "     ${GREEN}pnpm run dev${NC}"
echo ""
echo "  2. Start Semantic Search (in terminal 2):"
echo "     ${GREEN}cd semantic-search && ./dev.sh${NC}"
echo "     or: ${GREEN}make dev-semantic${NC}"
echo ""
echo "  3. Start Background Worker (in terminal 3 - optional):"
echo "     ${GREEN}./scripts/dev-worker.sh${NC}"
echo "     or: ${GREEN}make dev-worker${NC}"
echo ""
print_info "Useful commands:"
echo "  - View infrastructure logs:   ${GREEN}make dev-logs${NC}"
echo "  - Stop infrastructure:        ${GREEN}make dev-stop${NC}"
echo "  - Restart infrastructure:     ${GREEN}make dev-infra${NC}"
echo ""
print_info "Access points:"
echo "  - Next.js App:          http://localhost:3000"
echo "  - Semantic Search API:  http://localhost:8000"
echo "  - Semantic Search Docs: http://localhost:8000/docs"
echo "  - Qdrant Dashboard:     http://localhost:6333/dashboard"
echo ""
print_warning "Don't forget to update your .env files with actual credentials!"
echo ""
