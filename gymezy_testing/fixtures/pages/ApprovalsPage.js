/**
 * Page Object Model for Approvals & Plan Switches
 */
export class ApprovalsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.switchesTab = page.locator("xpath=//div[contains(@class, 'ant-tabs-tab') and (contains(., 'Switch') or @data-node-key='switches')]");
    this.switchRow0 = page.locator("xpath=(//tr[contains(@class, 'ant-table-row') or @data-testid='switch-row-0'])[1]");
    this.btnApproveSwitch = page.locator("xpath=//button[contains(., 'Accept') or contains(., 'Approve') or @data-testid='btn-approve-switch']");
    this.successMessage = page.locator("xpath=//div[contains(@class, 'ant-message-success')]");
    this.tags = page.locator("xpath=//span[contains(@class, 'ant-tag')]");
  }

  async goto() {
    await this.page.goto('/owner/members?tab=switches');
  }
}
