-- DB: general

-- Add external_resources column to collections table
-- This column stores an array of external resource objects with title, description, and url
ALTER TABLE collections 
ADD COLUMN IF NOT EXISTS external_resources JSONB DEFAULT '[]'::jsonb;

-- Add a comment to document the structure
COMMENT ON COLUMN collections.external_resources IS 'Array of external resource objects: [{"title": "...", "description": "...", "url": "..."}]';
