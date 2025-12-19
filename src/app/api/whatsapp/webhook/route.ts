import { NextResponse } from "next/server";
import { sendToVoiceflow } from "@/lib/voiceflow";

type WhatsAppTextMessage = {
  from: string;
  id: string;
  timestamp: string;
  text?: { body?: string };
  type: "text";
};

type WhatsAppWebhookBody = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: WhatsAppTextMessage[];
        statuses?: unknown[];
        metadata?: {
          phone_number_id?: string;
        };
      };
    }>;
  }>;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token && verifyToken && token === verifyToken) {
    return new Response(challenge ?? "", { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WhatsAppWebhookBody;
    const change = body.entry?.[0]?.changes?.[0]?.value;
    const messages = change?.messages ?? [];

    if (!messages.length) {
      return NextResponse.json({ status: "ignored" });
    }

    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId =
      process.env.WHATSAPP_PHONE_NUMBER_ID || change?.metadata?.phone_number_id;

    if (!accessToken || !phoneNumberId) {
      return NextResponse.json(
        { error: "Missing WhatsApp credentials" },
        { status: 500 }
      );
    }

    for (const message of messages) {
      if (message.type !== "text") continue;
      const text = message.text?.body?.trim() || "";
      const sessionId = `whatsapp:${message.from}`;

      const voiceflow = await sendToVoiceflow(sessionId, {
        type: "text",
        payload: text,
      });

      const reply =
        voiceflow.text ||
        "Gracias por tu mensaje. Un asesor te contactará pronto.";

      await fetch(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: message.from,
            type: "text",
            text: { body: reply },
          }),
        }
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
