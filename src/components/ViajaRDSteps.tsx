 "use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Locale = "es" | "en";

const translations = {
  heading: {
    es: "Viajar a República Dominicana",
    en: "Travel to Dominican Republic",
  },
  subheading: {
    es: "Paso a paso",
    en: "Step by step",
  },
  progress: {
    es: (step: number, total: number) => `Paso ${step} de ${total}`,
    en: (step: number, total: number) => `Step ${step} of ${total}`,
  },
  actions: {
    complete: { es: "Completar paso", en: "Complete step" },
    next: { es: "Siguiente", en: "Next" },
    prev: { es: "Anterior", en: "Previous" },
    help: { es: "Ayuda", en: "Help" },
    needFlight: {
      es: "Necesito comprar vuelo",
      en: "Need to buy a flight",
    },
    haveFlight: {
      es: "Ya tengo vuelo",
      en: "I already have a flight",
    },
    flightNumber: {
      es: "Número de vuelo",
      en: "Flight number",
    },
    flightDate: {
      es: "Fecha de viaje",
      en: "Travel date",
    },
    buyHere: {
      es: "Comprar aquí",
      en: "Buy here",
    },
  },
};

const stepIcons: Record<string, string> = {
  flight: "✈️",
  passport: "🛂",
  eticket: "🧾",
  documents: "📄",
  health: "🩺",
  checkin: "✅",
  arrival: "🧳",
};

const steps = [
  {
    key: "flight",
    title: { es: "Reservar vuelo", en: "Book flight" },
    instruction: {
      es: "Elige la fecha y aerolínea que prefieras para viajar a RD.",
      en: "Choose your preferred date and airline for your trip to DR.",
    },
  },
  {
    key: "passport",
    title: { es: "Verificar pasaporte", en: "Verify passport" },
    instruction: {
      es: "Confirma que tu pasaporte tiene al menos 6 meses de vigencia.",
      en: "Make sure your passport is valid for at least 6 more months.",
    },
  },
  {
    key: "eticket",
    title: { es: "Formulario E-Ticket (Erikes)", en: "E-Ticket form (Erikes)" },
    instruction: {
      es: "Completa el formulario E-Ticket antes de volar.",
      en: "Fill the online E-Ticket form before you fly.",
    },
  },
  {
    key: "documents",
    title: { es: "Preparar documentos", en: "Prepare documents" },
    instruction: {
      es: "Reúne boletos, reservas y cualquier carta de invitación.",
      en: "Gather tickets, reservations, and any invitation letters.",
    },
  },
  {
    key: "health",
    title: { es: "Confirmar salud/seguro", en: "Confirm health/insurance" },
    instruction: {
      es: "Valida que tu seguro médico cubre el viaje y lleva tus recetas.",
      en: "Ensure your health insurance covers the trip and pack prescriptions.",
    },
  },
  {
    key: "checkin",
    title: { es: "Check-in", en: "Check-in" },
    instruction: {
      es: "Haz check-in online o en el aeropuerto con tiempo.",
      en: "Check in online or at the airport with enough time.",
    },
  },
  {
    key: "arrival",
    title: { es: "Llegada y aduana", en: "Arrival and customs" },
    instruction: {
      es: "Presenta tus documentos y sigue las señales de aduana.",
      en: "Show your documents and follow customs instructions.",
    },
  },
];

