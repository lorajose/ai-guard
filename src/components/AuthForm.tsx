// src/components/AuthForm.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function AuthForm({
  mode = "login",
}: {
  mode?: "login" | "register";
}) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  async function handleLogin() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Login exitoso, redirigiendo..." });
      setTimeout(() => (window.location.href = "/dashboard"), 1200);
    }
    setLoading(false);
  }

  async function handleSignup() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Revisa tu correo para confirmar la cuenta.",
      });
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    }
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === "login" ? "Acceso Seguro" : "Crea tu Cuenta"}
      </h2>

      {/* Mensajes */}
      {message && (
        <div
          className={`mb-4 p-2 rounded-md text-sm ${
            message.type === "error"
              ? "bg-red-500/20 text-red-400 border border-red-600"
              : "bg-green-500/20 text-green-400 border border-green-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Inputs */}
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      {/* Botones */}
      {mode === "login" ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2 font-semibold disabled:opacity-50"
          >
            {loading ? "Procesando..." : "Iniciar Sesión"}
          </button>
          <button
            onClick={handleSignup}
            className="rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white py-2 font-semibold"
          >
            Registrarse
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2 font-semibold disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Registrarse"}
        </button>
      )}
    </div>
  );
}
