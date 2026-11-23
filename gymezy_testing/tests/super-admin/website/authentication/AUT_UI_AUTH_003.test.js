import { test, expect } from '@playwright/test';
import { SuperAdminLoginPage } from '../../../../fixtures/pages/SuperAdminLoginPage.js';

test.describe('Authentication - Super Admin Web', () => {
  test('AUT_UI_AUTH_003: [P1|Security/RBAC] Gym Owner credentials are denied on Super Admin portal @P1 @Smoke', async ({ page, baseURL }) => {
    const saLoginPage = new SuperAdminLoginPage(page);

    // 1. Open http://localhost:5174/login
    await page.goto(`${baseURL}/login`);

    // 2. Enter owner credentials
    await saLoginPage.emailInput.fill(process.env.OWNER_PORTAL_EMAIL || 'super@gmail.com');
    await saLoginPage.passwordInput.fill(process.env.OWNER_PORTAL_PASSWORD || 'super@gmail.coM1');

    // 3. Click sa-login-submit
    await saLoginPage.submitButton.click();
    
    // Assertions:
    // • .ant-message-error contains 'Access denied'
    await expect(saLoginPage.errorMessage).toBeVisible();
    await expect(saLoginPage.errorMessage).toContainText(/Access denied/i);

    // • URL stays on /login
    expect(page.url()).toContain('/login');

    // • localStorage has no auth token
    const token = await page.evaluate(() => {
      return (
        localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('superAdminToken') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('user')
      );
    });
    expect(token).toBeNull();
  });
});

