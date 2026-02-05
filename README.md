# SDG Innovation Commons

A Next.js application that enables collaboration, discovery and sharing of innovations supporting the Sustainable Development Goals (SDGs). This repository contains the web application, admin UI, server-side APIs, a background worker, and a semantic search microservice.

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - **START HERE!** Complete setup and deployment guide covering:

  - Local development setup (all three services)
  - Environment variables explained for Next.js, Worker, and Semantic Search
  - How the services work together
  - Production deployment (Automated CI/CD with Azure Kubernetes Service)
  - Troubleshooting common issues

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guidelines for contributing to the project

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/UNDP-Accelerator-Labs/sdg-innovation-commons.git
cd sdg-innovation-commons
pnpm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# 3. Start development
pnpm run dev
# Visit http://localhost:3000
```

For complete setup instructions, see **[SETUP.md](SETUP.md)**.

## Table of contents

- [About](#about)
- [Key features](#key-features)
- [Architecture overview](#architecture-overview)
- [Repository layout](#repository-layout)
- [Environment variables and secrets](#environment-variables-and-secrets)
- [Database / schema notes](#database--schema-notes)
- [Admin notifications (API + UI)](#admin-notifications-api--ui)
- [Background worker (container)](#background-worker-container)
- [CI / CD (GitHub Actions)](#ci--cd-github-actions)
- [Monitoring & health](#monitoring--health)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## About

SDG Innovation Commons is a modern web application built with Next.js. It includes a public-facing site and an admin console for managing platform operations, notifications, and exports. The codebase follows Next.js app-router conventions and keeps server logic in app/api and app/lib.

## Key features

- Public Next.js site for contributors and visitors
- Admin interface for managing notifications, users, exports and other platform operations
- Persisted admin notifications with action-taking workflow and audit notes
- Templated admin alert emails (HTML + plain-text fallback)
- **Semantic Search**: Vector-based search using Qdrant and sentence transformers
- Background worker for processing exports and other asynchronous tasks
- Worker built and deployed as a dedicated container
- Health/heartbeat monitoring and an admin-facing health card
- Automated CI/CD with GitHub Actions

## Architecture overview

The application consists of **three interconnected services**:

```
┌─────────────────────────────────────────┐
│   Next.js Web App                        │
│   - Public site & Admin UI               │
│   - API routes                           │
│   - Server-side rendering                │
└────────┬────────────────────────┬────────┘
         │                        │
         ▼                        ▼
┌────────────────────┐   ┌────────────────────┐
│ Background Worker   │   │ Semantic Search    │
│ - Export processing │   │ - FastAPI service  │
│ - Email sending     │   │ - Vector search    │
│ - Job queues        │   │ - Qdrant database  │
└────────────────────┘   └────────────────────┘
         │                        │
         └────────┬───────────────┘
                  ▼
        ┌─────────────────────┐
        │ Shared Data Layer    │
        │ - PostgreSQL (Azure) │
        │ - Redis Cache        │
        │ - Azure Blob Storage │
        └─────────────────────┘
```

**Technologies:**

- **Next.js 14** (App Router) - Main application
- **Python FastAPI** - Semantic search microservice
- **Node.js** - Background worker
- **PostgreSQL** (Azure managed) - Primary database
- **Qdrant** - Vector database for semantic search
- **Redis** - Cache and job queue
- **Azure Blob Storage** - File storage

**For detailed architecture and setup, see [SETUP.md](SETUP.md).**

## Repository layout (important paths)

- app/ — Next.js application (pages, API routes, components)
  - app/api/ — API routes (admin, content, search, etc.)
  - app/admin/ — Admin UI pages and client components
  - app/lib/ — Server-side helpers: db.ts, session.ts, platform-api.ts
  - app/lib/services/ — Service clients (semantic-search-client.ts)
- semantic-search/ — **Python FastAPI semantic search service**
  - main.py — FastAPI application
  - search.py — Core semantic search logic
  - qdrant_service.py — Qdrant vector database client
  - embeddings.py — Sentence transformer embedding generation
  - Dockerfile — Production container image
- scripts/ — Background worker scripts
  - process_exports.cjs — Export processing
  - run_worker.js — Worker entry point
  - worker_heartbeat.js — Health monitoring
- deploy/ — Deployment configurations
  - docker-compose.yml — Production Docker Compose
  - docker-compose.dev.yml — Development infrastructure
  - kubernetes/ — Kubernetes manifests for AKS
  - Dockerfile — Next.js production image
  - Dockerfile.worker — Worker production image
- .github/workflows/ — CI/CD automation
  - deploy-production.yml — Production deployment
  - deploy-staging.yml — Staging deployment

## Environment Variables and Secrets

The application uses **separate environment files** for each service:

| Service          | Development File                   | Production File          | Purpose                    |
| ---------------- | ---------------------------------- | ------------------------ | -------------------------- |
| Next.js + Worker | `.env.local`                       | `env.production` (CI/CD) | App config, database, APIs |
| Semantic Search  | `semantic-search/.env.development` | `env.production` (CI/CD) | Qdrant, embeddings, API    |

**Quick setup:**

```bash
# Development
cp .env.example .env.local
cp semantic-search/.env.example semantic-search/.env.development
# Edit with your credentials

