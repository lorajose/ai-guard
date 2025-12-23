"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { useLocale } from "@/contexts/LocaleProvider";

const copy = {
  es: {
    eyebrow: "IDEA · TrustSnap",
    title: "Tus testimonios de venta, ahora con un look profesional en segundos.",
    subtitle:
      "No más capturas de pantalla feas ni tachones. TrustSnap usa IA para anonimizar chats y crear contenido listo para redes.",
    cta: "Subir mi primera captura gratis",
    benefitsTitle: "Beneficios",
    benefits: [
      {
        title: "Privacidad total",
        description:
          "La IA detecta y borra nombres, caras y números automáticamente.",
      },
      {
        title: "Diseño de marca",
        description:
          "Aplica colores, marcos estéticos y marca de agua en segundos.",
      },
      {
        title: "Ahorro de tiempo",
        description:
          "Pasa de la captura al posteo en menos de 10 segundos.",
      },
    ],
    pricingTitle: "Planes",
    plans: [
      {
        name: "Starter",
        price: "$0",
        note: "3 capturas al mes · Marca de agua",
      },
      {
        name: "TrustPro",
        price: "$9.90/mes",
        note: "Ilimitado · Sin marca de agua",
      },
      {
        name: "Agencia",
        price: "$29/mes",
        note: "Múltiples marcas · Acceso API",
      },
    ],
    locked: "Disponible según tu plan.",
    viewPlans: "Ver planes",
  },
  en: {
    eyebrow: "IDEA · TrustSnap",
    title: "Your sales testimonials, now with a professional look in seconds.",
    subtitle:
      "No more ugly screenshots. TrustSnap uses AI to anonymize chats and create high-converting content.",
    cta: "Upload my first screenshot free",
    benefitsTitle: "Benefits",
    benefits: [
      {
        title: "Total privacy",
        description:
          "AI detects and removes names, faces, and phone numbers automatically.",
      },
      {
        title: "Brand design",
        description:
          "Apply colors, aesthetic frames, and watermark in seconds.",
      },
      {
        title: "Time saver",
        description: "Go from screenshot to post in under 10 seconds.",
      },
    ],
    pricingTitle: "Plans",
    plans: [
      {
        name: "Starter",
        price: "$0",
        note: "3 screenshots/month · Watermark",
      },
      {
        name: "TrustPro",
        price: "$9.90/mo",
        note: "Unlimited · No watermark",
      },
      {
        name: "Agency",
        price: "$29/mo",
        note: "Multiple brands · API access",
      },
    ],
    locked: "Available based on your plan.",
    viewPlans: "View plans",
  },
};

export default function TrustSnapPage() {
  const { locale } = useLocale();
  const t = copy[locale];

  return (
    <DashboardShell>
      <section className="space-y-8">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/80 to-black/40 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-sm text-zinc-300">{t.subtitle}</p>
          <button className="mt-4 rounded-full bg-neonGreen px-5 py-2 text-sm font-semibold text-white">
            {t.cta}
          </button>
        </header>

        <div>
          <h2 className="text-lg font-semibold text-white">{t.benefitsTitle}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {t.benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-white/10 bg-black/40 p-5 text-white"
              >
                <p className="text-sm font-semibold">{benefit.title}</p>
                <p className="mt-2 text-sm text-zinc-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white">
          <h2 className="text-lg font-semibold">{t.pricingTitle}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {t.plans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl border border-white/10 bg-black/60 p-4"
              >
                <p className="text-sm uppercase tracking-wide text-zinc-500">
                  {plan.name}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {plan.price}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{plan.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-400">{t.locked}</p>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-neonGreen px-5 py-2 text-sm font-semibold text-white"
            >
              {t.viewPlans}
            </a>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
