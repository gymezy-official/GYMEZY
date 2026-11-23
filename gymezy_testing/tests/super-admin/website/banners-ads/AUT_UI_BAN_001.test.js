import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { BannersPage } from '../../../../fixtures/pages/BannersPage.js';
import { SuperAdminLoginPage } from '../../../../fixtures/pages/SuperAdminLoginPage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Banners & Ads - Super Admin Web', () => {
  test('AUT_UI_BAN_001: [P2|Functional] Super Admin creates a priority banner @P2 @Regression', async ({ page, baseURL }) => {
    const bannersPage = new BannersPage(page);
    const saLoginPage = new SuperAdminLoginPage(page);

    // Ensure logged in as Super Admin
    await saLoginPage.goto();
    await saLoginPage.login(
      process.env.SUPER_ADMIN_EMAIL || 'admin@gymezy.com',
      process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@Gymezy2026!'
    );

    await page.goto(`${baseURL}/admin/banners`);

    // 1. Click Create New Banner button using XPath
    const createBtn = page.locator("xpath=//button[contains(., 'Create New Banner') or contains(., 'Add Banner') or @data-testid='btn-add-banner']");
    await expect(createBtn).toBeVisible();
    await createBtn.click();

    // 2. Enter title Diwali Offer using XPath
    const titleInput = page.locator("xpath=//input[@id='title' or contains(@placeholder, 'Festival') or @data-testid='banner-title']");
    await titleInput.fill('Diwali Offer');

    // 3. Upload offer.jpg using XPath
    const fixturesDir = path.resolve(__dirname, '../../../../fixtures/files');
    const uploadInput = page.locator("xpath=//div[contains(@class, 'ant-upload')]//input[@type='file']");
    await uploadInput.setInputFiles(path.join(fixturesDir, 'offer.jpg'));

    // 4. Turn on banner-priority switch inside modal
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Select gym if selector is present
    const gymCombobox = dialog.getByRole('combobox').first();
    if (await gymCombobox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await gymCombobox.click();
      const option = page.locator('.ant-select-item-option-content, .ant-select-dropdown div').first();
      await option.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if (await option.isVisible()) {
        await option.click();
      }
    }

    const prioritySwitch = dialog.getByRole('switch', { name: /Priority Flag/i }).first();
    const isChecked = await prioritySwitch.getAttribute('aria-checked');
    if (isChecked !== 'true') {
      await prioritySwitch.click();
    }

    // 5. Click banner-submit
    const submitBtn = dialog.getByRole('button', { name: /Create & Compress Banner/i });
    await submitBtn.click();

    // Assertions:
    // • Success toast is shown
    const successToast = page.locator("xpath=//div[contains(@class, 'ant-message-success')]");
    await expect(successToast).toBeVisible();

    // • New row appears with Priority tag
    const targetRow = page.locator("xpath=//tr[contains(@class, 'ant-table-row') and contains(., 'Diwali Offer')]").first();
    await expect(targetRow).toBeVisible();

    const priorityTag = targetRow.locator("xpath=.//*[contains(text(), 'PRIORITY') or contains(text(), 'Priority')]").first();
    await expect(priorityTag).toBeVisible();

    // • Preview image src starts with 'data:image'
    const previewImg = targetRow.locator("xpath=.//img");
    await expect(previewImg).toBeVisible();
    const imgSrc = await previewImg.getAttribute('src');
    expect(imgSrc).toMatch(/^data:image\//);
  });
});
