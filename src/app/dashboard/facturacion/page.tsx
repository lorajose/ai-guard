"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { useLocale } from "@/contexts/LocaleProvider";

const copy = {
  es: {
    title: "Facturación + Cobros",
    subtitle: "Sistema ultra simple para técnicos y freelancers.",
    problem: "Problema real",
    problemList: [
      "Hacen facturas a mano",
      "Cobran tarde",
      "No hacen seguimiento",
      "No quieren QuickBooks (caro y complejo)",
    ],
    solution: "Solución (Micro-SaaS)",
    solutionList: [
      "Crea facturas en 30 segundos",
      "Envía por WhatsApp / Email",
      "Seguimiento automático",
      "Marca pagado / pendiente",
      "Genera PDF profesional",
      "No contabilidad. Solo cobrar.",
    ],
    pricing: "Planes",
    tiers: [
      { name: "Básico", price: "$9/mes", note: "Facturas simples" },
      { name: "Automático", price: "$19/mes", note: "Seguimientos automáticos" },
      { name: "Branding", price: "$29/mes", note: "Logo y colores propios" },
    ],
    locked: "Disponible según tu plan.",
    cta: "Ver planes",
  },
  en: {
    title: "Billing + Collections",
    subtitle: "Ultra-simple invoicing for technicians and freelancers.",
    problem: "Real problem",
    problemList: [
      "Invoices done manually",
      "Late payments",
      "No follow-ups",
      "QuickBooks is expensive and complex",
    ],
    solution: "Solution (Micro-SaaS)",
    solutionList: [
      "Create invoices in 30 seconds",
      "Send via WhatsApp / Email",
      "Automatic follow-ups",
      "Mark paid / pending",
      "Generate professional PDF",
      "No accounting. Just collect.",
    ],
    pricing: "Plans",
    tiers: [
      { name: "Basic", price: "$9/mo", note: "Simple invoices" },
      { name: "Automation", price: "$19/mo", note: "Automatic follow-ups" },
      { name: "Branding", price: "$29/mo", note: "Custom logo and colors" },
    ],
    locked: "Available based on your plan.",
    cta: "View plans",
  },
};

export default function FacturacionPage() {
  const { locale } = useLocale();
  const t = copy[locale];

  return (
    <DashboardShell>
      <section className="space-y-8">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/80 to-black/40 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            IDEA 1
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-sm text-zinc-300">{t.subtitle}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white">
            <h2 className="text-lg font-semibold">{t.problem}</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {t.problemList.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white">
            <h2 className="text-lg font-semibold">{t.solution}</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {t.solutionList.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white">
          <h2 className="text-lg font-semibold">{t.pricing}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {t.tiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl border border-white/10 bg-black/60 p-4"
              >
                <p className="text-sm uppercase tracking-wide text-zinc-500">
                  {tier.name}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {tier.price}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{tier.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-400">{t.locked}</p>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-neonGreen px-5 py-2 text-sm font-semibold text-white"
            >
              {t.cta}
            </a>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
