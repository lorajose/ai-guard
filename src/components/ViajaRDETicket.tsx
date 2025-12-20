"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Locale = "es" | "en";

const sectionCopy = [
  {
    key: "personal",
    label: { es: "Datos personales", en: "Personal information" },
    fields: [
      { name: "fullName", label: { es: "Nombre completo", en: "Full name" } },
      { name: "document", label: { es: "Número de documento", en: "Document ID" } },
      { name: "birthDate", label: { es: "Fecha de nacimiento", en: "Birth date" }, type: "date" },
    ],
  },
  {
    key: "flight",
    label: { es: "Información del vuelo", en: "Flight information" },
    fields: [
      { name: "airline", label: { es: "Aerolinea", en: "Airline" } },
      { name: "flightNumber", label: { es: "Número de vuelo", en: "Flight number" } },
      { name: "arrivalDate", label: { es: "Fecha de llegada", en: "Arrival date" }, type: "date" },
    ],
  },
  {
    key: "address",
    label: { es: "Dirección en RD", en: "Address in DR" },
    fields: [
      { name: "hotel", label: { es: "Hotel o familiar", en: "Hotel or host" } },
      { name: "city", label: { es: "Ciudad", en: "City" } },
      { name: "phone", label: { es: "Teléfono de contacto", en: "Contact phone" } },
    ],
  },
  {
    key: "customs",
    label: { es: "Aduanas / salud", en: "Customs / health" },
    fields: [
      { name: "items", label: { es: "Lleva artículos declarables?", en: "Carrying declarable items?" } },
      { name: "meds", label: { es: "Medicamentos especiales", en: "Special medication" } },
      { name: "insurance", label: { es: "Seguro médico", en: "Health insurance" } },
    ],
  },
  {
    key: "review",
    label: { es: "Resumen final", en: "Final review" },
    fields: [],
  },
];

const helpContent = {
  es: {
    title: "¿Necesitas ayuda?",
    description:
      "Revisa la explicación en texto simple. Aquí pronto podrás escuchar audio TTS o ver un micro video demostrativo.",
    audio: "Audio TTS (pendiente)",
    video: "Video explicativo corto (pendiente)",
  },
  en: {
    title: "Need help?",
    description:
      "Read a simple explanation. Soon you'll be able to listen to TTS audio or watch a short demo video here.",
    audio: "Audio TTS (coming soon)",
    video: "Short video (coming soon)",
  },
};

type ViajaRDETicketFormProps = {
  prefill?: Record<string, string>;
};

