# GYMEZY QA Bug Tracker & Remediation Guide for Dev Team

This report compiles all findings from the automated Playwright UI test suite execution across the **Owner Web Portal** and **Super Admin Web Portal**.

---

## 📌 Executive Summary

- **Total Test Cases Executed**: 18 (10 UI + 8 API)
- **UI Tests Passed**: 2 (`AUT_UI_BAN_001`, `AUT_UI_WALK_002`)
- **UI Tests Failed**: 7 (`AUT_UI_AUTH_002`, `AUT_UI_GYM_001`, `AUT_UI_GYM_002`, `AUT_UI_GYM_003`, `AUT_UI_STF_001`, `AUT_UI_MEM_002`, `AUT_UI_WALK_001`)
- **UI Tests In-Progress by Dev**: 1 (`AUT_UI_AUTH_003`)
- **API Tests Passed**: 2 (`AUT_API_BAN_001`, `AUT_API_SEC_001`)
- **API Tests Failed**: 6 (`AUT_API_AUTH_001`, `AUT_API_AUTH_002`, `AUT_API_AUTH_003`, `AUT_API_BAN_002`, `AUT_API_SEC_002`, `AUT_API_SEC_003`)
- **Total Blockers (S1)**: 11
- **Total Critical Issues (S2)**: 2

---

## 🛠️ Master Action Item List for Developers

### API Automation Findings (`gymezy_testing/tests/api/`)

| ID | Status | Module | Severity | Root Cause Summary | Application File(s) & Line Reference |
|---|---|---|---|---|---|
| [`AUT_API_AUTH_001`](./BUG_AUT_API_AUTH_001.md) | **FAILED** | Auth API | **S1** | `/api/v1/memberships/my` without token returns 200 OK (`data: []`) instead of 401 Unauthorized | `middleware/src/routes/membership.routes.js:30`<br>`middleware/src/controllers/membership.controller.js:354-357` |
| [`AUT_API_AUTH_002`](./BUG_AUT_API_AUTH_002.md) | **FAILED** | Auth API | **S1** | Tampered JWT signature accepted by middleware (returns 200 OK); stack traces exposed in API errors | `middleware/src/utils/jwtHelper.js:38-50`<br>`middleware/src/middlewares/error.middleware.js` |
| [`AUT_API_AUTH_003`](./BUG_AUT_API_AUTH_003.md) | **FAILED** | Auth API | **S1** | Expired JWT (`exp=now-3600`) returns 200 OK on `/api/v1/memberships/my` instead of 401 Unauthorized | `middleware/src/routes/membership.routes.js:30`<br>`middleware/src/middlewares/auth.middleware.js:129-132` |
| [`AUT_API_SEC_001`](../tests/api/AUT_API_SEC_001.test.js) | **PASSED** ✅ | Security API | **-** | `authorizeRoles` blocks Member and Gym Owner from `GET /api/v1/admin/gyms` with 403 Forbidden | `middleware/src/routes/admin.routes.js:28` |
| [`AUT_API_SEC_002`](./BUG_AUT_API_SEC_002.md) | **FAILED** | Security API | **S1** | `GET /api/v1/owner/staff` returns 404 Not Found instead of 403 Forbidden; route unmapped | `middleware/src/routes/index.js:21`<br>`middleware/src/routes/employee.routes.js` |
| [`AUT_API_SEC_003`](./BUG_AUT_API_SEC_003.md) | **FAILED** | Security API | **S1** | `GET /api/v1/owner/staff` returns 404 Not Found; cross-tenant tenant ID check unmapped | `middleware/src/routes/index.js:21`<br>`middleware/src/controllers/employee.controller.js` |
| [`AUT_API_BAN_001`](../tests/api/AUT_API_BAN_001.test.js) | **PASSED** ✅ | Banners API | **-** | Priority banners listed first, followed by ascending Haversine distance ordering | `middleware/src/routes/banner.routes.js:16` |
| [`AUT_API_BAN_002`](./BUG_AUT_API_BAN_002.md) | **FAILED** | Banners API | **S2** | `lat=abc` and `lat=91` return 200 OK instead of 400 Bad Request with coordinate validation message | `middleware/src/controllers/banner.controller.js` |

### UI Automation Findings (`gymezy_testing/tests/ui/`)

