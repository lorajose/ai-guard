"use client";

import ShinyButton from "@/components/ShinyButton";
import { useLocale } from "@/contexts/LocaleProvider";
import { messages } from "@/i18n/messages";
import { motion } from "framer-motion";
import { useState } from "react";

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const { locale } = useLocale();
  const heroCopy = messages[locale].hero;
  const [videoOpen, setVideoOpen] = useState(false);

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
            {heroCopy.badges.map((badge) => (
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
            {heroCopy.title}
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-zinc-200"
            variants={heroVariants}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {heroCopy.subtitle}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={heroVariants}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <ShinyButton href="/register">{heroCopy.primaryCta}</ShinyButton>
            <button
              onClick={() => setVideoOpen(true)}
              className="w-full rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/60 hover:bg-white/20 sm:w-auto"
            >
              {heroCopy.secondaryCta}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {videoOpen && <DemoModal label={heroCopy.demoLabel} onClose={() => setVideoOpen(false)} />}
    </section>
  );
}

function DemoModal({
  label,
  onClose,
}: {
  label: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-black/90">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-sm text-zinc-400 transition hover:text-white"
        >
          ✕
        </button>
        <div className="aspect-video w-full bg-black/60">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-4 text-center text-sm text-zinc-400">{label}</div>
      </div>
    </div>
  );
}