export function ViajaRDETicketForm({ prefill }: ViajaRDETicketFormProps) {
  const [locale, setLocale] = useState<Locale>("es");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [needsFlight, setNeedsFlight] = useState(false);
  const lastPrefillRef = useRef<string>("");

  useEffect(() => {
    if (!prefill) return;
    const nextKey = JSON.stringify(prefill);
    if (nextKey === lastPrefillRef.current) return;
    lastPrefillRef.current = nextKey;
    setForm((prev) => ({ ...prev, ...prefill }));
  }, [prefill]);

  const trustedAirlines = [
    {
      id: "delta",
      name: "Delta",
      perks: { es: "SkyMiles + cambios flexibles", en: "SkyMiles + flexible changes" },
      link:
        process.env.NEXT_PUBLIC_AFFILIATE_DELTA ||
        "https://www.delta.com/?ref=iaguard",
    },
    {
      id: "aa",
      name: "American Airlines",
      perks: { es: "Soporte 24/7 y upgrades", en: "24/7 support and upgrades" },
      link:
        process.env.NEXT_PUBLIC_AFFILIATE_AA ||
        "https://www.aa.com/?ref=iaguard",
    },
    {
      id: "jetblue",
      name: "JetBlue",
      perks: { es: "Wi-Fi gratis y asientos cómodos", en: "Free Wi-Fi and comfy seats" },
      link:
        process.env.NEXT_PUBLIC_AFFILIATE_JETBLUE ||
        "https://www.jetblue.com/?ref=iaguard",
    },
  ];

  const currentSection = sectionCopy[sectionIndex];

  const canProceed = useMemo(() => {
    if (currentSection.key === "review") return true;
    if (currentSection.key === "flight" && needsFlight) return true;
    return currentSection.fields.every((field) => {
      const value = form[field.name];
      return value && value.trim().length > 0;
    });
  }, [currentSection, form, needsFlight]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const goNext = () => {
    if (!canProceed || sectionIndex === sectionCopy.length - 1) return;
    setSectionIndex((prev) => prev + 1);
  };

  const goPrev = () => {
    setSectionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    alert(
      locale === "es"
        ? "Formulario enviado a Migración Dominicana."
        : "Form submitted to Dominican Migration."
    );
  };

  return (
    <section className="mt-12 rounded-[32px] border border-white/10 bg-gradient-to-b from-black via-zinc-950 to-black p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
            {locale === "es" ? "Formulario oficial" : "Official form"}
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            {locale === "es"
              ? "Completar el formulario E-Ticket (Erikes)"
              : "Complete E-Ticket form (Erikes)"}
          </h2>
          <p className="text-xl text-zinc-400">
            {locale === "es" ? "Sección" : "Section"} {sectionIndex + 1}{" "}
            {locale === "es" ? "de" : "of"} {sectionCopy.length}
          </p>
        </div>
        <div className="flex gap-2">
          {(["es", "en"] as const).map((code) => (
            <button
              key={code}
              onClick={() => setLocale(code)}
              className={`rounded-full px-4 py-2 text-lg font-semibold ${
                locale === code ? "bg-neonGreen text-white" : "bg-white/10 text-white"
              }`}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-6">
        <div className="h-3 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-neonGreen transition-all"
            style={{ width: `${((sectionIndex + 1) / sectionCopy.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold tracking-wide">
            {currentSection.label[locale]}
          </p>
          <button
            onClick={() => setShowHelp(true)}
            className="rounded-full border border-white/30 px-4 py-2 text-lg font-semibold text-white"
          >
            {locale === "es" ? "¿Necesitas ayuda?" : "Need help?"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.key}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-6"
          >
            {currentSection.key === "review" ? (
              <div className="space-y-4 text-xl">
                {sectionCopy.slice(0, -1).map((section) => (
                  <div
                    key={section.key}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">
                        {section.label[locale]}
                      </p>
                      <button
                        onClick={() =>
                          setSectionIndex(sectionCopy.findIndex((s) => s.key === section.key))
                        }
                        className="rounded-full bg-neonGreen/20 px-4 py-1 text-sm font-semibold text-neonGreen"
                      >
                        {locale === "es" ? "Editar" : "Edit"}
                      </button>
                    </div>
                    <div className="mt-2 space-y-2 text-sm text-zinc-300">
                      {section.fields.map((field) => (
                        <p key={field.name}>
                          <span className="text-zinc-500">
                            {field.label[locale]}:
                          </span>{" "}
                          <span className="text-white">
                            {form[field.name] || (locale === "es" ? "Sin completar" : "Pending")}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSubmit}
                  className="w-full rounded-2xl bg-neonGreen px-6 py-4 text-2xl font-semibold text-white"
                >
                  {locale === "es" ? "Enviar formulario" : "Submit form"}
                </button>
              </div>
            ) : (
              <>
                {currentSection.fields.map((field) => (
                  <label
                    key={field.name}
                    className="block rounded-2xl border border-white/15 bg-black/30 p-4 text-xl"
                  >
                    <span className="text-zinc-400">{field.label[locale]}</span>
                    <input
                      type={field.type || "text"}
                      value={form[field.name] || ""}
                      onChange={(event) => handleChange(field.name, event.target.value)}
                      className="mt-3 w-full rounded-2xl border border-white/20 bg-black/60 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-neonGreen focus:outline-none"
                      placeholder={field.label[locale]}
                    />
                  </label>
                ))}

                {currentSection.key === "flight" && (
                  <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xl font-semibold text-amber-200">
                          {locale === "es"
                            ? "¿No tienes vuelo? El asistente lo compra contigo."
                            : "No flight yet? The assistant will buy with you."}
                        </p>
                        <p className="text-sm text-amber-100/80">
                          {locale === "es"
                            ? "Usamos aerolíneas confiables (Delta, JetBlue, American). Cada compra genera ingreso por referencia para IA Guard sin costo extra."
                            : "We use trusted airlines (Delta, JetBlue, American). Each purchase earns IA Guard a referral at no extra cost to you."}
                        </p>
                      </div>
                      <button
                        onClick={() => setNeedsFlight((prev) => !prev)}
                        className={`rounded-full px-4 py-2 text-base font-semibold ${
                          needsFlight
                            ? "bg-amber-300 text-black"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        {needsFlight
                          ? locale === "es"
                            ? "Necesito ayuda de compra"
                            : "I need to buy"
                          : locale === "es"
                          ? "Ya tengo vuelo"
                          : "I already have a flight"}
                      </button>
                    </div>

                    {needsFlight && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {trustedAirlines.map((airline) => (
                          <a
                            key={airline.id}
                            href={airline.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-white/10 bg-black/30 p-4 transition hover:-translate-y-1 hover:border-amber-200/60"
                          >
                            <p className="text-lg font-semibold text-white">
                              {airline.name}
                            </p>
                            <p className="mt-1 text-sm text-amber-100/80">
                              {airline.perks[locale]}
                            </p>
                            <p className="mt-2 text-sm text-amber-200">
                              {locale === "es"
                                ? "Abrir con el asistente →"
                                : "Open with assistant →"}
                            </p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={goPrev}
            disabled={sectionIndex === 0}
            className="flex-1 rounded-2xl border border-white/20 px-4 py-4 text-2xl font-semibold text-white disabled:opacity-40"
          >
            ◀ {locale === "es" ? "Anterior" : "Previous"}
          </button>
          {currentSection.key !== "review" && (
            <button
              onClick={goNext}
              disabled={!canProceed}
              className="flex-1 rounded-2xl bg-neonGreen px-4 py-4 text-2xl font-semibold text-white disabled:opacity-40"
            >
              {locale === "es" ? "Siguiente" : "Next"} ▶
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-xl rounded-3xl border border-white/20 bg-black p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">
                  {helpContent[locale].title}
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="rounded-full border border-white/20 px-4 py-1 text-lg font-semibold"
                >
                  ✕
                </button>
              </div>
              <p className="mt-3 text-xl text-zinc-300">
                {helpContent[locale].description}
              </p>
              <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-lg">
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm uppercase tracking-wide text-zinc-500">Audio</p>
                  <p>{helpContent[locale].audio}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm uppercase tracking-wide text-zinc-500">Video</p>
                  <p>{helpContent[locale].video}</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-4 w-full rounded-2xl bg-neonGreen px-4 py-3 text-xl font-semibold text-white"
              >
                {locale === "es" ? "Entendido" : "Got it"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
