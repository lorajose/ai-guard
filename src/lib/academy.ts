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

function extractJsonText(completion: OpenAI.Beta.Responses.Response) {
  if (completion.output_text?.length) {
    return completion.output_text.join("\n");
  }

  const segments =
    completion.output
      ?.flatMap((block) => block.content ?? [])
      .map((content) => {
        if (!content) return "";
        if ("text" in content && typeof content.text === "string") {
          return content.text;
        }
        // Some SDK versions wrap the text array
        if (
          "type" in content &&
          content.type === "output_text" &&
          Array.isArray((content as any).text)
        ) {
          return (content as any).text
            .map((entry: any) =>
              typeof entry === "string"
                ? entry
                : typeof entry?.text === "string"
                ? entry.text
                : ""
            )
            .join("");
        }
        return "";
      })
      .filter(Boolean);

  if (segments && segments.length) {
    return segments.join("\n");
  }

  return null;
}

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

  const jsonText = extractJsonText(completion);

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

  const jsonText = extractJsonText(completion);

  if (!jsonText) {
    throw new Error("OpenAI response did not include JSON payload");
  }

  return JSON.parse(jsonText);
}
