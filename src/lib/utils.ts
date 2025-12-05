export function formatScoreLabel(score: number) {
  const normalized = Math.max(0, Math.min(100, score));
  if (normalized >= 70) return "Riesgo alto";
  if (normalized >= 40) return "Revisar";
  return "Seguro";
}

export function safeJsonParse<T = unknown>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
