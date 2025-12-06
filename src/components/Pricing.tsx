"use client";

import { useLocale } from "@/contexts/LocaleProvider";
import { messages } from "@/i18n/messages";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type Mode = "personal" | "business";

const plans: Record<
  Mode,
  {
    title: string;
    subtitle: string;
    price: string;
    features: string[];
    badge?: string;
    stripeLink: string | undefined;
    label: string;
  }
> = {
  personal: {
    stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_LITE,
  },
  business: {
    stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_PRO,
  },
};

const toggleOptions: Mode[] = ["personal", "business"];

export default function Pricing() {
  const { locale } = useLocale();
  const pricingCopy = messages[locale].pricing;
  const [mode, setMode] = useState<Mode>("personal");
  const [loading, setLoading] = useState(false);
  const activePlan = pricingCopy.plans[mode];

  const otherPlanLabel = useMemo(() => {
    return mode === "personal"
      ? pricingCopy.toggle.business
      : pricingCopy.toggle.personal;
  }, [mode, pricingCopy.toggle.business, pricingCopy.toggle.personal]);

  function handleCheckout(target: Mode) {
    const link = plans[target].stripeLink;
    if (!link) {
      alert("Stripe link no configurado. Revisa tus variables de entorno.");
      return;
    }
    setLoading(true);
    window.open(link, "_blank", "noopener,noreferrer");
    setTimeout(() => setLoading(false), 600);
  }

  return (
    <section
      id="pricing"
      className="relative overflow-hidden px-6 py-20 text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyberBlue/20 via-black to-black" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold"
        >
          {pricingCopy.title}
        </motion.h2>
        <p className="mt-3 text-sm text-zinc-400">
          {pricingCopy.subtitle}
        </p>

        <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs uppercase tracking-wide text-neonGreen">
          🛡️ {pricingCopy.foundersBadge}
        </div>

        <div className="relative mx-auto mt-10 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          {toggleOptions.map((option) => {
            const isActive = option === mode;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={`relative z-10 min-w-[140px] rounded-full px-6 py-2 text-sm font-semibold transition ${
                  isActive ? "text-black" : "text-zinc-300"
                }`}
              >
                {pricingCopy.toggle[option]}
                {isActive && (
                  <motion.span
                    layoutId="toggle-pill"
                    className="absolute inset-0 z-[-1] rounded-full bg-white shadow-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-12">
          <PlanCard
            mode={mode}
            title={activePlan.title}
            subtitle={activePlan.subtitle}
            price={activePlan.price}
            features={activePlan.features}
            badge={activePlan.badge}
            loading={loading}
            onAction={() => handleCheckout(mode)}
            otherPlanLabel={otherPlanLabel}
            label={activePlan.label}
            noteTemplate={pricingCopy.note}
          />
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  mode,
  label,
  title,
  subtitle,
  price,
  features,
  badge,
  loading,
  onAction,
  otherPlanLabel,
  noteTemplate,
}: {
  mode: Mode;
  label: string;
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  badge?: string;
  loading: boolean;
  onAction: () => void;
  otherPlanLabel: string;
  noteTemplate: string;
}) {
  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative mx-auto max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-10 text-left shadow-2xl backdrop-blur-xl"
    >
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-br from-neonGreen/10 via-transparent to-cyan-500/10 opacity-0 transition group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative z-10 space-y-6">
        {badge && mode === "personal" && (
          <span className="inline-flex items-center rounded-full border border-neonGreen/40 bg-neonGreen/10 px-4 py-1 text-xs font-semibold text-neonGreen">
            {badge}
          </span>
        )}
        <div>
          <p className="text-sm uppercase tracking-wide text-zinc-400">
            {label}
          </p>
          <h3 className="mt-2 text-3xl font-semibold">{title}</h3>
          <p className="mt-2 text-base text-zinc-300">{subtitle}</p>
        </div>

        <div>
          <p className="text-5xl font-bold text-white">{price}</p>
          <p className="text-sm text-zinc-400">7 días de prueba gratis</p>
        </div>

        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm">
              <span className="text-neonGreen">✔</span>
              <span className="text-zinc-100">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onAction}
            disabled={loading}
            className="flex-1 rounded-2xl bg-neonGreen px-6 py-3 text-center text-base font-semibold text-black transition disabled:opacity-60"
          >
            {loading ? "Abriendo Stripe..." : "Start Free Trial"}
          </motion.button>
          <span className="text-center text-xs text-zinc-400 sm:flex-1 sm:text-left">
            {noteTemplate.replace("{plan}", otherPlanLabel)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
