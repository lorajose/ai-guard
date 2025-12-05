import { formatScoreLabel, safeJsonParse } from "@/lib/utils";

describe("formatScoreLabel", () => {
  it("labels high score as high risk", () => {
    expect(formatScoreLabel(85)).toBe("Riesgo alto");
  });

  it("labels low score as seguro", () => {
    expect(formatScoreLabel(10)).toBe("Seguro");
  });
});

describe("safeJsonParse", () => {
  it("returns parsed value when valid", () => {
    expect(safeJsonParse("{\"a\":1}", { a: 0 })).toEqual({ a: 1 });
  });

  it("returns fallback on invalid JSON", () => {
    expect(safeJsonParse("invalid", { ok: true })).toEqual({ ok: true });
  });
});
