"use client";

import { useLocale } from "@/contexts/LocaleProvider";
import { messages } from "@/i18n/messages";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MailCheck,
  MessageCircle,
  Shield,
  Smartphone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const iconMap = [MailCheck, Shield, Sparkles, Smartphone];

export default function HowItWorksLanding() {
  const { locale } = useLocale();
  const copy = messages[locale].howItWorks;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(57,255,20,0.15),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(12,108,211,0.2),_transparent_55%)] opacity-60" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-24 px-6 py-24">
        <Hero copy={copy.hero} />
        <Steps steps={copy.steps} />
        <Highlights highlight={copy.highlights} />
        <Coverage coverage={copy.coverage} />
        <CallToAction cta={copy.cta} />
      </div>
    </div>
  );
}

function Hero({
  copy,
}: {
  copy: (typeof messages)["en"]["howItWorks"]["hero"];
}) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">
        {copy.eyebrow}
      </p>
      <h1 className="mt-4 text-4xl font-semibold md:text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-zinc-300">{copy.subtitle}</p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/shield"
          className="inline-flex items-center gap-2 rounded-2xl bg-neonGreen px-6 py-3 text-sm font-semibold text-white transition hover:bg-neonGreen/90"
        >
          {copy.primaryCta}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/pricing"
          className="rounded-2xl border border-white/20 px-6 py-3 text-sm text-white transition hover:border-white/40"
        >
          {copy.secondaryCta}
        </Link>
      </div>
    </section>
  );
}

function Steps({
  steps,
}: {
  steps: (typeof messages)["en"]["howItWorks"]["steps"];
}) {
  return (
    <section className="space-y-10">
      <div className="flex items-center gap-3 text-zinc-400">
        <span className="h-px flex-1 bg-zinc-700" />
        <span className="text-xs uppercase tracking-[0.4em]">Flow</span>
        <span className="h-px flex-1 bg-zinc-700" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = iconMap[index] ?? Shield;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-[28px] border border-white/10 bg-black/40 p-6 backdrop-blur-lg"
            >
              <div className="flex items-center gap-3 text-neonGreen">
                <Icon className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.3em] text-neonGreen/80">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{step.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function Highlights({
  highlight,
}: {
  highlight: (typeof messages)["en"]["howItWorks"]["highlights"];
}) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-10">
      <h2 className="text-3xl font-semibold">{highlight.title}</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {highlight.cards.map((card) => (
          <motion.div
            key={card.title}
            whileHover={{ y: -6 }}
            className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-neonGreen/70">
              IA Shield
            </p>
            <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Coverage({
  coverage,
}: {
  coverage: (typeof messages)["en"]["howItWorks"]["coverage"];
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-black/30 p-8">
      <h2 className="text-2xl font-semibold">{coverage.title}</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {coverage.items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300"
          >
            <MessageCircle className="h-4 w-4 text-neonGreen" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CallToAction({
  cta,
}: {
  cta: (typeof messages)["en"]["howItWorks"]["cta"];
}) {
  return (
    <section className="rounded-[32px] border border-neonGreen/20 bg-gradient-to-r from-neonGreen/10 via-transparent to-blue-500/10 p-10 text-center">
      <h2 className="text-3xl font-semibold">{cta.title}</h2>
      <p className="mt-4 text-base text-zinc-200">{cta.description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-2xl bg-neonGreen px-6 py-3 text-sm font-semibold text-white transition hover:bg-neonGreen/90"
        >
          {cta.primary}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/contact"
          className="rounded-2xl border border-white/20 px-6 py-3 text-sm text-white transition hover:border-white/40"
        >
          {cta.secondary}
        </Link>
      </div>
    </section>
  );
}
