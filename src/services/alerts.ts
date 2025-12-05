import { Resend } from "resend";
import TelegramBot from "node-telegram-bot-api";

type CheckResult = {
  id?: string;
  label: string;
  score: number;
  razones: string[];
  consejo: string;
  text?: string;
  metadata?: Record<string, any>;
};

type AlertConfig = {
  user_id: string;
  email_enabled: boolean;
  telegram_enabled: boolean;
  slack_webhook?: string | null;
  min_score_threshold: number;
  email?: string;
  telegram_chat_id?: string;
};

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const telegramBot = process.env.TELEGRAM_BOT_TOKEN
  ? new TelegramBot(process.env.TELEGRAM_BOT_TOKEN)
  : null;

const rateLimiter = new Map<string, number>();
const digestBuckets = new Map<string, CheckResult[]>();

export async function sendAlert(
  userId: string,
  check: CheckResult,
  channels: ("email" | "telegram" | "slack")[],
  config: AlertConfig
) {
  if (check.score < (config.min_score_threshold ?? 0)) {
    return;
  }

  const now = Date.now();
  for (const channel of channels) {
    const key = `${userId}:${channel}`;
    const last = rateLimiter.get(key) || 0;
    if (now - last < 60_000) {
      queueDigest(key, check);
      continue;
    }

    switch (channel) {
      case "email":
        if (config.email_enabled) {
          await sendEmailAlert(config, check);
        }
        break;
      case "telegram":
        if (config.telegram_enabled) {
          await sendTelegramAlert(config, check);
        }
        break;
      case "slack":
        if (config.slack_webhook) {
          await sendSlackAlert(config, check);
        }
        break;
      default:
        break;
    }
    rateLimiter.set(key, now);
  }
}

function queueDigest(key: string, check: CheckResult) {
  const bucket = digestBuckets.get(key) || [];
  bucket.push(check);
  digestBuckets.set(key, bucket);

  if (bucket.length === 1) {
    setTimeout(() => flushDigest(key), 60 * 60 * 1000);
  }
}

async function flushDigest(key: string) {
  const bucket = digestBuckets.get(key);
  if (!bucket || !bucket.length) return;

  const [userId, channel] = key.split(":");
  const digestText = bucket
    .map(
      (chk, idx) =>
        `${idx + 1}. ${chk.label} (${Math.round(chk.score)}) - ${
          chk.razones?.[0] || "Sin razones"
        }`
    )
    .join("\n");

  switch (channel) {
    case "slack":
      if (process.env.SLACK_WEBHOOK_URL) {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🧾 *Digest IA Shield*\n${digestText}`,
          }),
        });
      }
      break;
    case "telegram":
      if (telegramBot && process.env.TELEGRAM_ALERT_CHAT) {
        await telegramBot.sendMessage(
          process.env.TELEGRAM_ALERT_CHAT,
          `🧾 Digest IA Shield\n${digestText}`,
          { parse_mode: "Markdown" }
        );
      }
      break;
    case "email":
      if (resend && process.env.ALERT_EMAIL) {
        await resend.emails.send({
          from: "IA Shield <alerts@iashield.com>",
          to: process.env.ALERT_EMAIL,
          subject: "🧾 Digest IA Shield",
          html: `<p>Se detectaron ${bucket.length} incidencias:</p><pre>${digestText}</pre>`,
        });
      }
      break;
  }

  digestBuckets.delete(key);
}

async function sendEmailAlert(config: AlertConfig, check: CheckResult) {
  if (!resend || !config.email) return;
  await resend.emails.send({
    from: "IA Shield <alerts@iashield.com>",
    to: config.email,
    subject: "⚠️ Estafa detectada - IA Shield",
    html: emailTemplate(check),
  });
}

function emailTemplate(check: CheckResult) {
  return `
    <div style="font-family: Arial, sans-serif; padding:24px; background:#050505; color:#fff;">
      <div style="max-width:520px; margin:0 auto; background:#0f172a; border-radius:24px; padding:32px; border:1px solid rgba(255,255,255,0.08);">
        <h1 style="color:#39ff14;">⚠️ Estafa detectada</h1>
        <p><strong>Score:</strong> ${Math.round(check.score)}/100</p>
        <p><strong>Label:</strong> ${check.label}</p>
        <p><strong>Razones:</strong></p>
        <ul>
          ${(check.razones || []).map((r) => `<li>${r}</li>`).join("")}
        </ul>
        <p><strong>Consejo:</strong> ${check.consejo}</p>
        <a style="display:inline-block;margin-top:24px;padding:12px 24px;background:#39ff14;color:#000;border-radius:999px;text-decoration:none;font-weight:bold;" href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">
          Ver en Dashboard
        </a>
      </div>
    </div>
  `;
}

async function sendTelegramAlert(config: AlertConfig, check: CheckResult) {
  if (!telegramBot || !config.telegram_chat_id) return;
  const text = [
    "🚨 *IA Shield alerta*",
    `🛡️ ${check.label}`,
    `📊 Score: ${Math.round(check.score)}/100`,
    `⚠️ Razones:\n${(check.razones || [])
      .map((r) => `• ${r}`)
      .join("\n") || "• Sin razones"}`,
    `💡 Consejo: ${check.consejo}`,
  ].join("\n");
  await telegramBot.sendMessage(config.telegram_chat_id, text, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Ver en Dashboard",
            url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          },
        ],
      ],
    },
  });
}

async function sendSlackAlert(config: AlertConfig, check: CheckResult) {
  if (!config.slack_webhook) return;

  const color =
    check.score >= 80 ? "#ef4444" : check.score >= 50 ? "#facc15" : "#22c55e";
  const payload = {
    attachments: [
      {
        color,
        title: "IA Shield Alert",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${check.label}* - Score ${Math.round(check.score)}/100`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                (check.razones || [])
                  .map((r) => `• ${r}`)
                  .join("\n") || "Sin razones detectadas",
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `💡 ${check.consejo}`,
              },
            ],
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Ver en Dashboard",
                },
                url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
              },
            ],
          },
        ] as SlackBlock[],
      },
    ],
  };

  await fetch(config.slack_webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
