"use client";
import AuthModal from "@/components/AuthModal"; // 👈 importamos el modal
import Logo from "@/components/Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-black/30 backdrop-blur border-b border-zinc-800 supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Logo />

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
          {/* 👇 Botón de login/registro */}
          <AuthModal triggerText="Login / Registro" />
        </nav>

        {/* Menú móvil */}
        <div className="md:hidden flex items-center gap-3 text-zinc-300">
          {/* Botón también disponible en móvil */}
          <AuthModal triggerText="Entrar" />
          <span className="cursor-pointer">☰</span>
        </div>
      </div>
    </header>
  );
}
