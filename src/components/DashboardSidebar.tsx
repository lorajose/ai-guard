"use client";

import { useLocale } from "@/contexts/LocaleProvider";
import { messages } from "@/i18n/messages";
import Link from "next/link";

export function DashboardSidebar() {
  const { locale } = useLocale();
  const copy = messages[locale].dashboard.sidebar;

  return (
    <aside className="border-b border-white/10 bg-black/30 px-5 pb-6 pt-20 backdrop-blur sm:px-6 sm:pt-24 lg:min-h-screen lg:w-72 lg:border-r lg:pt-16">
      <div className="flex flex-col items-start gap-3 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-neonGreen/10 font-black text-neonGreen sm:mx-0">
          IA
        </div>
        <div>
          <p className="text-sm uppercase tracking-widest text-zinc-400">
            {copy.brand}
          </p>
          <p className="text-lg font-semibold text-white">{copy.title}</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2 text-base font-medium text-zinc-300 sm:text-sm">
        {[
          { label: copy.nav.dashboard, href: "/dashboard" },
          { label: copy.nav.history, href: "/dashboard/history" },
          { label: copy.nav.viajard, href: "/dashboard/viajard" },
          { label: copy.nav.chat, href: "/dashboard/chat" },
          { label: copy.nav.billing, href: "/dashboard/facturacion" },
          { label: copy.nav.trustsnap, href: "/dashboard/trustsnap" },
          { label: copy.nav.settings, href: "/dashboard/settings" },
          { label: copy.nav.logout, href: "/logout" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 transition hover:border-white/20 hover:text-white"
          >
            <span>{item.label}</span>
            <span className="text-xs text-zinc-600">›</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
