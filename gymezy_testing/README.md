# GYMEZY Test Automation Suite

Enterprise-grade test automation suite built with Playwright for GYMEZY Web Applications (`Owner Web Portal` & `Super Admin Web`).

---

## 📁 Directory Structure

```plaintext
gymezy_testing/
├── TESTING_RULES.md            # Master QA testing rules & execution governance
├── README.md                   # Automation suite overview & instructions
├── package.json                # Dependencies, runners, and npm scripts
├── playwright.config.js        # Playwright test harness configuration
├── tests/                      # Organized test suites by Actor & Platform
│   ├── super-admin/            # Super Admin Role
│   │   ├── website/            # Super Admin Web Portal (https://dev.admin.gymezy.com)
│   │   │   ├── authentication/
│   │   │   │   └── AUT_UI_AUTH_003.test.js # [P1|Security/RBAC] Owner credentials denied on Super Admin
│   │   │   ├── banners-ads/
│   │   │   │   ├── AUT_UI_BAN_001.test.js  # [P2|Functional] Super Admin priority banner creation
│   │   │   │   ├── AUT_API_BAN_001.test.js # [P1|Functional] Priority first then distance
│   │   │   │   └── AUT_API_BAN_002.test.js # [P2|Negative] Missing/invalid coordinates
│   │   │   └── gym-verification/
│   │   │       ├── AUT_UI_GYM_002.test.js  # [P1|Functional] KYC review drawer, document preview & approval
│   │   │       ├── AUT_UI_GYM_003.test.js  # [P1|Functional] Action Required remark and resubmission
│   │   │       └── AUT_API_SEC_001.test.js # [P1|Security] Member blocked from admin routes
│   │   └── app/                # Super Admin Mobile App (Upcoming Appium/Detox)
│   │       └── README.md
│   ├── owner/                  # Gym Owner Role
│   │   ├── website/            # Owner Web Portal (https://dev.owner.gymezy.com)
│   │   │   ├── authentication/
│   │   │   │   └── AUT_UI_AUTH_002.test.js # [P1|Security/RBAC] Owner Pending Approval route restriction
│   │   │   ├── gym-onboarding/
│   │   │   │   └── AUT_UI_GYM_001.test.js  # [P1|Functional] 5-tab onboarding wizard submission
│   │   │   ├── memberships/
│   │   │   │   └── AUT_UI_MEM_002.test.js  # [P2|Functional] Owner approves staged plan switch
│   │   │   ├── staff-delegation/
│   │   │   │   ├── AUT_UI_STF_001.test.js  # [P1|Functional] Manager creates staged & auto-approved staff
│   │   │   │   ├── AUT_API_SEC_002.test.js # [P1|Security] Member blocked from owner routes
│   │   │   │   └── AUT_API_SEC_003.test.js # [P1|Security] Cross-tenant gymId injection
│   │   │   └── walk-ins/
│   │   │       ├── AUT_UI_WALK_001.test.js # [P1|Functional] Front-desk walk-in phone lookup & check-in
│   │   │       └── AUT_UI_WALK_002.test.js # [P3|Negative] Front-desk walk-in phone inline validation
│   │   └── app/                # Owner Scanner / Mobile App (Upcoming Appium - AUT_UI_ATT_002, AUT_UI_ATT_003)
│   │       └── README.md
│   └── member/                 # Member Role
│       ├── website/            # Member API / Web Portal
│       │   └── memberships/
│       │       ├── AUT_API_AUTH_001.test.js # [P1|Security] Protected route without token
│       │       ├── AUT_API_AUTH_002.test.js # [P1|Security] Tampered JWT signature
│       │       └── AUT_API_AUTH_003.test.js # [P1|Boundary] Expired JWT
│       └── app/                # Member Mobile App (Upcoming Detox - AUT_UI_AUTH_001, AUT_UI_MEM_001, etc.)
│           └── README.md
├── fixtures/                   # Test data, files, and Page Object Models (POM)
│   ├── authHelper.js           # API token generation and tampering fixtures
│   ├── files/                  # Test upload assets (PDFs, JPGs)
│   └── pages/                  # Page Object Models for UI screens
└── reports/                    # Execution results, traces, and audit matrices
    ├── GYMEZY_COMPREHENSIVE_TEST_EXCEL_AUDIT_REPORT.md # Master Excel cross-reference audit (164 cases)
    └── README.md
```

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
cd gymezy_testing
npm install
```

### 2. Run Test Suites

- **Run all UI tests:**
  ```bash
  npm test
  ```

- **Run priority-specific tests (Priority execution rule: P1 -> P2 -> P3):**
  ```bash
  npm run test:p1
  npm run test:p2
  npm run test:p3
  ```

- **Run by portal:**
  ```bash
  npm run test:owner
  npm run test:admin
  ```

- **Run smoke or regression suite:**
  ```bash
  npm run test:smoke
  npm run test:regression
  ```

- **View HTML execution report:**
  ```bash
  npm run report
  ```

---

## 📋 Test Matrix Summary

| Test ID | Module | Target App | Priority | Type | Summary |
|---|---|---|---|---|---|
| `AUT_UI_AUTH_002` | Authentication | Owner Web Portal | **P1** | Regression | Pending approval gym owner blocked from operational routes |
| `AUT_UI_AUTH_003` | Authentication | Super Admin Web | **P1** | Smoke | Gym owner credentials denied on Super Admin portal |
| `AUT_UI_GYM_001` | Gym Onboarding | Owner Web Portal | **P1** | Regression | 5-tab onboarding wizard submission with KYC documents |
| `AUT_UI_GYM_002` | Gym Onboarding | Super Admin Web | **P1** | Smoke | KYC review drawer preview, document validation & approval |
| `AUT_UI_GYM_003` | Gym Onboarding | Super Admin Web | **P1** | Regression | Action Required feedback loop and owner resubmission |
| `AUT_UI_STF_001` | Staff & Manager | Owner Web Portal | **P1** | Regression | Full-time staff staged & Part-time staff auto-approved |
| `AUT_UI_WALK_001` | Front-Desk Walk-Ins | Owner Web Portal | **P1** | Smoke | Walk-in modal phone lookup, check-in, and table refresh |
| `AUT_UI_MEM_002` | Memberships | Owner Web Portal | **P2** | Regression | Owner approves manager-staged plan switch |
| `AUT_UI_BAN_001` | Banners & Ads | Super Admin Web | **P2** | Regression | Super Admin creates priority banner with image upload |
| `AUT_UI_WALK_002` | Front-Desk Walk-Ins | Owner Web Portal | **P3** | Negative | Phone validation inline error messages and no network call |

