/**
 * Page Object Model for Super Admin Gym Onboarding Queue and KYC Review Drawer
 */
export class GymOnboardingQueuePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.pendingRowGym1 = page.locator("xpath=(//tr[contains(@data-testid, 'pending-row') or (contains(@class, 'ant-table-row') and (contains(., 'Pending') or contains(., 'GYM')))])[1]");
    this.drawer = page.locator("xpath=//div[contains(@class, 'ant-drawer') and contains(@class, 'ant-drawer-open')] | //div[contains(@class, 'ant-modal')] | //main");
    this.kycDocPreview0 = page.locator("xpath=(//img | //object | //*[contains(@data-testid, 'kyc-doc-preview')])[1]");
    this.kycDocPreview1 = page.locator("xpath=(//img | //object | //*[contains(@data-testid, 'kyc-doc-preview')])[2]");
    this.kycDocPreview2 = page.locator("xpath=(//img | //object | //*[contains(@data-testid, 'kyc-doc-preview')])[3]");
    this.btnApprove = page.locator("xpath=//button[contains(., 'Approve') or @data-testid='btn-approve']");
    this.popconfirmOk = page.locator("xpath=//div[contains(@class, 'ant-popconfirm')]//button[contains(@class, 'ant-btn-primary')] | //div[contains(@class, 'ant-modal')]//button[contains(@class, 'ant-btn-primary')]");
    this.btnActionRequired = page.locator("xpath=//button[contains(., 'Action Required') or contains(., 'Request Changes') or contains(., 'Reject') or @data-testid='btn-action-required']");
    this.actionRemarkInput = page.locator("xpath=//textarea[contains(@placeholder, 'remark') or contains(@placeholder, 'reason') or @id='remark' or @data-testid='action-remark']");
    this.successMessage = page.locator("xpath=//div[contains(@class, 'ant-message-success')]");
    this.statusTag = page.locator("xpath=//*[contains(@class, 'ant-tag')]");
  }

  async goto() {
    await this.page.goto('/admin/gyms?tab=pending');
  }
}
