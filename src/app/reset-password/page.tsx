"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    try {
      await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password_reset", email }),
      });
    } catch (err) {
      console.warn("No se pudo enviar correo de Resend", err);
    }

    setMessage({
      type: "success",
      text: "Si el email existe te enviaremos instrucciones en unos minutos.",
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-cyberBlue/50 to-black px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
        <h1 className="text-2xl font-semibold text-center">
          Recuperar acceso
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Ingresa tu email y te enviaremos instrucciones para restablecer tu
          contraseña.
        </p>

        {message && (
          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
              message.type === "error"
                ? "border-red-500/40 bg-red-500/10 text-red-300"
                : "border-green-500/40 bg-green-500/10 text-green-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-neonGreen"
              placeholder="persona@empresa.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-neonGreen px-6 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          <Link href="/login" className="hover:text-white">
            Volver al login
          </Link>
        </div>
      </div>
    </main>
  );
}
