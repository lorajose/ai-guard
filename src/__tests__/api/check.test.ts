import {
  runHeuristics,
  normalizeLabel,
  clampScore,
} from "@/app/api/check/route";

describe("Heuristics detection", () => {
  it("detects urgency and payments", () => {
    const text = "Necesito que transfieras dinero ahora mismo, es urgente";
    const result = runHeuristics(text);
    expect(result.reasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining("urgencia"),
        expect.stringContaining("pago"),
      ])
    );
    expect(result.scoreBump).toBeGreaterThan(0);
  });

  it("returns empty reasons when nothing suspicious", () => {
    const result = runHeuristics("Hola, confirmamos la reunión de mañana.");
    expect(result.reasons).toHaveLength(0);
    expect(result.scoreBump).toBe(0);
  });
});

describe("Classifier helpers", () => {
  it("normalizes unexpected labels", () => {
    expect(normalizeLabel("unknown", 0)).toBe("SOSPECHOSO");
  });

  it("clamps scores and applies heuristic bump", () => {
    expect(clampScore(95, 2)).toBeLessThanOrEqual(100);
    expect(clampScore(50, 1)).toBe(52);
  });
});
