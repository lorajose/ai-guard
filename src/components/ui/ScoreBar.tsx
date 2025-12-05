"use client";

import clsx from "clsx";

type ScoreBarProps = {
  score: number;
  showLabel?: boolean;
  className?: string;
};

function getGradient(score: number) {
  if (score >= 70) return "from-red-500 to-orange-500";
  if (score >= 40) return "from-amber-400 to-yellow-400";
  return "from-green-400 to-emerald-400";
}

export function ScoreBar({ score, showLabel = true, className }: ScoreBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <div className={clsx("space-y-1", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Score</span>
          <span>{clamped}/100</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-white/10">
        <div
          className={clsx(
            "h-full rounded-full bg-gradient-to-r",
            getGradient(clamped)
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
