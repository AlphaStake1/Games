import { test, expect } from '@playwright/test';

test.describe('App Shell', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for consistent testing
    await page.route('**/api/games/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          games: [
            {
              gameId: 'test-game-1',
              week: 1,
              homeTeam: { name: 'Test Home', abbreviation: 'TH' },
              awayTeam: { name: 'Test Away', abbreviation: 'TA' },
              gameDate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
          ],
        }),
      });
    });

    await page.route('**/api/boards/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          boards: [
            {
              boardId: 'test-board-1',
              gameId: 'test-game-1',
              tierId: 'starter',
              availableSquares: 85,
              totalSquaresSold: 15,
              fillPercentage: 15,
              boardState: 'active',
            },
          ],
        }),
      });
    });
  });

  test('renders network banner', async ({ page }) => {
    await page.goto('/');

    // Check if network banner is visible
    const networkBanner = page.locator('[class*="fixed top-0"]').first();
    await expect(networkBanner).toBeVisible();

    // Should show testnet by default
    await expect(networkBanner).toContainText(/testnet|devnet/i);
  });

  test('renders main navigation', async ({ page }) => {
    await page.goto('/');

    // Check sidebar navigation
    const sidebar = page.locator('[class*="UnifiedSidebar"], nav').first();
    await expect(sidebar).toBeVisible();

    // Check for key navigation items
    await expect(
      page.locator('a[href*="/dashboard"], a[href="/"]'),
    ).toBeVisible();
    await expect(page.locator('a[href*="/season-pass"]')).toBeVisible();
  });

  test('renders footer with testnet badge', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Should show testnet badge in footer
    await expect(footer.locator('text=/testnet|devnet/i')).toBeVisible();
  });

  test('handles responsive design', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('displays loading states gracefully', async ({ page }) => {
    // Slow down network to test loading states
    await page.route('**/api/**', (route) => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({}),
        });
      }, 1000);
    });

    await page.goto('/');

    // Page should still render even with slow API
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
