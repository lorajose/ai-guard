describe("sendAlert flow", () => {
  const MOCK_CHECK = {
    label: "ESTAFA",
    score: 80,
    razones: ["Solicitud de pago inusual"],
    consejo: "No transferir fondos",
  };

  beforeEach(() => {
    jest.resetModules();
    process.env.RESEND_API_KEY = "test";
    process.env.NEXT_PUBLIC_APP_URL = "https://app.test";
  });

  it("dispatches email alert when enabled", async () => {
    const { sendAlert } = await import("@/services/alerts");
    const config = {
      user_id: "1",
      email_enabled: true,
      telegram_enabled: false,
      slack_webhook: undefined,
      min_score_threshold: 60,
      email: "user@test.com",
    };
    await sendAlert("1", MOCK_CHECK, ["email"], config);
    const { Resend } = require("resend");
    const instance = Resend.mock.instances[0];
    expect(instance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@test.com",
      })
    );
  });

  it("does not alert when below threshold", async () => {
    const { sendAlert } = await import("@/services/alerts");
    const config = {
      user_id: "1",
      email_enabled: true,
      telegram_enabled: true,
      slack_webhook: undefined,
      min_score_threshold: 90,
      email: "user@test.com",
      telegram_chat_id: "123",
    };
    await sendAlert(
      "1",
      { ...MOCK_CHECK, score: 20, label: "SEGURO" },
      ["email", "telegram"],
      config
    );
    const { Resend } = require("resend");
    const instance = Resend.mock.instances[0];
    expect(instance.emails.send).not.toHaveBeenCalled();
  });
});
