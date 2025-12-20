import { NextResponse } from "next/server";
import OpenAI from "openai";
import pdfParse from "pdf-parse";

type ExtractRequest = {
  fileName?: string;
  contentType?: string;
  dataUrl?: string;
};

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }
  return new OpenAI({ apiKey });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExtractRequest;
    const dataUrl = body.dataUrl || "";
    const isImage = body.contentType?.startsWith("image/") || dataUrl.startsWith("data:image/");
    const isPdf =
      body.contentType === "application/pdf" ||
      dataUrl.startsWith("data:application/pdf");

    if (!dataUrl || (!isImage && !isPdf)) {
      return NextResponse.json(
        { error: "Solo se admiten imágenes o PDF." },
        { status: 400 }
      );
    }

    const client = getOpenAI();
    let outputText = "";

    if (isImage) {
      const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: [
                  "Extrae datos de viaje desde esta imagen.",
                  "Devuelve JSON con estas claves si aparecen:",
                  "fullName, passportNumber, passportExpiry, flightNumber, flightDate, email, phone, airline.",
                  "Si no existe un dato, usa una cadena vacia.",
                ].join(" "),
              },
              {
                type: "input_image",
                image_url: dataUrl,
              },
            ],
          },
        ],
      });

      outputText =
        response.output_text?.trim() ||
        response.output?.map((item) => item.content?.[0]?.text).join(" ") ||
        "";
    }

    if (isPdf) {
      const base64 = dataUrl.split(",")[1] || "";
      const buffer = Buffer.from(base64, "base64");
      const parsed = await pdfParse(buffer);
      const pdfText = parsed.text?.trim() || "";

      const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: [
                  "Extrae datos de viaje desde este texto de PDF.",
                  "Devuelve JSON con estas claves si aparecen:",
                  "fullName, passportNumber, passportExpiry, flightNumber, flightDate, email, phone, airline.",
                  "Si no existe un dato, usa una cadena vacia.",
                  "Texto:",
                  pdfText.slice(0, 8000),
                ].join(" "),
              },
            ],
          },
        ],
      });

      outputText =
        response.output_text?.trim() ||
        response.output?.map((item) => item.content?.[0]?.text).join(" ") ||
        "";
    }

    let parsed: Record<string, string> = {};
    try {
      parsed = JSON.parse(outputText);
    } catch {
      parsed = {};
    }

    return NextResponse.json({
      prefill: {
        fullName: parsed.fullName || "",
        document: parsed.passportNumber || "",
        flightNumber: parsed.flightNumber || "",
        arrivalDate: parsed.flightDate || "",
        airline: parsed.airline || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
      },
      extractedText: outputText,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
