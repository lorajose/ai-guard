"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function RegisterPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      alert("✅ Revisa tu correo para confirmar la cuenta.");
      window.location.href = "/login";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Crea tu cuenta</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-zinc-700 rounded p-2 w-full mb-2 bg-zinc-800 text-white"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-zinc-700 rounded p-2 w-full mb-4 bg-zinc-800 text-white"
        />
        <button
          onClick={handleSignup}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold"
        >
          Registrarse
        </button>
        <p className="mt-4 text-sm text-zinc-400 text-center">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-orange-400 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
