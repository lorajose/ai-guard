"use client";

import ShinyButton from "@/components/ShinyButton";
import { motion } from "framer-motion";

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const badges = [
  "🛡️ Hecho para EE.UU.",
  "⚡ Rápido",
  "🔒 Privado",
  "✅ Sin PHI",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cyberBlue via-black to-black py-24 text-white">
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(57,255,20,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(12,108,211,0.35),_transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: "easeOut" }}
          variants={heroVariants}
          className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-neonGreen/30 backdrop-blur-lg"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-200"
          >
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/10 bg-black/30 px-4 py-1"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          <motion.h1
            className="mt-8 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
            variants={heroVariants}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Protege a tu familia y tu negocio de estafas con IA — en segundos
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-zinc-200"
            variants={heroVariants}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Reenvía un mensaje, audio o email sospechoso. Te decimos si es
            estafa y qué hacer
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={heroVariants}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <ShinyButton href="/register">Start Free Trial</ShinyButton>
            <button className="w-full rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/60 hover:bg-white/20 sm:w-auto">
              Watch 60s Demo
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
