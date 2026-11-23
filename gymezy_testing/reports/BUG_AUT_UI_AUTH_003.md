Test Case ID:     AUT_UI_AUTH_003
Title:            [P1|Security/RBAC] Gym Owner credentials are denied on Super Admin portal
Severity:         S1 Blocker
Steps Run:
1. Open https://dev.admin.gymezy.com/login
2. Enter Gym Owner credentials (super@gmail.com / super@gmail.coM1)
3. Click sa-login-submit
4. Observe network response and UI error message

Expected Result:
• .ant-message-error contains 'Access denied'
• URL stays on /login
• localStorage has no auth token

Actual Result:
The backend correctly rejected the login with HTTP 403 and payload:
`{"success":false,"statusCode":403,"message":"Access denied. Only Super Administrators are authorized to access the Super Admin Portal."}`
However, NO error toast appeared in the UI, and .ant-message-error remained unrendered. When unseeded credentials (owner.fitzone@example.com) were used, it showed generic "Invalid credentials".

Evidence:
Network Response:
Status: 403 Forbidden
Payload: {"success":false,"statusCode":403,"message":"Access denied. Only Super Administrators are authorized to access the Super Admin Portal."}
Console / UI Locator:
Error: expect(locator).toBeVisible() failed for locator('.ant-message-error')
Screenshot: gymezy_testing/test-results/AUT_UI_AUTH_003-Authentica-5ebc1-Super-Admin-portal-P1-Smoke-super-admin/test-failed-1.png

Suspected Cause:
In web-application/super-admin/src/general/Login.jsx:82:
Line 82 reads:
`message.error(result.error || 'Authentication failed. Please check your credentials.');`
When Redux Toolkit loginSuperAdmin thunk rejects with `rejectWithValue(error.response?.data?.message)`, the custom error string is stored in `result.payload` (not `result.error`). Because `result.error` is an object, Ant Design message does not render the string, completely swallowing the 403 "Access denied" error message.
Fix for dev team: Change line 82 to:
`message.error(result.payload || result.error?.message || 'Authentication failed.');`
And add data-testid="sa-login-email", data-testid="sa-login-password", data-testid="sa-login-submit" on inputs.
