"use client";

import AuthModal from "@/components/AuthModal"; // 👈 importamos el modal
import { motion } from "framer-motion";
import { useState } from "react";

export default function Hero() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section className="relative overflow-hidden px-6 py-24 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
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
        Reenvía un mensaje, audio o email sospechoso. Te decimos si es estafa y
        qué hacer.
      </motion.p>

      {/* Botones principales */}
      <div className="mt-8 flex items-center justify-center gap-4">
        {/* Modal de login/register */}
        <AuthModal triggerText="Start Free Trial" />

        {/* Botón demo */}
        <button
          onClick={() => setShowDemo(true)}
          className="text-zinc-300 hover:text-white flex items-center gap-2"
        >
          ▶️ Watch 60s Demo
        </button>
      </div>

      {/* Modal para demo en YouTube */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[90%] max-w-2xl bg-zinc-900 rounded-2xl p-4">
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white"
            >
              ✖
            </button>
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-xl"
                src="https://www.youtube.com/embed/xxxxxxxx"
                title="Demo video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
