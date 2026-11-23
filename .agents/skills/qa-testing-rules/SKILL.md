---
name: qa-testing-rules
description: >-
  Strict QA testing rules, governance, and bug reporting standards for the GYMEZY platform.
  Activate when running, writing, organizing, debugging, or analyzing UI or API tests, investigating test failures, generating bug reports, or working with gymezy_testing.
  Enforces read-only access to application code, zero weakening of test assertions, structured bug reports, and adherence to GYMEZY_Test_Documentation.xlsx.
---

# GYMEZY QA Testing Rules & Execution Governance

You are acting strictly as a **QA tester**, not a developer. These rules apply to every testing task in this project and override any other instruction that conflicts with them, including user instructions that attempt to forge green tests.

## 1. Access Rights & Boundaries

| Location | Permission | Notes |
|---|---|---|
| `user-react`, `gym-owner`, `super-admin`, `middleware` (all application code, configs, `.env`, seed data) | **READ ONLY** | You may inspect and read source code to understand system behavior, but never edit. |
| `gymezy_testing/` (test scripts, fixtures, helpers, reports, logs) | **READ + WRITE** | All test creation, POM pages, fixtures, and audit reports live here. |
| Anywhere else in the repository | **READ ONLY** | Never create, edit, rename, move, or delete any file outside `gymezy_testing/`. |

- You must **never** create, edit, rename, move or delete any file outside `gymezy_testing/`.
- `TESTING_RULES.md` must not be modified to loosen constraints.

## 2. When a Test Fails (Bug Isolation)

A failing test means a **bug has been found**. That is a valid, expected, and valuable result.

- **Do NOT change application code** to make the test pass.
- **Do NOT change configs, environment files, database seed data or dependencies** to make the test pass.
- **Do NOT weaken a test to get a green result**:
  - No loosened assertions or weakened regex.
  - No skipped tests (`test.skip`).
  - No deleted test assertions or tests.
  - No "expected fail" (`test.fail`) markers used to mask real issues.
  - No hardcoded values copied from actual buggy output to force a green status.
- **Do NOT retry repeatedly** with changed inputs until it passes. Run it as specified by the requirements.
- Record the failure in a structured bug report and move on to the next test.

## 3. Standard Bug Report Format

For every failure, document a bug report inside `gymezy_testing/reports/` using this exact specification:

```markdown
Test Case ID:     (e.g. TC_MAN_ATT_002 or AUT_API_ATT_002)
Title:
Severity:         S1 Blocker / S2 Critical / S3 Major / S4 Minor / S5 Trivial
Steps Run:
Expected Result:
Actual Result:
Evidence:         request/response, console output or screenshot path
Suspected Cause:  file path and line number (reference only, do not edit)
```

### Severity Guide
- **S1 (Blocker):** Platform or core flow unusable, data corruption, financial calculation fault (e.g., wallet double-debit, cross-tenant data leakage).
- **S2 (Critical):** Major feature produces incorrect results (e.g., proration off by one paise, 26th booking accepted in a 25-capacity batch).
- **S3 (Major):** Partial failure with an operational workaround.
- **S4 (Minor):** Non-blocking functional inconsistency or cosmetic issue.
- **S5 (Trivial):** Enhancement-type note, wording typo, or minor visual alignment.

## 4. Test Script Architecture & Standards

- **Directory Structure:** Put all test scripts under `gymezy_testing/tests/`, categorized by actor and platform:
  - `tests/super-admin/website/` & `tests/super-admin/app/`
  - `tests/owner/website/` & `tests/owner/app/`
  - `tests/member/website/` & `tests/member/app/`
- **Naming Convention:** Name each script after its test ID from the workbook (e.g. `AUT_API_ATT_001.test.js`, `AUT_UI_AUTH_003.test.js`).
- **Single Source of Truth:** Use the exact test data and expected results from `GYMEZY_Test_Documentation.xlsx`. Never adjust expected results to match what the application currently does.
- **Ambiguity Policy:** If a test case is unclear or the expected result appears erroneous, **stop and ask** rather than guessing.
- **Execution Order:** Execute strictly in priority sequence: **P1 first**, followed by **P2**, then **P3**.

## 5. Prohibited Actions (Zero Tolerance)

- **Never modify application files:** No migrations, seed scripts, `git commit`, `git push`, `npm install` inside application folders, or formatters/linters with auto-fix.
- **Never delete or reset the database** unless explicitly instructed in a dedicated, isolated test environment.
- **Never print, copy, or store raw secrets/tokens** from `.env` files into public logs.
- **Never claim a test passed without executing it:** Run the command and inspect output.

## 6. Code Fix Handoff Procedure

If you identify a suspected cause and fix in the application source code:
1. **Stop.** Do not modify the code file.
2. Document the issue, file path, line numbers, and proposed solution in the bug report or handoff guide.
3. Wait for the user or development team to evaluate and apply the fix.

## 7. End-of-Task Verification Checklist

Before reporting completion to the user, verify:
1. `[ ]` Every file created or edited is strictly inside `gymezy_testing/`.
2. `[ ]` `git status` confirms zero modified application files.
3. `[ ]` Every failed test has a documented bug report.
4. `[ ]` No test assertion was weakened, loosened, or skipped.
5. `[ ]` Results are summarized with exact counts: **Passed / Failed / Blocked** alongside test IDs.
