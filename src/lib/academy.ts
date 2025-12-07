import OpenAI from "openai";
import {
  IA_ACADEMY_SYSTEM_PROMPT,
  IA_ACADEMY_PHISH_SIM_PROMPT,
} from "./prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    model: "gpt-4.1-mini",
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
