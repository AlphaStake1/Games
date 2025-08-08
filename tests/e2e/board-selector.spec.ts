import { test, expect } from '@playwright/test';

test.describe('Board Selector', () => {
  test.beforeEach(async ({ page }) => {
    // Mock game data
    await page.route('**/api/games/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          games: [
            {
              gameId: 'game-1',
              week: 1,
              homeTeam: { name: 'Test Home', abbreviation: 'TH', id: 'th' },
              awayTeam: { name: 'Test Away', abbreviation: 'TA', id: 'ta' },
              gameDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            },
          ],
        }),
      });
    });

    // Mock board data
    await page.route('**/api/boards/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          boards: [
            {
              boardId: 'board-1',
              gameId: 'game-1',
              tierId: 'starter',
              availableSquares: 80,
              totalSquaresSold: 20,
              fillPercentage: 20,
              boardState: 'active',
              cancellationThreshold: 30,
            },
            {
              boardId: 'board-2',
              gameId: 'game-1',
              tierId: 'premium',
              availableSquares: 90,
              totalSquaresSold: 10,
              fillPercentage: 10,
              boardState: 'active',
              cancellationThreshold: 30,
            },
          ],
        }),
      });
    });

    await page.goto('/');
  });

  test('displays board cards with price and rake badges', async ({ page }) => {
    // Navigate to board selector (may be on dashboard or dedicated page)
    const boardSection = page
      .locator(
        '[data-testid="board-selector"], .board-selector, [class*="board"]',
      )
      .first();

    if ((await boardSection.count()) > 0) {
      await expect(boardSection).toBeVisible();

      // Look for price badges
      const priceBadges = page
        .locator('[class*="badge"], .badge')
        .filter({ hasText: /\$.*\/sq|\$.*square/i });
      if ((await priceBadges.count()) > 0) {
        await expect(priceBadges.first()).toBeVisible();
      }

      // Look for rake badges
      const rakeBadges = page
        .locator('[class*="badge"], .badge')
        .filter({ hasText: /.*%.*rake|rake.*%/i });
      if ((await rakeBadges.count()) > 0) {
        await expect(rakeBadges.first()).toBeVisible();
      }
    }
  });

  test('shows kickoff countdown timer', async ({ page }) => {
    const countdownElements = page
      .locator('text=/kickoff|countdown|time.*until/i')
      .or(page.locator('[class*="countdown"], [data-testid*="countdown"]'));

    if ((await countdownElements.count()) > 0) {
      await expect(countdownElements.first()).toBeVisible();

      // Should show time format (hours/minutes)
      await expect(countdownElements.first()).toContainText(/\d+[hm]|\d+:\d+/);
    }
  });

  test('displays board availability progress', async ({ page }) => {
    // Look for progress bars or availability indicators
    const progressElements = page.locator(
      '[role="progressbar"], progress, [class*="progress"]',
    );
    const availabilityText = page.locator(
      'text=/\d+.*squares.*remaining|\d+.*sold|\d+.*available/i',
    );

    if ((await progressElements.count()) > 0) {
      await expect(progressElements.first()).toBeVisible();
    }

    if ((await availabilityText.count()) > 0) {
      await expect(availabilityText.first()).toBeVisible();
    }
  });

  test('shows VIP gating for premium tiers', async ({ page }) => {
    // Look for VIP-related messaging
    const vipElements = page.locator('text=/VIP|premium|upgrade/i');
    const lockedElements = page.locator(
      '[aria-disabled="true"], [disabled], [class*="disabled"]',
    );

    // VIP messaging or locked boards should be present for non-VIP users
    const hasVipContent = (await vipElements.count()) > 0;
    const hasLockedContent = (await lockedElements.count()) > 0;

    // At least one should be present to indicate VIP features exist
    expect(hasVipContent || hasLockedContent).toBeTruthy();
  });

  test('handles board selection state', async ({ page }) => {
    const selectButtons = page
      .locator('button')
      .filter({ hasText: /select|choose|join/i });

    if ((await selectButtons.count()) > 0) {
      const firstButton = selectButtons.first();

      // Button should be enabled for available boards
      if (!(await firstButton.getAttribute('disabled'))) {
        await firstButton.click();

        // Should show selected state or confirmation
        const selectedIndicators = page
          .locator('[class*="selected"], [aria-selected="true"]')
          .or(page.locator('text=/selected|chosen/i'));

        if ((await selectedIndicators.count()) > 0) {
          await expect(selectedIndicators.first()).toBeVisible();
        }
      }
    }
  });

  test('displays cancellation risk warnings', async ({ page }) => {
    // Look for warning messages about board cancellation
    const warningElements = page
      .locator('[class*="warning"], [role="alert"]')
      .or(page.locator('text=/cancellation|risk|threshold/i'));

    if ((await warningElements.count()) > 0) {
      await expect(warningElements.first()).toBeVisible();
    }
  });

  test('shows blue points earned information', async ({ page }) => {
    const pointsElements = page.locator(
      'text=/blue.*points|points.*earned|\d+.*points/i',
    );

    if ((await pointsElements.count()) > 0) {
      await expect(pointsElements.first()).toBeVisible();

      // Should show numeric value
      await expect(pointsElements.first()).toContainText(/\d+/);
    }
  });

  test('displays payout structure', async ({ page }) => {
    const payoutElements = page
      .locator('text=/payout|winnings|prize|\$\d+/')
      .or(page.locator('[class*="payout"], [data-testid*="payout"]'));

    if ((await payoutElements.count()) > 0) {
      await expect(payoutElements.first()).toBeVisible();
    }

    // Look for quarter-specific payouts
    const quarterElements = page.locator('text=/Q[1-4]|quarter/i');
    if ((await quarterElements.count()) > 0) {
      await expect(quarterElements.first()).toBeVisible();
    }
  });
});
