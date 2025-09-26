// app/dashboard/page.tsx
import { getUserSubscription } from "@/server/getSubscription";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <div>Por favor inicia sesión</div>;

  const sub = await getUserSubscription(user.id);
  if (!sub || sub.status !== "active") {
    return (
      <div>
        No tienes una suscripción activa. <a href="/pricing">Ver planes</a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Panel IA Guard</h1>
      <div className="text-sm text-white/60">
        Plan: <b>{sub.plan_name}</b> – Estado: <b>{sub.status}</b>
      </div>

      {/* IA Shield siempre visible */}
      <section className="rounded-xl p-4 bg-white/5">
        <h2 className="text-xl mb-2">IA Shield</h2>
        <p>Verificador de estafas (Webhook / Telegram / Email)</p>
      </section>

      {/* Pro-only: AgentGuard y Academy */}
      {sub.plan_name === "PRO" && (
        <>
          <section className="rounded-xl p-4 bg-white/5">
            <h2 className="text-xl mb-2">AgentGuard</h2>
            <p>Reglas para agentes IA (acciones, datos y límites de gasto).</p>
          </section>
          <section className="rounded-xl p-4 bg-white/5">
            <h2 className="text-xl mb-2">IA Academy</h2>
            <p>Simulaciones mensuales y casos prácticos.</p>
          </section>
        </>
      )}
    </div>
  );
}
