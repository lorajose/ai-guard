"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    password === confirmPassword;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!passwordValid) {
      setMessage({
        type: "error",
        text: "La contraseña debe tener 8 caracteres, números y una mayúscula.",
      });
      return;
    }
    setLoading(true);
    const result = await signUp(email, password);
    setLoading(false);
    if (!result.success && result.error) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    setMessage({
      type: "success",
      text: "Cuenta creada. Revisa tu correo para confirmar el acceso.",
    });
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-cyberBlue/30 to-black px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="text-3xl font-semibold">Crear cuenta IA Shield</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Incluye 7 días de prueba gratis, luego puedes elegir plan.
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

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-neonGreen"
              placeholder="founder@empresa.com"
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
              placeholder="Mínimo 8 caracteres"
              required
            />
            <p className="mt-2 text-xs text-zinc-500">
              Debe incluir al menos una letra mayúscula y un número.
            </p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-neonGreen"
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-neonGreen px-6 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-white underline-offset-4 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
