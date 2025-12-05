"use client";

import clsx from "clsx";

type BadgeVariant = "estafa" | "sospechoso" | "seguro" | "neutral";

const variants: Record<BadgeVariant, string> = {
  estafa: "bg-red-500/20 text-red-300 border-red-500/40",
  sospechoso: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  seguro: "bg-green-500/20 text-green-300 border-green-500/40",
  neutral: "bg-zinc-600/20 text-zinc-200 border-zinc-500/40",
};

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