# Production (CI/CD)
cp .env.production.example env.production
cp .env.staging.example env.staging
# Edit with actual secrets, then run:
./scripts/setup-github-secrets.sh production
```

**For complete environment variable documentation, see [SETUP.md - Environment Variables](SETUP.md#environment-variables).**

## Database / Schema Notes

The application uses PostgreSQL (Azure managed in production). Schema migrations are in `app/lib/db-schema/` or managed through your migration tool.

**Development database:**

```bash
# Set DATABASE_URL in .env.local
DATABASE_URL='postgresql://user:password@server.postgres.database.azure.com:5432/dbname?sslmode=require'

# Run migrations (if applicable)
pnpm run migrate
```

For production database setup, see [SETUP.md](SETUP.md).
cp semantic-search/.env.example semantic-search/.env.development

# Edit with your credentials

# Production (CI/CD)

cp .env.production.example env.production
cp .env.staging.example env.staging

# Edit with actual secrets, then run:

./scripts/setup-github-secrets.sh production

````

**For complete environment variable documentation, see [SETUP.md - Environment Variables](SETUP.md#environment-variables).**

```bash
pnpm run dev
````

Open http://localhost:3000 in your browser.

Semantic search API will be available at http://localhost:8000

### Run the worker locally (optional)

- Run the worker directly: `node scripts/process_exports.cjs` or `node scripts/run_worker.js`.
- Run the heartbeat and worker together (POSIX): `scripts/run.sh` (make executable: `chmod +x scripts/run.sh`).

## Environment variables and secrets

The application requires a set of environment variables for full functionality. Set these in your development environment or a `.env` file (do not commit secrets):

- APP_SECRET — secret used to sign/verify session tokens
- DATABASE_URL or database connection variables used by `app/lib/db.ts`
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (or SMTP_SERVICE) — SMTP config for sending admin emails
- ADMIN_EMAILS — semicolon/comma-separated list of admin email recipients
- LOCAL_BASE_URL — base URL used for building admin links in non-production
- REGISTRY_USERNAME / REGISTRY_PASSWORD — container registry credentials for CI
- AZURE_PUBLISH_PROFILE_STAGING / AZURE_PROD_PUBLISH_PROFILE — Azure publish profiles (used by GitHub Actions)
- AZURE_PUBLISH_PROFILE_WORKER — publish profile for the dedicated worker App Service (used by CI to deploy worker image)
- NODE_ENV — set to `production` for production behavior (actual email sending)

### Semantic Search Service

The application now includes an internal semantic search service (Python FastAPI). See `semantic-search/README.md` for detailed setup.

Required environment variables:

- SEMANTIC_SEARCH_URL — URL of the semantic search service (default: `http://localhost:8000`)
- SEMANTIC_SEARCH_API_KEY — API key for service authentication (generate with `openssl rand -hex 32`)

See `.env.semantic-search.example` for complete configuration options.

## Database / schema notes

The notifications system persists records in a `notifications` table. The important fields are:

- id — primary key
- type — text
- level — `info` | `action_required`
- payload — jsonb (arbitrary structured payload: subject, message, etc.)
- metadata — jsonb (UI hints, adminUrl, etc.)
- related_uuids — text[]
- status — string (open / acknowledged / closed)
- action_notes — text
- action_taken_by / action_taken_at — who and when (server-recorded)
- created_at, updated_at, expires_at

Migrations and schema definitions live under `app/lib/db-schema/`. When changing schema, add a migration and update code that reads or writes notification fields.

### Running migrations

Migrations live under `app/lib/db-schema/` and are applied in order by the included migration runner `scripts/run_migrations.ts`.

Two recommended ways to run migrations from a developer workstation or CI:

