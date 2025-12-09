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
    console.warn("OPENAI_API_KEY missing. Returning fallback simulation.");
    return fallbackSimulation(marca, escenario);
  }

  const userPrompt = IA_ACADEMY_PHISH_SIM_PROMPT(marca, escenario);

  try {
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
  } catch (error) {
    console.error("Error generating phishing simulation:", error);
    return fallbackSimulation(marca, escenario);
  }
}

export async function generarLeccionTeorica({
  titulo,
  nivel,
}: {
  titulo: string;
  nivel: string;
}) {
  if (!openai.apiKey) {
    console.warn("OPENAI_API_KEY is not configured. Returning fallback lesson.");
    return fallbackLesson(titulo, nivel);
  }

  const userPrompt = IA_ACADEMY_LESSON_PROMPT(titulo, nivel);

  try {
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
  } catch (error) {
    console.error("Error generating lesson with OpenAI:", error);
    return fallbackLesson(titulo, nivel);
  }
}

function fallbackLesson(titulo: string, nivel: string) {
  return {
    tipo: "lesson",
    titulo,
    nivel,
    resumen:
      "Aprende a identificar mensajes sospechosos, interpretar señales de ingeniería social y tomar decisiones inmediatas para proteger a tu familia o equipo.",
    secciones: [
      {
        subtitulo: "Señales clave en correos y chats",
        contenido_html:
          "<p>Busca urgencia artificial, solicitudes de pago inesperadas y dominios similares al original (ej. secure-paypal-us.com).</p><ul><li>Verifica el remitente y los enlaces antes de dar clic.</li><li>No compartas códigos 2FA o contraseñas por chat.</li><li>Cuando tengas duda, comunícate por un canal oficial.</li></ul>",
      },
      {
        subtitulo: "Revisión rápida antes de responder",
        contenido_html:
          "<p>Comparte el mensaje con IA Shield o tu equipo antes de contestar. Documenta la fecha, origen y screenshots para auditoría.</p><ul><li>Revisa si hay archivos adjuntos o links acortados.</li><li>Evalúa si el tono coincide con la persona o empresa real.</li><li>Si mencionan pagos, valida con finanzas antes de mover dinero.</li></ul>",
      },
    ],
    mini_quiz: [
      {
        pregunta:
          "Un correo dice: “Último aviso, transfiere hoy mismo a esta nueva cuenta o perderás el contrato”. ¿Qué haces?",
        opciones: [
          "Respondes y solicitas más detalles",
          "Verificas por teléfono con el contacto real",
          "Haces la transferencia para evitar problemas",
          "Ignoras el mensaje por completo",
        ],
        respuesta_correcta: "Verificas por teléfono con el contacto real",
        explicacion:
          "Los cambios urgentes de cuenta son comunes en fraudes BEC. Siempre valida por un canal confiable antes de pagar.",
      },
    ],
    checklist_final: [
      "Detecta urgencia o miedo como señal de alerta.",
      "Consulta dominios y enlaces en un visor seguro antes de abrirlos.",
      "Escala mensajes dudosos al equipo de seguridad o IA Shield para análisis.",
    ],
  };
}

function fallbackSimulation(marca: string, escenario: string) {
  return {
    tipo: "phish_simulation",
    subject: `[${marca}] Acción requerida inmediatamente`,
    from_name: `${marca} Alerts`,
    from_email: `alertas@${marca.toLowerCase()}-secure-review.com`,
    body_text: `Hola,

Recibimos un reporte de actividad inusual en tu ${marca}. Para evitar el cierre automático, verifica tu información antes de las próximas 2 horas:

https://${marca.toLowerCase()}-secure-checkup.support-account.com

Si no completas la revisión hoy, bloquearemos los pagos y transferencias asociados.

Equipo de Seguridad`,
    body_html:
      "<p>Hola,</p><p>Detectamos actividad inusual en tu cuenta. Para evitar el cierre, <strong>verifica tus datos</strong> antes de 2 horas:</p><p><a href='https://secure-review-login-account.com'>https://secure-review-login-account.com</a></p><p>De lo contrario bloquearemos temporalmente tus pagos.</p><p>Equipo de Seguridad</p>",
    indicadores_riesgo: [
      "URL sospechosa: secure-review-login-account.com no pertenece a la marca.",
      "Urgencia artificial: amenaza de bloqueo en 2 horas.",
      "Suplantación de marca: remitente falso que imita notificaciones oficiales.",
    ],
    nivel_estimado: "Básico",
    xp_base: 40,
  };
}
