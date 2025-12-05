import Imap from "node-imap";
import { simpleParser } from "mailparser";
import OpenAI from "openai";
import { Resend } from "resend";
import TelegramBot from "node-telegram-bot-api";
import winston from "winston";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const IMAP_HOST = process.env.IMAP_HOST;
const IMAP_USER = process.env.IMAP_USER;
const IMAP_PASSWORD = process.env.IMAP_PASSWORD;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ALERT_EMAIL = process.env.ALERT_EMAIL;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ALERT_CHAT = process.env.TELEGRAM_ALERT_CHAT;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const telegram =
  TELEGRAM_BOT_TOKEN && TELEGRAM_ALERT_CHAT
    ? new TelegramBot(TELEGRAM_BOT_TOKEN)
    : null;

const imap = new Imap({
  user: IMAP_USER,
  password: IMAP_PASSWORD,
  host: IMAP_HOST,
  port: Number(process.env.IMAP_PORT || 993),
  tls: true,
});

function startWorker() {
  if (!IMAP_HOST || !IMAP_USER || !IMAP_PASSWORD) {
    logger.error("IMAP credentials missing. Worker disabled.");
    return;
  }

  imap.once("ready", () => pollMailbox());
  imap.once("error", (err) => {
    logger.error("IMAP connection error", err);
    setTimeout(() => imap.connect(), 5000);
  });
  imap.once("end", () => logger.info("IMAP connection ended"));
  imap.connect();

  setInterval(() => {
    if (imap.state === "authenticated") {
      pollMailbox();
    } else {
      logger.warn("IMAP not authenticated. Attempting reconnect.");
      try {
        imap.connect();
      } catch (err) {
        logger.error("Reconnection error", err);
      }
    }
  }, 30_000);
}

function pollMailbox() {
  imap.openBox("INBOX", false, (err) => {
    if (err) {
      logger.error("Failed to open inbox", err);
      return;
    }
    imap.search(["UNSEEN"], (error, results) => {
      if (error) {
        logger.error("Search error", error);
        return;
      }
      if (!results || !results.length) return;

      const fetcher = imap.fetch(results, { bodies: "", markSeen: true });
      fetcher.on("message", (msg) => {
        let rawBuffer = Buffer.from("");
        msg.on("body", (stream) => {
          stream.on("data", (chunk) => {
            rawBuffer = Buffer.concat([rawBuffer, chunk]);
          });
        });
        msg.once("end", async () => {
          try {
            const parsed = await simpleParser(rawBuffer);
            await handleEmail(parsed);
          } catch (parseError) {
            logger.error("Failed to parse email", parseError);
          }
        });
      });

      fetcher.once("error", (fetchErr) => logger.error("Fetch error", fetchErr));
      fetcher.once("end", () => logger.info(`Processed ${results.length} emails.`));
    });
  });
}

async function handleEmail(mail: any) {
  const from = mail.from?.text || "unknown";
  const subject = mail.subject || "";
  const htmlBody = mail.html || "";
  const textBody = mail.text || "";
  const body = textBody || stripHtml(htmlBody);
  const attachments =
    mail.attachments?.map((att: any) => ({
      filename: att.filename,
      size: att.size,
      contentType: att.contentType,
    })) || [];

  const headerSignals = analyzeHeaders(mail.headers);
  const urls = extractUrls(htmlBody || textBody);

  const heuristicsScore = calcHeaderScore(headerSignals);
  const aiScore = await getOpenAiScore(body);
  const vtScore = await evaluateUrlsWithVirusTotal(urls);
  const combinedScore = Math.round(heuristicsScore * 0.25 + aiScore * 0.5 + vtScore * 0.25);

  await supabaseAdmin.from("checks").insert({
    source: "email",
    label: combinedScore >= 70 ? "ESTAFA" : combinedScore >= 40 ? "SOSPECHOSO" : "SEGURO",
    score: combinedScore,
    razones: [
      ...headerSignals.reasons,
      ...urls.map((url) => `URL detectada: ${url}`),
    ],
    consejo: heuristicsScore > 60 ? "No hagas clic ni respondas. Reporta a seguridad." : "Verifica por un canal oficial antes de responder.",
    metadata: {
      from,
      subject,
      attachments,
    },
    text: body,
  });

  if (combinedScore > 70) {
    await sendAlerts({ from, subject, body, combinedScore, urls });
  }
}

