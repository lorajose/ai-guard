"use client";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function AuthModal({ triggerText }: { triggerText: string }) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Login exitoso, redirigiendo..." });
      setTimeout(() => (window.location.href = "/dashboard"), 1200);
    }
  }

  async function handleRegister() {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Revisa tu correo para confirmar la cuenta.",
      });
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    }
  }

  return (
    <>
      {/* Botón que abre el modal */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 hover:text-white hover:border-zinc-500 transition"
      >
        {triggerText}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white"
            >
              ✖
            </button>

            {/* Tabs */}
            <div className="flex mb-6 border-b border-zinc-700">
              <button
                onClick={() => {
                  setTab("login");
                  setMessage(null);
                }}
                className={`flex-1 py-2 text-sm font-medium ${
                  tab === "login"
                    ? "text-white border-b-2 border-orange-500"
                    : "text-zinc-400"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setTab("register");
                  setMessage(null);
                }}
                className={`flex-1 py-2 text-sm font-medium ${
                  tab === "register"
                    ? "text-white border-b-2 border-orange-500"
                    : "text-zinc-400"
                }`}
              >
                Registro
              </button>
            </div>

            {/* Mensaje de error/success */}
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

            {/* Formulario */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                onClick={tab === "login" ? handleLogin : handleRegister}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 font-semibold transition disabled:opacity-50"
              >
                {loading
                  ? "Procesando..."
                  : tab === "login"
                  ? "Login"
                  : "Registrarse"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
