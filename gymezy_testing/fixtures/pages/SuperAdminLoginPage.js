/**
 * Page Object Model for Super Admin Login Page
 */
export class SuperAdminLoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("[data-testid='sa-login-email'], #email, input[placeholder*='admin@gymezy.com']");
    this.passwordInput = page.locator("[data-testid='sa-login-password'], #password, input[type='password']");
    this.submitButton = page.locator("[data-testid='sa-login-submit'], button[type='submit']");
    this.errorMessage = page.locator('.ant-message-error, .ant-alert-error');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    const [loginRes] = await Promise.all([
      this.page.waitForResponse(res => (res.url().includes('/auth/login') || res.url().includes('/login')), { timeout: 10000 }).catch(() => null),
      this.submitButton.click(),
    ]);
    if (loginRes && loginRes.status() === 200) {
      await this.page.waitForURL(/.*\/admin\/dashboard/, { timeout: 10000 }).catch(() => {});
    }
  }
}

