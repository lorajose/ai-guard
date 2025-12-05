import OpenAI from "openai";
import TelegramBot, { Message } from "node-telegram-bot-api";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DAILY_LIMIT = 50;
const API_BASE_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";
const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL;

type UsageEntry = { count: number; date: string };
const usageMap = new Map<number, UsageEntry>();

let bot: TelegramBot | null = null;
let initialized = false;

export function startTelegramBot() {
  if (initialized) return;
  if (!TELEGRAM_TOKEN) {
    console.warn("TELEGRAM_BOT_TOKEN no configurado. Bot deshabilitado.");
    return;
  }
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY no configurada. Bot no puede transcribir.");
    return;
  }

  const isDev = process.env.NODE_ENV !== "production";
  bot = new TelegramBot(TELEGRAM_TOKEN, {
    polling: isDev,
  });

  if (!isDev && WEBHOOK_URL) {
    bot
      .setWebHook(WEBHOOK_URL)
      .then(() => console.log("Telegram webhook configurado"))
      .catch((err) => console.error("Error configurando webhook", err));
  }

  registerHandlers(bot);
  initialized = true;
  console.log("Telegram bot inicializado en modo", isDev ? "polling" : "webhook");
}

export function processTelegramUpdate(update: TelegramBot.Update) {
  if (!bot) {
    startTelegramBot();
  }
  bot?.processUpdate(update);
}

function registerHandlers(botInstance: TelegramBot) {
  botInstance.onText(/\/start/, async (msg) => {
    await botInstance.sendMessage(
      msg.chat.id,
      [
        "🛡️ *Bienvenido a IA Shield Lite*",
        "",
        "Envía cualquier mensaje sospechoso (texto, audio o nota de voz).",
        "Recibirás en segundos una evaluación con el nivel de riesgo y consejos.",
        "",
        "Comandos útiles:",
        "• /help – Guía rápida",
        "• /stats – Tus checks disponibles hoy",
      ].join("\n"),
      { parse_mode: "Markdown" }
    );
  });

  botInstance.onText(/\/help/, async (msg) => {
    await botInstance.sendMessage(
      msg.chat.id,
      [
        "ℹ️ *Cómo usar IA Shield Lite*",
        "",
        "1. Reenvía el mensaje sospechoso o describe brevemente lo que recibiste.",
        "2. También puedes enviar notas de voz o audios: IA Shield los transcribe automáticamente.",
        "3. Recibirás un resultado con:",
        "   • Label (Estafa / Sospechoso / Seguro)",
        "   • Score 0-100",
        "   • Razones detectadas",
        "   • Consejo accionable",
        "",
        `Plan Lite incluye ${DAILY_LIMIT} verificaciones por día.`,
      ].join("\n"),
      { parse_mode: "Markdown" }
    );
  });

  botInstance.onText(/\/stats/, async (msg) => {
    const usage = getUsage(msg.chat.id);
    const remaining = Math.max(DAILY_LIMIT - usage.count, 0);
    await botInstance.sendMessage(
      msg.chat.id,
      [
        "📊 *Tus estadísticas de hoy*",
        `Checks usados: ${usage.count}/${DAILY_LIMIT}`,
        `Checks restantes: ${remaining}`,
      ].join("\n"),
      { parse_mode: "Markdown" }
    );
  });

  botInstance.on("voice", async (msg) => handleAudioMessage(botInstance, msg));
  botInstance.on("audio", async (msg) => handleAudioMessage(botInstance, msg));
  botInstance.on("text", async (msg) => {
    if (msg.text?.startsWith("/")) return;
    await handleTextMessage(botInstance, msg);
  });
}

function getUsage(chatId: number) {
  const today = new Date().toISOString().slice(0, 10);
  const entry = usageMap.get(chatId);
  if (!entry || entry.date !== today) {
    const fresh = { count: 0, date: today };
    usageMap.set(chatId, fresh);
    return fresh;
  }
  return entry;
}

function incrementUsage(chatId: number) {
  const entry = getUsage(chatId);
  entry.count += 1;
  usageMap.set(chatId, entry);
  return entry;
}

async function handleTextMessage(botInstance: TelegramBot, msg: Message) {
  const chatId = msg.chat.id;
  if (getUsage(chatId).count >= DAILY_LIMIT) {
    await botInstance.sendMessage(
      chatId,
      "🚫 Has alcanzado el límite diario de 50 verificaciones. Vuelve mañana o actualiza a un plan superior."
    );
    return;
  }

  if (!msg.text) return;
  await botInstance.sendChatAction(chatId, "typing");
  const updated = incrementUsage(chatId);
  try {
    const result = await checkMessage(msg.text);
    const remaining = Math.max(DAILY_LIMIT - updated.count, 0);
    await botInstance.sendMessage(chatId, formatResult(result, remaining), {
      parse_mode: "Markdown",
    });
  } catch (error: any) {
    console.error("Error procesando texto:", error);
    await botInstance.sendMessage(
      chatId,
      "⚠️ Ocurrió un error procesando tu mensaje. Intenta de nuevo en unos segundos."
    );
  }
}

async function handleAudioMessage(botInstance: TelegramBot, msg: Message) {
  const chatId = msg.chat.id;
  if (getUsage(chatId).count >= DAILY_LIMIT) {
    await botInstance.sendMessage(
      chatId,
      "🚫 Has alcanzado el límite diario de 50 verificaciones. Vuelve mañana o actualiza a un plan superior."
    );
    return;
  }

  const fileId = msg.voice?.file_id || msg.audio?.file_id;
  if (!fileId) return;

  await botInstance.sendChatAction(chatId, "typing");
  const updated = incrementUsage(chatId);
  try {
    const transcription = await transcribeTelegramAudio(fileId);
    if (!transcription) {
      throw new Error("Sin transcripción disponible");
    }
    const result = await checkMessage(transcription);
    const remaining = Math.max(DAILY_LIMIT - updated.count, 0);
    await botInstance.sendMessage(
      chatId,
      `🗣️ Transcripción: ${transcription}\n\n${formatResult(
        result,
        remaining
      )}`,
      { parse_mode: "Markdown" }
    );
  } catch (error: any) {
    console.error("Error procesando audio:", error);
    await botInstance.sendMessage(
      chatId,
      "⚠️ No pudimos procesar tu audio. Intenta enviarlo nuevamente."
    );
  }
}

async function checkMessage(text: string) {
  const response = await fetch(`${API_BASE_URL}/api/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source: "telegram" }),
  });
  if (!response.ok) {
    throw new Error("API check error");
  }
  return response.json();
}

async function transcribeTelegramAudio(fileId: string) {
  if (!bot) throw new Error("Bot no inicializado");
  const fileLink = await bot.getFileLink(fileId);
  const audioResponse = await fetch(fileLink);
  const arrayBuffer = await audioResponse.arrayBuffer();
  const file = new File([arrayBuffer], `voice-${fileId}.ogg`, {
    type: "audio/ogg",
  });

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "text",
  });

  return transcription?.trim();
}

function formatResult(
  result: {
    label: string;
    score: number;
    razones: string[];
    consejo: string;
  },
  remaining: number
) {
  return [
    `🛡️ *Resultado:* ${result.label}`,
    `📊 *Score:* ${Math.round(result.score)}/100`,
    `⚠️ *Razones:*`,
    result.razones.length
      ? result.razones.map((r) => `• ${r}`).join("\n")
      : "• Sin señales claras.",
    `💡 *Consejo:* ${result.consejo}`,
    "",
    `🧮 Checks restantes hoy: ${remaining}`,
  ].join("\n");
}
