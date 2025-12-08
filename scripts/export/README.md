# Export System Modules

This directory contains the modular export worker system for SDG Innovation Commons. The export system handles asynchronous generation of data exports in XLSX, CSV, and JSON formats with support for PII scrubbing, streaming large datasets, and Azure Blob Storage upload.

## Module Overview

### Core Types & Utilities

#### `types.ts`

TypeScript type definitions for the export system.

**Exports:**

- `ExportJob`: Job record structure from database
- `ExportParams`: Export request parameters and options
- `ProcessedExport`: Final export result with blob URL
- `UserInfo`: User enrichment data structure

#### `utils.ts`

General utility functions used across the export system.

**Key Functions:**

- `sleep(ms)`: Async delay helper
- `waitStreamFinish(stream)`: Wait for stream completion
- `scrubPII(val, excludePii, recordId?)`: Remove PII (emails, phones, IDs) with optional logging
- `mapCategoryForDb(key)`: Map content type to category
- `mapDataType(key, row)`: Determine output data type label

### Cloud Storage & Notifications

#### `azure-storage.ts`

Azure Blob Storage integration with SAS token generation.

**Key Functions:**

- `uploadStreamToAzure(stream, destName, contentType)`: Upload stream to Azure with automatic SAS token generation and error handling

#### `notifications.ts`

Email notification system for export completion.

**Key Functions:**

- `sendExportNotification(to, blobUrl, cc?)`: Send export completion email via SMTP with download link

### Database Layer

#### `database.ts`

Core database operations including streaming queries and data enrichment.

**Key Functions:**

- `enrichUserCached(userId)`: Fetch and cache user data (name, email, country)
- `fetchAdm0Map()`: Load ISO3 → country name mapping
- `streamQueryToHandler(dbKey, sql, params, handler)`: Stream large result sets with memory efficiency
- `hasColumn(dbKey, table, column)`: Check column existence
- `hasTable(dbKey, table)`: Check table existence
- `detectBlogContributorColumn()`: Auto-detect blog contributor column name
- `detectBlogContentColumn()`: Auto-detect blog content column name

#### `sql-builders.ts`

SQL query construction for different content types.

**Key Functions:**

- `buildBlogSelectSql(key, includeTags?)`: Generate SQL for blog/publication exports
- `buildPadsSelectSql(statusFilter?)`: Generate SQL for pad exports with optional status filtering

### Domain-Specific Helpers

#### `pad-helpers.ts`

Pad-related data enrichment and mapping.

**Key Functions:**

- `fetchPadRelatedMaps()`: Fetch tag names, template titles, and source pad titles for resolution in exports

#### `export-notes.ts`

Generate documentation sheets for exports.

**Key Functions:**

- `buildExportNotes(job, dbKeys, excludePii)`: Create comprehensive export documentation with field descriptions and usage guidance

### Job Queue Management

#### `job-manager.ts`

Worker job queue coordination and lifecycle management.

**Key Functions:**

- `ensureJobColumns()`: Initialize/migrate export_jobs table schema
- `reaper(staleMinutes, batchSize)`: Reclaim stuck/abandoned jobs
- `claimPendingJobs(limit, workerId)`: Atomically claim pending jobs for processing
- `markJobDone(jobId, blobUrl, expiresAt)`: Mark job as successfully completed
- `markJobFailed(jobId, error)`: Mark job as failed with error details
- `sendHeartbeat(workerId)`: Update worker heartbeat timestamp

### Export Handlers

#### `xlsx-export.ts`

XLSX file generation using ExcelJS streaming.

**Key Functions:**

- `uploadXlsxWithRetries(job, maxRetries)`: Generate and upload XLSX export with retry logic
  - Streams data directly to Azure (memory efficient)
  - Handles blogs, solutions, experiments, learning plans
  - Generates fallback sheets for unknown data types
  - Creates Notes sheet with export documentation
  - Automatic retry with exponential backoff

**Features:**

- Blog-specific handling (force-disable metadata/contributor for privacy)
- PII scrubbing across title, full_text, sections
- Tag/template/source pad title resolution
- Country enrichment via ISO3 codes
- Configurable metadata inclusion (tags, locations, metafields, engagement, comments)

#### `csv-json-export.ts`

CSV and JSON export generation with streaming.

**Key Functions:**

