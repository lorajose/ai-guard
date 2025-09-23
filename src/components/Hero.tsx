"use client";
import { motion } from "framer-motion";
import ShinyButton from "./ShinyButton";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-5xl md:text-6xl font-extrabold"
      >
        Protege a tu familia y tu negocio de{" "}
        <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
          estafas con IA
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300"
      >
        Reenvía un mensaje, audio o email sospechoso. Nuestra IA detecta si es
        una estafa y te da recomendaciones claras en segundos.
      </motion.p>

      <div className="mt-8 flex items-center justify-center gap-4">
        <ShinyButton href="#pricing">Comienza Gratis</ShinyButton>
        <a className="text-zinc-300 hover:text-white" href="#demo">
          Ver demo (60s)
        </a>
      </div>
    </section>
  );
}
