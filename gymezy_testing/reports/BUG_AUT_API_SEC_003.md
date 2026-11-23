Test Case ID:     AUT_API_SEC_003
Title:            [P1|Security/RBAC] Cross-tenant: owner of Gym A cannot read Gym B staff by injecting gymId
Severity:         S1 Blocker
Steps Run:
1. Log in as Owner of Gym A (Super Max Gym).
2. Send GET https://dev.api.gymezy.com/api/v1/owner/staff?gymId=<Gym B id> with Gym A Owner Bearer token.
3. Test injecting Gym B id via path parameter (/owner/staff/<Gym B id>).

Expected Result:
• HTTP 403 Forbidden
• No Gym B staff in the response
• body.message indicates not the owner of this gym
• Injected gymId in path or body is rejected with 403 or ignored

Actual Result:
HTTP 404 Not Found returned:
{"success":false,"statusCode":404,"message":"Endpoint not found: [GET] /api/v1/owner/staff"}
The route /api/v1/owner/staff does not exist on the server.

Evidence:
Request:
GET /api/v1/owner/staff?gymId=6ac3818dbf09d1169f70e6cc HTTP/1.1
Host: dev.api.gymezy.com
Authorization: Bearer <GymA-owner-token>

Response:
HTTP/1.1 404 Not Found
{"success":false,"statusCode":404,"message":"Endpoint not found: [GET] /api/v1/owner/staff"}

Console Output:
Error: expect(received).toBe(expected)
Expected: 403
Received: 404
  at D:\Work\Gymezy\GYMEZY\gymezy_testing\api\AUT_API_SEC_003.test.js:23:31

Suspected Cause:
1. In middleware/src/routes/index.js:21:
   The route `/owner/staff` is missing; routes are mounted at `/employees`.
2. In middleware/src/controllers/employee.controller.js:
   Cross-tenant validation check: When an authenticated `GYM_OWNER` passes a `gymId` in query/params that does not match their assigned `req.user.gymId`, the controller must throw `ApiError.forbidden("Access denied: You are not authorized to view or manage resources of another gym.")`.

