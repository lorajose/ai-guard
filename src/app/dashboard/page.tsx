"use client";

import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type CheckRecord = {
  id: string;
  created_at: string;
  source?: string | null;
  label: "ESTAFA" | "SOSPECHOSO" | "SEGURO" | string;
  score: number;
  text?: string | null;
  status?: string | null;
};

type FilterOption = "ALL" | "ESTAFA" | "SOSPECHOSO" | "SEGURO";

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ESTAFA", label: "Estafa" },
  { value: "SOSPECHOSO", label: "Sospechoso" },
  { value: "SEGURO", label: "Seguro" },
];

export default function DashboardPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [checks, setChecks] = useState<CheckRecord[]>([]);
  const [loadingChecks, setLoadingChecks] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCheck, setSelectedCheck] = useState<CheckRecord | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      setLoadingUser(false);
    }
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    async function loadChecks() {
      setLoadingChecks(true);
      const { data, error } = await supabase
        .from("checks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100);
      if (!isMounted) return;
      if (error) {
        console.error("Error fetching checks:", error.message);
      } else if (data) {
        setChecks(data as CheckRecord[]);
      }
      setLoadingChecks(false);
    }

    loadChecks();

    const channel = supabase
      .channel("checks-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "checks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setChecks((prev) => {
            const without = prev.filter((item) => item.id !== payload.new.id);
            const next = [payload.new as CheckRecord, ...without];
            return next
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              );
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const filteredChecks = useMemo(() => {
    return checks.filter((check) => {
      const matchesFilter =
        selectedFilter === "ALL" ||
        check.label?.toUpperCase() === selectedFilter;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = term
        ? check.text?.toLowerCase().includes(term) ||
          check.source?.toLowerCase().includes(term)
        : true;
      return matchesFilter && matchesSearch;
    });
  }, [checks, searchTerm, selectedFilter]);

  const stats = useMemo(() => {
    const total = checks.length;
    const scams = checks.filter(
      (check) => check.label?.toUpperCase() === "ESTAFA"
    ).length;
    const safe = checks.filter(
      (check) => check.label?.toUpperCase() === "SEGURO"
    ).length;
    const pending = checks.filter(
      (check) =>
        check.label?.toUpperCase() === "PENDIENTE" ||
        check.status?.toLowerCase() === "pending"
    ).length;
    return [
      { label: "Total checks", value: total },
      { label: "Estafas detectadas", value: scams },
      { label: "Seguras", value: safe },
      { label: "Pendientes", value: pending },
    ];
  }, [checks]);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="text-sm text-zinc-400">Cargando dashboard...</span>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-semibold">Inicia sesión para continuar</h1>
        <p className="text-zinc-400 text-sm">
          Necesitas una cuenta de IA Shield para ver tus verificaciones.
        </p>
        <a
          href="/login"
          className="rounded-full bg-neonGreen px-6 py-2 text-black font-semibold"
        >
          Ir a Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-cyberBlue to-black text-white">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 px-6 py-10 lg:px-10">
          <header className="flex flex-col gap-2">
            <p className="text-sm text-zinc-400">Bienvenido de nuevo</p>
            <h1 className="text-3xl font-semibold">Panel de verificaciones</h1>
          </header>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                loading={loadingChecks}
              />
            ))}
          </section>

          <section className="mt-10 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFilter(option.value)}
                    className={`rounded-full px-4 py-1 text-sm transition ${
                      selectedFilter === option.value
                        ? "bg-neonGreen text-black"
                        : "bg-white/5 text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar por origen o texto"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none placeholder:text-zinc-500"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                  ⌕
                </span>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
              <div className="hidden grid-cols-[140px_1fr_150px_200px_120px] bg-white/5 px-6 py-3 text-left text-xs uppercase tracking-wide text-zinc-400 md:grid">
                <span>Fecha</span>
                <span>Origen</span>
                <span>Label</span>
                <span>Score</span>
                <span>Acciones</span>
              </div>
              {loadingChecks ? (
                <SkeletonRows />
              ) : filteredChecks.length === 0 ? (
                <EmptyState />
              ) : (
                <ul className="divide-y divide-white/5">
                  {filteredChecks.map((check) => (
                    <li
                      key={check.id}
                      className="grid cursor-pointer grid-cols-1 gap-4 px-4 py-4 text-sm transition hover:bg-white/5 md:grid-cols-[140px_1fr_150px_200px_120px] md:items-center"
                      onClick={() => setSelectedCheck(check)}
                    >
                      <span className="text-zinc-400">
                        {formatDate(check.created_at)}
                      </span>
                      <span className="font-medium">
                        {check.source || "Desconocido"}
                      </span>
                      <LabelBadge label={check.label} />
                      <ScoreBar score={check.score} label={check.label} />
                      <button
                        className="rounded-full border border-white/20 px-4 py-1 text-xs text-white transition hover:border-white/40"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedCheck(check);
                        }}
                      >
                        Ver detalles
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </main>
      </div>
      <DetailsModal
        check={selectedCheck}
        onClose={() => setSelectedCheck(null)}
      />
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="border-b border-white/10 bg-black/30 px-6 py-6 backdrop-blur md:px-8 lg:min-h-screen lg:w-72 lg:border-r">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-neonGreen/10 text-neonGreen flex items-center justify-center font-black">
          IA
        </div>
        <div>
          <p className="text-sm uppercase tracking-widest text-zinc-400">
            IA Shield
          </p>
          <p className="text-lg font-semibold">Dashboard</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2 text-sm font-medium text-zinc-400">
        {[
          { label: "Dashboard", href: "/dashboard" },
          { label: "History", href: "/dashboard/history" },
          { label: "Settings", href: "/dashboard/settings" },
          { label: "Logout", href: "/logout" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-2 transition hover:border-white/10 hover:text-white"
          >
            <span>{item.label}</span>
            <span className="text-xs text-zinc-600">›</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

function StatCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      {loading ? (
        <div className="mt-4 h-6 w-24 animate-pulse rounded-full bg-white/10" />
      ) : (
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      )}
    </div>
  );
}

function LabelBadge({ label }: { label: string }) {
  const normalized = label?.toUpperCase();
  const colors: Record<string, string> = {
    ESTAFA: "bg-red-500/20 text-red-300 border-red-500/40",
    SOSPECHOSO: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    SEGURO: "bg-green-500/20 text-green-300 border-green-500/40",
    PENDIENTE: "bg-zinc-500/20 text-zinc-200 border-zinc-500/40",
  };
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
        colors[normalized] || "bg-blue-500/20 text-blue-200 border-blue-500/40"
      }`}
    >
      {normalized || "N/A"}
    </span>
  );
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  const normalized = label?.toUpperCase();
  const color =
    normalized === "ESTAFA"
      ? "bg-red-500"
      : normalized === "SOSPECHOSO"
      ? "bg-amber-400"
      : "bg-green-400";
  const width = `${Math.min(Math.max(score || 0, 0), 100)}%`;
  return (
    <div>
      <div className="h-2 rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width }}
        ></div>
      </div>
      <p className="mt-1 text-xs text-zinc-500">{Math.round(score)}%</p>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="h-16 animate-pulse rounded-2xl bg-white/5"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <p className="text-lg font-semibold">Sin verificaciones todavía</p>
      <p className="text-sm text-zinc-400">
        Envía tu primer mensaje sospechoso para verlo reflejado aquí en tiempo
        real.
      </p>
      <a
        href="/shield"
        className="rounded-full bg-neonGreen px-4 py-2 text-sm font-semibold text-black"
      >
        Comenzar verificación
      </a>
    </div>
  );
}

