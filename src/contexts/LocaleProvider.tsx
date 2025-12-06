"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Locale, messages } from "@/i18n/messages";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

function getMessage(locale: Locale, path: string) {
  return path.split(".").reduce<any>((acc, part) => acc?.[part], messages[locale]) ?? path;
}

export function LocaleProvider({
  initialLocale = "en",
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    if (typeof document !== "undefined") {
      document.cookie = `locale=${nextLocale};path=/;max-age=31536000`;
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookieMatch = document.cookie.match(/locale=([^;]+)/);
    if (cookieMatch && (cookieMatch[1] === "en" || cookieMatch[1] === "es")) {
      setLocaleState(cookieMatch[1] as Locale);
    }
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (path: string) => getMessage(locale, path),
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
