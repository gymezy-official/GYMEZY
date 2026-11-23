Test Case ID:     AUT_UI_STF_001
Title:            [P1|Functional] Manager creates Full-time staff (staged) and Part-time staff (auto-approved)
Severity:         S1 Blocker
Steps Run:
1. Log in as Manager with requireStaffApproval=true (https://dev.owner.gymezy.com/login)
2. Open Staff and click btn-add-staff (/owner/staff)
3. Create Karthik S as Full-time Trainer
4. Create Divya R as Part-time Front Desk
5. Read tag in each row

Expected Result:
• Karthik S row tag text is 'Pending Approval' (yellow)
• Divya R row tag text is 'Active' (green)
• Modal closes after each save

Actual Result:
TimeoutError: waiting for locator('[data-testid=\'btn-add-staff\']') timed out after 10000ms. Navigating to /owner/staff redirected to /login because manager test credentials could not authenticate. Furthermore, the "Add Staff" button in EmployeeManagement.jsx lacks the specified data-testid="btn-add-staff" attribute.

Evidence:
Locator: locator('[data-testid=\'btn-add-staff\']')
Console Output:
TimeoutError: locator.click: Timeout 10000ms exceeded.
Screenshot: gymezy_testing/test-results/AUT_UI_STF_001-Staff-Manag-9557b-auto-approved-P1-Regression-owner-portal/test-failed-1.png

Suspected Cause:
1. Missing Seed Account: Manager account manager@fitzone.example.com with flag requireStaffApproval=true is not seeded in the live database.
2. Missing Automation Contract Attributes: In web-application/gym-owner/src/owner/components/EmployeeManagement.jsx (lines 3879 & 4434):
   - Add data-testid="btn-add-staff" to the "Add Staff" / "Add Employee" button.
   - Add data-testid="staff-name" to the employee name input field.
   - Add data-testid="staff-employment" to employment type (Full-time / Part-time) dropdown.
   - Add data-testid="staff-submit" to the modal submit button.
   - Ensure the staged Full-time employee tag renders 'Pending Approval' and Part-time renders 'Active'.
