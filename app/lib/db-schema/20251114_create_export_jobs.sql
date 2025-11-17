-- DB: general

CREATE TABLE IF NOT EXISTS export_jobs (
  id BIGSERIAL PRIMARY KEY,
  requester_uuid UUID,
  db_keys TEXT[] NOT NULL,
  kind TEXT,
  format TEXT,
  params JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  blob_url TEXT,
  expires_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS export_jobs_status_idx ON export_jobs(status);
