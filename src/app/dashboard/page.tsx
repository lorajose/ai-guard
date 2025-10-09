"use client";

import AuthModal from "@/components/AuthModal";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion"; // 👈 animación pro
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    }
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading)
    return (
      <header className="sticky top-0 z-40 bg-black/30 backdrop-blur border-b border-zinc-800 h-14 transition-all duration-500"></header>
    );

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        // 🌑 NAVBAR PÚBLICO
        <motion.header
          key="public-navbar"
          initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="sticky top-0 z-40 bg-black/30 backdrop-blur border-b border-zinc-800 supports-[backdrop-filter]:bg-black/40 shadow-sm"
        >
          <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image
                src="/logo-icon.svg"
                alt="AI Guard"
                width={20}
                height={20}
              />
              <span className="text-sm font-semibold text-orange-400">
                AI Guard
              </span>
            </div>

            {/* Menú desktop */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
              <a href="#how" className="hover:text-white transition">
                Cómo funciona
              </a>
              <a href="#pricing" className="hover:text-white transition">
                Precios
              </a>
              <a href="#faq" className="hover:text-white transition">
                FAQ
              </a>
              <a
                href="#demo"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 hover:text-white hover:border-zinc-500 transition"
              >
                Ver demo
              </a>
              <AuthModal triggerText="Login / Registro" />
            </nav>

            {/* Menú móvil */}
            <div className="md:hidden flex items-center gap-3 text-zinc-300">
              <AuthModal triggerText="Entrar" />
              <span className="cursor-pointer">☰</span>
            </div>
          </div>
        </motion.header>
      ) : (
        // 🧡 NAVBAR PRIVADO
        <motion.nav
          key="private-navbar"
          initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 bg-zinc-900 border-b border-zinc-800 text-white px-6 py-3 flex justify-between items-center shadow-md z-50"
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo-icon.svg" alt="AI Guard" width={22} height={22} />
            <span className="text-lg font-semibold text-orange-400">
              AI Guard
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <a href="/dashboard" className="hover:text-white transition">
              Dashboard
            </a>
            <a href="/pricing" className="hover:text-white transition">
              Planes
            </a>
            <a href="/support" className="hover:text-white transition">
              Soporte
            </a>
          </div>

          {/* Menú del usuario */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition"
            >
              <img
                src={user.user_metadata?.avatar_url || "/icons/user.svg"}
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium text-zinc-200">
                {user.user_metadata?.full_name ||
                  user.email?.split("@")[0] ||
                  "Usuario"}
              </span>
            </button>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg border border-zinc-700 shadow-xl overflow-hidden"
              >
                <a
                  href="/account"
                  className="block px-4 py-2 text-sm hover:bg-zinc-700"
                >
                  ⚙️ Mi cuenta
                </a>
                <a
                  href="/change-password"
                  className="block px-4 py-2 text-sm hover:bg-zinc-700"
                >
                  🔑 Cambiar contraseña
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700"
                >
                  🚪 Cerrar sesión
                </button>
              </motion.div>
            )}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
