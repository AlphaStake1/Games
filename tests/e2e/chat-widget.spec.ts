import { test, expect } from '@playwright/test';

test.describe('Chat Widget Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
  });

  test('opens and closes chat widget', async ({ page }) => {
    // Find and click chat button
    const chatButton = page
      .locator('button')
      .filter({ hasText: /ask|chat/i })
      .first();

    if ((await chatButton.count()) > 0) {
      await chatButton.click();

      // Check if chat widget opened
      const chatWidget = page
        .locator('[class*="card"], [role="dialog"]')
        .filter({ hasText: /ask|chat/i });
      await expect(chatWidget).toBeVisible();

      // Find close button and close
      const closeButton = page
        .locator('button[aria-label*="close"]')
        .or(page.locator('button').filter({ hasText: '×' }))
        .first();

      if ((await closeButton.count()) > 0) {
        await closeButton.click();
        await expect(chatWidget).not.toBeVisible();
      }
    }
  });

  test('supports keyboard navigation', async ({ page }) => {
    const chatButton = page
      .locator('button')
      .filter({ hasText: /ask|chat/i })
      .first();

    if ((await chatButton.count()) > 0) {
      // Focus and activate with keyboard
      await chatButton.focus();
      await page.keyboard.press('Enter');

      const chatWidget = page
        .locator('[class*="card"], [role="dialog"]')
        .filter({ hasText: /ask|chat/i });
      await expect(chatWidget).toBeVisible();

      // Test Escape key closes chat
      await page.keyboard.press('Escape');

      // Widget should be minimized or closed
      const isMinimized =
        (await page.locator('[class*="minimized"]').count()) > 0;
      const isClosed = (await chatWidget.count()) === 0;
      expect(isMinimized || isClosed).toBeTruthy();
    }
  });

  test('has proper ARIA labels', async ({ page }) => {
    const chatButton = page
      .locator('button')
      .filter({ hasText: /ask|chat/i })
      .first();

    if ((await chatButton.count()) > 0) {
      // Chat button should have aria-label
      const ariaLabel = await chatButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();

      await chatButton.click();

      // Check for ARIA live region in messages
      const liveRegion = page.locator('[aria-live="polite"], [role="log"]');
      if ((await liveRegion.count()) > 0) {
        await expect(liveRegion).toBeVisible();
      }

      // Send button should have aria-label
      const sendButton = page
        .locator('button[aria-label*="send"], button')
        .filter({ hasText: /send/i })
        .first();
      if ((await sendButton.count()) > 0) {
        const sendLabel = await sendButton.getAttribute('aria-label');
        expect(sendLabel).toBeTruthy();
      }
    }
  });

  test('persists state in localStorage', async ({ page }) => {
    const chatButton = page
      .locator('button')
      .filter({ hasText: /ask|chat/i })
      .first();

    if ((await chatButton.count()) > 0) {
      await chatButton.click();

      // Check localStorage for persistence
      const isOpenStored = await page.evaluate(() => {
        return localStorage.getItem('chatCore_isOpen');
      });

      // Should be stored as true when opened
      expect(isOpenStored).toBe('true');

      // Close and check localStorage
      const closeButton = page
        .locator('button[aria-label*="close"]')
        .or(page.locator('button').filter({ hasText: '×' }))
        .first();

      if ((await closeButton.count()) > 0) {
        await closeButton.click();

        const isOpenAfterClose = await page.evaluate(() => {
          return localStorage.getItem('chatCore_isOpen');
        });

        expect(isOpenAfterClose).toBe('false');
      }
    }
  });

  test('handles input validation', async ({ page }) => {
    const chatButton = page
      .locator('button')
      .filter({ hasText: /ask|chat/i })
      .first();

    if ((await chatButton.count()) > 0) {
      await chatButton.click();

      const chatInput = page
        .locator('input[placeholder*="ask"], textarea[placeholder*="ask"]')
        .first();
      const sendButton = page
        .locator('button[aria-label*="send"], button')
        .filter({ hasText: /send/i })
        .first();

      if ((await chatInput.count()) > 0 && (await sendButton.count()) > 0) {
        // Send button should be disabled with empty input
        await expect(sendButton).toBeDisabled();

        // Type message and button should be enabled
        await chatInput.fill('Test message');
        await expect(sendButton).toBeEnabled();

        // Clear input and button should be disabled again
        await chatInput.fill('');
        await expect(sendButton).toBeDisabled();
      }
    }
  });
});