| ID | Status | Module | Severity | Root Cause Summary | Application File(s) & Line Reference |
|---|---|---|---|---|---|
| [`AUT_UI_AUTH_002`](./BUG_AUT_UI_AUTH_002.md) | **FAILED** | Auth (Owner) | **S1** | Unseeded pending owner account; missing `data-testid="pending-approval-banner"` | `web-application/gym-owner/src/general/ApplicationStatus.jsx:144-165`<br>`web-application/gym-owner/src/general/Login.jsx:354, 370` |
| [`AUT_UI_AUTH_003`](./BUG_AUT_UI_AUTH_003.md) | **DEV IN PROGRESS** | Auth (Super Admin) | **S1** | UI toast swallows backend 403 "Access denied" error message; renders nothing | `web-application/super-admin/src/general/Login.jsx:82`<br>`web-application/super-admin/src/redux/slices/authSlice.js:24-36` |
| [`AUT_UI_GYM_001`](./BUG_AUT_UI_GYM_001.md) | **FAILED** | Onboarding (Owner) | **S1** | Route `/onboarding` missing in router (redirects to `/login`); missing form testids | `web-application/gym-owner/src/App.jsx:21-27`<br>`web-application/gym-owner/src/general/Register.jsx:199, 335` |
| [`AUT_UI_GYM_002`](./BUG_AUT_UI_GYM_002.md) | **FAILED** | Onboarding (Admin) | **S1** | `/admin/onboarding` renders creation wizard instead of the verification queue | `web-application/super-admin/src/App.jsx:30-31`<br>`web-application/super-admin/src/admin/GymsManagement.jsx:218, 403` |
| [`AUT_UI_GYM_003`](./BUG_AUT_UI_GYM_003.md) | **FAILED** | Onboarding (Admin) | **S1** | Route mismatch on `/admin/onboarding`; Action Required remark modal missing testids | `web-application/super-admin/src/admin/GymsManagement.jsx:550-580`<br>`web-application/gym-owner/src/general/ApplicationStatus.jsx:740-770` |
| [`AUT_UI_STF_001`](./BUG_AUT_UI_STF_001.md) | **FAILED** | Staff & Delegation | **S1** | Manager account unseeded; "Add Staff" button missing `data-testid="btn-add-staff"` | `web-application/gym-owner/src/owner/components/EmployeeManagement.jsx:3879, 4434` |
| [`AUT_UI_WALK_001`](./BUG_AUT_UI_WALK_001.md) | **FAILED** | Walk-Ins (Owner) | **S1** | Priya Raman (phone `9876543210`) unseeded in user DB; lookup returns empty | `web-application/gym-owner/src/owner/components/MembersManagement.jsx` |
| [`AUT_UI_MEM_002`](./BUG_AUT_UI_MEM_002.md) | **FAILED** | Memberships | **S2** | Route `/owner/approvals` missing in router table; no pending switch requests in DB | `web-application/gym-owner/src/App.jsx:29-44`<br>`web-application/gym-owner/src/owner/components/MembersManagement.jsx` |
| `AUT_UI_BAN_001` | **PASSED** ✅ | Banners & Ads | **-** | Verified priority banner creation with image and toast on live Super Admin portal | `tests/ui/AUT_UI_BAN_001.test.js` |
| `AUT_UI_WALK_002` | **PASSED** ✅ | Walk-Ins (Owner) | **-** | Verified phone validation inline errors and network prevention on live Owner portal | `tests/ui/AUT_UI_WALK_002.test.js` |

---

## 🔧 Detailed Bug Remediation

