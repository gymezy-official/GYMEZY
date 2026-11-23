import { test, expect } from '@playwright/test';
import { WalkInsPage } from '../../../../fixtures/pages/WalkInsPage.js';

test.describe('Front-Desk Walk-Ins - Owner Web Portal', () => {
  test('AUT_UI_WALK_001: [P1|Functional] Walk-in modal: phone lookup, immediate check-in, table refresh @P1 @Smoke', async ({ page, baseURL }) => {
    const walkinsPage = new WalkInsPage(page);

    // 1. Log in as Owner
    await page.goto(`${baseURL}/login`);
    await page.locator("xpath=//input[@id='email' or contains(@placeholder, 'owner@gym.com')]").fill(process.env.OWNER_PORTAL_EMAIL || 'super@gmail.com');
    await page.locator("xpath=//input[@id='password' or @type='password']").fill(process.env.OWNER_PORTAL_PASSWORD || 'super@gmail.coM1');
    await page.locator("xpath=//button[@type='submit']").click();
    await page.waitForLoadState('networkidle').catch(() => {});

    // Navigate to members page with action=walkin
    await page.goto(`${baseURL}/owner/members?action=walkin`);

    const modal = page.locator("xpath=//div[@role='dialog']");
    const addBtn = page.locator("xpath=//button[contains(., 'Add Member') or contains(., 'Walk-in')]");

    if (!await modal.isVisible().catch(() => false)) {
      await addBtn.click();
    }
    await expect(modal).toBeVisible();

    // 2. Type 9876543210 into walkin-phone and blur using XPath
    const phoneInput = modal.locator("xpath=.//input[@id='phone' or contains(@placeholder, 'phone')]");
    await phoneInput.fill('9876543210');
    await phoneInput.blur();

    // 3. Verify walkin-name is auto-filled
    const nameInput = modal.locator("xpath=.//input[@id='name' or contains(@placeholder, 'customer name')]");
    await expect(nameInput).toHaveValue('Priya Raman');

    // 4. Select Monthly plan and Cash payment
    const planSelect = modal.locator("xpath=(.//div[contains(@class, 'ant-select')])[2] | .//div[contains(@class, 'ant-select')]");
    await planSelect.click();
    await page.locator("xpath=//div[contains(@class, 'ant-select-item-option-content') and contains(., 'Monthly')]").click();

    const cashRadio = modal.locator("xpath=.//input[@value='Cash' or @value='Offline'] | .//label[contains(., 'Cash') or contains(., 'Offline')]");
    if (await cashRadio.isVisible()) {
      await cashRadio.click();
    }

    // 5. Tick walkin-checkin-now
    const checkinCheckbox = modal.locator("xpath=.//label[contains(@class, 'ant-checkbox-wrapper')]");
    if (await checkinCheckbox.isVisible()) {
      await checkinCheckbox.click();
    }

    // 6. Click submit button using XPath
    const submitBtn = modal.locator("xpath=.//button[@type='submit' or contains(., 'Save') or contains(., 'Register')]");
    await submitBtn.click();

    // Assertions:
    await expect(modal).not.toBeVisible();
    const successToast = page.locator("xpath=//div[contains(@class, 'ant-message-success')]");
    await expect(successToast).toBeVisible();

    // 7. Observe the table: first row contains Priya Raman with Active status
    const firstRow = page.locator("xpath=(//tbody[contains(@class, 'ant-table-tbody')]//tr[contains(@class, 'ant-table-row')])[1]");
    await expect(firstRow).toContainText('Priya Raman');
    await expect(firstRow).toContainText('Active');
  });
});
