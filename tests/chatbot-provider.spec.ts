import { test, expect, Page } from '@playwright/test';

test.describe('ChatbotProvider Route-based Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Set up any common configurations
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.describe('Coach B Chatbot on Public Routes', () => {
    test('should display Coach B chatbot on homepage', async ({ page }) => {
      await page.goto('/');

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Check that Coach B chatbot button is present
      const coachBButton = page.locator('button:has-text("Coach B")');
      await expect(coachBButton).toBeVisible();

      // Verify it's Coach B specifically (not OC-Phil)
      await expect(page.locator('text="OC-Phil"')).not.toBeVisible();

      // Test chatbot functionality
      await coachBButton.click();

      // Verify chatbot opens with Coach B interface
      await expect(page.locator('text="Coach B"')).toBeVisible();
      await expect(
        page.locator('text="Football Squares Assistant"'),
      ).toBeVisible();

      // Verify initial message is from Coach B
      await expect(
        page.locator('text="Hey there! I\'m Coach B"'),
      ).toBeVisible();
    });

    test('should display Coach B chatbot on /play route', async ({ page }) => {
      await page.goto('/play');

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Check that Coach B chatbot button is present
      const coachBButton = page.locator('button:has-text("Coach B")');
      await expect(coachBButton).toBeVisible();

      // Verify it's not OC-Phil
      await expect(page.locator('text="OC-Phil"')).not.toBeVisible();

      // Test opening the chatbot
      await coachBButton.click();

      // Verify Coach B interface
      await expect(page.locator('text="Coach B"')).toBeVisible();
      await expect(
        page.locator('text="Football Squares Assistant"'),
      ).toBeVisible();
    });

    test('should display Coach B chatbot on /rules route', async ({ page }) => {
      await page.goto('/rules');

      await page.waitForLoadState('networkidle');

      const coachBButton = page.locator('button:has-text("Coach B")');
      await expect(coachBButton).toBeVisible();

      await expect(page.locator('text="OC-Phil"')).not.toBeVisible();
    });

    test('should display Coach B chatbot on /boards route', async ({
      page,
    }) => {
      await page.goto('/boards');

      await page.waitForLoadState('networkidle');

      const coachBButton = page.locator('button:has-text("Coach B")');
      await expect(coachBButton).toBeVisible();

      await expect(page.locator('text="OC-Phil"')).not.toBeVisible();
    });
  });

  test.describe('OC-Phil Widget on CBL Routes', () => {
    test('should display OC-Phil widget on /cbl/overview', async ({ page }) => {
      await page.goto('/cbl/overview');

      await page.waitForLoadState('networkidle');

      // Check that OC-Phil widget button is present
      const ocPhilButton = page.locator('button:has-text("OC-Phil")');
      await expect(ocPhilButton).toBeVisible();

      // Verify it's not Coach B
      await expect(page.locator('text="Coach B"')).not.toBeVisible();

      // Test opening the widget
      await ocPhilButton.click();

      // Verify OC-Phil interface
      await expect(page.locator('text="OC-Phil"')).toBeVisible();
      await expect(
        page.locator('text="Community Board Leader Assistant"'),
      ).toBeVisible();

      // Verify initial message is from OC-Phil
      await expect(
        page.locator('text="Welcome to the CBL Portal!"'),
      ).toBeVisible();
    });

    test('should display OC-Phil widget on /cbl/dashboard with authentication', async ({
      page,
    }) => {
      // Mock authentication state for CBL access
      await page.addInitScript(() => {
        // Mock the auth hook to return CBL user
        window.localStorage.setItem(
          'auth-user',
          JSON.stringify({
            name: 'OC-Phil',
            role: 'CBL_ROLE',
            isCBL: true,
          }),
        );
      });

      await page.goto('/cbl/dashboard');

      // Wait for authentication and page load
      await page.waitForLoadState('networkidle');

      // Check that we're on the dashboard (not redirected to login)
      await expect(page.locator('text="CBL Dashboard"')).toBeVisible();

      // Check that OC-Phil widget is present
      const ocPhilButton = page.locator('button:has-text("OC-Phil")');
      await expect(ocPhilButton).toBeVisible();

      // Verify it's not Coach B
      await expect(page.locator('text="Coach B"')).not.toBeVisible();

      // Test widget functionality
      await ocPhilButton.click();

      // Verify OC-Phil interface
      await expect(page.locator('text="OC-Phil"')).toBeVisible();
      await expect(
        page.locator('text="Community Board Leader Assistant"'),
      ).toBeVisible();
    });
  });

  test.describe('Route Switching Behavior', () => {
    test('should switch chatbots when navigating between routes', async ({
      page,
    }) => {
      // Start on a public route with Coach B
      await page.goto('/play');
      await page.waitForLoadState('networkidle');

      // Verify Coach B is present
      await expect(page.locator('button:has-text("Coach B")')).toBeVisible();
      await expect(page.locator('text="OC-Phil"')).not.toBeVisible();

      // Navigate to CBL overview
      await page.goto('/cbl/overview');
      await page.waitForLoadState('networkidle');

      // Verify OC-Phil is now present
      await expect(page.locator('button:has-text("OC-Phil")')).toBeVisible();
      await expect(page.locator('text="Coach B"')).not.toBeVisible();

      // Navigate back to public route
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify Coach B is present again
      await expect(page.locator('button:has-text("Coach B")')).toBeVisible();
      await expect(page.locator('text="OC-Phil"')).not.toBeVisible();
    });
  });

  test.describe('Chatbot Functionality', () => {
    test('Coach B should respond to crypto questions', async ({ page }) => {
      await page.goto('/play');
      await page.waitForLoadState('networkidle');

      // Open Coach B chatbot
      const coachBButton = page.locator('button:has-text("Coach B")');
      await coachBButton.click();

      // Wait for chatbot to open
      await expect(page.locator('text="Coach B"')).toBeVisible();

      // Type a crypto-related question
      const inputField = page.locator(
        'input[placeholder="Ask Coach B anything..."]',
      );
      await inputField.fill('What is Solana?');

      // Send the message
      const sendButton = page.locator('button:has([class*="lucide-send"])');
      await sendButton.click();

      // Wait for response
      await expect(
        page.locator('text="Great question about cryptocurrency!"'),
      ).toBeVisible({ timeout: 5000 });
    });

    test('OC-Phil should respond to CBL management questions', async ({
      page,
    }) => {
      await page.goto('/cbl/overview');
      await page.waitForLoadState('networkidle');

      // Open OC-Phil widget
      const ocPhilButton = page.locator('button:has-text("OC-Phil")');
      await ocPhilButton.click();

      // Wait for widget to open
      await expect(page.locator('text="OC-Phil"')).toBeVisible();

      // Type a CBL-related question
      const inputField = page.locator(
        'input[placeholder="Ask OC-Phil anything..."]',
      );
      await inputField.fill('How do I create a board?');

      // Send the message
      const sendButton = page.locator('button:has([class*="lucide-send"])');
      await sendButton.click();

      // Wait for response
      await expect(
        page.locator('text="Managing boards is at the heart"'),
      ).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Visual Consistency', () => {
    test('chatbots should maintain consistent positioning across routes', async ({
      page,
    }) => {
      // Test Coach B position
      await page.goto('/play');
      await page.waitForLoadState('networkidle');

      const coachBButton = page.locator('button:has-text("Coach B")');
      const coachBBox = await coachBButton.boundingBox();

      // Test OC-Phil position
      await page.goto('/cbl/overview');
      await page.waitForLoadState('networkidle');

      const ocPhilButton = page.locator('button:has-text("OC-Phil")');
      const ocPhilBox = await ocPhilButton.boundingBox();

      // Both chatbots should be positioned in the same location (bottom-left)
      expect(coachBBox?.x).toBeCloseTo(ocPhilBox?.x || 0, 10);
      expect(coachBBox?.y).toBeCloseTo(ocPhilBox?.y || 0, 10);
    });

    test('chatbot windows should have consistent dimensions', async ({
      page,
    }) => {
      // Test Coach B window size
      await page.goto('/play');
      await page.waitForLoadState('networkidle');

      await page.locator('button:has-text("Coach B")').click();
      const coachBWindow = page.locator('[class*="w-96"]').first();
      const coachBBox = await coachBWindow.boundingBox();

      // Close and test OC-Phil window size
      await page.locator('button:has([class*="lucide-x"])').click();
      await page.goto('/cbl/overview');
      await page.waitForLoadState('networkidle');

      await page.locator('button:has-text("OC-Phil")').click();
      const ocPhilWindow = page.locator('[class*="w-96"]').first();
      const ocPhilBox = await ocPhilWindow.boundingBox();

      // Both windows should have the same dimensions
      expect(coachBBox?.width).toBe(ocPhilBox?.width);
      expect(coachBBox?.height).toBe(ocPhilBox?.height);
    });
  });
});