function DetailsModal({
  check,
  onClose,
}: {
  check: CheckRecord | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {check && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-6"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-sm text-zinc-500 hover:text-white"
            >
              ✕
            </button>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-semibold">
                Detalles de verificación
              </h3>
              <div className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
                <p>
                  <span className="text-zinc-500">Fecha:</span>{" "}
                  {formatDate(check.created_at, true)}
                </p>
                <p>
                  <span className="text-zinc-500">Origen:</span>{" "}
                  {check.source || "Desconocido"}
                </p>
                <p>
                  <span className="text-zinc-500">Label:</span>{" "}
                  <LabelBadge label={check.label} />
                </p>
                <p>
                  <span className="text-zinc-500">Score:</span>{" "}
                  {Math.round(check.score)}%
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Mensaje analizado
                </p>
                <div className="mt-2 max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-100">
                  {check.text || "Sin contenido"}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-white/5 bg-black/40 p-4 text-sm text-zinc-400">
              <p>
                Estado:{" "}
                <span className="font-semibold text-white">
                  {check.status || "Completado"}
                </span>
              </p>
              <p>Actualizado: {formatDate(check.created_at, true)}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatDate(dateValue: string, includeTime = false) {
  const date = new Date(dateValue);
  return date.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: includeTime ? "short" : undefined,
  });
}
