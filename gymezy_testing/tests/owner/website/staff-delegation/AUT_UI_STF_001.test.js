import { test, expect } from '@playwright/test';
import { StaffPage } from '../../../../fixtures/pages/StaffPage.js';

test.describe('Staff & Manager Delegation - Owner Web Portal', () => {
  test('AUT_UI_STF_001: [P1|Functional] Manager creates Full-time staff (staged) and Part-time staff (auto-approved) @P1 @Regression', async ({ page, baseURL }) => {
    const staffPage = new StaffPage(page);

    // 1. Log in with owner/manager session
    await page.goto(`${baseURL}/login`);
    await page.locator("xpath=//input[@id='email' or contains(@placeholder, 'owner@gym.com')]").fill(process.env.OWNER_PORTAL_EMAIL || 'super@gmail.com');
    await page.locator("xpath=//input[@id='password' or @type='password']").fill(process.env.OWNER_PORTAL_PASSWORD || 'super@gmail.coM1');
    await page.locator("xpath=//button[@type='submit']").click();
    await page.waitForLoadState('networkidle').catch(() => {});

    // 2. Open Staff and click Add Staff using XPath
    await page.goto(`${baseURL}/owner/staff`);
    const addStaffBtn = page.locator("xpath=//button[contains(., 'Add Staff') or contains(., 'Add Employee') or @data-testid='btn-add-staff']");
    await expect(addStaffBtn).toBeVisible();
    await addStaffBtn.click();

    const modal = page.locator("xpath=//div[contains(@class, 'ant-modal') and not(contains(@style, 'display: none'))]");
    await expect(modal).toBeVisible();

    // 3. Create Karthik S as Full-time Trainer
    const nameInput = page.locator("xpath=//div[contains(@class, 'ant-modal')]//input[@id='name' or contains(@placeholder, 'Full Name') or @data-testid='staff-name']");
    await nameInput.fill('Karthik S');

    const empSelect = page.locator("xpath=(//div[contains(@class, 'ant-modal')]//div[contains(@class, 'ant-select')])[1]");
    await empSelect.click();
    await page.locator("xpath=//div[contains(@class, 'ant-select-item-option-content') and contains(., 'Full-time')]").click();

    const submitBtn = page.locator("xpath=//div[contains(@class, 'ant-modal')]//button[@type='submit' or contains(., 'Save') or contains(., 'Add')]");
    await submitBtn.click();
    await expect(modal).not.toBeVisible();

    // 4. Create Divya R as Part-time Front Desk
    await addStaffBtn.click();
    await expect(modal).toBeVisible();

    await nameInput.fill('Divya R');
    await empSelect.click();
    await page.locator("xpath=//div[contains(@class, 'ant-select-item-option-content') and contains(., 'Part-time')]").click();
    await submitBtn.click();
    await expect(modal).not.toBeVisible();

    // 5. Read tag in each row using XPath
    const karthikTag = page.locator("xpath=//tr[contains(., 'Karthik S')]//span[contains(@class, 'ant-tag')]");
    await expect(karthikTag).toContainText('Pending Approval');

    const divyaTag = page.locator("xpath=//tr[contains(., 'Divya R')]//span[contains(@class, 'ant-tag')]");
    await expect(divyaTag).toContainText('Active');
  });
});
