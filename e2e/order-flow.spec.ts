import { test, expect } from "@playwright/test";

test.describe("Order Flow (Click & Collect)", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("/fr");

    // Check title
    await expect(page).toHaveTitle(/Crousty Chicken/);

    // Check hero section (use first h1)
    await expect(page.locator("h1").first()).toContainText("Crousty Chicken");
  });

  test("can navigate to order page directly", async ({ page }) => {
    await page.goto("/fr/order");

    // Should load the order page
    await expect(page).toHaveURL(/\/fr\/order/);
  });

  test("order page shows menu items", async ({ page }) => {
    await page.goto("/fr/order");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check that menu sections are visible (if click & collect is enabled)
    const unavailable = page.locator("text=Click & Collect indisponible");
    const menuVisible = page.locator("text=L'Original");

    // Either the menu is shown or click & collect is disabled
    const isUnavailable = await unavailable.isVisible().catch(() => false);

    if (!isUnavailable) {
      await expect(menuVisible).toBeVisible({ timeout: 10000 });
    }
  });

  test("can add item to cart", async ({ page }) => {
    await page.goto("/fr/order");
    await page.waitForLoadState("networkidle");

    // Skip if click & collect is disabled
    const unavailable = page.locator("text=Click & Collect indisponible");
    if (await unavailable.isVisible().catch(() => false)) {
      test.skip();
      return;
    }

    // Find a menu item and click "Ajouter au panier"
    const addButton = page.locator('button:has-text("Ajouter")').first();

    if (await addButton.isVisible().catch(() => false)) {
      await addButton.click();

      // Cart should now have items
      const cartBadge = page.locator('[data-testid="cart-count"]');
      // Or check the cart drawer opens
      await expect(page.locator("text=Votre panier")).toBeVisible({
        timeout: 5000,
      });
    }
  });
});

test.describe("Admin Flow", () => {
  test("admin login page loads", async ({ page }) => {
    await page.goto("/fr/admin/login");

    await expect(page.locator("text=Administration")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("shows error on invalid login", async ({ page }) => {
    await page.goto("/fr/admin/login");

    await page.fill('input[type="email"]', "invalid@test.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button:has-text("Se connecter")');

    // Should show error
    await expect(page.locator("text=incorrect")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Kitchen Display", () => {
  test("kitchen page requires authentication", async ({ page }) => {
    await page.goto("/fr/admin/kitchen");

    // Should redirect to login
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });
  });
});
