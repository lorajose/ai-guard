# Arquitectura IA Shield

## Visión general

```
Usuarios → Next.js App → API Routes → Supabase
                                 ↘ OpenAI / Stripe / Resend / Telegram / n8n
Workers: Telegram Bot / IMAP / n8n → Supabase + Alert Service
```

### Componentes principales

- **Next.js App**: App Router. Pages públicas (landing) y áreas autenticadas (dashboard, settings).
- **API Routes**: `/api/check`, `/api/check-url`, `/api/checkout`, `/api/webhooks/stripe`, etc.
- **Supabase**: Auth, base de datos (`checks`, `subscriptions`, `alerts_config`).
- **Stripe**: Suscripciones (Lite/Pro) + Webhook.
- **OpenAI**: Clasificador y Whisper.
- **VirusTotal**: análisis de URLs.
- **Resend / Telegram / Slack**: canales de alerta.
- **Workers**:
  - `src/services/telegram-bot.ts`: bot Plan Lite.
  - `src/workers/imap-watcher.ts`: listener IMAP Plan Pro.
  - n8n workflow (ver `workflows/iashield-pro.json`).

## Flow de datos

1. Usuario envía mensaje (web, bot, email).
2. API o worker:
   - Heurísticas → OpenAI → VirusTotal → Score.
   - Inserta en `checks`.
3. `sendAlert` evalúa `alerts_config` y dispara canales si `score > threshold`.
4. Dashboard escucha cambios vía Supabase realtime.
5. Suscripciones: checkout → webhook → `subscriptions` + `user_metadata`.

## Decisiones técnicas

- **Next.js App Router** para SSR híbrido y componentes cliente controlados.
- **Supabase**: auth+DB simple, real-time.
- **Tailwind 4 + custom UI** para diseño consistente (ver `src/components/ui`).
- **Workers dedicados** en Node/PM2/n8n para tareas largas (IMAP, bot).
- **Vercel**: despliegue serverless, headers CSP en `vercel.json`.
- **Testing completo**: Jest + RTL + Playwright.

## Diagramas

Ver `docs/DEPLOYMENT.md` para diagrama de servicios y monitoreo.
