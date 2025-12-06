"use client";

import { useLocale } from "@/contexts/LocaleProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-3 py-1 font-semibold ${
          locale === "en" ? "bg-white text-black" : "border border-white/20"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("es")}
        className={`rounded-full px-3 py-1 font-semibold ${
          locale === "es" ? "bg-white text-black" : "border border-white/20"
        }`}
      >
        ES
      </button>
    </div>
  );
}
