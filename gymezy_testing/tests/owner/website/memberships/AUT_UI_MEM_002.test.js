import { test, expect } from '@playwright/test';
import { ApprovalsPage } from '../../../../fixtures/pages/ApprovalsPage.js';

test.describe('Memberships & Proration - Owner Web Portal', () => {
  test('AUT_UI_MEM_002: [P2|Functional] Owner approves a Manager-staged plan switch @P2 @Regression', async ({ page, baseURL }) => {
    const approvalsPage = new ApprovalsPage(page);

    // 1. Log in as Owner
    await page.goto(`${baseURL}/login`);
    await page.locator("xpath=//input[@id='email' or contains(@placeholder, 'owner@gym.com')]").fill(process.env.OWNER_PORTAL_EMAIL || 'super@gmail.com');
    await page.locator("xpath=//input[@id='password' or @type='password']").fill(process.env.OWNER_PORTAL_PASSWORD || 'super@gmail.coM1');
    await page.locator("xpath=//button[@type='submit']").click();
    await page.waitForLoadState('networkidle').catch(() => {});

    // 2. Open Approvals / Plan Switches tab using XPath
    await page.goto(`${baseURL}/owner/members?tab=switches`);
    const switchesTab = page.locator("xpath=//div[contains(@class, 'ant-tabs-tab') and (contains(., 'Switch') or @data-node-key='switches')]");
    if (await switchesTab.isVisible()) {
      await switchesTab.click();
    }

    // 3. Open the first request row
    const firstSwitchRow = page.locator("xpath=(//tr[contains(@class, 'ant-table-row')])[1]");
    await expect(firstSwitchRow).toBeVisible();
    await firstSwitchRow.click();

    // 4. Click btn-approve-switch and confirm using XPath
    const approveBtn = page.locator("xpath=//button[contains(., 'Accept') or contains(., 'Approve') or @data-testid='btn-approve-switch']");
    await approveBtn.click();

    const confirmBtn = page.locator("xpath=//div[contains(@class, 'ant-modal')]//button[contains(@class, 'ant-btn-primary')] | //div[contains(@class, 'ant-popconfirm')]//button[contains(@class, 'ant-btn-primary')]");
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }

    // Assertions:
    // • Success toast is shown
    const successToast = page.locator("xpath=//div[contains(@class, 'ant-message-success')]");
    await expect(successToast).toBeVisible();

    // • Request row tag changes to Approved
    const switchRowTag = firstSwitchRow.locator("xpath=.//span[contains(@class, 'ant-tag')]");
    await expect(switchRowTag).toContainText(/Approved|Executed/i);
  });
});
