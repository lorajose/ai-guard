"use client";

import { useLocale } from "@/contexts/LocaleProvider";
import { messages } from "@/i18n/messages";
import { motion } from "framer-motion";
import { Gauge, ShieldAlert, Sparkles } from "lucide-react";

const icons = [Gauge, Sparkles, ShieldAlert];

export default function Features() {
  const { locale } = useLocale();
  const copy = messages[locale].featuresSection;

  return (
    <section id="how" className="relative px-6 py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(57,255,20,0.12),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(12,108,211,0.15),_transparent_55%)] opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.05)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative mx-auto max-w-6xl text-center text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
          {copy.eyebrow}
        </p>
        <h2 className="mt-4 text-4xl font-bold md:text-5xl">
          {copy.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          {copy.description}
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {copy.items.map((feature, index) => {
            const Icon = icons[index] ?? Gauge;
            return (
              <motion.div
                key={feature.title}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-left backdrop-blur"
              >
                <div className="inline-flex items-center justify-center rounded-2xl bg-black/40 p-3 text-neonGreen">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="text-neonGreen">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
