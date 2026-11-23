Test Case ID:     AUT_API_AUTH_003
Title:            [P1|Boundary Value] Expired JWT
Severity:         S1 Blocker
Steps Run:
1. Generate JWT with exp = now - 3600 (expired 1 hour ago).
2. Send GET https://dev.api.gymezy.com/api/v1/memberships/my with Authorization: Bearer <expired-token>.
3. Test boundary token with exp = now + 1 (1 second before expiry).

Expected Result:
• HTTP 401 Unauthorized for expired token
• body.message indicates token expired
• Token 1 second before expiry returns 200 OK

Actual Result:
HTTP 200 OK returned for the expired token. The expired token was silently ignored, and the endpoint returned 200 OK with data: [].

Evidence:
Request:
GET /api/v1/memberships/my HTTP/1.1
Host: dev.api.gymezy.com
Authorization: Bearer <token exp=now-3600>

Response:
HTTP/1.1 200 OK
{"statusCode":200,"data":[],"message":"My memberships retrieved successfully.","success":true}

Console Output:
Error: expect(received).toBe(expected)
Expected: 401
Received: 200
  at D:\Work\Gymezy\GYMEZY\gymezy_testing\api\AUT_API_AUTH_003.test.js:16:31

Suspected Cause:
1. In middleware/src/routes/membership.routes.js:30:
   Route uses optionalAuthenticate:
   `router.get('/my', optionalAuthenticate, getMyMemberships);`
2. In middleware/src/middlewares/auth.middleware.js:129-132:
   optionalAuthenticate catches all errors (including TokenExpiredError) and silently swallows them:
   ```javascript
   } catch (_err) {
     // Silently continue for optional authentication
   }
   return next();
   ```
   Because /memberships/my is a protected member resource, it must use authenticate, which properly rejects expired tokens with 401 and 'Session expired. Please sign in again.'.

