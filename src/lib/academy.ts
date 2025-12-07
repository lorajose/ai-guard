import OpenAI from "openai";
import {
  IA_ACADEMY_SYSTEM_PROMPT,
  IA_ACADEMY_PHISH_SIM_PROMPT,
  IA_ACADEMY_LESSON_PROMPT,
} from "./prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const ACADEMY_MODEL = "gpt-4o-mini";

export async function generarSimulacionPhishing({
  marca,
  escenario,
}: {
  marca: string;
  escenario: string;
}) {
  if (!openai.apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const userPrompt = IA_ACADEMY_PHISH_SIM_PROMPT(marca, escenario);

  const completion = await openai.responses.create({
    model: ACADEMY_MODEL,
    input: [
      { role: "system", content: IA_ACADEMY_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const payload = completion.output?.[0]?.content?.[0];
  const jsonText =
    payload && payload.type === "output_text" ? payload.text : null;

  if (!jsonText) {
    throw new Error("OpenAI response did not include JSON payload");
  }

  return JSON.parse(jsonText);
}

export async function generarLeccionTeorica({
  titulo,
  nivel,
}: {
  titulo: string;
  nivel: string;
}) {
  if (!openai.apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const userPrompt = IA_ACADEMY_LESSON_PROMPT(titulo, nivel);

  const completion = await openai.responses.create({
    model: ACADEMY_MODEL,
    input: [
      { role: "system", content: IA_ACADEMY_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const payload = completion.output?.[0]?.content?.[0];
  const jsonText =
    payload && payload.type === "output_text" ? payload.text : null;

  if (!jsonText) {
    throw new Error("OpenAI response did not include JSON payload");
  }

  return JSON.parse(jsonText);
}
