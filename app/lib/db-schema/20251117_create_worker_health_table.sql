-- Migration: create worker_health table
-- Date: 2025-11-17

CREATE TABLE IF NOT EXISTS worker_health (
  worker_id text PRIMARY KEY,
  last_seen timestamptz NOT NULL,
  pid integer,
  uptime double precision,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_worker_health_last_seen ON worker_health(last_seen);

CREATE OR REPLACE FUNCTION worker_health_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_worker_health_updated_at ON worker_health;
CREATE TRIGGER trg_worker_health_updated_at
BEFORE UPDATE ON worker_health
FOR EACH ROW EXECUTE PROCEDURE worker_health_set_updated_at();
