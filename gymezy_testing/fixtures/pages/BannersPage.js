/**
 * Page Object Model for Super Admin Banners & Ads Management
 */
export class BannersPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.btnAddBanner = page.locator("xpath=//button[contains(., 'Create New Banner') or contains(., 'Add Banner') or @data-testid='btn-add-banner']");
    this.bannerTitleInput = page.locator("xpath=//input[@id='title' or contains(@placeholder, 'Festival') or @data-testid='banner-title']");
    this.bannerImageUpload = page.locator("xpath=//div[contains(@class, 'ant-upload')]//input[@type='file']");
    this.bannerPrioritySwitch = page.locator("xpath=(//button[@role='switch'])[1]");
    this.bannerSubmitButton = page.locator("xpath=//div[contains(@class, 'ant-modal')]//button[@type='submit' or contains(., 'Create Banner') or @data-testid='banner-submit']");
    this.tableRows = page.locator("xpath=//tr[contains(@class, 'ant-table-row')]");
    this.successToast = page.locator("xpath=//div[contains(@class, 'ant-message-success')]");
  }

  async goto() {
    await this.page.goto('/admin/banners');
  }
}
