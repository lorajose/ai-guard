// src/components/PricingButtons.tsx
"use client";
import { useState } from "react";

export default function PricingButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  async function start(plan: "LITE" | "PRO") {
    setLoading(plan);
    const res = await fetch("/api/checkout/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        disabled={loading === "LITE"}
        onClick={() => start("LITE")}
        className="rounded-xl px-4 py-3 bg-white/10 hover:bg-white/20"
      >
        Empezar Lite – $10/mes
      </button>
      <button
        disabled={loading === "PRO"}
        onClick={() => start("PRO")}
        className="rounded-xl px-4 py-3 bg-amber-500 hover:bg-amber-600"
      >
        Empezar Pro – $20/mes
      </button>
    </div>
  );
}
