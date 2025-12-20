"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ViajaRDFlightState, ViajaRDPassportEntry } from "@/components/ViajaRDSteps";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type ViajaRDTicketPrefill = Record<string, string>;

type AssistantProps = {
  flight: ViajaRDFlightState;
  onFlightChange: (flight: ViajaRDFlightState) => void;
  passports: ViajaRDPassportEntry[];
  onPassportsChange: (passports: ViajaRDPassportEntry[]) => void;
  onTicketPrefill: (prefill: ViajaRDTicketPrefill) => void;
  onComplete: () => void;
};

function createSessionId() {
  if (typeof window === "undefined") return "";
  const stored = window.localStorage.getItem("viajard_session_id");
  if (stored) return stored;
  const id = window.crypto.randomUUID();
  window.localStorage.setItem("viajard_session_id", id);
  return id;
}

function extractEmail(text: string) {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0]?.trim() || "";
}

function normalizePhone(raw: string) {
  const digits = raw.replace(/[^\d+]/g, "");
  const normalized = digits.startsWith("+") ? digits : digits.replace(/\D/g, "");
  const numeric = normalized.replace(/\D/g, "");
  if (numeric.length < 7 || numeric.length > 15) return "";
  return normalized;
}

function extractPhone(text: string) {
  const keywordMatch = text.match(
    /(telefono|teléfono|whatsapp|celular|cel|phone)\D+([+()\d][\d\s().-]{6,}\d)/i
  );
  if (keywordMatch?.[2]) return normalizePhone(keywordMatch[2]);
  const genericMatch = text.match(/([+()\d][\d\s().-]{6,}\d)/);
  if (genericMatch?.[1]) return normalizePhone(genericMatch[1]);
  return "";
}

function extractName(text: string) {
  const labeledMatch = text.match(
    /(me llamo|soy|mi nombre es|nombre|name is)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-Za-zÁÉÍÓÚÑáéíóúñ]+){0,4})/i
  );
  if (labeledMatch?.[2]) return labeledMatch[2].trim();
  const plainName =
    /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-Za-zÁÉÍÓÚÑáéíóúñ]+){1,3}$/.test(
      text.trim()
    );
  return plainName ? text.trim() : "";
}

function extractFlightNumber(text: string) {
  const match = text.match(/\b([A-Z]{2}\s?\d{2,4})\b/);
  return match?.[1]?.replace(/\s+/g, "") || "";
}

function parseDate(text: string) {
  const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  const slashMatch = text.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, "0");
    const month = slashMatch[2].padStart(2, "0");
    return `${slashMatch[3]}-${month}-${day}`;
  }
  return "";
}

function extractPassportNumber(text: string) {
  const match = text.match(
    /(pasaporte|passport)\D+([A-Z0-9]{6,9})/i
  );
  return match?.[2]?.trim() || "";
}

function extractPassportExpiry(text: string) {
  const match = text.match(
    /(vencimiento|expira|expiry)\D+(\d{4}-\d{2}-\d{2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i
  );
  return match ? parseDate(match[2]) : "";
}

export function ViajaRDAssistant({
  flight,
  onFlightChange,
  passports,
  onPassportsChange,
  onTicketPrefill,
  onComplete,
}: AssistantProps) {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docStatus, setDocStatus] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSessionId(createSessionId());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!sessionId || messages.length) return;
    void sendMessage("", "launch");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  function applyExtraction(text: string) {
    const nextFlightNumber = extractFlightNumber(text);
    const nextFlightDate = parseDate(text);
    const nextNeedsFlight =
      /no tengo vuelo|sin vuelo|comprar vuelo|reservar vuelo/i.test(text) ||
      flight.needsFlight;

    if (nextFlightNumber || nextFlightDate || nextNeedsFlight !== flight.needsFlight) {
      onFlightChange({
        flightNumber: nextFlightNumber || flight.flightNumber,
        flightDate: nextFlightDate || flight.flightDate,
        needsFlight: nextNeedsFlight,
      });
    }

    const name = extractName(text);
    const email = extractEmail(text);
    const phone = extractPhone(text);
    const passportNumber = extractPassportNumber(text);
    const passportExpiry = extractPassportExpiry(text);

    if (name || email || phone || passportNumber || passportExpiry) {
      const updated = passports.length
        ? passports.map((p, idx) =>
            idx === 0
              ? {
                  ...p,
                  name: name || p.name,
                  number: passportNumber || p.number,
                  expiry: passportExpiry || p.expiry,
                }
              : p
          )
        : [
            {
              id: 1,
              name: name,
              mode: "manual",
              number: passportNumber,
              expiry: passportExpiry,
              imageName: "",
            },
          ];
      onPassportsChange(updated);
    }

    const prefill: ViajaRDTicketPrefill = {};
    if (name) prefill.fullName = name;
    if (passportNumber) prefill.document = passportNumber;
    if (nextFlightNumber) prefill.flightNumber = nextFlightNumber;
    if (nextFlightDate) prefill.arrivalDate = nextFlightDate;
    if (phone) prefill.phone = phone;
    if (email) prefill.email = email;
    if (Object.keys(prefill).length) {
      onTicketPrefill(prefill);
    }
  }

  async function sendMessage(text: string, action?: "launch") {
    setLoading(true);
    if (text) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", text },
      ]);
      applyExtraction(text);
    }
    setInput("");

    try {
      const res = await fetch("/api/voiceflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: `viajard:${sessionId}`,
          message: text,
          action,
          project: "viajard",
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
        if (data.text.includes("[END]")) {
          onComplete();
        }
      }
      if (data.traces && Array.isArray(data.traces)) {
        const hasEnd = data.traces.some((trace: { type?: string }) => {
          const type = trace.type?.toLowerCase?.() || "";
          return (
            type === "end" ||
            type === "flow_end" ||
            type === "session_end" ||
            type === "exit" ||
            type === "finish"
          );
        });
        if (hasEnd) {
          onComplete();
        }
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

  async function handleDocumentUpload(file: File) {
    setDocStatus("");
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setDocStatus("Solo se admiten imágenes o PDF (JPG/PNG/PDF).");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("/api/viajard/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            dataUrl: reader.result,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "No se pudo leer el documento.");
        }
        if (data.extractedText) {
          applyExtraction(data.extractedText);
        }
        if (data.prefill) {
          applyExtraction(JSON.stringify(data.prefill));
          onTicketPrefill(data.prefill);
        }
        setDocStatus("Documento procesado y campos actualizados.");
      } catch (error) {
        setDocStatus(
          error instanceof Error ? error.message : "No se pudo leer el documento."
        );
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
            ViajaRD · Asistente IA
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            Auto completa tu viaje paso a paso
          </h2>
          <p className="text-lg text-zinc-400">
            Escríbeme o sube tu pasaporte/itinerario para rellenar los campos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:border-white/30"
        >
          Chat Inteligente · Extraer documentos
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void handleDocumentUpload(file);
            }
          }}
        />
      </div>

      {docStatus && <p className="mt-2 text-sm text-zinc-300">{docStatus}</p>}

      <div className="mt-6 h-[320px] overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-4">
        {messages.length === 0 && (
          <p className="text-zinc-500">Inicia la conversación con tu primera pregunta.</p>
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
          }
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Escribe tu información o pregunta..."
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
    </section>
  );
}
