import { NextResponse } from "next/server";
import { sendToVoiceflow } from "@/lib/voiceflow";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = body.sessionId as string | undefined;
    const message = body.message as string | undefined;
    const action = body.action as "launch" | "text" | undefined;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const result =
      action === "launch" || !message
        ? await sendToVoiceflow(sessionId, { type: "launch" })
        : await sendToVoiceflow(sessionId, { type: "text", payload: message });

    return NextResponse.json({
      sessionId,
      text: result.text,
      traces: result.traces,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Voiceflow error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
