Test Case ID:     AUT_UI_WALK_002
Title:            [P3|Negative] Walk-in phone validation shows inline errors
Severity:         S3 Major
Steps Run:
1. Open https://dev.owner.gymezy.com/owner/walk-ins
2. Open the walk-in modal
3. Enter 12345 and click submit
4. Enter 98765abcde and click submit
5. Clear the field and click submit

Expected Result:
• Each case shows .ant-form-item-explain-error with the phone message
• No network call to the walk-in endpoint is made

Actual Result:
TimeoutError: waiting for locator('[data-testid=\'btn-new-walkin\']') timed out after 10000ms. Route /owner/walk-ins is not registered in App.jsx.

Evidence:
Locator: locator('[data-testid=\'btn-new-walkin\']')
Console Output:
TimeoutError: locator.click: Timeout 10000ms exceeded.
Screenshot: gymezy_testing/test-results/AUT_UI_WALK_002-Front-Desk-d13fe-inline-errors-P3-Regression-owner-portal/test-failed-1.png

Suspected Cause:
Route /owner/walk-ins is not configured in web-application/gym-owner/src/App.jsx.
Fix for dev team:
1. Implement route /owner/walk-ins in App.jsx.
2. In the walk-in modal Form.Item for phone, attach validation rules enforcing 10-digit Indian phone number formatting so Ant Design renders .ant-form-item-explain-error before any API POST request is triggered.
