"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function AccountForm({ user }: { user: any }) {
  const supabase = createClient();
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );

  async function handleUpdateProfile() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
      email,
    });
    setLoading(false);
    if (error) setMessage({ type: "error", text: error.message });
    else
      setMessage({
        type: "success",
        text: "✅ Perfil actualizado correctamente.",
      });
  }

  async function handleChangePassword() {
    if (!password)
      return setMessage({
        type: "error",
        text: "Escribe una nueva contraseña.",
      });
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setMessage({ type: "error", text: error.message });
    else
      setMessage({
        type: "success",
        text: "🔑 Contraseña actualizada correctamente.",
      });
    setPassword("");
  }

  async function handleDeleteAccount() {
    const confirmed = confirm(
      "⚠️ ¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible."
    );
    if (!confirmed) return;
    const { error } = await supabase.rpc("delete_user"); // <- usa RPC si tienes función delete_user()
    if (error) setMessage({ type: "error", text: error.message });
    else {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg space-y-6">
      {/* Mensaje */}
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "error"
              ? "bg-red-900/30 text-red-400 border border-red-700/50"
              : "bg-green-900/30 text-green-400 border border-green-700/50"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">
          Nombre completo
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-400 cursor-not-allowed"
        />
        <p className="text-xs text-zinc-500 mt-1">
          *El cambio de correo requiere confirmación por email.
        </p>
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">
          Cambiar contraseña
        </label>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Guardar nueva contraseña
        </button>
      </div>

      {/* Botón actualizar */}
      <button
        onClick={handleUpdateProfile}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-md transition"
      >
        {loading ? "Guardando..." : "💾 Guardar cambios"}
      </button>

      {/* Eliminar cuenta */}
      <div className="pt-4 border-t border-zinc-700">
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition"
        >
          🗑️ Eliminar mi cuenta
        </button>
      </div>
    </div>
  );
}
