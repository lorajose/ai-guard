import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";
import { createHash } from "crypto";
import OpenAI from "openai";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const MODEL = "gpt-4o-mini";
const MAX_REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60 * 1000;

const rateLimitStore = new Map<
  string,
  {
    count: number;
    expiresAt: number;
  }
>();

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

const shortUrlRegex =
  /(bit\.ly|tinyurl\.com|t\.co|ow\.ly|buff\.ly|goo\.gl|is\.gd|cutt\.ly|rebrand\.ly|bitly\.com)/i;
const urgencyKeywords = ["inmediato", "ahora", "rápido", "ultimo día", "último día"];
const paymentKeywords = ["transferir", "enviar dinero", "western union", "pago inmediato"];
const emotionKeywords = ["ayuda", "emergencia", "accidente"];

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no configurada." },
        { status: 500 }
      );
    }

    const ip =
      request.ip ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta nuevamente en un minuto." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json(
        { error: "El campo 'text' es obligatorio." },
        { status: 400 }
      );
    }

    const text: string = body.text.trim();
    const source: string | undefined =
      typeof body.source === "string" ? body.source : undefined;

    const heuristicResult = runHeuristics(text);

    const prompt = buildPrompt(text, source);

    const response = await openai.responses.create({
      model: MODEL,
      input: prompt,
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "classification",
          schema: {
            type: "object",
            properties: {
              label: {
                type: "string",
                description: "ESTAFA, SOSPECHOSO o SEGURO",
              },
              score: {
                type: "number",
                description: "Confianza 0-100",
              },
              razones: {
                type: "array",
                items: { type: "string" },
              },
              consejo_breve: {
                type: "string",
              },
            },
            required: ["label", "score", "razones", "consejo_breve"],
            additionalProperties: false,
          },
        },
      },
    });

    const aiPayload = parseAIResponse(response);

    const finalLabel = normalizeLabel(
      aiPayload.label,
      heuristicResult.reasons.length
    );
    const finalScore = clampScore(
      aiPayload.score + heuristicResult.scoreBump,
      heuristicResult.reasons.length
    );
    const finalReasons = Array.from(
      new Set([...heuristicResult.reasons, ...aiPayload.razones])
    );

    await persistCheck({
      text,
      source,
      label: finalLabel,
      score: finalScore,
      reasons: finalReasons,
      advice: aiPayload.consejo_breve,
      heuristicReasons: heuristicResult.reasons,
    });

    return NextResponse.json({
      label: finalLabel,
      score: finalScore,
      razones: finalReasons,
      consejo: aiPayload.consejo_breve,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /api/check:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar la verificación." },
      { status: 500 }
    );
  }
}

function isRateLimited(identifier: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  if (!entry || entry.expiresAt <= now) {
    rateLimitStore.set(identifier, { count: 1, expiresAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }

  entry.count += 1;
  rateLimitStore.set(identifier, entry);
  return false;
}

export function runHeuristics(text: string) {
  const lower = text.toLowerCase();
  const reasons: string[] = [];
  let scoreBump = 0;

  if (shortUrlRegex.test(lower)) {
    reasons.push("Se detectaron URLs acortadas potencialmente riesgosas.");
    scoreBump += 8;
  }

  if (urgencyKeywords.some((word) => lower.includes(word))) {
    reasons.push("Lenguaje de urgencia detectado (inmediato, ahora, rápido).");
    scoreBump += 6;
  }

  if (paymentKeywords.some((word) => lower.includes(word))) {
    reasons.push("Solicitud de pago/transferencia detectada.");
    scoreBump += 8;
  }

  if (emotionKeywords.some((word) => lower.includes(word))) {
    reasons.push("Apelación emocional detectada (ayuda, emergencia, accidente).");
    scoreBump += 5;
  }

  return { reasons, scoreBump };
}

export function buildPrompt(text: string, source?: string) {
  return `Tarea: Clasifica el mensaje como [ESTAFA, SOSPECHOSO, SEGURO].
Devuelve JSON: { label, score(0-100), razones[], consejo_breve }.
Señales: urgencia, pagos inmediatos, familiares en peligro, premios, cripto, links acortados.
Fuente: ${source ?? "desconocida"}
Mensaje: """${text}"""`;
}

async function persistCheck({
  text,
  source,
  label,
  score,
  reasons,
  advice,
  heuristicReasons,
}: {
  text: string;
  source?: string;
  label: string;
  score: number;
  reasons: string[];
  advice: string;
  heuristicReasons: string[];
}) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const contentHash = createHash("sha256").update(text).digest("hex");
    await supabaseAdmin.from("checks").insert({
      user_id: user.id,
      source: source ?? "web",
      content_hash: contentHash,
      label,
      score,
      reasons,
      advice,
      text,
      metadata: {
        source,
        heuristicReasons,
      },
    });
  } catch (error) {
    console.error("Failed to persist check:", error);
  }
}

export function parseAIResponse(response: any) {
  const text =
    (Array.isArray(response.output_text) && response.output_text[0]) || "";

  try {
    const parsed = JSON.parse(text || "{}");
    return {
      label: typeof parsed.label === "string" ? parsed.label : "SOSPECHOSO",
      score: typeof parsed.score === "number" ? parsed.score : 50,
      razones: Array.isArray(parsed.razones) ? parsed.razones : [],
      consejo_breve:
        typeof parsed.consejo_breve === "string"
          ? parsed.consejo_breve
          : "Mantente alerta y verifica por un canal oficial.",
    };
  } catch {
    return {
      label: "SOSPECHOSO",
      score: 55,
      razones: ["No se pudo interpretar la respuesta del modelo."],
      consejo_breve: "Mantente alerta y verifica por un canal oficial.",
    };
  }
}

export function normalizeLabel(label: string, heuristicHits: number) {
  const upper = label?.toUpperCase();
  const allowed = ["ESTAFA", "SOSPECHOSO", "SEGURO"];
  const normalized = allowed.includes(upper) ? upper : "SOSPECHOSO";

  if (heuristicHits >= 2 && normalized === "SEGURO") {
    return "SOSPECHOSO";
  }
  return normalized;
}

export function clampScore(score: number, heuristicHits: number) {
  const baseline = heuristicHits > 0 ? score + heuristicHits * 2 : score;
  return Math.max(0, Math.min(100, Math.round(baseline)));
}
