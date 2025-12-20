"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type PlanState = {
  plan: string;
  status: string;
  trialEndsAt?: string | null;
  cancelAtPeriodEnd?: boolean;
};

export default function SettingsPage() {
  const supabase = createClient();
  const [plan, setPlan] = useState<PlanState | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlan() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setPlan({
          plan: (user.user_metadata?.plan || "FREE").toUpperCase(),
          status: (user.user_metadata?.plan_status || "inactive")
            .toString()
            .toLowerCase(),
          trialEndsAt: user.user_metadata?.trial_ends_at,
          cancelAtPeriodEnd: Boolean(user.user_metadata?.cancel_at_period_end),
        });
      } else {
        setError("Debes iniciar sesión para ver tu suscripción.");
      }
      setLoading(false);
    }
    loadPlan();
  }, [supabase]);

  async function handleManagePortal() {
    setPortalLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No pudimos abrir el portal de Stripe.");
      } else {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-cyberBlue/40 to-black px-6 py-14 text-white">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <p className="text-sm text-zinc-500">Cuenta</p>
          <h1 className="text-4xl font-semibold">Settings</h1>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-32 rounded-full bg-white/10" />
              <div className="h-10 w-60 rounded-full bg-white/10" />
            </div>
          ) : error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide">
                  <span className="h-2 w-2 rounded-full bg-neonGreen" />
                  {plan?.plan || "FREE"} plan
                </span>
                <span className="text-xs text-zinc-400 capitalize">
                  Estado: {plan?.status || "inactive"}
                </span>
                {plan?.trialEndsAt && (
                  <span className="text-xs text-amber-300">
                    Trial termina{" "}
                    {new Date(plan.trialEndsAt).toLocaleDateString("es-ES")}
                  </span>
                )}
                {plan?.cancelAtPeriodEnd && (
                  <span className="text-xs text-zinc-400">
                    Cancelado al final del periodo
                  </span>
                )}
              </div>

              <p className="text-sm text-zinc-400">
                Gestiona tu suscripción, método de pago o cancela directamente
                desde el portal de Stripe.
              </p>

              <button
                onClick={handleManagePortal}
                disabled={portalLoading}
                className="rounded-2xl bg-neonGreen px-6 py-3 text-sm font-semibold text-white transition hover:bg-neonGreen/90 disabled:opacity-60"
              >
                {portalLoading ? "Abriendo portal..." : "Manage Subscription"}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
