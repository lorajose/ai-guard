type VoiceflowTrace = {
  type: string;
  payload?: {
    message?: string;
  };
};

export type VoiceflowResult = {
  text: string;
  traces: VoiceflowTrace[];
};

type VoiceflowAction =
  | { type: "text"; payload: string }
  | { type: "launch" };

function getVoiceflowConfig() {
  const apiKey = process.env.VOICEFLOW_API_KEY;
  const versionId = process.env.VOICEFLOW_VERSION_ID;

  if (!apiKey || !versionId) {
    throw new Error(
      "Missing VOICEFLOW_API_KEY or VOICEFLOW_VERSION_ID environment variables."
    );
  }

  return { apiKey, versionId };
}

function extractText(traces: VoiceflowTrace[]) {
  const messages = traces
    .filter((trace) => trace.type === "text" || trace.type === "speak")
    .map((trace) => trace.payload?.message)
    .filter(Boolean) as string[];

  return messages.join("\n").trim();
}

export async function sendToVoiceflow(
  sessionId: string,
  action: VoiceflowAction
): Promise<VoiceflowResult> {
  const { apiKey, versionId } = getVoiceflowConfig();

  const response = await fetch(
    `https://general-runtime.voiceflow.com/state/user/${encodeURIComponent(
      sessionId
    )}/interact`,
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action:
          action.type === "launch"
            ? { type: "launch" }
            : { type: "text", payload: action.payload },
        config: { tts: false, stripSSML: true },
        versionID: versionId,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Voiceflow error: ${response.status} ${errorText}`);
  }

  const traces = (await response.json()) as VoiceflowTrace[];
  return { traces, text: extractText(traces) };
}
