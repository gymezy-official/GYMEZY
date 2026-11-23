/**
 * Page Object Model for Staff & Manager Delegation Page
 */
export class StaffPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.btnAddStaff = page.locator("xpath=//button[contains(., 'Add Staff') or contains(., 'Add Employee') or @data-testid='btn-add-staff']");
    this.modal = page.locator("xpath=//div[contains(@class, 'ant-modal') and not(contains(@style, 'display: none'))]");
    this.staffNameInput = page.locator("xpath=//div[contains(@class, 'ant-modal')]//input[@id='name' or contains(@placeholder, 'Full Name') or @data-testid='staff-name']");
    this.staffEmploymentSelect = page.locator("xpath=(//div[contains(@class, 'ant-modal')]//div[contains(@class, 'ant-select')])[1]");
    this.staffSubmitButton = page.locator("xpath=//div[contains(@class, 'ant-modal')]//button[@type='submit' or contains(., 'Save') or contains(., 'Add') or @data-testid='staff-submit']");
    this.rowTags = page.locator("xpath=//tr[contains(@class, 'ant-table-row')]//span[contains(@class, 'ant-tag')]");
  }

  async goto() {
    await this.page.goto('/owner/staff');
  }
}
