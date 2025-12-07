"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "@/contexts/LocaleProvider";
import { messages } from "@/i18n/messages";

const AuthModal = dynamic(() => import("@/components/AuthModal"), {
  ssr: false,
  loading: () => (
    <button className="rounded-lg border border-zinc-700 px-3 py-1.5 opacity-70">
      ...
    </button>
  ),
});

export default function Navbar() {
  const { user, initializing, signOut } = useAuth();
  const { locale } = useLocale();
  const navbarCopy = messages[locale].navbar;
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut();
  }

  if (initializing) {
    return (
      <header className="sticky top-0 z-40 bg-black/30 backdrop-blur border-b border-zinc-800 h-14"></header>
    );
  }

  // 🔹 Navbar público (usuario no logueado)
  if (!user) {
    return (
      <header className="sticky top-0 z-40 bg-black/30 backdrop-blur border-b border-zinc-800 supports-[backdrop-filter]:bg-black/40">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo-icon.svg" alt="AI Guard" width={20} height={20} />
            <span className="text-sm font-semibold text-orange-400">
              AI Guard
            </span>
          </div>

          {/* Menú desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <a href="#how" className="hover:text-white transition">
              {navbarCopy.public.how}
            </a>
            <a href="#pricing" className="hover:text-white transition">
              {navbarCopy.public.pricing}
            </a>
            <a href="#faq" className="hover:text-white transition">
              {navbarCopy.public.faq}
            </a>
            <a
              href="#demo"
              className="rounded-lg border border-zinc-700 px-3 py-1.5 hover:text-white hover:border-zinc-500 transition"
            >
              {navbarCopy.public.demo}
            </a>
            <AuthModal triggerText={navbarCopy.public.authTrigger} />
          </nav>

          {/* Menú móvil */}
          <div className="md:hidden flex items-center gap-3 text-zinc-300">
            <AuthModal triggerText={navbarCopy.public.mobileTrigger} />
            <span className="cursor-pointer">☰</span>
          </div>
        </div>
      </header>
    );
  }

  // 🔸 Navbar privado (usuario logueado)
  return (
    <nav className="fixed top-0 left-0 right-0 bg-zinc-900 border-b border-zinc-800 text-white px-6 py-3 flex justify-between items-center shadow-md z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src="/logo-icon.svg" alt="AI Guard" width={22} height={22} />
        <span className="text-lg font-semibold text-orange-400">AI Guard</span>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
        <Link href="/dashboard" className="hover:text-white transition">
          {navbarCopy.private.dashboard}
        </Link>
        <Link href="/pricing" className="hover:text-white transition">
          {navbarCopy.private.pricing}
        </Link>
        <Link href="/support" className="hover:text-white transition">
          {navbarCopy.private.support}
        </Link>
      </div>

      {/* Menú del usuario */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition"
        >
          <Image
            src={user.user_metadata?.avatar_url || "/icons/user.svg"}
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full"
            unoptimized
          />
          <span className="text-sm font-medium text-zinc-200">
            {user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              navbarCopy.account.userFallback}
          </span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-lg border border-zinc-700 shadow-xl overflow-hidden">
            <Link
              href="/account"
              className="block px-4 py-2 text-sm hover:bg-zinc-700"
            >
              ⚙️ {navbarCopy.account.account}
            </Link>
            <Link
              href="/change-password"
              className="block px-4 py-2 text-sm hover:bg-zinc-700"
            >
              🔑 {navbarCopy.account.password}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700"
            >
              🚪 {navbarCopy.account.logout}
            </button>
          </div>
        )}
      </div>

      <LanguageSwitcher />
    </nav>
  );
}
