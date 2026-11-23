/**
 * Page Object Model for Owner Login and Pending Approval Page
 */
export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("xpath=//input[@id='email' or contains(@placeholder, 'owner@gym.com') or @data-testid='login-email']");
    this.passwordInput = page.locator("xpath=//input[@id='password' or @type='password' or @data-testid='login-password']");
    this.submitButton = page.locator("xpath=//button[@type='submit' or contains(., 'Sign In') or @data-testid='login-submit']");
    this.pendingApprovalBanner = page.locator("xpath=//*[contains(@data-testid, 'pending-approval') or contains(text(), 'Pending Approval') or contains(@class, 'ant-alert-warning')]");
    this.menuItems = page.locator("xpath=//li[contains(@class, 'ant-menu-item')]");
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
