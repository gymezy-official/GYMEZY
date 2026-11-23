/**
 * Page Object Model for Front-Desk Walk-Ins
 */
export class WalkInsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.btnNewWalkin = page.locator("xpath=//button[contains(., 'Add Member') or contains(., 'Walk-in') or @data-testid='btn-new-walkin']");
    this.modal = page.locator("xpath=//div[contains(@class, 'ant-modal') and not(contains(@style, 'display: none'))]");
    this.walkinPhone = page.locator("xpath=//div[contains(@class, 'ant-modal')]//input[@id='phone' or contains(@placeholder, 'phone') or @data-testid='walkin-phone']");
    this.walkinName = page.locator("xpath=//div[contains(@class, 'ant-modal')]//input[@id='name' or contains(@placeholder, 'customer name') or @data-testid='walkin-name']");
    this.walkinPlanSelect = page.locator("xpath=(//div[contains(@class, 'ant-modal')]//div[contains(@class, 'ant-select')])[1]");
    this.walkinPaymentGroup = page.locator("xpath=//div[contains(@class, 'ant-modal')]//div[contains(@class, 'ant-radio-group')]");
    this.walkinCheckinCheckbox = page.locator("xpath=//div[contains(@class, 'ant-modal')]//label[contains(@class, 'ant-checkbox-wrapper')]");
    this.walkinSubmitButton = page.locator("xpath=//div[contains(@class, 'ant-modal')]//button[@type='submit' or contains(., 'Save') or contains(., 'Register') or @data-testid='walkin-submit']");
    this.tableRows = page.locator("xpath=//tbody[contains(@class, 'ant-table-tbody')]//tr[contains(@class, 'ant-table-row')]");
    this.errorMessage = page.locator("xpath=//div[contains(@class, 'ant-form-item-explain-error')]");
  }

  async goto() {
    await this.page.goto('/owner/members?action=walkin');
  }
}
