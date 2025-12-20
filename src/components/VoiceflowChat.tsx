"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type LeadForm = {
  name: string;
  email: string;
  phone: string;
};

const END_KEYWORDS = [
  "listo",
  "gracias",
  "terminar",
  "bye",
  "adios",
  "adiós",
  "finalizar",
];

type SpeechRecognitionEvent = {
  results: Array<{ 0: { transcript: string } }>;
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function createSessionId() {
  if (typeof window === "undefined") return "";
  const stored = window.localStorage.getItem("vf_session_id");
  if (stored) return stored;
  const id = window.crypto.randomUUID();
  window.localStorage.setItem("vf_session_id", id);
  return id;
}

export function VoiceflowChat() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [lead, setLead] = useState<LeadForm>({
    name: "",
    email: "",
    phone: "",
  });
  const [leadStatus, setLeadStatus] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const lastSpokenId = useRef<string | null>(null);
  const autoSavedRef = useRef(false);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSessionId(createSessionId());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Recognition =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance })
        .webkitSpeechRecognition;

    if (!Recognition) return;
    const instance = new Recognition();
    instance.lang = "es-ES";
    instance.interimResults = false;
    instance.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    instance.onerror = () => setListening(false);
    instance.onend = () => setListening(false);
    recognitionRef.current = instance;
  }, []);

  useEffect(() => {
    if (!sessionId || messages.length) return;
    void sendMessage("", "launch");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    if (!ttsEnabled || typeof window === "undefined") return;
    const last = [...messages].reverse().find((msg) => msg.role === "assistant");
    if (!last || last.id === lastSpokenId.current) return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(last.text);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
    lastSpokenId.current = last.id;
  }, [messages, ttsEnabled]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  const lastUserMessage = useMemo(() => {
    return [...messages].reverse().find((msg) => msg.role === "user");
  }, [messages]);

  useEffect(() => {
    if (!lastUserMessage) return;
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      void autoSaveLead("inactivity");
    }, 60_000);
  }, [lastUserMessage]);

  function extractLeadFromMessages() {
    const userTexts = messages
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.text);

    const fullText = userTexts.join(" ");
    const emailMatch = fullText.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );
    const phoneMatch = fullText.match(
      /(\+?\d[\d\s().-]{6,}\d)/
    );
    const nameMatch = fullText.match(
      /(me llamo|soy|mi nombre es)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-Za-zÁÉÍÓÚÑáéíóúñ]+){0,3})/i
    );

    return {
      name: nameMatch?.[2]?.trim() || "",
      email: emailMatch?.[0]?.trim() || "",
      phone: phoneMatch?.[1]?.trim() || "",
    };
  }

  function hasEndKeyword(text: string) {
    const normalized = text.toLowerCase();
    return END_KEYWORDS.some((word) =>
      new RegExp(`\\b${word}\\b`, "i").test(normalized)
    );
  }

  function tracesIndicateEnd(traces: Array<{ type: string; payload?: { message?: string } }>) {
    return traces.some((trace) => {
      const type = trace.type?.toLowerCase?.() || "";
      if (
        type === "end" ||
        type === "flow_end" ||
        type === "session_end" ||
        type === "exit" ||
        type === "finish"
      ) {
        return true;
      }
      const message = trace.payload?.message || "";
      return message.includes("[END]");
    });
  }

  async function autoSaveLead(trigger: "keyword" | "inactivity" | "voiceflow_end") {
    if (autoSavedRef.current) return;
    const extracted = extractLeadFromMessages();
    if (!extracted.name && !extracted.email && !extracted.phone) return;

    autoSavedRef.current = true;
    setLead((prev) => ({
      name: extracted.name || prev.name,
      email: extracted.email || prev.email,
      phone: extracted.phone || prev.phone,
    }));

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...extracted,
          source: "web-chat-auto",
          notes: `Auto-captura (${trigger}). Último mensaje: "${lastUserMessage?.text ?? ""}"`,
          metadata: {
            sessionId,
            trigger,
            conversation: messages.slice(-20),
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo guardar el lead.");
      }
      setLeadStatus("Datos guardados automáticamente.");
    } catch (error) {
      autoSavedRef.current = false;
      setLeadStatus(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el lead."
      );
    }
  }

  async function sendMessage(text: string, action?: "launch") {
    setLoading(true);
    if (text) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", text },
      ]);
    }
    setInput("");

    try {
      const res = await fetch("/api/voiceflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: text,
          action,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Voiceflow error");
      }

      if (data.text) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", text: data.text },
        ]);
      }
      if (data.traces && tracesIndicateEnd(data.traces)) {
        void autoSaveLead("voiceflow_end");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "No se pudo conectar con el asistente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function toggleListening() {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setLeadStatus("Tu navegador no soporta reconocimiento de voz.");
      return;
    }
    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }
    setListening(true);
    recognition.start();
  }

  async function submitLead() {
    setLeadStatus("");
    if (!lead.name.trim() || !lead.phone.trim()) {
      setLeadStatus("Completa nombre y telefono.");
      return;
    }
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          source: "web-chat",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo guardar el lead.");
      }
      setLeadStatus("Listo. Te contactaremos pronto.");
      setLead({ name: "", email: "", phone: "" });
    } catch (error) {
      setLeadStatus(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el lead."
      );
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
              AI Guard · Chat IA
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Asistente experto con documentos
            </h2>
            <p className="text-lg text-zinc-400">
              Pregunta sobre el PDF y obtén respuestas en segundos.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setTtsEnabled((prev) => !prev)}
              className="rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:border-white/40"
            >
              {ttsEnabled ? "🔊 Voz activada" : "🔇 Voz desactivada"}
            </button>
          </div>
        </div>

        <div className="mt-6 h-[420px] overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-4">
          {messages.length === 0 && (
            <p className="text-zinc-500">
              Inicia la conversación con tu primera pregunta.
            </p>
          )}
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-emerald-600 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[60%] rounded-2xl bg-white/10 px-4 py-3 text-sm text-zinc-300">
                Escribiendo...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSend) {
              void sendMessage(input.trim());
              if (hasEndKeyword(input)) {
                void autoSaveLead("keyword");
              }
            }
          }}
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`rounded-2xl px-4 py-3 text-lg font-semibold text-white transition ${
              listening
                ? "bg-red-500/80"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {listening ? "🎙️..." : "🎙️"}
          </button>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-neonGreen focus:outline-none"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-2xl bg-neonGreen px-6 py-3 text-lg font-semibold text-white disabled:opacity-40"
          >
            Enviar
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <h3 className="text-2xl font-semibold">Captura de leads</h3>
        <p className="mt-2 text-sm text-zinc-400">
          Si necesitas un asesor humano, deja tus datos y te contactamos.
        </p>
        <div className="mt-4 space-y-3">
          <input
            value={lead.name}
            onChange={(event) =>
              setLead((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Nombre completo"
            className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-neonGreen focus:outline-none"
          />
          <input
            value={lead.email}
            onChange={(event) =>
              setLead((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Correo (opcional)"
            className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-neonGreen focus:outline-none"
          />
          <input
            value={lead.phone}
            onChange={(event) =>
              setLead((prev) => ({ ...prev, phone: event.target.value }))
            }
            placeholder="Telefono/WhatsApp"
            className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-neonGreen focus:outline-none"
          />
          <button
            onClick={submitLead}
            className="w-full rounded-2xl bg-neonGreen px-6 py-3 text-lg font-semibold text-white"
          >
            Enviar mis datos
          </button>
          {leadStatus && (
            <p className="text-sm text-zinc-300">{leadStatus}</p>
          )}
        </div>
      </div>
    </section>
  );
}
