"use client";

import Link from "next/link";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-cyberBlue/40 to-black px-6 py-14 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
            IA Shield
          </p>
          <h1 className="mt-2 text-4xl font-semibold">History</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Próximamente podrás ver todas tus verificaciones, exportarlas y
            filtrar por canal. Mientras tanto, usa el dashboard principal para
            revisar tus checks más recientes.
          </p>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-black/50 text-4xl">
            📊
          </div>
          <h2 className="mt-6 text-2xl font-semibold">Historial en construcción</h2>
          <p className="mt-3 text-sm text-zinc-400">
            Estamos afinando la vista de historial con filtros avanzados,
            exportación CSV y etiquetas personalizadas. Si necesitas acceso
            prioritario escríbenos a support@ia-guard.co.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/20 bg-black px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Volver al dashboard
            </Link>
            <Link
              href="/pricing"
              className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Ver planes
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
