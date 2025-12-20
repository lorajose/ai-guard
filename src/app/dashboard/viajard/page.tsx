"use client";

import { useState } from "react";
import {
  ViajaRDSteps,
  ViajaRDFlightState,
  ViajaRDPassportEntry,
} from "@/components/ViajaRDSteps";
import { ViajaRDETicketForm } from "@/components/ViajaRDETicket";
import { ViajaRDFlightLinks } from "@/components/ViajaRDFlightLinks";
import { ViajaRDAssistant } from "@/components/ViajaRDAssistant";
import { DashboardShell } from "@/components/DashboardShell";

export default function ViajaRDScreen() {
  const [mode, setMode] = useState<"manual" | "assistant" | null>(null);
  const [assistantComplete, setAssistantComplete] = useState(false);
  const [flight, setFlight] = useState<ViajaRDFlightState>({
    flightNumber: "",
    flightDate: "",
    needsFlight: false,
  });
  const [passports, setPassports] = useState<ViajaRDPassportEntry[]>([
    {
      id: 1,
      name: "",
      mode: "manual",
      number: "",
      expiry: "",
      imageName: "",
    },
  ]);
  const [ticketPrefill, setTicketPrefill] = useState<Record<string, string>>({});

  return (
    <DashboardShell>
      <div className="space-y-12">
      {mode && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setMode(null);
              setAssistantComplete(false);
            }}
            className="rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm font-semibold text-white hover:border-white/30"
          >
            ← Volver
          </button>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            ViajaRD
          </p>
        </div>
      )}
      {!mode && (
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-b from-amber-200/20 via-orange-100/10 to-transparent p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
            ViajaRD
          </p>
          <h1 className="mt-2 text-4xl font-black text-white">
            Viajar a República Dominicana
          </h1>
          <p className="mt-2 text-lg text-zinc-300">
            Elige cómo quieres completar tu E‑Ticket y pasos de viaje.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setMode("manual")}
              className="rounded-3xl border border-white/10 bg-black/70 p-6 text-left transition hover:border-white/30"
            >
              <p className="text-sm uppercase tracking-wide text-amber-200">
                Modo manual
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Completar paso a paso
              </h2>
              <p className="mt-2 text-sm text-zinc-200">
                Llenas cada sección con tus datos y documentos.
              </p>
              <span className="mt-4 inline-flex rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
                Empezar manual
              </span>
            </button>

            <button
              onClick={() => setMode("assistant")}
              className="rounded-3xl border border-neonGreen/50 bg-neonGreen/10 p-6 text-left transition hover:border-neonGreen/80"
            >
              <p className="text-sm uppercase tracking-wide text-neonGreen">
                Asistente IA
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Auto‑completar con IA
              </h2>
              <p className="mt-2 text-sm text-zinc-100">
                Chat inteligente que extrae datos de tus documentos.
              </p>
              <span className="mt-4 inline-flex rounded-full bg-neonGreen px-4 py-2 text-sm font-semibold text-white">
                Usar asistente
              </span>
            </button>
          </div>
        </section>
      )}

      {mode === "assistant" && (
        <ViajaRDAssistant
          flight={flight}
          onFlightChange={setFlight}
          passports={passports}
          onPassportsChange={setPassports}
          onTicketPrefill={(prefill) =>
            setTicketPrefill((prev) => ({ ...prev, ...prefill }))
          }
          onComplete={() => setAssistantComplete(true)}
        />
      )}

      {mode === "manual" && (
        <>
          <ViajaRDSteps
            flight={flight}
            onFlightChange={setFlight}
            passports={passports}
            onPassportsChange={setPassports}
          />
          <ViajaRDETicketForm prefill={ticketPrefill} />
          <ViajaRDFlightLinks />
        </>
      )}

      {mode === "assistant" && assistantComplete && (
        <section className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            ViajaRD · Resumen
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            Tus pasos están completados
          </h2>
          <p className="mt-2 text-sm text-emerald-100/80">
            Revisa tu información y descarga tu E‑Ticket.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-lg font-semibold">Checklist final</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li>✅ Vuelo reservado o asistido</li>
                <li>✅ Pasaporte verificado</li>
                <li>✅ Formulario E‑Ticket listo</li>
                <li>✅ Documentos preparados</li>
                <li>✅ Salud/seguro confirmados</li>
                <li>✅ Check‑in y llegada</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-lg font-semibold">Acciones finales</p>
              <div className="mt-3 flex flex-col gap-3">
                <button
                  onClick={() => window.print()}
                  className="rounded-2xl bg-neonGreen px-4 py-3 text-sm font-semibold text-white"
                >
                  Imprimir / Guardar E‑Ticket en PDF
                </button>
                <button
                  onClick={() => alert("Próximamente: Guardar en Wallet")}
                  className="rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-white"
                >
                  Guardar en Wallet
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      </div>
    </DashboardShell>
  );
}
