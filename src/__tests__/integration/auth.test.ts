import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

jest.mock("@/lib/subscription", () => ({
  checkUserPlan: jest.fn(),
}));

const mockSupabase = require("@/lib/supabase");
const mockCheckPlan = require("@/lib/subscription");

describe("middleware auth flow", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("redirects unauthenticated users to login", async () => {
    mockSupabase.createSupabaseMiddlewareClient.mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      },
    });
    const req = new NextRequest("https://app.test/dashboard");
    const res = await middleware(req);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("blocks pro routes when plan is not pro", async () => {
    mockSupabase.createSupabaseMiddlewareClient.mockReturnValue({
      auth: {
        getSession: jest
          .fn()
          .mockResolvedValue({ data: { session: { user: { id: "1" } } } }),
      },
    });
    mockCheckPlan.checkUserPlan = jest.fn().mockResolvedValue({ isPro: false });
    const req = new NextRequest("https://app.test/agentguard");
    const res = await middleware(req);
    expect(res.headers.get("location")).toContain("/pricing");
  });

  it("allows access when authenticated and plan is valid", async () => {
    mockSupabase.createSupabaseMiddlewareClient.mockReturnValue({
      auth: {
        getSession: jest
          .fn()
          .mockResolvedValue({ data: { session: { user: { id: "1" } } } }),
      },
    });
    mockCheckPlan.checkUserPlan = jest.fn().mockResolvedValue({ isPro: true });
    const req = new NextRequest("https://app.test/dashboard");
    const res = await middleware(req);
    expect(res.headers.get("location")).toBeNull();
  });
});
