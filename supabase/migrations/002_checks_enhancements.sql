ALTER TABLE public.checks
  ADD COLUMN IF NOT EXISTS text text,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

ALTER TABLE public.checks
  ALTER COLUMN content_hash DROP NOT NULL,
  ALTER COLUMN content_hash SET DEFAULT encode(gen_random_bytes(16), 'hex');
