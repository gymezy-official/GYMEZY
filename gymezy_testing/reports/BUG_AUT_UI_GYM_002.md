Test Case ID:     AUT_UI_GYM_002
Title:            [P1|Functional] KYC review drawer: preview documents, approve gym, success toast
Severity:         S1 Blocker
Steps Run:
1. Log in as Super Admin (https://dev.admin.gymezy.com/login)
2. Open the Onboarding queue (/admin/onboarding)
3. Click pending-row-GYM00001
4. Wait for .ant-drawer to open
5. Click each kyc-doc-preview and check the viewer
6. Click btn-approve and confirm in the popconfirm

Expected Result:
• .ant-drawer is visible
• Each preview element has src starting 'data:' and non-zero naturalWidth (images) or rendered object (PDF)
• .ant-message-success text contains 'approved'
• Row pending-row-GYM00001 is removed from the table
• Network PATCH returns 200

Actual Result:
TimeoutError: locator.click for locator('[data-testid=\'pending-row-GYM00001\']') timed out after 10000ms. Navigating to /admin/onboarding renders the "New Gym Partner Onboarding" wizard instead of the Onboarding Verification Queue table.

Evidence:
Locator: locator('[data-testid=\'pending-row-GYM00001\']')
Console Output:
TimeoutError: locator.click: Timeout 10000ms exceeded.
Screenshot: gymezy_testing/test-results/AUT_UI_GYM_002-Gym-Onboard-51772--gym-success-toast-P1-Smoke-super-admin/test-failed-1.png

Suspected Cause:
1. Route / Feature Placement: In web-application/super-admin/src/App.jsx (lines 30-31), route /admin/onboarding renders GymOnboarding.jsx (a creation wizard). The actual Onboarding Queue with KYC review drawer is located inside GymsManagement.jsx at /admin/gyms?tab=onboarding (lines 218-230, 403-435).
   Fix for dev team: Either redirect /admin/onboarding to /admin/gyms?tab=onboarding, or embed the queue component on /admin/onboarding.
2. Missing Automation Attributes: In web-application/super-admin/src/admin/GymsManagement.jsx:
   - Add data-testid={`pending-row-${gym.customId || gym.partnerId || 'GYM00001'}`} to table rows
   - Add data-testid="kyc-doc-preview-0", "kyc-doc-preview-1", "kyc-doc-preview-2" to document preview items
   - Add data-testid="btn-approve" to the approve button in review view
   - Add data-testid="btn-action-required" to Action Required button
