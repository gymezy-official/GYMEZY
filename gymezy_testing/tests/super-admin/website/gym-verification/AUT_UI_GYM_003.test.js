import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Gym Onboarding - Action Required & Resubmission', () => {
  test('AUT_UI_GYM_003: [P1|Functional] Action Required feedback then owner resubmission @P1 @Regression', async ({ browser }) => {
    const adminUrl = process.env.SUPER_ADMIN_URL || 'https://dev.admin.gymezy.com';
    const ownerUrl = process.env.OWNER_PORTAL_URL || 'https://dev.owner.gymezy.com';
    const remarkText = 'GST certificate is unreadable, re-upload a clear copy';

    // 1. Super Admin opens pending gym review
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    await adminPage.goto(`${adminUrl}/login`);
    await adminPage.locator("xpath=//input[@id='email' or contains(@placeholder, 'admin@gymezy.com')]").fill(process.env.SUPER_ADMIN_EMAIL || 'admin@gymezy.com');
    await adminPage.locator("xpath=//input[@id='password' or @type='password']").fill(process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@Gymezy2026!');
    await Promise.all([
      adminPage.waitForResponse(res => (res.url().includes('/auth/login') || res.url().includes('/login')) && res.status() === 200, { timeout: 10000 }).catch(() => null),
      adminPage.locator("xpath=//button[@type='submit']").click()
    ]);
    await adminPage.waitForURL(/.*\/admin\/dashboard/, { timeout: 10000 }).catch(() => {});

    await adminPage.goto(`${adminUrl}/admin/gyms?tab=pending`);
    const pendingRow = adminPage.locator("xpath=(//tr[contains(@data-testid, 'pending-row') or (contains(@class, 'ant-table-row') and contains(., 'Pending'))])[1]");
    await expect(pendingRow).toBeVisible();
    await pendingRow.click();

    // 2. Click Action Required / Request Changes and type remark using XPath
    const actionReqBtn = adminPage.locator("xpath=//button[contains(., 'Action Required') or contains(., 'Request Changes') or contains(., 'Reject')]");
    await actionReqBtn.click();

    const remarkInput = adminPage.locator("xpath=//textarea[contains(@placeholder, 'remark') or contains(@placeholder, 'reason') or @id='remark']");
    await remarkInput.fill(remarkText);

    const confirmBtn = adminPage.locator("xpath=//div[contains(@class, 'ant-modal')]//button[contains(@class, 'ant-btn-primary')] | //button[contains(., 'Submit')]");
    await confirmBtn.click();

    // Verify tag shows Action Required / Changes Requested
    const actionReqTag = adminPage.locator("xpath=//*[contains(@class, 'ant-tag') and (contains(., 'Action Required') or contains(., 'Changes Requested') or contains(., 'On Hold'))]");
    await expect(actionReqTag).toBeVisible();

    // 3. Switch to Owner Web and log in
    const ownerContext = await browser.newContext();
    const ownerPage = await ownerContext.newPage();

    await ownerPage.goto(`${ownerUrl}/login`);
    await ownerPage.locator("xpath=//input[@id='email' or contains(@placeholder, 'owner@gym.com')]").fill(process.env.OWNER_PORTAL_EMAIL || 'super@gmail.com');
    await ownerPage.locator("xpath=//input[@id='password' or @type='password']").fill(process.env.OWNER_PORTAL_PASSWORD || 'super@gmail.coM1');
    await ownerPage.locator("xpath=//button[@type='submit']").click();
    await ownerPage.waitForLoadState('networkidle').catch(() => {});

    // 4. Read remark-banner on application-status
    await ownerPage.goto(`${ownerUrl}/application-status`);
    const remarkBanner = ownerPage.locator("xpath=//*[contains(@data-testid, 'remark-banner') or (contains(@class, 'ant-alert') and contains(., 'GST')) or contains(., 'GST certificate is unreadable')]");
    await expect(remarkBanner).toBeVisible();

    // 5. Replace GST file and click resubmit using XPath
    const fixturesDir = path.resolve(__dirname, '../../../../fixtures/files');
    const uploadInput = ownerPage.locator("xpath=(//input[@type='file'])[1]");
    if (await uploadInput.isVisible()) {
      await uploadInput.setInputFiles(path.join(fixturesDir, 'gst-clear.pdf'));
    }

    const resubmitBtn = ownerPage.locator("xpath=//button[contains(., 'Resubmit') or contains(., 'Update') or contains(@data-testid, 'onboarding-resubmit')]");
    if (await resubmitBtn.isVisible()) {
      await resubmitBtn.click();
    }

    // Status tag returns to 'Pending Approval'
    const pendingTag = ownerPage.locator("xpath=//*[contains(@class, 'ant-tag') and contains(., 'Pending Approval')]");
    await expect(pendingTag).toBeVisible();

    await adminContext.close();
    await ownerContext.close();
  });
});
