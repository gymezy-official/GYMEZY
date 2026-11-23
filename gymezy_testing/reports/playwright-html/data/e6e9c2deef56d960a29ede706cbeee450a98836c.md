# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: owner\website\authentication\AUT_UI_AUTH_002.test.js >> Authentication - Owner Web Portal >> AUT_UI_AUTH_002: [P1|Security/RBAC] Owner with Pending Approval gym is blocked from operational routes @P1 @Regression
- Location: tests\owner\website\authentication\AUT_UI_AUTH_002.test.js:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('//*[contains(@data-testid, \'pending-approval-banner\') or contains(text(), \'Pending Approval\') or contains(@class, \'ant-alert-warning\')]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('//*[contains(@data-testid, \'pending-approval-banner\') or contains(text(), \'Pending Approval\') or contains(@class, \'ant-alert-warning\')]').first() with timeout 5000ms
  - waiting for locator('//*[contains(@data-testid, \'pending-approval-banner\') or contains(text(), \'Pending Approval\') or contains(@class, \'ant-alert-warning\')]').first()

```

```yaml
- button "moon sun Night":
  - switch "moon sun" [checked]:
    - img "moon"
    - img "sun"
  - text: Night
- img "GYMEZY Logo"
- heading "GYMEZY" [level=1]
- paragraph: SMART GYM OPERATING SYSTEM
- heading "Sign In" [level=2]
- text: "* Email / Phone"
- img "user"
- textbox "* Email / Phone":
  - /placeholder: e.g. owner@gym.com or +91 9876543210
- text: "* Password"
- img "lock"
- textbox "* Password":
  - /placeholder: ••••••••
- button "Show":
  - img "eye-invisible"
- checkbox "Remember me"
- text: Remember me Forgot password?
- button "Sign In"
- separator: OR CONTINUE WITH
- button "Sign in with Google"
- text: Want to partner with GYMEZY? Register your Gym
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { LoginPage } from '../../../../fixtures/pages/LoginPage.js';
  3  | 
  4  | test.describe('Authentication - Owner Web Portal', () => {
  5  |   test('AUT_UI_AUTH_002: [P1|Security/RBAC] Owner with Pending Approval gym is blocked from operational routes @P1 @Regression', async ({ page, baseURL }) => {
  6  |     const loginPage = new LoginPage(page);
  7  | 
  8  |     // 1. Open http://localhost:5173/login
  9  |     await page.goto(`${baseURL}/login`);
  10 | 
  11 |     // 2. Fill email and password using exact XPath locators
  12 |     await page.locator("xpath=//input[@id='email' or contains(@placeholder, 'owner@gym.com')]").fill(process.env.OWNER_PORTAL_EMAIL || 'super@gmail.com');
  13 |     await page.locator("xpath=//input[@id='password' or @type='password']").fill(process.env.OWNER_PORTAL_PASSWORD || 'super@gmail.coM1');
  14 | 
  15 |     // 3. Click login-submit
  16 |     await page.locator("xpath=//button[@type='submit' and contains(., 'Sign In')]").click();
  17 |     await page.waitForTimeout(2000);
  18 | 
  19 |     // 4. Navigate to /memberships
  20 |     await page.goto(`${baseURL}/memberships`);
  21 |     await page.waitForLoadState('networkidle').catch(() => {});
  22 | 
  23 |     // 5. Read the page & Assertions:
  24 |     // • pending-approval-banner is visible
  25 |     const pendingBanner = page.locator("xpath=//*[contains(@data-testid, 'pending-approval-banner') or contains(text(), 'Pending Approval') or contains(@class, 'ant-alert-warning')]");
> 26 |     await expect(pendingBanner.first()).toBeVisible();
     |                                         ^ Error: expect(locator).toBeVisible() failed
  27 | 
  28 |     // • URL is redirected away from /memberships
  29 |     expect(page.url()).not.toMatch(/\/memberships\/?$/);
  30 | 
  31 |     // • Operational menu items are not rendered or are disabled (aria-disabled=true)
  32 |     const menuItems = page.locator("xpath=//li[contains(@class, 'ant-menu-item')]");
  33 |     const count = await menuItems.count();
  34 |     if (count > 0) {
  35 |       for (let i = 0; i < count; i++) {
  36 |         const item = menuItems.nth(i);
  37 |         const ariaDisabled = await item.getAttribute('aria-disabled');
  38 |         const classNames = await item.getAttribute('class');
  39 |         const isDisabled = ariaDisabled === 'true' || (classNames && classNames.includes('ant-menu-item-disabled'));
  40 |         expect(isDisabled).toBe(true);
  41 |       }
  42 |     }
  43 |   });
  44 | });
  45 | 
```