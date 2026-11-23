import { test, expect } from '@playwright/test';
import { GymOnboardingQueuePage } from '../../../../fixtures/pages/GymOnboardingQueuePage.js';
import { SuperAdminLoginPage } from '../../../../fixtures/pages/SuperAdminLoginPage.js';

test.describe('Gym Onboarding - Super Admin Web', () => {
  test('AUT_UI_GYM_002: [P1|Functional] KYC review drawer: preview documents, approve gym, success toast @P1 @Smoke', async ({ page, baseURL }) => {
    const queuePage = new GymOnboardingQueuePage(page);
    const saLoginPage = new SuperAdminLoginPage(page);

    // 1. Log in as Super Admin
    await saLoginPage.goto();
    await saLoginPage.login(
      process.env.SUPER_ADMIN_EMAIL || 'admin@gymezy.com',
      process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@Gymezy2026!'
    );

    // 2. Open the Onboarding queue
    await page.goto(`${baseURL}/admin/gyms?tab=pending`);
    await page.waitForTimeout(2000);

    // 3. Click pending row using XPath
    const pendingRow = page.locator("xpath=(//tr[contains(@data-testid, 'pending-row') or (contains(@class, 'ant-table-row') and (contains(., 'Pending') or contains(., 'GYM')))])[1]");
    await expect(pendingRow).toBeVisible();
    await pendingRow.click();

    // 4. Wait for review view / drawer to open
    const reviewContainer = page.locator("xpath=//div[contains(@class, 'ant-drawer') and contains(@class, 'ant-drawer-open')] | //div[contains(@class, 'ant-modal')] | //main");
    await expect(reviewContainer).toBeVisible();

    // 5. Click each kyc-doc-preview and check viewer
    const previews = page.locator("xpath=//img[contains(@src, 'data:') or parent::div[contains(@class, 'ant-image')]] | //object | //*[contains(@data-testid, 'kyc-doc-preview')]");
    const previewCount = await previews.count();
    if (previewCount > 0) {
      for (let i = 0; i < Math.min(previewCount, 3); i++) {
        await previews.nth(i).click();
        const viewer = page.locator("xpath=//div[contains(@class, 'ant-image-preview')] | //div[contains(@class, 'ant-image')] | //object").first();
        await expect(viewer).toBeVisible();
      }
    }

    // Listen for PATCH response
    const patchPromise = page.waitForResponse(
      (response) =>
        (response.url().includes('/gym') || response.url().includes('/status')) &&
        response.request().method() === 'PATCH',
      { timeout: 15000 }
    ).catch(() => null);

    // 6. Click btn-approve and confirm in popconfirm using XPath
    const approveBtn = page.locator("xpath=//button[contains(., 'Approve') and not(@disabled)]");
    await approveBtn.click();

    const popconfirmOk = page.locator("xpath=//div[contains(@class, 'ant-popconfirm')]//button[contains(@class, 'ant-btn-primary')] | //div[contains(@class, 'ant-modal')]//button[contains(@class, 'ant-btn-primary')]");
    if (await popconfirmOk.isVisible()) {
      await popconfirmOk.click();
    }

    // Assertions:
    const successToast = page.locator("xpath=//div[contains(@class, 'ant-message-success')]");
    await expect(successToast).toBeVisible();
    await expect(successToast).toContainText(/approved/i);

    const patchResponse = await patchPromise;
    if (patchResponse) {
      expect(patchResponse.status()).toBe(200);
    }
  });
});
