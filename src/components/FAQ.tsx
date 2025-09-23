"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    q: "¿Guardan mis mensajes?",
    a: "Solo almacenamos metadatos mínimos para análisis. Puedes eliminar todo tu historial con un solo clic.",
  },
  {
    q: "¿Cumplen HIPAA?",
    a: "El plan Lite no procesa PHI. El plan Pro es de concienciación/filtrado, no sustituye un EHR.",
  },
  {
    q: "¿Cuánto tarda en analizar un mensaje?",
    a: "Segundos. El 90% de los análisis se devuelven en menos de 3s.",
  },
  {
    q: "¿Necesito conocimientos técnicos?",
    a: "No. Simplemente reenvía el mensaje sospechoso y recibirás un veredicto claro.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí. Sin contratos ni penalizaciones, puedes cancelar desde tu panel de control.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="faq" className="px-6 py-20 bg-black text-white">
      <h2 className="text-4xl font-bold text-center mb-10">
        Preguntas Frecuentes
      </h2>
      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden"
          >
            <button
              onClick={() => setActive(active === i ? null : i)}
              className="w-full text-left px-6 py-4 flex justify-between items-center"
            >
              <span className="font-medium">{item.q}</span>
              <span>{active === i ? "−" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {active === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-4 text-zinc-300">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
