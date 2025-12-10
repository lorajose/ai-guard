 "use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Locale = "es" | "en";

const translations = {
  heading: {
    es: "ViajaRD · Paso a Paso del Viaje",
    en: "ViajaRD · Step-by-Step Journey",
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
  },
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

  return (
    <section className="min-h-screen bg-white px-4 py-10 text-black">
      <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{translations.heading[locale]}</h1>
            <p className="text-xl text-zinc-600">
              {translations.progress[locale](currentStep + 1, steps.length)}
            </p>
          </div>
          <div className="flex gap-2">
            {(["es", "en"] as const).map((code) => (
              <button
                key={code}
                onClick={() => setLocale(code)}
                className={`rounded-full px-4 py-2 text-lg font-semibold ${
                  locale === code ? "bg-black text-white" : "bg-zinc-200 text-black"
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <div className="mt-6">
          <div className="h-4 rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-black transition-all"
              style={{ width: `${Math.max(progress, (currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xl font-semibold uppercase tracking-wide text-zinc-500">
            {current.title[locale]}
          </p>
          <p className="mt-3 text-2xl leading-relaxed text-black">
            {current.instruction[locale]}
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 rounded-2xl bg-zinc-100 px-4 py-4 text-2xl font-semibold disabled:opacity-40"
          >
            ◀ {translations.actions.prev[locale]}
          </button>
          <button
            onClick={handleCompleteStep}
            className="flex-1 rounded-2xl bg-emerald-500 px-4 py-4 text-2xl font-semibold text-white"
          >
            ✔ {translations.actions.complete[locale]}
          </button>
          <button
            onClick={handleNext}
            disabled={!completed[currentStep] || currentStep === steps.length - 1}
            className="flex-1 rounded-2xl bg-black px-4 py-4 text-2xl font-semibold text-white disabled:opacity-40"
          >
            {translations.actions.next[locale]} ▶
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${currentStep}-${completed[currentStep]}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="mt-10 flex items-center gap-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-6"
          >
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-300" />
              {completed[currentStep] && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-green-500"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.svg
                    viewBox="0 0 52 52"
                    className="h-full w-full stroke-green-500"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <motion.path
                      fill="none"
                      strokeWidth="6"
                      d="M14 27 l8 8 18 -18"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.div>
              )}
            </div>
            <p className="text-2xl font-semibold text-black">
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
          <div className="mt-10 rounded-3xl border-2 border-emerald-500 bg-emerald-500/10 p-6 text-center">
            <p className="text-3xl font-bold text-emerald-600">
              {locale === "es"
                ? "¡Listo! Estás preparado para tu viaje."
                : "All set! You're ready for your trip."}
            </p>
          </div>
        )}
      </div>

      <button
        className="fixed bottom-6 right-6 rounded-full bg-black px-6 py-4 text-2xl font-semibold text-white shadow-xl"
        onClick={() => alert(locale === "es" ? "Un asesor te contactará pronto." : "A travel assistant will reach out soon.")}
      >
        {translations.actions.help[locale]}
      </button>
    </section>
  );
}
