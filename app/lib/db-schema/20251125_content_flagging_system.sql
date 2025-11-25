-- Migration: Complete Content Flagging System
-- Date: 2025-11-25
-- Purpose: Single table approach for content flags with admin actions and audit trail

-- Use pgcrypto for gen_random_uuid() if available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing table and views if they exist
DROP VIEW IF EXISTS content_flags_with_latest_action CASCADE;
DROP VIEW IF EXISTS content_flags_with_urls CASCADE;
DROP TABLE IF EXISTS content_flags CASCADE;

-- Create the main content_flags table (single table for flags and all admin actions)
CREATE TABLE content_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content information (always present)
  content_id text NOT NULL,
  platform text NOT NULL,
  content_type text NOT NULL DEFAULT 'pad',
  content_title text,
  content_url text,
  
  -- Reporter information (only for initial flags)
  reporter_uuid uuid,
  reporter_name text,
  reason text, -- Required for initial flags
  description text,
  
  -- Action information (for all records)
  action_type text NOT NULL DEFAULT 'flag' CHECK (action_type IN (
    'flag',        -- Initial user report
    'dismiss',     -- Admin dismisses flag
    'resolve',     -- Admin resolves flag  
    'respond',     -- Admin responds to reporter
    'remove',      -- Admin removes content
    'reopen'       -- Admin reopens flag
  )),
  
  -- Status and admin information
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'reviewed', 'resolved', 'dismissed'
  )),
  admin_response text,
  admin_uuid uuid,
  admin_name text,
  
  -- Reference to original flag (for admin actions)
  parent_flag_id uuid REFERENCES content_flags(id) ON DELETE CASCADE,
  
  -- Timestamps
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Constraints
  -- Original flags must have reporter and reason
  CHECK (
    (action_type = 'flag' AND reporter_uuid IS NOT NULL AND reason IS NOT NULL) OR
    (action_type != 'flag' AND parent_flag_id IS NOT NULL AND admin_uuid IS NOT NULL)
  ),
  
  -- Admin actions must reference a parent flag
  CHECK (
    (action_type = 'flag' AND parent_flag_id IS NULL) OR
    (action_type != 'flag' AND parent_flag_id IS NOT NULL)
  )
);

-- Create indexes for performance
CREATE INDEX idx_content_flags_content_id ON content_flags(content_id);
CREATE INDEX idx_content_flags_platform ON content_flags(platform);
CREATE INDEX idx_content_flags_status ON content_flags(status);
CREATE INDEX idx_content_flags_action_type ON content_flags(action_type);
CREATE INDEX idx_content_flags_parent_flag_id ON content_flags(parent_flag_id);
CREATE INDEX idx_content_flags_reporter_uuid ON content_flags(reporter_uuid);
CREATE INDEX idx_content_flags_admin_uuid ON content_flags(admin_uuid);
CREATE INDEX idx_content_flags_created_at ON content_flags(created_at);
CREATE INDEX idx_content_flags_content_url ON content_flags(content_url);

-- Create a view that combines original flags with their latest action status
CREATE VIEW content_flags_with_latest_action AS
WITH latest_actions AS (
  SELECT 
    parent_flag_id,
    status as latest_status,
    action_type as latest_action_type,
    admin_response as latest_admin_response,
    admin_uuid as latest_admin_uuid,
    admin_name as latest_admin_name,
    reviewed_at as latest_reviewed_at,
    created_at as latest_action_at,
    ROW_NUMBER() OVER (PARTITION BY parent_flag_id ORDER BY created_at DESC) as rn
  FROM content_flags 
  WHERE action_type != 'flag' AND parent_flag_id IS NOT NULL
),
action_counts AS (
  SELECT 
    parent_flag_id,
    COUNT(*) as action_count
  FROM content_flags 
  WHERE action_type != 'flag' AND parent_flag_id IS NOT NULL
  GROUP BY parent_flag_id
)
SELECT 
  cf.*,
  COALESCE(la.latest_status, cf.status) as current_status,
  la.latest_action_type,
  la.latest_admin_response,
  la.latest_admin_uuid,
  la.latest_admin_name,
  la.latest_reviewed_at,
  la.latest_action_at,
  COALESCE(ac.action_count, 0) as total_actions,
  cf.content_url as display_url
FROM content_flags cf
LEFT JOIN latest_actions la ON cf.id = la.parent_flag_id AND la.rn = 1
LEFT JOIN action_counts ac ON cf.id = ac.parent_flag_id
WHERE cf.action_type = 'flag';

-- Add comments for documentation
COMMENT ON TABLE content_flags IS 'Unified table for content flags and all admin actions with complete audit trail';
COMMENT ON COLUMN content_flags.content_url IS 'The actual URL of the flagged content as captured when the flag was created. Used for direct linking in admin interface.';
COMMENT ON COLUMN content_flags.action_type IS 'Type of action: flag (initial report) or admin actions (dismiss, resolve, respond, remove, reopen)';
COMMENT ON COLUMN content_flags.parent_flag_id IS 'References the original flag for admin actions, NULL for initial flags';
COMMENT ON VIEW content_flags_with_latest_action IS 'View showing original flags with their latest admin action status and guaranteed URLs';

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION update_content_flags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER content_flags_updated_at_trigger
    BEFORE UPDATE ON content_flags
    FOR EACH ROW
    EXECUTE FUNCTION update_content_flags_updated_at();

-- Grant permissions (adjust as needed for your application)
-- GRANT SELECT, INSERT, UPDATE ON content_flags TO your_app_user;
-- GRANT SELECT ON content_flags_with_latest_action TO your_app_user;
-- GRANT USAGE ON SCHEMA public TO your_app_user;

COMMIT;
