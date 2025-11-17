-- Migration: create notifications table
-- Date: 2025-11-17

-- Use pgcrypto for gen_random_uuid() if available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  level text NOT NULL DEFAULT 'info', -- 'info' | 'action_required'
  payload jsonb NOT NULL,
  related_uuids uuid[] DEFAULT ARRAY[]::uuid[],
  status text NOT NULL DEFAULT 'open', -- 'open' | 'acknowledged' | 'closed'
  actor_uuid uuid, -- optional actor that authored the thing that generated this notification
  action_taken_by uuid, -- admin UUID who acted on the notification
  action_taken_at timestamptz,
  action_notes text,
  expires_at timestamptz,
  metadata jsonb, -- free-form structured metadata for UI / indexing
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes to support typical queries
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_payload_gin ON notifications USING gin (payload);
CREATE INDEX IF NOT EXISTS idx_notifications_related_uuids_gin ON notifications USING gin (related_uuids);

-- Helper trigger to maintain updated_at
CREATE OR REPLACE FUNCTION notifications_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notifications_updated_at ON notifications;
CREATE TRIGGER trg_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE PROCEDURE notifications_set_updated_at();