function analyzeHeaders(headers: Map<string, any>) {
  const reasons: string[] = [];
  const spf = headers.get("received-spf") || "";
  const dkim = headers.get("dkim-signature") || "";
  const replyTo = headers.get("reply-to") || "";
  const fromHeader = headers.get("from") || "";

  if (!spf.includes("pass")) {
    reasons.push("SPF no pasó.");
  }
  if (!dkim.includes("pass")) {
    reasons.push("DKIM no válido.");
  }
  if (replyTo && replyTo !== fromHeader) {
    reasons.push("Reply-To no coincide con From.");
  }

  return { reasons };
}

function calcHeaderScore(signals: { reasons: string[] }) {
  if (!signals.reasons.length) return 10;
  return Math.min(100, signals.reasons.length * 20);
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ");
}

function extractUrls(text: string) {
  const regex = /(https?:\/\/[^\s)]+)/gi;
  const matches = text.match(regex);
  return matches ? Array.from(new Set(matches)) : [];
}

async function getOpenAiScore(body: string) {
  if (!body) return 30;
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: `
Clasifica el texto como ESTAFA, SOSPECHOSO o SEGURO.
Texto: """${body.slice(0, 5000)}"""
Devuelve JSON { "score": number 0-100 }
`,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "classification",
        schema: {
          type: "object",
          properties: {
            score: { type: "number" },
          },
          required: ["score"],
        },
      },
    },
  });

  const parsed = JSON.parse(response.output_text ?? "{}");
  return typeof parsed.score === "number" ? parsed.score : 50;
}

async function evaluateUrlsWithVirusTotal(urls: string[]) {
  if (!urls.length || !VIRUSTOTAL_API_KEY) return 30;
  let totalScore = 0;
  for (const url of urls.slice(0, 5)) {
    try {
      const vtResult = await fetch("https://www.virustotal.com/api/v3/urls", {
        method: "POST",
        headers: {
          "x-apikey": VIRUSTOTAL_API_KEY,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ url }),
      }).then((res) => res.json());
      const analysisId = vtResult.data?.id;
      if (!analysisId) continue;
      const stats = await fetch(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: { "x-apikey": VIRUSTOTAL_API_KEY },
        }
      ).then((res) => res.json());
      const malicious =
        stats.data?.attributes?.stats?.malicious +
          stats.data?.attributes?.stats?.suspicious || 0;
      totalScore += Math.min(100, malicious * 25);
    } catch (error) {
      logger.warn("VirusTotal fetch failed", error);
    }
  }
  return totalScore ? Math.min(100, totalScore / urls.length) : 20;
}

async function sendAlerts(payload: {
  from: string;
  subject: string;
  body: string;
  combinedScore: number;
  urls: string[];
}) {
  if (resend && ALERT_EMAIL) {
    await resend.emails.send({
      from: "IA Shield <alerts@iashield.com>",
      to: ALERT_EMAIL,
      subject: `ALERTA: Posible phishing (${payload.combinedScore})`,
      html: `
        <h2>Detección IA Shield</h2>
        <p>From: ${payload.from}</p>
        <p>Subject: ${payload.subject}</p>
        <p>Score: ${payload.combinedScore}</p>
        <p>URLs: ${(payload.urls || []).join(", ")}</p>
        <pre>${payload.body}</pre>
      `,
    });
  }

  if (telegram && TELEGRAM_ALERT_CHAT) {
    await telegram.sendMessage(
      TELEGRAM_ALERT_CHAT,
      [
        "🚨 *IA Shield – Phishing detectado*",
        `✨ Score: ${payload.combinedScore}`,
        `👤 From: ${payload.from}`,
        `📌 Subject: ${payload.subject}`,
        payload.urls.length ? `🔗 URLs: ${payload.urls.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      { parse_mode: "Markdown" }
    );
  }

  if (SLACK_WEBHOOK_URL) {
    await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🚨 IA Shield detectó un posible phishing\nFrom: ${payload.from}\nSubject: ${payload.subject}\nScore: ${payload.combinedScore}`,
      }),
    });
  }
}

if (require.main === module) {
  startWorker();
}

export { startWorker };