### 1. `BUG_AUT_API_AUTH_001`: Enforce Authentication on `/api/v1/memberships/my`
- **File**: [`middleware/src/routes/membership.routes.js:30`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/routes/membership.routes.js#L30) and [`middleware/src/controllers/membership.controller.js:354-357`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/controllers/membership.controller.js#L354-L357)
- **Root Cause**: Route uses `optionalAuthenticate` instead of `authenticate`. In `membership.controller.js`, `if (!rawUserId)` returns `200 OK` with `data: []` instead of throwing `401 Unauthorized`.
- **Developer Fix**:
  ```javascript
  // middleware/src/routes/membership.routes.js line 30:
  import { authenticate } from '../middlewares/auth.middleware.js';
  router.get('/my', authenticate, getMyMemberships);

  // middleware/src/controllers/membership.controller.js line 354:
  const rawUserId = req.user?.userId || req.user?.id || req.user?._id;
  if (!rawUserId) {
    throw ApiError.unauthorized('Not authorized, token missing');
  }
  ```

### 2. `BUG_AUT_API_AUTH_002` & `BUG_AUT_API_AUTH_003`: Fix JWT Verification Bypass & Token Validation
- **File**: [`middleware/src/utils/jwtHelper.js:38-50`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/utils/jwtHelper.js#L38-L50)
- **Root Cause**: The `verifyToken` function contains a development bypass (`if (!ENV.IS_PRODUCTION) { return jwt.decode(token); }`) which silently catches verification errors (such as `JsonWebTokenError: invalid signature` and `TokenExpiredError: jwt expired`) and returns the decoded payload as valid.
- **Developer Fix**:
  ```javascript
  // middleware/src/utils/jwtHelper.js:
  export const verifyToken = (token) => {
    if (!token || token === 'undefined' || token === 'null') {
      throw ApiError.unauthorized('No authentication token provided.');
    }
    // Must strictly verify signature and expiration:
    return jwt.verify(token, ENV.JWT_SECRET);
  };
  ```

### 3. `BUG_AUT_API_SEC_002` & `BUG_AUT_API_SEC_003`: Mount `/owner/staff` and Implement Cross-Tenant Isolation
- **File**: [`middleware/src/routes/index.js`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/routes/index.js), [`middleware/src/routes/employee.routes.js:34`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/routes/employee.routes.js#L34), [`middleware/src/controllers/employee.controller.js:484-510`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/controllers/employee.controller.js#L484-L510)
- **Root Cause**: The backend only mounts `/employees`. `/api/v1/owner/staff` returns `404 Not Found`. Additionally, `router.get('/', getEmployees)` is missing `authorizeRoles(...)`, and `getEmployees` does not verify if the requesting Gym Owner owns the gym specified in `?gymId=`.
- **Developer Fix**:
  ```javascript
  // 1. In middleware/src/routes/index.js:
  apiRouter.use('/owner/staff', employeeRoutes);

  // 2. In middleware/src/routes/employee.routes.js:
  router.get('/', authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN), getEmployees);

  // 3. In middleware/src/controllers/employee.controller.js:
  if (req.user?.role === USER_ROLES.GYM_OWNER && targetIdentifier) {
    const ownerGym = await Gym.findOne({
      $or: [{ ownerId: req.user._id || req.user.userId }, { userId: req.user._id || req.user.userId }, { email: req.user.email }],
    });
    if (!ownerGym || (String(ownerGym._id) !== String(targetIdentifier) && ownerGym.partnerId !== targetIdentifier)) {
      throw ApiError.forbidden('Forbidden: You are not authorized to view staff for this gym.');
    }
  }
  ```

### 4. `BUG_AUT_API_BAN_002`: Validate Latitude & Longitude Query Parameters
- **File**: [`middleware/src/controllers/banner.controller.js:39-44`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/controllers/banner.controller.js#L39-L44)
- **Root Cause**: `parseFloat(req.query.lat)` allows `NaN` and out-of-range coordinates (`lat=91`) to return `200 OK` instead of rejecting with `400 Bad Request`.
- **Developer Fix**:
  ```javascript
  export const getPublicBanners = async (req, res) => {
    try {
      const { lat, lng } = req.query;
      if (lat !== undefined || lng !== undefined) {
        const parsedLat = parseFloat(lat);
        const parsedLng = parseFloat(lng);
        if (isNaN(parsedLat) || isNaN(parsedLng) || parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
          return res.status(400).json({
            success: false,
            message: 'Invalid coordinates provided. Latitude must be between -90 and 90, longitude between -180 and 180.',
          });
        }
      }
      ...
  ```

### 5. `BUG_AUT_UI_AUTH_003`: Fix Swallowed "Access Denied" Toast
- **Issue**: The server correctly responds with `403 Forbidden` and `{"message": "Access denied. Only Super Administrators are authorized to access the Super Admin Portal."}`. However, line 82 of `super-admin/src/general/Login.jsx` executes:
  ```js
  message.error(result.error || 'Authentication failed. Please check your credentials.');
  ```
  In Redux Toolkit, `result.error` is an object, causing Ant Design's `message.error()` to ignore it.
- **Fix**: Change to:
  ```js
  message.error(result.payload || result.error?.message || 'Authentication failed. Please check your credentials.');
  ```

### 6. `BUG_AUT_UI_GYM_001`, `BUG_AUT_UI_MEM_002`, `BUG_AUT_UI_WALK_001`: Register Missing Routes
- **Issue**: The React Router in `gym-owner/src/App.jsx` lacks endpoints for:
  - `/onboarding` (should alias or mount `<Register />`)
  - `/owner/walk-ins` (currently only triggered via dashboard query params)
  - `/owner/approvals` (for membership plan switch reviews)
- **Fix**: Add route definitions in `gym-owner/src/App.jsx`:
  ```jsx
  <Route path="/onboarding" element={<Navigate to="/register" replace />} />
  <Route path="/owner" element={<OwnerLayout />}>
    ...
    <Route path="walk-ins" element={<WalkInsPage />} />
    <Route path="approvals" element={<ApprovalsPage />} />
  </Route>
  ```

### 7. `BUG_AUT_UI_GYM_002` & `BUG_AUT_UI_GYM_003`: Route Routing on Super Admin
- **Issue**: `/admin/onboarding` currently loads `GymOnboarding.jsx` (the creation form) rather than the verification queue. The verification queue and drawer live inside `GymsManagement.jsx` under tab `'onboarding'`.
- **Fix**: Update `super-admin/src/App.jsx` to direct `/admin/onboarding` to `GymsManagement` with `tab=onboarding`, or unify the queue screen.

### 8. Database Seed Data Requirements
- Seed `owner.fitzone@example.com` with `approvalStatus = 'Pending Approval'`.
- Seed manager account `manager@fitzone.example.com` with `requireStaffApproval = true`.

---

## 🔄 Re-Running the Test Suite

Once the above code changes and seed data updates are deployed, run:

```bash
cd GYMEZY/gymezy_testing
npm test
```