- Use the TypeScript migration runner (recommended):

  - Apply all pending migrations for all DBs:
    pnpm dlx ts-node scripts/run_migrations.ts
  - Apply only migrations targeting the `general` DB:
    pnpm dlx ts-node scripts/run_migrations.ts --db=general
  - Include `init*.sql` files (dangerous for production):
    pnpm dlx ts-node scripts/run_migrations.ts --include-inits
    The runner records applied filenames in a `schema_migrations` table so migrations are idempotent.

- Apply a single SQL migration directly (psql):
  - Example (bash / zsh):
    export GENERAL_DB_URL='postgresql://user:pass@host:port/db'
    psql "$GENERAL_DB_URL" -f app/lib/db-schema/20251117_create_worker_health_table.sql

Notes:

- The migration runner defaults to the `general` DB key when no header is present in a SQL file. Files may include a header comment like `-- DB: general,blogs` to target multiple DBs.
- The new worker health migration is `app/lib/db-schema/20251117_create_worker_health_table.sql` — run it before deploying the containerized worker so the worker can upsert heartbeats into the DB.
- In CI you can run the migration runner, but that requires secure DB credentials available to the workflow. If you want, I can add an optional CI step to run migrations during deployment.

## Admin notifications (API + UI)

### APIs

- GET /api/admin/notifications
  - List mode: supports `limit`, `offset`, and filters (type, status, level) and returns an array of notifications.
  - Single mode: when called with `?id=...`, returns that notification and, if available, `action_taken_by_details` (contributor lookup: name, email).
- PATCH /api/admin/notifications
  - Accepts `{ id, status, action_notes }` and validates `status` against allowed values. The server ignores client-supplied `action_taken_by` and `action_taken_at` and records the acting admin (from session) and timestamp server-side.

### Client

- `app/admin/notifications/NotificationsClient.client.tsx` contains the admin table with filtering, pagination, action dropdown, and a shared modal for details/actions.
- ActionForm includes an auditing note instructing admins to record actions; notes are stored in DB for audit purposes only.
- Info-level notifications are displayed as no-action-needed and are auto-closed by the client.

### Email templates and sending

- When a notification is created with `level === 'action_required'`, the server constructs a full HTML email with a plain-text fallback and sends it to `ADMIN_EMAILS` using the configured SMTP transport. In non-production the mail is logged.
- HTML is escaped before interpolation and payload fields are expanded in both HTML and plain-text versions.

## Background worker (container)

- Worker code and helpers live in `scripts/`.
- In production the worker runs as a separate container deployed to the `sdg-innovation-commons-worker` Azure App Service. The worker image is built in CI and deployed independently from the main app image.
- `worker_heartbeat.js` writes a small JSON heartbeat (`worker.heartbeat.json`) periodically so the main app can check worker status via the protected health endpoint.
- For local or container runs, use `scripts/run.sh` which starts the heartbeat and the worker. The container image entrypoint also executes `scripts/run.sh` by default.

## CI / CD (GitHub Actions)

- The workflow at `.github/workflows/app.yaml` performs:
  - Build and push the Docker image for the main app.
  - Build and push a dedicated worker Docker image and deploy it to the `sdg-innovation-commons-worker` App Service using the `AZURE_PUBLISH_PROFILE_WORKER` secret.
- The workflow ensures corepack/pnpm is enabled on runners so pnpm installs are deterministic; it falls back to `npm install --omit=dev` when pnpm is unavailable.

## Monitoring & health

- Health endpoint: `GET /api/admin/worker-health` returns the latest heartbeat (pid, uptime, lastSeen).
- Access control: the health endpoint requires an admin session or a bearer JWT that can be issued via the server session helper.
- Admin UI: `app/admin/analytics/` contains a Worker health card component that polls the health endpoint and shows lastSeen, PID and uptime and warns when heartbeat is stale.

## Security & auditing

- All admin endpoints use the session helper (`app/lib/session.ts`) to determine the acting user. Several admin routes require elevated rights.
- The PATCH route for notifications enforces allowed statuses and records actor/timestamp on the server side to prevent spoofing.
- Action notes are stored for internal auditing and are not forwarded externally.

## Testing

- Unit and integration tests are recommended for the notifications PATCH behavior and for email sending (mock the SMTP transporter).
- Add tests under a `test/` folder and wire into CI if required.

## Contributing

- Follow the contributor guide in `CONTRIBUTING.md`.
- When adding features that require database changes, include SQL migrations in `app/lib/db-schema/` and update README/API docs.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
