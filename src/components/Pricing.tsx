"use client";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Pricing() {
  const [mode, setMode] = useState<"lite" | "pro">("lite");

  // Cargamos los links de Stripe desde .env
  const liteLink = process.env.NEXT_PUBLIC_STRIPE_LINK_LITE || "#";
  const proLink = process.env.NEXT_PUBLIC_STRIPE_LINK_PRO || "#";

  return (
    <section id="pricing" className="px-6 py-20 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-12"
      >
        Elige tu plan
      </motion.h2>

      {/* Toggle */}
      <div className="inline-flex rounded-full bg-zinc-800 p-1 mb-8">
        <button
          onClick={() => setMode("lite")}
          className={`px-5 py-2 rounded-full transition ${
            mode === "lite"
              ? "bg-black text-white"
              : "text-zinc-300 hover:text-white"
          }`}
        >
          Personal (Lite)
        </button>
        <button
          onClick={() => setMode("pro")}
          className={`px-5 py-2 rounded-full transition ${
            mode === "pro"
              ? "bg-black text-white"
              : "text-zinc-300 hover:text-white"
          }`}
        >
          Business (Pro)
        </button>
      </div>

      {/* Card */}
      {mode === "lite" ? (
        <Card
          title="AI Scam Detector Lite"
          price="$10/mes"
          bullets={[
            "SMS/WhatsApp/DM scan",
            "Audio → texto → veredicto",
            "Consejos claros haz/no hagas",
            "Alertas Email/Telegram",
          ]}
          cta={liteLink}
        />
      ) : (
        <Card
          title="IA Shield Pro"
          price="$20/mes"
          bullets={[
            "Detección de phishing en emails",
            "Panel con histórico y score",
            "Alertas Slack/Email",
            "Onboarding 15 min",
          ]}
          cta={proLink}
        />
      )}
    </section>
  );
}

function Card({
  title,
  price,
  bullets,
  cta,
}: {
  title: string;
  price: string;
  bullets: string[];
  cta: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-10 backdrop-blur max-w-md mx-auto"
    >
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-3 text-4xl font-bold">{price}</p>
      <ul className="mt-6 space-y-3 text-left mx-auto max-w-sm">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="text-green-400">✔</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <a
        href={cta}
        target="_blank"
        className="mt-8 inline-block rounded-xl bg-white text-black px-6 py-3 font-semibold hover:scale-105 transition"
      >
        Start Free Trial
      </a>
    </motion.div>
  );
}
