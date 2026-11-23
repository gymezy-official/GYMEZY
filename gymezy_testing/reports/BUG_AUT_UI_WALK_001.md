Test Case ID:     AUT_UI_WALK_001
Title:            [P1|Functional] Walk-in modal: phone lookup, immediate check-in, table refresh
Severity:         S1 Blocker
Steps Run:
1. Open https://dev.owner.gymezy.com/owner/walk-ins
2. Click btn-new-walkin
3. Type 9876543210 into walkin-phone and blur
4. Verify walkin-name is auto-filled
5. Select Monthly plan and Cash payment
6. Tick walkin-checkin-now
7. Click walkin-submit
8. Observe the table

Expected Result:
• walkin-name value is 'Priya Raman' after blur
• Modal closes and success toast is shown
• First table row contains Priya Raman with status Active and attendance Checked-In
• Row count increases by one without page reload

Actual Result:
TimeoutError: waiting for locator('[data-testid=\'btn-new-walkin\']') timed out after 10000ms. Route /owner/walk-ins is not registered in App.jsx.

Evidence:
Locator: locator('[data-testid=\'btn-new-walkin\']')
Console Output:
TimeoutError: locator.click: Timeout 10000ms exceeded.
Screenshot: gymezy_testing/test-results/AUT_UI_WALK_001-Front-Desk-eb7a2-k-in-table-refresh-P1-Smoke-owner-portal/test-failed-1.png

Suspected Cause:
1. Missing Route: In web-application/gym-owner/src/App.jsx:29-44, route /owner/walk-ins does not exist. The application currently triggers walk-ins via query parameter in Dashboard.jsx (/owner/bookings?action=walkin or /owner/members?action=walkin).
   Fix for dev team: Register `<Route path="walk-ins" element={<WalkInsPage />} />` under /owner in App.jsx.
2. Missing Automation Attributes:
   - Add data-testid="btn-new-walkin" to trigger button.
   - Add data-testid="walkin-phone", data-testid="walkin-name", data-testid="walkin-plan", data-testid="walkin-payment", data-testid="walkin-checkin-now", data-testid="walkin-submit" inside the modal.
   - Ensure blur on 10-digit phone queries member record and auto-populates walkin-name.
