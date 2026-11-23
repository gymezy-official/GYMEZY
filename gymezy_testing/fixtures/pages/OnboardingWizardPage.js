/**
 * Page Object Model for Gym Onboarding Wizard
 */
export class OnboardingWizardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.generalTab = page.locator("xpath=//div[contains(@class, 'ant-tabs-tab') and (@data-node-key='general' or contains(., 'General'))] | //div[contains(., 'Step 1')]");
    this.gymName = page.locator("xpath=//input[@name='gymName' or @id='gymName' or contains(@placeholder, 'FitZone') or @data-testid='gym-name']");
    this.gymLat = page.locator("xpath=//input[@name='lat' or @id='lat' or contains(@placeholder, 'Latitude') or @data-testid='gym-lat']");
    this.gymLng = page.locator("xpath=//input[@name='lng' or @id='lng' or contains(@placeholder, 'Longitude') or @data-testid='gym-lng']");
    this.kycGstUpload = page.locator("xpath=(//input[@type='file'])[1]");
    this.kycPanUpload = page.locator("xpath=(//input[@type='file'])[2]");
    this.kycLicenseUpload = page.locator("xpath=(//input[@type='file'])[3]");
    this.submitButton = page.locator("xpath=//button[contains(., 'Submit') or contains(., 'Complete Registration') or @data-testid='onboarding-submit']");
    this.resubmitButton = page.locator("xpath=//button[contains(., 'Resubmit') or @data-testid='onboarding-resubmit']");
    this.remarkBanner = page.locator("xpath=//*[contains(@data-testid, 'remark-banner') or contains(@class, 'ant-alert')]");
    this.resultSuccess = page.locator("xpath=//*[contains(@class, 'ant-result-success') or contains(., 'GYM')]");
    this.statusTag = page.locator("xpath=//*[contains(@class, 'ant-tag') and (contains(., 'Pending Approval') or contains(., 'Action Required'))]");
  }

  async goto() {
    await this.page.goto('/register');
  }
}
