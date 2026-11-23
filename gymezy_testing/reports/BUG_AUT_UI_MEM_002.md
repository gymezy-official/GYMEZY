Test Case ID:     AUT_UI_MEM_002
Title:            [P2|Functional] Owner approves a Manager-staged plan switch
Severity:         S2 Critical
Steps Run:
1. Log in as Owner (https://dev.owner.gymezy.com/login)
2. Open Approvals > Plan Switches (/owner/approvals)
3. Open the first request (switch-row-0)
4. Click btn-approve-switch and confirm
5. Open the member's membership list

Expected Result:
• Success toast is shown
• Request row tag changes to Approved
• Old membership tag is 'Switched'
• New membership tag is 'Active'

Actual Result:
TimeoutError: waiting for locator('[data-testid=\'switch-row-0\']') timed out after 10000ms. Route /owner/approvals is completely missing from the Owner Web application routing table (App.jsx), causing a fallback redirect to /login.

Evidence:
Locator: locator('[data-testid=\'switch-row-0\']')
Console Output:
TimeoutError: locator.click: Timeout 10000ms exceeded.
Screenshot: gymezy_testing/test-results/AUT_UI_MEM_002-Memberships-1b85d-d-plan-switch-P2-Regression-owner-portal/test-failed-1.png

Suspected Cause:
Feature Missing: ApprovalsPage and Plan Switch approval workflows are not yet implemented in web-application/gym-owner:
1. web-application/gym-owner/src/App.jsx: Missing route definition `<Route path="approvals" element={<ApprovalsManagement />} />`.
2. Missing tab for Plan Switches with data-node-key="switches".
3. Missing table rows with data-testid="switch-row-0" and approval trigger data-testid="btn-approve-switch".
