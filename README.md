<div align="center">
  <img src="./public/og-image.png" alt="IA Shield" width="280" />
</div>

# IA Shield

IA Shield es una plataforma de ciberseguridad asistida por IA que analiza mensajes, correos, audios y llamadas para detectar estafas en segundos. Ofrece protección multi-canal para familias y equipos, con explicaciones claras y alertas inteligentes.

## 🚀 Features principales

- **Detección multi-capa**: Heurísticas + GPT-4o + VirusTotal.
- **Alertas inteligentes**: Email, Telegram y Slack cuando importa.
- **Dashboard en tiempo real**: Estadísticas, filtros y modal de detalle.
- **Bots y workers**: Integraciones con Telegram Lite y watcher IMAP Pro.
- **Suscripciones Stripe**: Checkout, trial, portal del cliente.
- **Deploy listo en Vercel**: Configuración completa incluida.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind 4, Framer Motion.
- **Backend**: API Routes, Supabase, OpenAI, Stripe.
- **Infra**: Vercel, n8n, Telegram Bot, PM2/Docker para workers.
- **Testing**: Jest, React Testing Library, Playwright.

## ✅ Requisitos previos

- Node.js 18+
- pnpm 9+
- Cuenta Supabase, Stripe, OpenAI, Resend, VirusTotal.
- Vercel CLI (para deploy).

## 🔧 Instalación

```bash
pnpm install
pnpm dev
```

## 🔐 Variables de entorno

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_LINK_LITE=
NEXT_PUBLIC_STRIPE_LINK_PRO=
OPENAI_API_KEY=
VIRUSTOTAL_API_KEY=
RESEND_API_KEY=
SUPABASE_SERVICE_ROLE=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
TELEGRAM_BOT_TOKEN=
IMAP_HOST=
IMAP_USER=
IMAP_PASSWORD=
```

## 📦 Scripts disponibles

| comando         | descripción                              |
| --------------- | ---------------------------------------- |
| `pnpm dev`      | Dev server                               |
| `pnpm build`    | Build Next.js                            |
| `pnpm start`    | Sirve el build                           |
| `pnpm lint`     | Linter                                    |
| `pnpm test`     | Jest unit + integration                   |
| `pnpm test:watch`| Jest watch                              |
| `pnpm test:e2e` | Playwright E2E                            |

## 🚀 Deployment

1. Configura variables en Vercel (preview y prod).
2. `pnpm install`, `pnpm build`.
3. `vercel --prod`.
4. Conecta dominio y habilita analytics (vercel.json ya incluye headers, rewrites, caching).

Consulta `docs/DEPLOYMENT.md` para detalles de servicios externos (Supabase, Stripe, Telegram, etc.).

## 🧰 Troubleshooting

- **OPENAI_API_KEY missing**: la API `/api/check` retornará 500. Verifica env vars.
- **Stripe webhook 400**: revisa `STRIPE_WEBHOOK_SECRET` y endpoint `/api/webhooks/stripe`.
- **Telegram bot no responde**: asegúrate de iniciar `startTelegramBot()` en tu worker y configurar webhook/polling.
- **pnpm approve-builds warning**: ejecuta `pnpm approve-builds`.
- **Test fallan por imports**: `pnpm install` para traer dev deps (Jest/RTL).

Documentación adicional en `docs/`.
