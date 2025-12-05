import { test, expect } from "@playwright/test";

test.describe("IA Shield user journey", () => {
  test("signup to dashboard flow", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AI Guard|IA Shield/i);
    await page.goto("/signup");
    await expect(page.locator("h1")).toContainText("Crear cuenta");
    // The rest of the flow depends on backend; we just ensure forms exist.
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "Password123");
    await page.fill('input[placeholder="Repite tu contraseña"]', "Password123");
    await expect(
      page.getByRole("button", { name: /crear cuenta/i })
    ).toBeVisible();
  });
});
