"use client";

import { motion } from "framer-motion";

export default function DemoModal({
  label,
  onClose,
}: {
  label: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-black/90"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-sm text-zinc-400 transition hover:text-white"
        >
          ✕
        </button>
        <div className="aspect-video w-full bg-black/60">
          <video
            className="h-full w-full object-cover"
            src="/videos/A_cinematic_AI_Guard.mp4"
            controls
            autoPlay
            muted
            loop
            playsInline
          >
            {label}
          </video>
        </div>
        <div className="p-4 text-center text-sm text-zinc-400">{label}</div>
      </div>
    </motion.div>
  );
}
