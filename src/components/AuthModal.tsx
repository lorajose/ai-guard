// src/components/AuthModal.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { createPortal } from "react-dom";

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

  // 📧 Login con email/pass
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
      setMessage({
        type: "success",
        text: "✅ Login exitoso, redirigiendo...",
      });
      setTimeout(() => (window.location.href = "/dashboard"), 1200);
    }
  }

  // 📧 Registro con email/pass
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
        text: "📧 Revisa tu correo para confirmar la cuenta.",
      });
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    }
  }

  // 🌐 Social Auth
  async function handleOAuth(
    provider: "google" | "github" | "facebook" | "twitter" | "linkedin"
  ) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setMessage({ type: "error", text: error.message });
  }

  // 📱 Phone OTP (SMS)
  async function handlePhoneLogin() {
    const phone = prompt("Introduce tu número de teléfono (ej: +1...)");
    if (!phone) return;
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) setMessage({ type: "error", text: error.message });
    else
      setMessage({
        type: "success",
        text: "📲 Código enviado a tu teléfono. Revisa tu SMS.",
      });
  }

  // Contenido del modal
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md mx-auto my-10 bg-zinc-900 rounded-2xl shadow-xl p-6">
        {/* Cerrar */}
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
            Iniciar Sesión
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
            Registrarse
          </button>
        </div>

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

        {/* Formulario */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={tab === "login" ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 font-semibold transition disabled:opacity-50"
          >
            {loading
              ? "Procesando..."
              : tab === "login"
              ? "Iniciar Sesión"
              : "Registrarse"}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <hr className="flex-1 border-zinc-700" />
          <span className="text-xs text-zinc-500">o continua con</span>
          <hr className="flex-1 border-zinc-700" />
        </div>

        {/* Social Buttons */}
        <div className="grid gap-3">
          <button
            onClick={() => handleOAuth("google")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 py-2 text-white font-medium flex items-center justify-center gap-2"
          >
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>
          <button
            onClick={() => handleOAuth("github")}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 py-2 text-white font-medium flex items-center justify-center gap-2"
          >
            <img src="/icons/github.svg" alt="GitHub" className="w-5 h-5" />
            GitHub
          </button>
          <button
            onClick={() => handleOAuth("facebook")}
            className="w-full rounded-lg border border-blue-700 bg-blue-600 hover:bg-blue-700 py-2 text-white font-medium flex items-center justify-center gap-2"
          >
            <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
            Facebook
          </button>
          <button
            onClick={() => handleOAuth("twitter")}
            className="w-full rounded-lg border border-sky-700 bg-sky-600 hover:bg-sky-700 py-2 text-white font-medium flex items-center justify-center gap-2"
          >
            <img src="/icons/twitter.svg" alt="Twitter" className="w-5 h-5" />
            Twitter
          </button>
          <button
            onClick={() => handleOAuth("linkedin")}
            className="w-full rounded-lg border border-blue-800 bg-blue-700 hover:bg-blue-800 py-2 text-white font-medium flex items-center justify-center gap-2"
          >
            <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
            LinkedIn
          </button>
          <button
            onClick={handlePhoneLogin}
            className="w-full rounded-lg border border-green-700 bg-green-600 hover:bg-green-700 py-2 text-white font-medium flex items-center justify-center gap-2"
          >
            <img src="/icons/phone.svg" alt="Phone" className="w-5 h-5" />
            Teléfono (SMS/OTP)
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 hover:text-white hover:border-zinc-500 transition"
      >
        {triggerText}
      </button>

      {open &&
        typeof window !== "undefined" &&
        createPortal(modalContent, document.body)}
    </>
  );
}
