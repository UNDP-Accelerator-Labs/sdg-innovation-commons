-- DB: general
-- Migration: add deleted and left_at columns to users
-- Run: adds a deleted boolean and left_at timestamp used to mark deactivated users
ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS deleted boolean DEFAULT false;

ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS left_at timestamptz;
