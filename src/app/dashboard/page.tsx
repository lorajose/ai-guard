"use client";

import { useLocale } from "@/contexts/LocaleProvider";
import { Locale, messages } from "@/i18n/messages";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FixedSizeList as List, type ListChildComponentProps } from "react-window";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

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

type PlanBadge = {
  plan: string;
  status: string;
};

type DashboardCopy = (typeof messages)["en"]["dashboard"];

const PAGE_SIZE = 25;
const ROW_HEIGHT = 96;

export default function DashboardPage() {
  const { locale } = useLocale();
  const dashboardCopy = messages[locale].dashboard;
  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "ALL", label: dashboardCopy.filters.all },
    { value: "ESTAFA", label: dashboardCopy.filters.estafa },
    { value: "SOSPECHOSO", label: dashboardCopy.filters.sospechoso },
    { value: "SEGURO", label: dashboardCopy.filters.seguro },
  ];
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [checks, setChecks] = useState<CheckRecord[]>([]);
  const [loadingChecks, setLoadingChecks] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCheck, setSelectedCheck] = useState<CheckRecord | null>(null);
  const [planBadge, setPlanBadge] = useState<PlanBadge | null>(null);
  const academyCopy = dashboardCopy.academy;
  const modules = academyCopy.modules || [];
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    modules[0]?.id ?? ""
  );
  const [simulation, setSimulation] = useState<any | null>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<any | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [lessonOpen, setLessonOpen] = useState(false);
  const normalizedPlan = planBadge?.plan?.toLowerCase() ?? "free";
  const planStatus = planBadge?.status ?? "inactive";
  const isFreeTier = normalizedPlan === "free";
  const hasFullAcademyAccess =
    normalizedPlan !== "free" &&
    ["active", "trialing", "past_due"].includes(planStatus);
  const canAccessAcademy = hasFullAcademyAccess || isFreeTier;

  const academyLevelLabel = useMemo(() => {
    if (normalizedPlan.includes("enterprise"))
      return academyCopy.levels.enterprise;
    if (normalizedPlan.includes("business") || normalizedPlan.includes("pro"))
      return academyCopy.levels.business;
    if (normalizedPlan.includes("lite") || normalizedPlan.includes("basic"))
      return academyCopy.levels.basic;
    return academyCopy.levels.free;
  }, [academyCopy.levels, normalizedPlan]);

  const academyLessonLevel = useMemo(() => {
    if (normalizedPlan.includes("enterprise")) return "Avanzado";
    if (
      normalizedPlan.includes("business") ||
      normalizedPlan.includes("pro")
    ) {
      return "Intermedio";
    }
    return "Básico";
  }, [normalizedPlan]);

  const unlockedModuleIds = useMemo(() => {
    const base = isFreeTier ? modules.slice(0, 1) : modules;
    return new Set(base.map((module) => module.id));
  }, [isFreeTier, modules]);

  useEffect(() => {
    const fallbackId =
      modules.find((module) => unlockedModuleIds.has(module.id))?.id ??
      modules[0]?.id ??
      "";
    setSelectedModuleId((previous) =>
      previous && unlockedModuleIds.has(previous) ? previous : fallbackId
    );
  }, [modules, unlockedModuleIds]);

  const activeModule =
    modules.find(
      (module) =>
        module.id === selectedModuleId && unlockedModuleIds.has(module.id)
    ) ||
    modules.find((module) => unlockedModuleIds.has(module.id)) ||
    modules[0];

  const xpEarned = useMemo(() => checks.length * 5, [checks.length]);
  const streak = useMemo(
    () => Math.max(checks.length ? Math.min(checks.length, 21) : 1, 1),
    [checks.length]
  );
  const progress = useMemo(
    () => Math.min(((xpEarned % 120) / 120) * 100, 100),
    [xpEarned]
  );
  const medalsUnlocked = useMemo(() => {
    const unlocked: string[] = [];
    if (checks.length > 0) unlocked.push(academyCopy.medals.hunter);
    if (checks.length >= 10) unlocked.push(academyCopy.medals.firewall);
    if (checks.length >= 25) unlocked.push(academyCopy.medals.trainee);
    return unlocked;
  }, [academyCopy.medals, checks.length]);

  const handleGenerateSimulation = useCallback(async () => {
    if (!canAccessAcademy) return;
    setSimulationError(null);
    setSimulationLoading(true);
    try {
      const response = await fetch("/api/academy/phish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: "IA Shield",
          scenario: "Dashboard monthly training",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed request");
      }
      const payload = await response.json();
      setSimulation(payload);
    } catch (error) {
      console.error(error);
      setSimulationError(academyCopy.actions.error);
    } finally {
      setSimulationLoading(false);
    }
  }, [academyCopy.actions.error, canAccessAcademy]);

  const handleOpenLessonCard = useCallback(async () => {
    if (!canAccessAcademy) return;
    setLessonError(null);
    setLessonLoading(true);
    try {
      const response = await fetch("/api/academy/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeModule?.title ?? "Phishing fundamentals",
          level: academyLessonLevel,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed lesson request");
      }
      const payload = await response.json();
      setLessonData(payload);
      setLessonOpen(true);
    } catch (error) {
      console.error(error);
      setLessonError(academyCopy.actions.error);
    } finally {
      setLessonLoading(false);
    }
  }, [
    academyCopy.actions.error,
    academyLessonLevel,
    activeModule?.title,
    canAccessAcademy,
  ]);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      if (user) {
        setPlanBadge({
          plan: (user.user_metadata?.plan || "FREE").toUpperCase(),
          status: (user.user_metadata?.plan_status || "inactive")
            .toString()
            .toLowerCase(),
        });
      }
      setLoadingUser(false);
    }
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    setChecks([]);
    setPage(0);
    setHasMore(true);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    async function loadChecks() {
      setLoadingChecks(true);
      const { data, error } = await supabase
        .from("checks")
        .select("id,created_at,source,label,score,text,metadata")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
      if (!isMounted) return;
      if (error) {
        console.error("Error fetching checks:", error.message);
      } else if (data) {
        setChecks((prev) =>
          page === 0 ? (data as CheckRecord[]) : [...prev, ...(data as CheckRecord[])]
        );
        setHasMore((data?.length ?? 0) === PAGE_SIZE);
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
  }, [supabase, userId, page]);

  const filteredChecks = useMemo(() => {
    return checks.filter((check) => {
      const matchesFilter =
        selectedFilter === "ALL" ||
        check.label?.toUpperCase() === selectedFilter;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = term
        ? (check.text || "").toLowerCase().includes(term) ||
          (check.source || "").toLowerCase().includes(term)
        : true;
      return matchesFilter && matchesSearch;
    });
  }, [checks, searchTerm, selectedFilter]);

  const handleRowClick = useCallback((check: CheckRecord) => {
    setSelectedCheck(check);
  }, []);

  const loadMore = useCallback(() => {
    if (loadingChecks || !hasMore) return;
    setPage((prev) => prev + 1);
  }, [hasMore, loadingChecks]);

  const shouldVirtualize = filteredChecks.length > 20;
  const listHeight =
    Math.max(Math.min(filteredChecks.length, 8), 1) * ROW_HEIGHT;

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
      { label: dashboardCopy.stats.total, value: total },
      { label: dashboardCopy.stats.scams, value: scams },
      { label: dashboardCopy.stats.safe, value: safe },
      { label: dashboardCopy.stats.pending, value: pending },
    ];
  }, [checks, dashboardCopy]);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="text-sm text-zinc-400">{dashboardCopy.loading}</span>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-cyberBlue/20 to-black flex items-center justify-center px-6 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(57,255,20,0.15),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(12,108,211,0.2),_transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.04)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(255,255,255,0.04)_1px,_transparent_1px)] bg-[size:120px_120px]" />
        </div>
        <div className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-black/70 p-8 text-center backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">
            IA Shield
          </p>
          <h1 className="mt-4 text-3xl font-semibold">
            {dashboardCopy.unauthenticated.title}
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            {dashboardCopy.unauthenticated.description}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Home
            </Link>
            <Link
              href="/login?guest=1"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-black px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition hover:border-white/40 hover:bg-black/80"
            >
              {dashboardCopy.unauthenticated.cta}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-cyberBlue to-black text-white">
      <div className="flex flex-col lg:flex-row">
        <Sidebar copy={dashboardCopy.sidebar} />
        <main className="flex-1 px-6 py-10 lg:px-10">
          <header className="flex flex-col gap-3">
            <p className="text-sm text-zinc-400">{dashboardCopy.welcome}</p>
            <h1 className="text-3xl font-semibold">{dashboardCopy.title}</h1>
            {planBadge && (
              <span className="inline-flex items-center gap-2 w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-zinc-200">
                <span className="h-2 w-2 rounded-full bg-neonGreen" />
                {formatTemplate(dashboardCopy.planLabel, {
                  plan: planBadge.plan,
                })}
                <span className="text-zinc-500 capitalize">
                  (
                  {formatTemplate(dashboardCopy.statusLabel, {
                    status: planBadge.status,
                  })}
                  )
                </span>
              </span>
            )}
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

          <section className="mt-10 rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-950 via-black to-cyberBlue/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                  {academyCopy.title}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {academyCopy.title}
                </h2>
                <p className="text-sm text-zinc-400">{academyCopy.description}</p>
              </div>
              {planBadge && (
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-wider text-zinc-300">
                  🎮 {academyLevelLabel}
                </span>
              )}
            </div>

            {canAccessAcademy ? (
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.95fr]">
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {academyCopy.gamification.streakLabel}
                      </p>
                      <p className="mt-2 text-3xl font-semibold">{streak}d</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {academyCopy.gamification.xpLabel}
                      </p>
                      <p className="mt-2 text-3xl font-semibold">{xpEarned}</p>
                      <div className="mt-3 h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-neonGreen"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {academyCopy.gamification.badgeLabel}
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {academyLevelLabel}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-zinc-500">
                        {academyCopy.gamification.medalsLabel}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        {(medalsUnlocked.length ? medalsUnlocked : ["—"]).map(
                          (medal) => (
                            <span
                              key={medal}
                              className="rounded-full border border-white/20 px-2 py-0.5 text-white/80"
                            >
                              {medal}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          {activeModule?.tag}
                        </p>
                        <h3 className="text-xl font-semibold">
                          {activeModule?.title}
                        </h3>
                        <p className="mt-2 text-sm text-zinc-400">
                          {activeModule?.summary}
                        </p>
                      </div>
                      <button
                        onClick={handleOpenLessonCard}
                        disabled={lessonLoading || !canAccessAcademy}
                        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 disabled:opacity-60"
                      >
                        {lessonLoading
                          ? academyCopy.actions.generating
                          : academyCopy.actions.startLesson}
                      </button>
                    </div>
                    {lessonError && (
                      <p className="mt-3 text-sm text-red-300">{lessonError}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {modules.map((module) => {
                        const unlocked = unlockedModuleIds.has(module.id);
                        return (
                          <button
                            key={module.id}
                            onClick={() => {
                              if (!unlocked) return;
                              setSelectedModuleId(module.id);
                            }}
                            className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
                              unlocked && selectedModuleId === module.id
                                ? "border-neonGreen bg-neonGreen/20 text-neonGreen"
                                : unlocked
                                ? "border-white/10 bg-white/5 text-zinc-300 hover:border-white/30"
                                : "border-white/5 bg-black/30 text-zinc-500 cursor-not-allowed"
                            }`}
                          >
                            {module.title} {!unlocked && "🔒"}
                          </button>
                        );
                      })}
                    </div>
                    {isFreeTier && (
                      <div className="mt-4 rounded-2xl border border-dashed border-neonGreen/40 bg-neonGreen/5 p-4 text-sm text-zinc-300">
                        <p className="text-xs uppercase tracking-[0.4em] text-neonGreen/80">
                          {academyCopy.freePreview.eyebrow}
                        </p>
                        <p className="mt-1 font-semibold text-white">
                          {academyCopy.freePreview.title}
                        </p>
                        <p className="mt-1 text-zinc-400">
                          {academyCopy.freePreview.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {academyCopy.actions.lastSimulation}
                      </p>
                      <p className="text-lg font-semibold">
                        {simulation?.subject || "—"}
                      </p>
                      {simulation?.from_email && (
                        <p className="text-xs text-zinc-500">
                          {simulation.from_name} · {simulation.from_email}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleGenerateSimulation}
                      disabled={simulationLoading}
                      className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 disabled:opacity-60"
                    >
                      {simulationLoading
                        ? academyCopy.actions.generating
                        : academyCopy.actions.startSimulation}
                    </button>
                  </div>
                  {simulationError && (
                    <p className="mt-3 text-sm text-red-300">{simulationError}</p>
                  )}
                  <div className="mt-4 min-h-[140px] rounded-2xl border border-white/10 bg-black/60 p-4 text-sm text-zinc-200">
                    {simulation?.body_text || academyCopy.actions.empty}
                  </div>
                  {simulation && (
                    <div className="mt-4 text-xs text-zinc-400">
                      <p className="font-semibold uppercase tracking-wide">
                        {academyCopy.actions.indicators}
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-4">
                        {simulation.indicadores_riesgo?.map(
                          (risk: string, index: number) => (
                            <li key={`risk-${index}`}>{risk}</li>
                          )
                        )}
                      </ul>
                      <p className="mt-3">
                        <span className="text-zinc-500">
                          {academyCopy.actions.levelTag}:
                        </span>{" "}
                        <span className="font-semibold text-white">
                          {simulation.nivel_estimado || "—"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-white/20 bg-black/40 p-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                  {academyCopy.locked.eyebrow}
                </p>
                <h3 className="mt-3 text-2xl font-semibold">
                  {academyCopy.locked.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {academyCopy.locked.description}
                </p>
                <Link
                  href="/pricing"
                  className="mt-5 inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
                >
                  {academyCopy.locked.cta}
                </Link>
              </div>
            )}
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
                  placeholder={dashboardCopy.searchPlaceholder}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none placeholder:text-zinc-500"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                  ⌕
                </span>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
              <div className="hidden grid-cols-[140px_1fr_150px_200px_120px] bg-white/5 px-6 py-3 text-left text-xs uppercase tracking-wide text-zinc-400 md:grid">
                <span>{dashboardCopy.table.date}</span>
                <span>{dashboardCopy.table.source}</span>
                <span>{dashboardCopy.table.label}</span>
                <span>{dashboardCopy.table.score}</span>
                <span>{dashboardCopy.table.actions}</span>
              </div>
              {loadingChecks ? (
                <SkeletonRows />
              ) : filteredChecks.length === 0 ? (
                <EmptyState copy={dashboardCopy.empty} />
              ) : shouldVirtualize ? (
                <VirtualizedCheckList
                  items={filteredChecks}
                  locale={locale}
                  copy={dashboardCopy.table}
                  onRowClick={handleRowClick}
                  height={listHeight}
                />
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredChecks.map((check) => (
                    <CheckRowItem
                      key={check.id}
                      check={check}
                      locale={locale}
                      copy={dashboardCopy.table}
                      onRowClick={handleRowClick}
                    />
                  ))}
                </div>
              )}
              {filteredChecks.length > 0 && (
                <div className="border-t border-white/5 bg-black/20 px-4 py-4 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingChecks || !hasMore}
                    className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:border-white/40 disabled:opacity-50"
                  >
                    {loadingChecks
                      ? "Loading..."
                      : hasMore
                      ? "Load more"
                      : "No more results"}
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
      <DetailsModal
        check={selectedCheck}
        onClose={() => setSelectedCheck(null)}
        copy={dashboardCopy.table}
        locale={locale}
      />
      <LessonModal
        lesson={lessonData}
        isOpen={lessonOpen}
        onClose={() => setLessonOpen(false)}
      />
    </div>
  );
}

const Sidebar = memo(function Sidebar({
  copy,
}: {
  copy: DashboardCopy["sidebar"];
}) {
  return (
    <aside className="border-b border-white/10 bg-black/30 px-6 py-6 backdrop-blur md:px-8 lg:min-h-screen lg:w-72 lg:border-r">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-neonGreen/10 text-neonGreen flex items-center justify-center font-black">
          IA
        </div>
        <div>
          <p className="text-sm uppercase tracking-widest text-zinc-400">
            {copy.brand}
          </p>
          <p className="text-lg font-semibold">{copy.title}</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2 text-sm font-medium text-zinc-400">
        {[
          { label: copy.nav.dashboard, href: "/dashboard" },
          { label: copy.nav.history, href: "/dashboard/history" },
          { label: copy.nav.settings, href: "/dashboard/settings" },
          { label: copy.nav.logout, href: "/logout" },
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
});

const StatCard = memo(function StatCard({
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
});

type RowData = {
  items: CheckRecord[];
  locale: Locale;
  copy: DashboardCopy["table"];
  onRowClick: (check: CheckRecord) => void;
};

const CheckRowItem = memo(function CheckRowItem({
  check,
  locale,
  copy,
  onRowClick,
  style,
}: {
  check: CheckRecord;
  locale: Locale;
  copy: DashboardCopy["table"];
  onRowClick: (check: CheckRecord) => void;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className="grid cursor-pointer grid-cols-1 gap-4 px-4 py-4 text-sm transition hover:bg-white/5 md:grid-cols-[140px_1fr_150px_200px_120px] md:items-center"
      onClick={() => onRowClick(check)}
    >
      <span className="text-zinc-400">
        {formatDate(check.created_at, locale)}
      </span>
      <span className="font-medium">
        {check.source || copy.unknownSource}
      </span>
      <DashboardLabelBadge label={check.label} />
      <DashboardScoreBar score={check.score} label={check.label} />
      <button
        className="rounded-full border border-white/20 px-4 py-1 text-xs text-white transition hover:border-white/40"
        onClick={(event) => {
          event.stopPropagation();
          onRowClick(check);
        }}
      >
        {copy.viewDetails}
      </button>
    </div>
  );
});

const VirtualizedRow = memo(
  ({ data, index, style }: ListChildComponentProps<RowData>) => {
    const check = data.items[index];
    if (!check) return null;
    return (
      <CheckRowItem
        check={check}
        locale={data.locale}
        copy={data.copy}
        onRowClick={data.onRowClick}
        style={style}
      />
    );
  }
);

const VirtualizedCheckList = memo(function VirtualizedCheckList({
  items,
  locale,
  copy,
  onRowClick,
  height,
}: {
  items: CheckRecord[];
  locale: Locale;
  copy: DashboardCopy["table"];
  onRowClick: (check: CheckRecord) => void;
  height: number;
}) {
  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={ROW_HEIGHT}
      width="100%"
      itemData={{ items, locale, copy, onRowClick }}
    >
      {VirtualizedRow}
    </List>
  );
});

export const DashboardLabelBadge = memo(function DashboardLabelBadge({
  label,
}: {
  label: string;
}) {
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
});

export const DashboardScoreBar = memo(function DashboardScoreBar({
  score,
  label,
}: {
  score: number;
  label: string;
}) {
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
});

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

function EmptyState({ copy }: { copy: DashboardCopy["empty"] }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      <div className="rounded-full bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.4em] text-zinc-400">
        IA Shield
      </div>
      <p className="text-2xl font-semibold">{copy.title}</p>
      <p className="max-w-xl text-sm text-zinc-400">{copy.description}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="/shield"
          className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
        >
          {copy.cta}
        </a>
        <a
          href="/pricing"
          className="rounded-full border border-white/20 bg-black/60 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
        >
          {copy.secondaryCta}
        </a>
      </div>
    </div>
  );
}

function DetailsModal({
  check,
  onClose,
  copy,
  locale,
}: {
  check: CheckRecord | null;
  onClose: () => void;
  copy: DashboardCopy["table"];
  locale: Locale;
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
              <h3 className="text-2xl font-semibold">{copy.modalTitle}</h3>
              <div className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
                <p>
                  <span className="text-zinc-500">{copy.date}:</span>{" "}
                  {formatDate(check.created_at, locale, true)}
                </p>
                <p>
                  <span className="text-zinc-500">{copy.source}:</span>{" "}
                  {check.source || copy.unknownSource}
                </p>
                <p>
                  <span className="text-zinc-500">{copy.label}:</span>{" "}
                  <LabelBadge label={check.label} />
                </p>
                <p>
                  <span className="text-zinc-500">{copy.score}:</span>{" "}
                  {Math.round(check.score)}%
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  {copy.messageAnalyzed}
                </p>
                <div className="mt-2 max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-100">
                  {check.text || copy.noContent}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-white/5 bg-black/40 p-4 text-sm text-zinc-400">
              <p>
                {copy.status}:{" "}
                <span className="font-semibold text-white">
                  {check.status || copy.completed}
                </span>
              </p>
              <p>
                {copy.updated}: {formatDate(check.created_at, locale, true)}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LessonModal({
  lesson,
  isOpen,
  onClose,
}: {
  lesson: any | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {lesson && isOpen && (
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
            className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950 p-6"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-sm text-zinc-500 hover:text-white"
            >
              ✕
            </button>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                  {lesson.tipo === "lesson" ? "IA Academy · Lesson" : "IA Academy"}
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {lesson.titulo}
                </h3>
                {lesson.resumen && (
                  <p className="mt-2 text-sm text-zinc-400">{lesson.resumen}</p>
                )}
              </div>
              <div className="space-y-4">
                {lesson.secciones?.map(
                  (section: { subtitulo: string; contenido_html: string }, index: number) => (
                    <div
                      key={`lesson-section-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/40 p-4"
                    >
                      <h4 className="text-lg font-semibold text-white">
                        {section.subtitulo}
                      </h4>
                      <div
                        className="mt-2 text-sm text-zinc-200 space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: section.contenido_html,
                        }}
                      />
                    </div>
                  )
                )}
              </div>
              {lesson.mini_quiz && lesson.mini_quiz.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Quiz
                  </p>
                  <div className="mt-3 space-y-4 text-sm text-zinc-200">
                    {lesson.mini_quiz.map(
                      (
                        quiz: {
                          pregunta: string;
                          opciones: string[];
                          respuesta_correcta: string;
                          explicacion: string;
                        },
                        index: number
                      ) => (
                        <div key={`lesson-quiz-${index}`} className="space-y-2">
                          <p className="font-semibold">{quiz.pregunta}</p>
                          <ul className="space-y-1">
                            {quiz.opciones.map((option, optionIndex) => (
                              <li
                                key={`${option}-${optionIndex}`}
                                className={`rounded-full border px-3 py-1 text-xs ${
                                  option === quiz.respuesta_correcta
                                    ? "border-neonGreen text-neonGreen"
                                    : "border-white/10 text-zinc-300"
                                }`}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-zinc-500">
                            {quiz.explicacion}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              {lesson.checklist_final && (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Checklist
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-200">
                    {lesson.checklist_final.map((item: string, index: number) => (
                      <li key={`lesson-check-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatDate(dateValue: string, locale: Locale, includeTime = false) {
  const date = new Date(dateValue);
  const localeCode = locale === "es" ? "es-ES" : "en-US";
  return date.toLocaleString(localeCode, {
    dateStyle: "medium",
    timeStyle: includeTime ? "short" : undefined,
  });
}

function formatTemplate(template: string, replacements: Record<string, string>) {
  return Object.entries(replacements).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, value),
    template
  );
}
