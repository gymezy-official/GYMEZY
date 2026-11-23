Test Case ID:     AUT_UI_GYM_003
Title:            [P1|Functional] Action Required feedback then owner resubmission
Severity:         S1 Blocker
Steps Run:
1. Super Admin opens https://dev.admin.gymezy.com/admin/onboarding and clicks pending-row-GYM00001
2. Types the remark and confirms
3. Switch to Owner Web and log in
4. Read remark-banner
5. Replace GST file and click onboarding-resubmit
6. Switch to Super Admin queue

Expected Result:
• Status tag shows 'Action Required' after the first step
• remark-banner text equals the remark
• After resubmit the tag is 'Pending Approval'
• Gym is back in the Super Admin queue

Actual Result:
TimeoutError: waiting for locator('[data-testid=\'pending-row-GYM00001\']') timed out after 10000ms. Route /admin/onboarding in Super Admin loads the onboarding creation form rather than the verification queue. In Owner Web, the remark banner lacks data-testid="remark-banner".

Evidence:
Locator: locator('[data-testid=\'pending-row-GYM00001\']')
Console Output:
TimeoutError: locator.click: Timeout 10000ms exceeded.
Screenshot: gymezy_testing/test-results/AUT_UI_GYM_003-Gym-Onboard-5e40d--resubmission-P1-Regression-super-admin/test-failed-1.png

Suspected Cause:
1. Super Admin Route: In web-application/super-admin/src/App.jsx:31, /admin/onboarding does not load the pending queue (GymsManagement.jsx?tab=onboarding).
2. Action Required Remark Modal: In web-application/super-admin/src/admin/GymsManagement.jsx (lines 550-580), input field for remarks needs data-testid="action-remark" and submit button needs data-testid="btn-action-required".
3. Owner Resubmission Banner: In web-application/gym-owner/src/general/ApplicationStatus.jsx (lines 740-770), the admin note alert banner requires data-testid="remark-banner" and the re-upload submission button needs data-testid="onboarding-resubmit".
