"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const { signIn, sendMagicLink, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    const result = await signIn(email, password);
    if (!result.success && result.error) {
      setMessage({ type: "error", text: result.error });
    }
    setLoading(false);
  }

  async function handleMagicLink() {
    if (!email) {
      setMessage({
        type: "error",
        text: "Ingrese un email para enviar el Magic Link.",
      });
      return;
    }
    setMagicLoading(true);
    const result = await sendMagicLink(email);
    setMagicLoading(false);
    if (result.success) {
      setMessage({
        type: "success",
        text: "Revisa tu bandeja. Te enviamos un enlace seguro.",
      });
    } else if (result.error) {
      setMessage({ type: "error", text: result.error });
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-cyberBlue/40 to-black px-4 py-20 text-white">
      <div className="mx-auto w-full max-w-lg rounded-3xl border border-white/10 bg-black/50 p-8 backdrop-blur">
        <h1 className="text-center text-3xl font-semibold">
          Protege tus conversaciones
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Accede con tu cuenta o solicita acceso instantáneo.
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

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-neonGreen"
              placeholder="you@email.com"
              required
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-neonGreen"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-neonGreen px-6 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 grid gap-4">
          <button
            onClick={handleMagicLink}
            disabled={magicLoading}
            className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 disabled:opacity-50"
          >
            {magicLoading ? "Enviando..." : "Enviar Magic Link"}
          </button>
          <button
            onClick={signInWithGoogle}
            type="button"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
          >
            <span role="img" aria-hidden>
              🔐
            </span>
            Ingresar con Google
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between text-sm text-zinc-400">
          <Link href="/signup" className="hover:text-white">
            ¿No tienes cuenta? Regístrate
          </Link>
          <Link href="/reset-password" className="hover:text-white">
            Recuperar contraseña
          </Link>
        </div>
      </div>
    </main>
  );
}
