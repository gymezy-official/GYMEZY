import { test, expect } from '@playwright/test';

test.describe('Front-Desk Walk-Ins - Owner Web Portal', () => {
  test('AUT_UI_WALK_002: [P3|Negative] Walk-in phone validation shows inline errors @P3 @Regression', async ({ page, baseURL }) => {
    let walkinNetworkCallCount = 0;
    page.on('request', (request) => {
      if ((request.url().includes('/walkin') || request.url().includes('/members')) && request.method() === 'POST') {
        walkinNetworkCallCount++;
      }
    });

    // 1. Log in and open walk-in modal
    await page.goto(`${baseURL}/login`);
    await page.locator("xpath=//input[@id='email' or contains(@placeholder, 'owner@gym.com')]").fill(process.env.OWNER_PORTAL_EMAIL || 'super@gmail.com');
    await page.locator("xpath=//input[@id='password' or @type='password']").fill(process.env.OWNER_PORTAL_PASSWORD || 'super@gmail.coM1');
    await page.locator("xpath=//button[@type='submit']").click();
    await page.waitForLoadState('networkidle').catch(() => {});

    await page.goto(`${baseURL}/owner/members?action=walkin`);
    const modal = page.locator("xpath=//div[@role='dialog']");
    const addBtn = page.locator("xpath=//button[contains(., 'Add Member') or contains(., 'Walk-in')]");

    if (!await modal.isVisible().catch(() => false)) {
      await addBtn.click();
    }
    await expect(modal).toBeVisible();

    const phoneInput = modal.locator("xpath=.//input[@id='phone' or contains(@placeholder, 'phone')]");
    const submitBtn = modal.locator("xpath=.//button[@type='submit' or contains(., 'Save') or contains(., 'Register')]");
    const errorExplain = page.locator("xpath=//div[contains(@class, 'ant-form-item-explain-error')]");

    // 2. Enter 12345 and click submit
    await phoneInput.fill('12345');
    await submitBtn.click();
    await expect(errorExplain).toBeVisible();
    expect(walkinNetworkCallCount).toBe(0);

    // 3. Enter 98765abcde and click submit
    await phoneInput.fill('98765abcde');
    await submitBtn.click();
    await expect(errorExplain).toBeVisible();
    expect(walkinNetworkCallCount).toBe(0);

    // 4. Clear the field and click submit
    await phoneInput.fill('');
    await submitBtn.click();
    await expect(errorExplain).toBeVisible();
    expect(walkinNetworkCallCount).toBe(0);
  });
});
