Test Case ID:     AUT_API_SEC_002
Title:            [P1|Security/RBAC] authorizeRoles blocks Member from owner routes
Severity:         S1 Blocker
Steps Run:
1. Send GET https://dev.api.gymezy.com/api/v1/owner/staff with Member (CUSTOMER) Bearer token.
2. Send GET https://dev.api.gymezy.com/api/v1/owner/staff with Trainer Bearer token.

Expected Result:
• HTTP 403 Forbidden
• body.message indicates forbidden / not authorized
• No staff data returned

Actual Result:
HTTP 404 Not Found returned:
{"success":false,"statusCode":404,"message":"Endpoint not found: [GET] /api/v1/owner/staff"}
The route /api/v1/owner/staff does not exist in the routing table.

Evidence:
Request:
GET /api/v1/owner/staff HTTP/1.1
Host: dev.api.gymezy.com
Authorization: Bearer <member-token>

Response:
HTTP/1.1 404 Not Found
{"success":false,"statusCode":404,"message":"Endpoint not found: [GET] /api/v1/owner/staff"}

Console Output:
Error: expect(received).toBe(expected)
Expected: 403
Received: 404
  at D:\Work\Gymezy\GYMEZY\gymezy_testing\api\AUT_API_SEC_002.test.js:16:31

Suspected Cause:
1. In middleware/src/routes/index.js:21:
   The employee and staff management routes are mounted under `/employees` instead of `/owner/staff`:
   `apiRouter.use('/employees', employeeRoutes);`
   There is no alias for `/owner/staff` or `/owner` routes.
2. Fix for dev team:
   In middleware/src/routes/index.js, add an alias for owner staff:
   `apiRouter.use('/owner/staff', employeeRoutes);`
   Ensure `employeeRoutes` enforces `authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN)` on GET `/` so that CUSTOMER and TRAINER tokens receive 403 Forbidden.

