export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-black/60 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            IA Shield
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Support & Contact</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Need help with your subscription, suspicious messages, or onboarding?
            Reach our team anytime.
          </p>
        </div>
        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
            <h2 className="text-xl font-semibold">Priority email</h2>
            <p className="mt-1 text-sm text-zinc-400">
              founders@ai-guard.co (response within 24h)
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
            <h2 className="text-xl font-semibold">Telegram (Lite)</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Contact @ia_guard_support for bot issues.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
            <h2 className="text-xl font-semibold">Slack / Business</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Enterprise customers can open a ticket in the shared Slack channel.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
            <h2 className="text-xl font-semibold">Status</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Visit status.ai-guard.co for uptime and incident reports.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
