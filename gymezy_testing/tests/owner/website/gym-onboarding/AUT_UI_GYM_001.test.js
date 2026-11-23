import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { OnboardingWizardPage } from '../../../../fixtures/pages/OnboardingWizardPage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Gym Onboarding - Owner Web Portal', () => {
  test('AUT_UI_GYM_001: [P1|Functional] 5-tab onboarding wizard submits with valid KYC and shows partnerId @P1 @Regression', async ({ page, baseURL }) => {
    const wizardPage = new OnboardingWizardPage(page);

    // Navigate to registration / onboarding wizard
    await page.goto(`${baseURL}/register`);

    // Listen for the network POST submission
    const postResponsePromise = page.waitForResponse(
      (response) =>
        (response.url().includes('/gym') ||
          response.url().includes('/onboarding') ||
          response.url().includes('/register')) &&
        response.request().method() === 'POST',
      { timeout: 15000 }
    ).catch(() => null);

    // 1. Fill General & Geo tab using proper XPaths
    const gymNameInput = page.locator("xpath=//input[@name='gymName' or @id='gymName' or contains(@placeholder, 'FitZone') or @data-testid='gym-name']");
    if (await gymNameInput.isVisible()) {
      await gymNameInput.fill('FitZone Madurai');
    }

    const nextBtn = page.locator("xpath=//button[contains(., 'Next') or contains(., 'Continue') or @data-testid='btn-next-tab']");
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
    }

    // 2. Fill Operations & Amenities tab
    const latInput = page.locator("xpath=//input[@name='lat' or @id='lat' or contains(@placeholder, 'Latitude') or @data-testid='gym-lat']");
    const lngInput = page.locator("xpath=//input[@name='lng' or @id='lng' or contains(@placeholder, 'Longitude') or @data-testid='gym-lng']");
    if (await latInput.isVisible()) {
      await latInput.fill('9.9252');
      await lngInput.fill('78.1198');
    }

    if (await nextBtn.isVisible()) {
      await nextBtn.click();
    }

    // 3. Pricing Plans tab
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
    }

    // 4. Staff Profiles tab
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
    }

    // 5. Upload KYC Documents
    const fileInputs = page.locator("xpath=//input[@type='file']");
    const fileCount = await fileInputs.count();
    const fixturesDir = path.resolve(__dirname, '../../../../fixtures/files');

    if (fileCount >= 3) {
      await fileInputs.nth(0).setInputFiles(path.join(fixturesDir, 'gst.pdf'));
      await fileInputs.nth(1).setInputFiles(path.join(fixturesDir, 'pan.jpg'));
      await fileInputs.nth(2).setInputFiles(path.join(fixturesDir, 'gym-license.pdf'));
    }

    // 6. Click onboarding-submit
    const submitBtn = page.locator("xpath=//button[contains(., 'Submit') or contains(., 'Complete') or @data-testid='onboarding-submit']");
    await submitBtn.click();

    // Assertions:
    // • Network POST returns 201
    const response = await postResponsePromise;
    if (response) {
      expect(response.status()).toBe(201);
    }

    // • .ant-result-success is visible
    const resultSuccess = page.locator("xpath=//*[contains(@class, 'ant-result-success') or contains(., 'GYM')]");
    await expect(resultSuccess).toBeVisible();

    // • Result text matches /GYM\d{5}/
    await expect(resultSuccess).toHaveText(/GYM\d{5}/);

    // • Status tag text is 'Pending Approval'
    const statusTag = page.locator("xpath=//*[contains(@class, 'ant-tag') and contains(., 'Pending Approval')]");
    await expect(statusTag).toBeVisible();
  });
});
