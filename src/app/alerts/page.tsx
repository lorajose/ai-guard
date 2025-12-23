"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleProvider";

const copy = {
  es: {
    eyebrow: "LexFocus",
    title: "Actualizaciones críticas sin ruido innecesario.",
    subtitle:
      "Recibe solo cambios reales en tu nicho profesional. 3 puntos claros por WhatsApp o Email cuando algo importante sucede.",
    hookTitle: "Hoy · Alertas críticas",
    alerts: [
      {
        title: "Nueva regulación de datos en salud",
        body:
          "Qué cambió: 3 obligaciones inmediatas para clínicas privadas. Acción: actualiza tus consentimientos hoy.",
      },
      {
        title: "Leyes de IA en Europa",
        body:
          "Qué cambió: requisitos de auditoría para proveedores. Acción: revisar modelos de alto riesgo.",
      },
      {
        title: "Novedades en odontología láser",
        body:
          "Qué cambió: nuevo protocolo de calibración. Acción: ajustar equipos antes de fin de mes.",
      },
    ],
    paywallTitle: "No pierdas el próximo cambio crítico.",
    paywallBody:
      "El 80% de los profesionales se enteran tarde. Recibe alertas estratégicas en tu WhatsApp por solo $1/semana.",
    cta: "Activar alertas por $1/semana",
    pricingNote: "Cancela cuando quieras.",
    demo: {
      label: "Demo interactivo",
      prompt: "Selecciona un nicho para ver el resumen del día:",
      niches: ["Leyes de IA", "Odontología Láser", "Finanzas Cripto"],
      blurredHint: "Contenido premium bloqueado",
      unlock: "Desbloquear por $1/semana",
    },
    stackTitle: "Cómo funciona detrás de escena",
    stackItems: [
      "Rastreadores oficiales (boletines, portales, revistas).",
      "IA filtra ruido y resume en 3 puntos clave.",
      "Entrega por WhatsApp o Email cuando hay cambios reales.",
    ],
  },
  en: {
    eyebrow: "LexFocus",
    title: "Critical updates without the noise.",
    subtitle:
      "Receive only real changes in your niche. 3 clear points via WhatsApp or Email when it matters.",
    hookTitle: "Today · Critical alerts",
    alerts: [
      {
        title: "New health data regulation",
        body:
          "What changed: 3 immediate obligations for clinics. Action: update consents today.",
      },
      {
        title: "EU AI compliance update",
        body:
          "What changed: audit requirements for providers. Action: review high‑risk models.",
      },
      {
        title: "Laser dentistry update",
        body:
          "What changed: new calibration protocol. Action: adjust equipment before month‑end.",
      },
    ],
    paywallTitle: "Don't miss the next critical change.",
    paywallBody:
      "80% of professionals find out too late. Get strategic alerts on WhatsApp for just $1/week.",
    cta: "Activate alerts for $1/week",
    pricingNote: "Cancel anytime.",
    demo: {
      label: "Interactive demo",
      prompt: "Pick a niche to preview today’s briefs:",
      niches: ["AI laws", "Laser dentistry", "Crypto finance"],
      blurredHint: "Premium content locked",
      unlock: "Unlock for $1/week",
    },
    stackTitle: "How it works behind the scenes",
    stackItems: [
      "Official sources (bulletins, portals, journals).",
      "AI filters noise and summarizes 3 key points.",
      "Delivery via WhatsApp or Email when changes happen.",
    ],
  },
};

export default function AlertsPage() {
  const { locale } = useLocale();
  const t = copy[locale];
  const [selectedNiche, setSelectedNiche] = useState(0);
  const demoItems = useMemo(() => {
    const items = [
      [
        "Nueva regulación de datos en salud",
        "Ley de IA europea",
        "Actualización fiscal para clínicas",
        "Impacto en seguros médicos",
      ],
      [
        "Protocolos de calibración láser",
        "Nuevos límites de potencia",
        "Norma de consentimiento informado",
        "Actualización de equipos",
      ],
      [
        "MiCA 2.0 y stablecoins",
        "ETF de SOL aprobado",
        "Requisitos de reservas 1:1",
        "Impuestos sobre staking",
      ],
    ];
    return items[selectedNiche] || items[0];
  }, [selectedNiche]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black px-6 pb-16 pt-24 text-white">
      <section className="mx-auto max-w-5xl space-y-10">
        <header className="rounded-3xl border border-white/10 bg-black/50 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-300 sm:text-base">
            {t.subtitle}
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-lg font-semibold">{t.hookTitle}</h2>
          <div className="mt-4 grid gap-4">
            {t.alerts.map((alert) => (
              <div
                key={alert.title}
                className="rounded-2xl border border-white/10 bg-black/60 p-4"
              >
                <p className="text-sm font-semibold">{alert.title}</p>
                <p className="mt-2 text-sm text-zinc-300">{alert.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
            <div className="relative bg-black/70 p-6">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]" />
              <div className="relative z-10 space-y-3 text-center">
                <p className="text-lg font-semibold">{t.paywallTitle}</p>
                <p className="text-sm text-zinc-300">{t.paywallBody}</p>
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                  <a
                    href="/pricing"
                    className="rounded-full bg-neonGreen px-5 py-2 text-sm font-semibold text-white"
                  >
                    {t.cta}
                  </a>
                  <span className="text-xs text-zinc-400">{t.pricingNote}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/50 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                {t.demo.label}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                {t.demo.prompt}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {t.demo.niches.map((niche, index) => (
                <button
                  key={niche}
                  onClick={() => setSelectedNiche(index)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    selectedNiche === index
                      ? "border-neonGreen bg-neonGreen text-white"
                      : "border-white/10 text-zinc-300 hover:border-white/30"
                  }`}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {demoItems.slice(0, 2).map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-black/60 p-4"
              >
                <p className="text-sm font-semibold text-white">{item}</p>
                <p className="mt-2 text-xs text-zinc-300">
                  Qué cambió, impacto y acción en 3 puntos rápidos.
                </p>
              </div>
            ))}
          </div>
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4">
            <div className="space-y-3 blur-sm">
              {demoItems.slice(2).map((item) => (
                <div key={item} className="rounded-xl border border-white/10 p-3">
                  <p className="text-sm font-semibold text-white">{item}</p>
                  <p className="mt-2 text-xs text-zinc-300">
                    Resumen completo disponible para suscriptores.
                  </p>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-center">
              <p className="text-sm font-semibold text-white">
                {t.demo.blurredHint}
              </p>
              <button className="mt-3 rounded-full bg-neonGreen px-4 py-2 text-sm font-semibold text-white">
                {t.demo.unlock}
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/50 p-6">
          <h2 className="text-lg font-semibold">{t.stackTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {t.stackItems.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