export function ViajaRDSteps() {
  const [locale, setLocale] = useState<Locale>("es");
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(
    Array(steps.length).fill(false)
  );
  const [flightNumber, setFlightNumber] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [needsFlight, setNeedsFlight] = useState(false);

  const trustedAirlines = [
    {
      id: "delta",
      name: "Delta",
      link:
        process.env.NEXT_PUBLIC_AFFILIATE_DELTA ||
        "https://www.delta.com/?ref=iaguard",
    },
    {
      id: "aa",
      name: "American",
      link:
        process.env.NEXT_PUBLIC_AFFILIATE_AA ||
        "https://www.aa.com/?ref=iaguard",
    },
    {
      id: "jetblue",
      name: "JetBlue",
      link:
        process.env.NEXT_PUBLIC_AFFILIATE_JETBLUE ||
        "https://www.jetblue.com/?ref=iaguard",
    },
  ];

  const progress = useMemo(
    () =>
      completed.filter(Boolean).length / steps.length ||
      currentStep / steps.length,
    [completed, currentStep]
  );

  const playSuccessTone = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = 660;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
  };

  const handleCompleteStep = () => {
    if (completed[currentStep]) return;
    if (steps[currentStep].key === "flight" && !needsFlight) {
      if (flightNumber.trim().length < 3 || !flightDate) return;
    }
    const updated = [...completed];
    updated[currentStep] = true;
    setCompleted(updated);
    playSuccessTone();
  };

  const handleNext = () => {
    if (!completed[currentStep] || currentStep === steps.length - 1) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const current = steps[currentStep];
  const allComplete = completed.every(Boolean);

  const accent = "from-amber-500 via-orange-500 to-amber-700";

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-amber-100 px-4 py-10 text-amber-950">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-amber-200 bg-gradient-to-b from-orange-100 via-amber-50 to-orange-50 shadow-[0_25px_80px_rgba(0,0,0,0.15)]">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.25),transparent_45%)]" />
          <header className="flex flex-col gap-4 px-6 pb-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
                ViajaRD
              </p>
              <h1 className="text-3xl font-black text-amber-900 drop-shadow-sm">
                {translations.heading[locale]}
              </h1>
              <p className="text-lg font-semibold text-amber-700">
                {translations.subheading[locale]} ·{" "}
                {translations.progress[locale](currentStep + 1, steps.length)}
              </p>
            </div>
            <div className="flex gap-2">
              {(["es", "en"] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => setLocale(code)}
                  className={`rounded-full px-4 py-2 text-lg font-semibold shadow ${
                    locale === code
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-300/60"
                      : "bg-white/70 text-amber-800 border border-amber-200"
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </header>

          <div className="px-6 pb-6">
            <div className="h-4 rounded-full bg-amber-100 shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${accent} transition-all`}
                style={{
                  width: `${Math.max(progress, (currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="grid gap-4 px-6 pb-8">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isDone = completed[index];
              return (
                <div
                  key={step.key}
                  className={`flex items-center justify-between rounded-3xl border bg-white/90 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    isActive
                      ? "border-orange-300 shadow-orange-200/80"
                      : "border-amber-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-orange-200 text-2xl shadow-inner">
                      {stepIcons[step.key]}
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-amber-900">
                        {step.title[locale]}
                      </p>
                      <p className="text-sm text-amber-700">
                        {step.instruction[locale]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                        ✓
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                        ○
                      </span>
                    )}
                    <button
                      className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-amber-800 shadow-sm border border-amber-200"
                      onClick={() => setCurrentStep(index)}
                    >
                      {locale === "es" ? "Ir" : "Go"}
                    </button>
                  </div>
                  {isActive && step.key === "flight" && (
                    <div className="mt-4 grid w-full gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-sm text-amber-800">
                          {translations.actions.flightNumber[locale]}
                          <input
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-amber-900 shadow-inner placeholder:text-amber-400 focus:border-orange-400 focus:outline-none"
                            placeholder="AA1234"
                          />
                        </label>
                        <label className="text-sm text-amber-800">
                          {translations.actions.flightDate[locale]}
                          <input
                            type="date"
                            value={flightDate}
                            onChange={(e) => setFlightDate(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-amber-900 shadow-inner focus:border-orange-400 focus:outline-none"
                          />
                        </label>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setNeedsFlight((prev) => !prev)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            needsFlight
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow"
                              : "bg-white text-amber-900 border border-amber-200"
                          }`}
                        >
                          {needsFlight
                            ? translations.actions.haveFlight[locale]
                            : translations.actions.needFlight[locale]}
                        </button>
                        {needsFlight && (
                          <div className="flex flex-wrap gap-2 text-sm text-amber-800">
                            {trustedAirlines.map((airline) => (
                              <a
                                key={airline.id}
                                href={airline.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-amber-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-orange-300"
                              >
                                {airline.name} · {translations.actions.buyHere[locale]}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-amber-200 bg-white/80 px-6 py-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex-1 rounded-2xl border border-amber-200 bg-white px-4 py-4 text-lg font-semibold text-amber-900 shadow-sm disabled:opacity-40"
              >
                ◀ {translations.actions.prev[locale]}
              </button>
              <button
                onClick={handleCompleteStep}
                className="flex-1 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-4 text-lg font-semibold text-white shadow-lg"
              >
                ✔ {translations.actions.complete[locale]}
              </button>
              <button
                onClick={handleNext}
                disabled={!completed[currentStep] || currentStep === steps.length - 1}
                className="flex-1 rounded-2xl border border-amber-200 bg-white px-4 py-4 text-lg font-semibold text-amber-900 shadow-sm disabled:opacity-40"
              >
                {translations.actions.next[locale]} ▶
              </button>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${currentStep}-${completed[currentStep]}`}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className="mt-6 flex items-center gap-4 rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-200 to-amber-200 text-2xl shadow-inner">
                  {completed[currentStep] ? "✅" : "🕒"}
                </div>
                <p className="text-lg font-semibold text-amber-900">
                  {completed[currentStep]
                    ? locale === "es"
                      ? "Paso completado. ¡Buen trabajo!"
                      : "Step completed. Great job!"
                    : locale === "es"
                    ? "Marca el paso como completado para continuar."
                    : "Mark this step as complete to continue."}
                </p>
              </motion.div>
            </AnimatePresence>

            {allComplete && (
              <div className="mt-6 rounded-3xl border-2 border-emerald-400 bg-emerald-50 p-5 text-center shadow-inner">
                <p className="text-2xl font-bold text-emerald-700">
                  {locale === "es"
                    ? "¡Listo! Estás preparado para tu viaje."
                    : "All set! You're ready for your trip."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-lg font-semibold text-white shadow-xl"
        onClick={() =>
          alert(
            locale === "es"
              ? "Un asesor te contactará pronto."
              : "A travel assistant will reach out soon."
          )
        }
      >
        {translations.actions.help[locale]}
      </button>
    </section>
  );
}