- `uploadKeyStreamWithRetries(job, key, format, maxRetries)`: Stream CSV or JSON export to Azure
- `handleCsvExport(...)`: CSV-specific generation with header row
- `handleJsonExport(...)`: JSON array format generation
- `enrichRow(...)`: Enrich database rows with user info, country, tags, metadata

**Features:**

- Streaming architecture (low memory usage for large exports)
- Row-by-row enrichment with user/country data
- PII scrubbing across all text fields (title, full_text, sections, tags, locations, metafields, comments, description, content)
- Tag/template/source pad title resolution
- Automatic retry with exponential backoff

#### `process-job.ts`

Job processing orchestration and format routing.

**Key Functions:**

- `processJob(job)`: Main job processor
  - Routes to XLSX or CSV/JSON handler based on format
  - Generates manifest JSON for multi-file exports
  - Handles ExcelJS availability gracefully

### Module Aggregator

#### `index.ts`

Central export point that re-exports all modules for convenient importing.

## Data Flow

```
User Request
    ↓
Export Job Created (export_jobs table)
    ↓
Worker Claims Job (claimPendingJobs)
    ↓
Process Job (processJob)
    ↓
    ├─→ XLSX Export (uploadXlsxWithRetries)
    │   ├─ Stream from database
    │   ├─ Enrich with user/country data
    │   ├─ Scrub PII
    │   ├─ Generate workbook
    │   └─ Upload to Azure
    │
    └─→ CSV/JSON Export (uploadKeyStreamWithRetries)
        ├─ Stream from database
        ├─ Enrich rows with metadata
        ├─ Scrub PII
        ├─ Format as CSV or JSON
        └─ Upload to Azure
    ↓
Mark Job Complete (markJobDone)
    ↓
Send Email Notification
    ↓
User Downloads Export
```

## Configuration

### Environment Variables

Required for export worker:

- `GENERAL_DB_*`: General database connection (job queue)
- `BLOG_DB_*`: Blog database connection (if exporting blogs)
- `SOLUTIONS_DB_*`, `EXPERIMENT_DB_*`: Pad database connections
- `AZURE_STORAGE_ACCOUNT`: Azure storage account name
- `AZURE_STORAGE_KEY`: Azure storage access key
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Email notification settings

### Export Options

Jobs support these parameters:

- `format`: 'xlsx' | 'csv' | 'json'
- `db_keys`: Array of data sources to export
- `exclude_pii`: Boolean to enable PII scrubbing
- `exclude_owner_uuid`: Boolean to exclude owner/contributor UUIDs
- `include_name`, `include_email`, `include_uuid`: Fine-grained PII control
- `include_tags`, `include_locations`, `include_metafields`, `include_engagement`, `include_comments`: Metadata control
- `statuses`: Filter pads by status (for solutions, experiments, learning plans)

## PII Protection

The export system provides comprehensive PII protection:

### Scrubbing Patterns

- **Email addresses**: `user@example.com` → `[REDATED_EMAIL]`
- **Phone numbers**: `+1-234-567-8900` → `[REDATED_PHONE]`
- **National IDs**: `123456789` → `[REDATED_ID]`

### Scrubbed Fields

- `title`, `full_text`, `sections`, `content`, `description`
- `tags`, `locations`, `metafields`, `comments`
- Any string fields when `exclude_pii: true`

## Performance Considerations

- **Memory Usage**: Streaming architecture keeps memory low (~100MB for 100K+ records)
- **Query Performance**: Uses indexes on `status`, `created_at`, `contributor_id`
- **Concurrent Workers**: Multiple workers can run simultaneously
- **Rate Limiting**: No external API calls during export (all data pre-fetched or cached)

## Error Handling

- **Retry Logic**: Automatic retry with exponential backoff (max 3 attempts)
- **Job Reaping**: Stuck jobs automatically recovered after 10 minutes
- **Graceful Degradation**: Missing ExcelJS falls back to CSV
- **Schema Detection**: Auto-detects blog table schema variations
- **Validation**: Type checking and runtime validation

## Future Enhancements

- Add comprehensive unit tests for each module
- Add integration tests for full export workflows
- Add metrics and telemetry (export duration, size, success rate)
- Add support for incremental exports (date range filtering)
- Add compression for large exports (gzip)
- Add export templates/presets
- Add real-time progress updates via WebSocket
