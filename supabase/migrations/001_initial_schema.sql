-- IA Shield initial schema
-- Tabla / Table: checks
CREATE TABLE IF NOT EXISTS public.checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('telegram', 'web', 'imap', 'whatsapp')),
  content_hash text NOT NULL,
  label text NOT NULL CHECK (label IN ('ESTAFA', 'SOSPECHOSO', 'SEGURO')),
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  -- reasons (default idioma / language = EN); translations guardan ambas versiones
  reasons jsonb DEFAULT '[]'::jsonb,
  reasons_translations jsonb DEFAULT '{"en": [], "es": []}'::jsonb,
  advice text,
  advice_translations jsonb DEFAULT '{"en": "", "es": ""}'::jsonb,
  urls_analyzed jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla / Table: users_metadata
CREATE TABLE IF NOT EXISTS public.users_metadata (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('lite', 'pro')),
  stripe_customer_id text,
  subscription_status text,
  trial_ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_checks_user_created
  ON public.checks (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_checks_label
  ON public.checks (label);

-- Row Level Security
ALTER TABLE public.checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own checks" ON public.checks;
CREATE POLICY "Users can manage own checks"
  ON public.checks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
