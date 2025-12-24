"use client";

import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthActionResult = { success: boolean; error?: string };

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<AuthActionResult>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function hydrateUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.access_token) {
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `sb-access-token=${session.access_token}; Path=/; SameSite=Lax${secure}`;
      }
      if (session?.refresh_token) {
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `sb-refresh-token=${session.refresh_token}; Path=/; SameSite=Lax${secure}`;
      }
      if (session?.access_token && session?.refresh_token) {
        fetch("/api/auth/session", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        }).catch((error) =>
          console.warn("Failed to sync auth session", error)
        );
      }
      setInitializing(false);
    }

    hydrateUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.access_token && session?.refresh_token) {
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `sb-access-token=${session.access_token}; Path=/; SameSite=Lax${secure}`;
        document.cookie = `sb-refresh-token=${session.refresh_token}; Path=/; SameSite=Lax${secure}`;
        fetch("/api/auth/session", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        }).catch((error) =>
          console.warn("Failed to sync auth session", error)
        );
      } else {
        fetch("/auth/callback", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event, session }),
        }).catch((error) =>
          console.warn("Failed to sync auth session", error)
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await fetch("/api/auth/session", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          }),
        });
      }
      router.push("/dashboard");
      return { success: true };
    },
    [router, supabase]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      try {
        await fetch("/api/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "welcome", email }),
        });
      } catch (err) {
        console.warn("No se pudo enviar el correo de bienvenida", err);
      }

      return { success: true };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || "/";
    await supabase.auth.signOut();
    window.location.href = redirectUrl;
  }, [supabase]);

  const sendMagicLink = useCallback(
    async (email: string) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return {
        success: true,
      };
    },
    [supabase]
  );

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      signIn,
      signUp,
      signOut,
      sendMagicLink,
      signInWithGoogle,
    }),
    [initializing, signIn, signUp, signOut, sendMagicLink, signInWithGoogle, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
