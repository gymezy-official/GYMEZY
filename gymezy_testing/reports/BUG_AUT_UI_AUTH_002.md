Test Case ID:     AUT_UI_AUTH_002
Title:            [P1|Security/RBAC] Owner with Pending Approval gym is blocked from operational routes
Severity:         S1 Blocker
Steps Run:
1. Open https://dev.owner.gymezy.com/login
2. Fill email (owner.fitzone@example.com) and password (Test@1234)
3. Click login-submit
4. Navigate to /memberships
5. Read the page

Expected Result:
• pending-approval-banner is visible
• URL is redirected away from /memberships
• Operational menu items are not rendered or are disabled (aria-disabled=true)

Actual Result:
Login failed with seed test credentials (owner.fitzone@example.com is unseeded in the live database). Furthermore, on navigation to /memberships, redirect to /application-status occurred, but no element with [data-testid='pending-approval-banner'] exists on the page.

Evidence:
Console Output:
Error: expect(locator).toBeVisible() failed
Locator: locator('[data-testid=\'pending-approval-banner\']')
Timeout: 5000ms exceeded.
Screenshot: gymezy_testing/test-results/AUT_UI_AUTH_002-Authentica-ff9c0-tional-routes-P1-Regression-owner-portal/test-failed-1.png

Suspected Cause:
1. Database Seed: User owner.fitzone@example.com with gym.approvalStatus="Pending Approval" is not seeded in the dev database.
2. Missing Attribute in UI: In web-application/gym-owner/src/general/ApplicationStatus.jsx (lines 140-165 & 740-755), the status banner lacks data-testid="pending-approval-banner".
3. Missing Attribute on Login: In web-application/gym-owner/src/general/Login.jsx (lines 354, 370, 420), inputs lack data-testid="login-email", data-testid="login-password", and data-testid="login-submit".
