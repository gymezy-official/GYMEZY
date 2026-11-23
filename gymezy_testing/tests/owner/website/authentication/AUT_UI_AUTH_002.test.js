import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../fixtures/pages/LoginPage.js';

test.describe('Authentication - Owner Web Portal', () => {
  test('AUT_UI_AUTH_002: [P1|Security/RBAC] Owner with Pending Approval gym is blocked from operational routes @P1 @Regression', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page);

    // 1. Open http://localhost:5173/login
    await page.goto(`${baseURL}/login`);

    // 2. Fill email and password using exact XPath locators
    await page.locator("xpath=//input[@id='email' or contains(@placeholder, 'owner@gym.com')]").fill(process.env.OWNER_PORTAL_EMAIL || 'super@gmail.com');
    await page.locator("xpath=//input[@id='password' or @type='password']").fill(process.env.OWNER_PORTAL_PASSWORD || 'super@gmail.coM1');

    // 3. Click login-submit
    await page.locator("xpath=//button[@type='submit' and contains(., 'Sign In')]").click();
    await page.waitForTimeout(2000);

    // 4. Navigate to /memberships
    await page.goto(`${baseURL}/memberships`);
    await page.waitForLoadState('networkidle').catch(() => {});

    // 5. Read the page & Assertions:
    // • pending-approval-banner is visible
    const pendingBanner = page.locator("xpath=//*[contains(@data-testid, 'pending-approval-banner') or contains(text(), 'Pending Approval') or contains(@class, 'ant-alert-warning')]");
    await expect(pendingBanner.first()).toBeVisible();

    // • URL is redirected away from /memberships
    expect(page.url()).not.toMatch(/\/memberships\/?$/);

    // • Operational menu items are not rendered or are disabled (aria-disabled=true)
    const menuItems = page.locator("xpath=//li[contains(@class, 'ant-menu-item')]");
    const count = await menuItems.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const item = menuItems.nth(i);
        const ariaDisabled = await item.getAttribute('aria-disabled');
        const classNames = await item.getAttribute('class');
        const isDisabled = ariaDisabled === 'true' || (classNames && classNames.includes('ant-menu-item-disabled'));
        expect(isDisabled).toBe(true);
      }
    }
  });
});
