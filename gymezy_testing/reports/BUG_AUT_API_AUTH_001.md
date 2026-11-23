Test Case ID:     AUT_API_AUTH_001
Title:            [P1|Security/RBAC] Protected route without a token
Severity:         S1 Blocker
Steps Run:
1. Send GET request to https://dev.api.gymezy.com/api/v1/memberships/my with Header: Content-Type: application/json and no Authorization token.
2. Repeat with Authorization: Bearer <empty>.

Expected Result:
• HTTP 401 Unauthorized
• body.success=false
• body.message='Not authorized, token missing'
• No data array in the response

Actual Result:
HTTP 200 OK returned. The endpoint returned:
{"statusCode":200,"data":[],"message":"My memberships retrieved successfully.","success":true}
Unauthorized requests bypass authentication completely and receive an empty data list with a success status.

Evidence:
Request:
GET /api/v1/memberships/my HTTP/1.1
Host: dev.api.gymezy.com
Content-Type: application/json

Response:
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{"statusCode":200,"data":[],"message":"My memberships retrieved successfully.","success":true}

Console Output:
Error: expect(received).toBe(expected)
Expected: 401
Received: 200
  at D:\Work\Gymezy\GYMEZY\gymezy_testing\api\AUT_API_AUTH_001.test.js:13:31

Suspected Cause:
1. In middleware/src/routes/membership.routes.js:30:
   Route is mounted with optionalAuthenticate instead of authenticate:
   `router.get('/my', optionalAuthenticate, getMyMemberships);`
2. In middleware/src/controllers/membership.controller.js:354-357:
   When req.user is absent, the controller returns a 200 OK success response rather than throwing ApiError.unauthorized():
   ```javascript
   const rawUserId = req.user?.userId || req.user?.id || req.user?._id || req.query?.userId;
   if (!rawUserId) {
     return res.status(200).json(ApiResponse.success([], 'My memberships retrieved successfully.'));
   }
   ```
   Fix: Replace optionalAuthenticate with authenticate on /my route in membership.routes.js.

