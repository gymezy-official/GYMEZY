# GYMEZY Developer Handoff & Bug Remediation Guide

**Target Audience:** GYMEZY Backend & Frontend Engineering Teams  
**Environment:** Development (`https://dev.api.gymezy.com`, `https://dev.owner.gymezy.com`, `https://dev.admin.gymezy.com`)  
**Status:** 4 Passed, 13 Failed, 1 In-Progress (Super Admin Auth toast)

---

## 📋 Table of Contents

1. [Backend Fixes (`middleware`)](#1-backend-fixes-middleware)
   - [Bug 1: Unauthorized Access Bypass (`AUT_API_AUTH_001`)](#bug-1-unauthorized-access-bypass-aut_api_auth_001)
   - [Bug 2: JWT Tampering & Expiry Bypass (`AUT_API_AUTH_002`, `AUT_API_AUTH_003`)](#bug-2-jwt-tampering--expiry-bypass-aut_api_auth_002-aut_api_auth_003)
   - [Bug 3: Missing Route & RBAC on Staff Endpoints (`AUT_API_SEC_002`, `AUT_API_SEC_003`)](#bug-3-missing-route--rbac-on-staff-endpoints-aut_api_sec_002-aut_api_sec_003)
   - [Bug 4: Missing Coordinate Bounds Validation (`AUT_API_BAN_002`)](#bug-4-missing-coordinate-bounds-validation-aut_api_ban_002)
2. [Frontend Fixes (`web-application`)](#2-frontend-fixes-web-application)
   - [Bug 5: Owner Portal Missing Routes (`AUT_UI_GYM_001`, `AUT_UI_MEM_002`)](#bug-5-owner-portal-missing-routes-aut_ui_gym_001-aut_ui_mem_002)
   - [Bug 6: Super Admin Verification Queue Routing (`AUT_UI_GYM_002`, `AUT_UI_GYM_003`)](#bug-6-super-admin-verification-queue-routing-aut_ui_gym_002-aut_ui_gym_003)
   - [Bug 7: Missing `data-testid` Attributes (`AUT_UI_AUTH_002`, `AUT_UI_STF_001`)](#bug-7-missing-data-testid-attributes-aut_ui_auth_002-aut_ui_stf_001)
3. [Database Seed Data Requirements](#3-database-seed-data-requirements)
4. [Verification Commands](#4-verification-commands)

---

## 1. Backend Fixes (`middleware`)

### Bug 1: Unauthorized Access Bypass (`AUT_API_AUTH_001`)
* **Severity:** **S1 Blocker** (Security / RBAC)
* **Problem:** Calling `GET /api/v1/memberships/my` without an `Authorization` header returns `HTTP 200 OK` with `data: []` instead of rejecting with `HTTP 401 Unauthorized`.
* **Files to Edit:**
  1. [`middleware/src/routes/membership.routes.js`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/routes/membership.routes.js) (Line 22 & 30)
  2. [`middleware/src/controllers/membership.controller.js`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/controllers/membership.controller.js) (Line 354)

#### Code Diff:

```diff
// middleware/src/routes/membership.routes.js:22,30
- import { optionalAuthenticate } from '../middlewares/auth.middleware.js';
+ import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware.js';

...
// Line 30:
- router.get('/my', optionalAuthenticate, getMyMemberships);
+ router.get('/my', authenticate, getMyMemberships);
```

```diff
// middleware/src/controllers/membership.controller.js:354
  export const getMyMemberships = async (req, res, next) => {
    try {
-     const rawUserId = req.user?.userId || req.user?.id || req.user?._id || req.query?.userId;
-     if (!rawUserId) {
-       return res.status(200).json(ApiResponse.success([], 'My memberships retrieved successfully.'));
-     }
+     const rawUserId = req.user?.userId || req.user?.id || req.user?._id;
+     if (!rawUserId) {
+       throw ApiError.unauthorized('Not authorized, token missing');
+     }
```

---

### Bug 2: JWT Tampering & Expiry Bypass (`AUT_API_AUTH_002`, `AUT_API_AUTH_003`)
* **Severity:** **S1 Blocker** (Authentication Security)
* **Problem:** In non-production environments, `verifyToken` catches verification failures (invalid signature, expired token) and falls back to `jwt.decode(token)`. This allows an attacker to forge tokens, tamper with roles (e.g., elevate to `SUPER_ADMIN`), or use expired tokens.
* **File to Edit:** [`middleware/src/utils/jwtHelper.js`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/utils/jwtHelper.js) (Lines 21–54)

#### Code Diff:

```diff
// middleware/src/utils/jwtHelper.js:21-54
  export const verifyToken = (token) => {
    if (!token || token === 'undefined' || token === 'null') {
-     throw new Error('No authentication token provided.');
+     throw ApiError.unauthorized('No authentication token provided.');
    }

-   // 1. Try with configured JWT_SECRET
-   try {
-     return jwt.verify(token, ENV.JWT_SECRET);
-   } catch (err) {
-     // 2. Try with default dev key fallback
-     try {
-       return jwt.verify(token, 'default_jwt_secret_dev_key');
-     } catch (_) {
-       // Continue
-     }
-
-     // 3. In development mode, allow valid decoded token payload so developer sessions don't break across restarts
-     if (!ENV.IS_PRODUCTION) {
-       try {
-         const decoded = jwt.decode(token);
-         if (decoded && (decoded.userId || decoded.id || decoded._id || decoded.email)) {
-           return {
-             ...decoded,
-             userId: decoded.userId || decoded.id || decoded._id,
-           };
-         }
-       } catch (_) {
-         // Continue
-       }
-     }
-
-     throw err;
-   }
+   try {
+     return jwt.verify(token, ENV.JWT_SECRET);
+   } catch (err) {
+     try {
+       return jwt.verify(token, 'default_jwt_secret_dev_key');
+     } catch (_) {
+       // Never fallback to jwt.decode without signature check
+       throw ApiError.unauthorized(
+         err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token signature'
+       );
+     }
+   }
  };
```

---

### Bug 3: Missing Route & RBAC on Staff Endpoints (`AUT_API_SEC_002`, `AUT_API_SEC_003`)
* **Severity:** **S1 Blocker** (Cross-Tenant Security / RBAC)
* **Problem:**
  1. `GET /api/v1/owner/staff` returns `404 Not Found` because routes are only mounted at `/api/v1/employees`.
  2. `GET /api/v1/employees` lacks role authorization middleware (`authorizeRoles`), allowing regular members to query employee lists.
  3. `getEmployees` in `employee.controller.js` accepts `?gymId=` without checking if the calling Gym Owner owns that gym.
* **Files to Edit:**
  1. [`middleware/src/routes/index.js`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/routes/index.js) (Line 21)
  2. [`middleware/src/routes/employee.routes.js`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/routes/employee.routes.js) (Line 34)
  3. [`middleware/src/controllers/employee.controller.js`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/controllers/employee.controller.js) (Line 484)

#### Code Diff:

```diff
// middleware/src/routes/index.js:21
  apiRouter.use('/gyms', gymRoutes);
  apiRouter.use('/employees', employeeRoutes);
+ apiRouter.use('/owner/staff', employeeRoutes);
```

```diff
// middleware/src/routes/employee.routes.js:34
  // List employees (with gymId / partnerId filtering)
- router.get('/', getEmployees);
+ router.get(
+   '/',
+   authorizeRoles(USER_ROLES.GYM_OWNER, USER_ROLES.SUPER_ADMIN),
+   getEmployees
+ );
```

```diff
// middleware/src/controllers/employee.controller.js:484
  const targetIdentifier = gymId || gymPartnerId;
+ if (req.user?.role === USER_ROLES.GYM_OWNER && targetIdentifier) {
+   const ownerGym = await Gym.findOne({
+     $or: [
+       { ownerId: req.user._id || req.user.userId },
+       { userId: req.user._id || req.user.userId },
+       { email: req.user.email },
+     ].filter(Boolean),
+   });
+   if (!ownerGym || (String(ownerGym._id) !== String(targetIdentifier) && ownerGym.partnerId !== targetIdentifier)) {
+     throw ApiError.forbidden('Forbidden: You are not authorized to view staff for this gym.');
+   }
+ }
```

---

### Bug 4: Missing Coordinate Bounds Validation (`AUT_API_BAN_002`)
* **Severity:** **S2 Critical** (Input Validation)
* **Problem:** `GET /api/v1/banners?lat=abc&lng=78.1198` and `lat=91` return `200 OK` instead of rejecting invalid inputs with `400 Bad Request`.
* **File to Edit:** [`middleware/src/controllers/banner.controller.js`](file:///d:/Work/Gymezy/GYMEZY/middleware/src/controllers/banner.controller.js) (Line 40)

#### Code Diff:

```diff
// middleware/src/controllers/banner.controller.js:40
  export const getPublicBanners = async (req, res) => {
    try {
+     const { lat, lng } = req.query;
+     if (lat !== undefined || lng !== undefined) {
+       const parsedLat = parseFloat(lat);
+       const parsedLng = parseFloat(lng);
+       if (
+         isNaN(parsedLat) ||
+         isNaN(parsedLng) ||
+         parsedLat < -90 ||
+         parsedLat > 90 ||
+         parsedLng < -180 ||
+         parsedLng > 180
+       ) {
+         return res.status(400).json({
+           success: false,
+           message: 'Invalid coordinates provided. Latitude must be between -90 and 90, longitude between -180 and 180.',
+         });
+       }
+     }
      const userLat = req.query.lat ? parseFloat(req.query.lat) : null;
      const userLng = req.query.lng ? parseFloat(req.query.lng) : null;
```

---

## 2. Frontend Fixes (`web-application`)

### Bug 5: Owner Portal Missing Routes (`AUT_UI_GYM_001`, `AUT_UI_MEM_002`)
* **Problem:** The routes `/onboarding` and `/owner/approvals` are referenced in user navigation and tests, but they are missing in the React Router table in `gym-owner`.
* **File to Edit:** [`web-application/gym-owner/src/App.jsx`](file:///d:/Work/Gymezy/GYMEZY/web-application/gym-owner/src/App.jsx)

#### Action:
Add redirect/route mappings for:
```jsx
<Route path="/onboarding" element={<Navigate to="/register" replace />} />
<Route path="/owner" element={<OwnerLayout />}>
  ...
  <Route path="approvals" element={<ApprovalsReview />} />
  <Route path="walk-ins" element={<WalkInsDesk />} />
</Route>
```

---

### Bug 6: Super Admin Verification Queue Routing (`AUT_UI_GYM_002`, `AUT_UI_GYM_003`)
* **Problem:** Navigating to `https://dev.admin.gymezy.com/admin/onboarding` renders `GymOnboarding.jsx` (the gym creation wizard) instead of the gym verification and approval table. The verification queue is currently embedded inside `GymsManagement.jsx` under the `onboarding` tab.
* **File to Edit:** [`web-application/super-admin/src/App.jsx`](file:///d:/Work/Gymezy/GYMEZY/web-application/super-admin/src/App.jsx)

#### Action:
Update the route for `/admin/onboarding` to render `GymsManagement` pre-selected to the onboarding/verification tab.

---

### Bug 7: Missing `data-testid` Attributes (`AUT_UI_AUTH_002`, `AUT_UI_STF_001`)
* **Problem:** Automated UI tests look for stable QA selector testids:
  1. [`web-application/gym-owner/src/general/ApplicationStatus.jsx`](file:///d:/Work/Gymezy/GYMEZY/web-application/gym-owner/src/general/ApplicationStatus.jsx): Add `data-testid="pending-approval-banner"` to the pending application banner div.
  2. [`web-application/gym-owner/src/owner/components/EmployeeManagement.jsx`](file:///d:/Work/Gymezy/GYMEZY/web-application/gym-owner/src/owner/components/EmployeeManagement.jsx): Add `data-testid="btn-add-staff"` to the primary "Add Employee" / "Add Staff" button.

---

## 3. Database Seed Data Requirements

Run the following seed updates in the development database:
1. **Pending Owner Account (`AUT_UI_AUTH_002`)**:
   - Email: `owner.fitzone@example.com`
   - Role: `GYM_OWNER`
   - Gym `approvalStatus`: `'Pending Approval'`
2. **Manager Account with Delegation (`AUT_UI_STF_001`)**:
   - Email: `manager@fitzone.example.com`
   - Role: `MANAGER`
   - Permissions: `{ requireStaffApproval: true }`
3. **Walk-in Member Record (`AUT_UI_WALK_001`)**:
   - Name: `Priya Raman`
   - Phone: `9876543210`

---

## 4. Verification Commands

Once the dev team applies the code changes and restarts the dev backend server, run the test suites:

```powershell
# In GYMEZY/gymezy_testing directory:
cd d:\Work\Gymezy\GYMEZY\gymezy_testing

# 1. Run all API tests (target: 8 passed)
npm run test:api

# 2. Run all UI tests
npm run test:ui
```

