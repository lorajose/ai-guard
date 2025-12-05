import { Resend } from "resend";

const resend =
  process.env.RESEND_API_KEY && new Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS =
  process.env.RESEND_FROM || "IA Shield <security@notify.iashield.com>";

if (process.env.RESEND_API_KEY && !FROM_ADDRESS) {
  throw new Error("Configura RESEND_FROM para los correos transaccionales.");
}

type TrialMetadata = {
  trialEndsAt: string;
  planName?: string;
};

export async function sendWelcomeEmail(email: string, name?: string) {
  ensureClient();
  return resend!.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "Bienvenido a IA Shield",
    html: baseTemplate({
      title: "Bienvenido 👋",
      body: `Hola ${name || ""},<br/><br/>Tu cuenta ya está lista. Empieza a reenviar mensajes sospechosos y obtienes un veredicto en segundos.`,
      cta: { label: "Ir al dashboard", url: "https://iashield.app/dashboard" },
    }),
  });
}

export async function sendPasswordResetEmail(email: string) {
  ensureClient();
  return resend!.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "Recupera tu acceso a IA Shield",
    html: baseTemplate({
      title: "Recuperación solicitada",
      body: "Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, ignora este mensaje.",
    }),
  });
}

export async function sendTrialExpiringEmail(
  email: string,
  metadata: TrialMetadata
) {
  ensureClient();
  const now = Date.now();
  const target = new Date(metadata.trialEndsAt).getTime();
  const daysLeft = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

  if (Number.isNaN(daysLeft) || daysLeft > 5) {
    return { skipped: true, reason: "Trial aún no está dentro de los 5 días." };
  }

  return resend!.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "Tu prueba de IA Shield termina pronto",
    html: baseTemplate({
      title: "Quedan pocos días de tu prueba",
      body: `Tu prueba ${
        metadata.planName || ""
      } termina en ${daysLeft} días. Activa un plan para mantener la protección continua.`,
      cta: { label: "Elegir plan", url: "https://iashield.app/pricing" },
    }),
  });
}

function ensureClient() {
  if (!resend) {
    throw new Error("RESEND_API_KEY no configurada.");
  }
}

function baseTemplate({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: { label: string; url: string };
}) {
  return `
    <div style="font-family: Arial, sans-serif; padding:24px; background:#050505; color:#fff;">
      <div style="max-width:520px; margin:0 auto; background:#0f172a; border-radius:24px; padding:32px; border:1px solid rgba(255,255,255,0.08);">
        <h1 style="margin-bottom:16px;">${title}</h1>
        <p style="line-height:1.6;">${body}</p>
        ${
          cta
            ? `<a href="${cta.url}" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#39ff14;color:#000;border-radius:999px;text-decoration:none;font-weight:bold;">${cta.label}</a>`
            : ""
        }
        <p style="margin-top:32px;font-size:12px;color:#94a3b8;">IA Shield · Protección anti-estafas con IA</p>
      </div>
    </div>
  `;
}
