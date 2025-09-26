// src/components/AuthForm.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function AuthForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else window.location.href = "/dashboard";
    setLoading(false);
  }

  async function handleSignup() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Revisa tu correo para confirmar la cuenta.");
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Acceso Seguro</h2>
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
      <div className="flex gap-2">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2 font-semibold disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Iniciar Sesión"}
        </button>
        <button
          onClick={handleSignup}
          className="flex-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white py-2 font-semibold"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}
