Test Case ID:     AUT_UI_GYM_001
Title:            [P1|Functional] 5-tab onboarding wizard submits with valid KYC and shows partnerId
Severity:         S1 Blocker
Steps Run:
1. Open https://dev.owner.gymezy.com/onboarding
2. Fill General & Geo tab
3. Fill Operations & Amenities tab
4. Add two plans on Pricing Plans tab
5. Add one Manager on Staff Profiles tab
6. Upload three files on KYC Documents tab
7. Click onboarding-submit

Expected Result:
• .ant-result-success is visible
• Result text matches /GYM\d{5}/
• Status tag text is 'Pending Approval'
• Network POST returns 201

Actual Result:
Route /onboarding failed: browser was redirected to /login because route /onboarding is not registered in App.jsx. Furthermore, the wizard form at /register lacks required test automation contract attributes (data-testid).

Evidence:
Console Output:
TimeoutError: locator.fill: Timeout 10000ms exceeded.
Locator: locator('[data-testid=\'gym-name\']')
Screenshot: gymezy_testing/test-results/AUT_UI_GYM_001-Gym-Onboard-ab09b-ows-partnerId-P1-Regression-owner-portal/test-failed-1.png

Suspected Cause:
1. Missing Route: In web-application/gym-owner/src/App.jsx:21-27, there is no route for /onboarding. Register.jsx is mounted only at /register.
   Fix: Add `<Route path="/onboarding" element={<Navigate to="/register" replace />} />` or mount `<Register />` on `/onboarding`.
2. Missing Attributes: In web-application/gym-owner/src/general/Register.jsx:
   - Add data-testid="gym-name" to gym name input
   - Add data-testid="gym-lat" and data-testid="gym-lng" to geolocation inputs
   - Add data-testid="kyc-gst-upload", data-testid="kyc-pan-upload", data-testid="kyc-license-upload" to file uploads
   - Add data-testid="onboarding-submit" to final submit button
   - Ensure the post-registration success screen renders class .ant-result-success with generated partnerId (e.g. GYM00001).
