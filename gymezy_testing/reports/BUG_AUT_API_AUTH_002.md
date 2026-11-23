Test Case ID:     AUT_API_AUTH_002
Title:            [P1|Security/RBAC] Tampered JWT signature
Severity:         S1 Blocker
Steps Run:
1. Generate valid member JWT payload.
2. Flip the last character of the signature portion.
3. Send GET https://dev.api.gymezy.com/api/v1/memberships/my with Authorization: Bearer <tampered-token>.
4. Alter role claim to SUPER_ADMIN without re-signing and repeat.

Expected Result:
• HTTP 401 Unauthorized
• body.message indicates invalid token
• No stack trace in the response

Actual Result:
HTTP 200 OK returned. The tampered signature was accepted by the middleware and decoded without verification, returning the membership data/status 200. In addition, when other unauthorized errors occur in the system, full server stack traces are leaked into the JSON response.

Evidence:
Request:
GET /api/v1/memberships/my HTTP/1.1
Host: dev.api.gymezy.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWMzODNlMTM3ZmU2ZDUxYjFjZWE0NTAiLCJlbWFpbCI6ImN1c3RvbWVyLmZpdHpvbmVAZXhhbXBsZS5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJmdWxsTmFtZSI6IllvdmVsIFIiLCJpYXQiOjE3OTQzMDIzOTcsImV4cCI6MTc5NDMwNTk5N30.Zz3yG-fF5sF8y9Q2X8G3e1A_7-tamperedA

Response:
HTTP/1.1 200 OK
{"statusCode":200,"data":[],"message":"My memberships retrieved successfully.","success":true}

Console Output:
Error: expect(received).toBe(expected)
Expected: 401
Received: 200
  at D:\Work\Gymezy\GYMEZY\gymezy_testing\api\AUT_API_AUTH_002.test.js:18:31

Suspected Cause:
1. In middleware/src/utils/jwtHelper.js:38-50:
   The server has a development bypass that blindly decodes any JWT without signature verification:
   ```javascript
   if (!ENV.IS_PRODUCTION) {
     try {
       const decoded = jwt.decode(token);
       if (decoded && (decoded.userId || decoded.id || decoded._id || decoded.email)) {
         return { ...decoded, userId: decoded.userId || decoded.id || decoded._id };
       }
     } catch (_) {}
   }
   ```
   This allows attackers to forge or tamper with any token (such as escalating role to SUPER_ADMIN) on development/staging deployments.
2. In middleware/src/middlewares/error.middleware.js:
   Stack traces are being rendered in JSON output when errors occur instead of being suppressed.

