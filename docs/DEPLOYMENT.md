# Guía de Deployment

## Vercel

- **Build command**: `pnpm build`
- **Install command**: `pnpm install`
- **Output**: `.next`
- **Node**: 18.x
- **Environment**: ver `vercel.json`
- **Analytics**: habilitar Vercel Analytics + Web Vitals.
- **Preview Deployments**: activar automáticos en PRs. Protección con password opcional.
- **Domains**: añadir dominio raíz (`iashield.com`) y redirigir `www` → apex (ver `vercel.json`).
- **Headers**: CSP, HSTS y caching ya definidos.

## Variables de entorno

Configura en Vercel (Preview/Production):

- `NEXT_PUBLIC_*` (URLs, Stripe public links).
- Secretas: `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `VIRUSTOTAL_API_KEY`, `TELEGRAM_BOT_TOKEN`, `IMAP_*`, etc.

## Servicios externos

- **Supabase**: crea tablas (`checks`, `subscriptions`, `alerts_config`). Ajusta policies.
- **Stripe**: Price IDs para Lite/Pro, Webhook → `/api/webhooks/stripe`.
- **OpenAI / VirusTotal / Resend / Telegram**: agrega API keys.
- **n8n**: importa `workflows/iashield-pro.json`, configura credenciales.
- **Workers**:
  - Telegram Bot: ejecuta `startTelegramBot()` en un proceso Node/PM2.
  - IMAP watcher: `node src/workers/imap-watcher.ts` en VPS o Docker (recomendado monitor con PM2).

## Monitoring & Logs

- Vercel: habilitar logging + alerts (Pro plan).
- Supabase: monitorear `auth` y `postgres` logs.
- Workers: usar PM2 (`pm2 start src/workers/imap-watcher.ts --name imap-worker`).
- Alert digests: revisar `sendAlert` y `digestBuckets`.

## Checklist

1. `pnpm install && pnpm build`
2. `pnpm test && pnpm test:e2e`
3. Variables configuradas en Vercel.
4. Stripe webhook verificado.
5. Bot/IMAP workers corriendo.
6. `vercel --prod` para deploy final.
