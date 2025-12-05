# IA Shield API Reference

Esta guía describe los endpoints principales que expone IA Shield.

## Autenticación

Todas las rutas protegidas requieren sesión Supabase (token de acceso en cookies). Para llamadas server-to-server, usa el `SUPABASE_SERVICE_ROLE`.

---

## `POST /api/check`

Clasifica un texto (mensaje/email/audio transcrito) usando heurísticas + OpenAI.

### Request

```json
{
  "text": "Mensaje sospechoso",
  "source": "telegram"
}
```

### Response

```json
{
  "label": "ESTAFA",
  "score": 82,
  "razones": ["Solicitud de pago detectada"],
  "consejo": "No transfieras fondos",
  "timestamp": "2024-05-05T12:30:00Z"
}
```

### Errores

- `400`: faltan campos (text vacío)
- `429`: rate limit por IP (10/min)
- `500`: OPENAI_API_KEY no configurada o error interno

---

## `POST /api/check-url`

Analiza URLs con VirusTotal.

### Request

```json
{
  "urls": ["https://bit.ly/123", "https://phish.com"]
}
```

### Response

```json
{
  "results": [
    {
      "url": "https://bit.ly/123",
      "malicious_count": 2,
      "total_scans": 60,
      "is_safe": false
    }
  ],
  "timestamp": "2024-05-05T12:45:00Z"
}
```

Errores: `400` (sin URLs), `429` (VirusTotal limit), `500` (clave faltante o error externo).

---

## `POST /api/checkout/start`

Inicia un Checkout Session de Stripe. Requiere usuario autenticado.

### Body

```json
{ "plan": "PRO" }
```

### Response

```json
{ "url": "https://checkout.stripe.com/..." }
```

Errores: `401` sin sesión, `400` plan no configurado, `500` error Stripe.

---

## `POST /api/billing/portal`

Crea sesión del portal de Stripe (Manage Subscription).

Response: `{ "url": "https://billing.stripe.com/..." }`

Errores: `401` sin sesión, `400` sin `stripe_customer_id`, `500` error Stripe.

---

## `POST /api/webhooks/stripe`

Webhook Node.js (no requiere auth). Eventos soportados:

- `checkout.session.completed`
- `customer.subscription.*`

Actualiza tabla `subscriptions` y `user_metadata`. Devuelve `{ received: true }`.

Errores: `400` (firma inválida), `500` (error de handler).

---

## `POST /api/emails`

Envío interno de alertas (Resend). Tipos:

- `welcome`
- `password_reset`
- `trial`

Request:

```json
{
  "type": "welcome",
  "email": "user@example.com",
  "metadata": { "name": "User" }
}
```

---

## Autenticación (Pages)

- `/login` (form + magic link + oauth)
- `/signup`
- `/reset-password`

Estas rutas no son API, pero usan Supabase auth client.

---

## Errores comunes

| Código | Significado                       |
| ------ | --------------------------------- |
| 400    | Bad request / campos inválidos    |
| 401    | Not authenticated                 |
| 429    | Rate limit                        |
| 500    | Error interno / configuración     |

Consulte `docs/ARCHITECTURE.md` y `/docs/DEPLOYMENT.md` para más detalles.
