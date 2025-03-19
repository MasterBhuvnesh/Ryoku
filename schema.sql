CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT AS $$
    SELECT NULLIF(
        current_setting('request.jwt.claims', true)::json->>'sub',
        ''
    )::text;
$$ LANGUAGE SQL STABLE;

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT
);

-- Index on clerk_id (already unique, but useful for performance)
CREATE UNIQUE INDEX idx_profiles_clerk_id ON profiles (clerk_id);

