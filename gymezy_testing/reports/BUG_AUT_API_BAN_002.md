Test Case ID:     AUT_API_BAN_002
Title:            [P2|Negative] Missing or invalid coordinates
Severity:         S2 Critical
Steps Run:
1. Send GET https://dev.api.gymezy.com/api/v1/banners?lat=abc&lng=78.1198.
2. Send GET https://dev.api.gymezy.com/api/v1/banners?lat=91&lng=78.1198 (latitude out of range [-90, 90]).
3. Send GET https://dev.api.gymezy.com/api/v1/banners (no coordinates).

Expected Result:
• HTTP 400 Bad Request for lat=abc
• body.message indicates invalid coordinates
• lat=91 returns 400 Bad Request
• Calling without lat & lng returns 200 OK with priority first and no distance field

Actual Result:
HTTP 200 OK returned for both lat=abc and lat=91.
For lat=abc, the backend returns 200 OK with distanceKm: null instead of 400 Bad Request.
For lat=91, the backend computes an impossible distance (8663.68 km) and returns 200 OK instead of validating latitude boundary [-90, 90].

Evidence:
Request 1:
GET /api/v1/banners?lat=abc&lng=78.1198 HTTP/1.1
Host: dev.api.gymezy.com

Response 1:
HTTP/1.1 200 OK
{"success":true,"data":[...],"total":8}

Request 2:
GET /api/v1/banners?lat=91&lng=78.1198 HTTP/1.1
Host: dev.api.gymezy.com

Response 2:
HTTP/1.1 200 OK
{"success":true,"data":[{"distanceKm":8663.68,...}]}

Console Output:
Error: expect(received).toBe(expected)
Expected: 400
Received: 200
  at D:\Work\Gymezy\GYMEZY\gymezy_testing\api\AUT_API_BAN_002.test.js:10:31

Suspected Cause:
In middleware/src/controllers/banner.controller.js (or bannerService.js):
Coordinates parsing lacks input validation:
```javascript
const userLat = parseFloat(lat);
const userLng = parseFloat(lng);
```
If lat or lng is provided but is NaN or outside [-90, 90] (latitude) or [-180, 180] (longitude), it should throw ApiError.badRequest('Invalid geographic coordinates provided. Latitude must be between -90 and 90, longitude between -180 and 180.').

