import { NextResponse } from "next/server";
import { sendToVoiceflow } from "@/lib/voiceflow";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = body.sessionId as string | undefined;
    const message = body.message as string | undefined;
    const action = body.action as "launch" | "text" | undefined;
    const project = body.project as "viajard" | undefined;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    let config:
      | {
          apiKey: string;
          versionId: string;
        }
      | undefined;

    if (project === "viajard") {
      const apiKey = process.env.VOICEFLOW_API_KEY;
      const versionId = process.env.VOICEFLOW_VIAJARD_VERSION_ID;
      if (!apiKey || !versionId) {
        return NextResponse.json(
          { error: "Missing Voiceflow ViajaRD configuration." },
          { status: 500 }
        );
      }
      config = { apiKey, versionId };
    }

    const result =
      action === "launch" || !message
        ? await sendToVoiceflow(sessionId, { type: "launch" }, config)
        : await sendToVoiceflow(
            sessionId,
            { type: "text", payload: message },
            config
          );

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
