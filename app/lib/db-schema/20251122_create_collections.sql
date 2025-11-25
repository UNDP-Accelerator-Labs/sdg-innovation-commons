-- DB: general

CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  content TEXT,
  creator_name TEXT,
  main_image TEXT,
  sections JSONB,
  highlights JSONB,
  boards INTEGER[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- optional: a simple trigger to keep updated_at current on update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at ON collections;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON collections
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
