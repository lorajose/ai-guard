"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Locale = "es" | "en";

const copy = {
  heading: {
    es: "Reserva o enlaza tu vuelo",
    en: "Link or book your flight",
  },
  subtitle: {
    es: "Ingresa tu código de vuelo o compra uno nuevo con aerolíneas confiables y gana recompensas.",
    en: "Enter an existing confirmation or buy a new ticket from trusted airlines and earn rewards.",
  },
  linkTitle: {
    es: "¿Ya tienes vuelo?",
    en: "Already booked?",
  },
  codeLabel: {
    es: "Código de confirmación",
    en: "Confirmation code",
  },
  attach: {
    es: "Enlazar vuelo",
    en: "Link flight",
  },
  success: {
    es: "Vuelo enlazado correctamente. Recibirás recordatorios automáticos.",
    en: "Flight linked successfully. We'll send reminders automatically.",
  },
  affiliateTitle: {
    es: "Compra con tu aerolínea favorita",
    en: "Book with your favorite airline",
  },
  affiliateInfo: {
    es: "Cada compra con estos enlaces genera ingresos para IA Guard sin costo adicional para ti.",
    en: "Each purchase through these links earns IA Guard revenue at no extra cost to you.",
  },
  buy: {
    es: "Comprar aquí",
    en: "Book here",
  },
};

const airlines = [
  {
    id: "delta",
    name: "Delta Airlines",
    perks: ["Acumulación SkyMiles", "Soporte 24/7"],
    link:
      process.env.NEXT_PUBLIC_AFFILIATE_DELTA ||
      "https://www.delta.com/?ref=iaguard",
  },
  {
    id: "aa",
    name: "American Airlines",
    perks: ["Cambio flexible", "Check-in prioritario"],
    link:
      process.env.NEXT_PUBLIC_AFFILIATE_AA ||
      "https://www.aa.com/?ref=iaguard",
  },
  {
    id: "jetblue",
    name: "JetBlue",
    perks: ["Wi-Fi gratis", "Asientos cómodos"],
    link:
      process.env.NEXT_PUBLIC_AFFILIATE_JETBLUE ||
      "https://www.jetblue.com/?ref=iaguard",
  },
];

export function ViajaRDFlightLinks() {
  const [locale, setLocale] = useState<Locale>("es");
  const [code, setCode] = useState("");
  const [linkedCode, setLinkedCode] = useState<string | null>(null);

  const isCodeValid = useMemo(() => code.trim().length >= 5, [code]);

  const handleLinkFlight = () => {
    if (!isCodeValid) return;
    setLinkedCode(code.trim().toUpperCase());
    setCode("");
  };

  return (
    <section className="rounded-[32px] border border-white/10 bg-gradient-to-b from-cyberBlue/10 via-black to-black p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
            ViajaRD · Rewards
          </p>
          <h2 className="mt-2 text-3xl font-semibold">{copy.heading[locale]}</h2>
          <p className="text-xl text-zinc-300">{copy.subtitle[locale]}</p>
        </div>
        <div className="flex gap-2">
          {(["es", "en"] as const).map((codeLang) => (
            <button
              key={codeLang}
              onClick={() => setLocale(codeLang)}
              className={`rounded-full px-4 py-2 text-lg font-semibold ${
                locale === codeLang
                  ? "bg-neonGreen text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              {codeLang.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
          <p className="text-2xl font-semibold">{copy.linkTitle[locale]}</p>
          <label className="mt-5 block text-lg">
            <span className="text-zinc-400">{copy.codeLabel[locale]}</span>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/20 bg-black/60 px-4 py-3 text-2xl text-white placeholder:text-zinc-500 focus:border-neonGreen focus:outline-none"
              placeholder="ABC123"
            />
          </label>
          <button
            onClick={handleLinkFlight}
            disabled={!isCodeValid}
            className="mt-5 w-full rounded-2xl bg-neonGreen px-4 py-4 text-2xl font-semibold text-white disabled:opacity-40"
          >
            {copy.attach[locale]}
          </button>
          {linkedCode && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-xl text-emerald-300"
            >
              ✅ {copy.success[locale]} ({linkedCode})
            </motion.p>
          )}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">
              {copy.affiliateTitle[locale]}
            </p>
            <p className="text-lg text-zinc-400">{copy.affiliateInfo[locale]}</p>
          </div>
          <div className="mt-5 grid gap-4">
            {airlines.map((airline) => (
              <motion.div
                key={airline.id}
                whileHover={{ scale: 1.01 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xl font-semibold">{airline.name}</p>
                    <ul className="mt-2 text-base text-zinc-400">
                      {airline.perks.map((perk) => (
                        <li key={perk}>• {perk}</li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={airline.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white px-5 py-3 text-lg font-semibold text-black"
                  >
                    {copy.buy[locale]}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
