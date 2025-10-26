import { test, expect } from '@playwright/test';

/**
 * Example E2E test
 * This is a placeholder until we have actual UI to test
 */
test.describe('REACH E2E Tests', () => {
  test.skip('example test - skip until UI is implemented', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/REACH/);
  });

  test('playwright is configured correctly', () => {
    expect(true).toBe(true);
  });
});
