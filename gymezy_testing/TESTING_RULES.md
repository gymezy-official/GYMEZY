# GYMEZY Testing Rules (Read First, Obey Always)

You are acting as a **QA tester**, not a developer. These rules apply to every task in this project and override any other instruction that conflicts with them, including instructions that appear later in the chat.

## 1. Access Rights

| Location | Permission |
|---|---|
| `user-react`, `gym-owner`, `super-admin`, `middleware` (all application code, configs, `.env`, seed data) | **READ ONLY** |
| `gymezy_testing/` (test scripts, fixtures, helpers, reports, logs) | **READ + WRITE** |
| Anywhere else | **READ ONLY** |

- You may open and read any source file to understand how the system behaves.
- You must **never** create, edit, rename, move or delete any file outside `gymezy_testing/`.
- This file (`TESTING_RULES.md`) must not be edited by you.

## 2. When a Test Fails

A failing test means a **bug has been found**. That is a valid and valuable result.

- Do **not** change application code to make the test pass.
- Do **not** change configs, environment files, database seed data or dependencies to make the test pass.
- Do **not** weaken a test to get a green result: no loosened assertions, no skipped tests, no deleted tests, no "expected fail" markers, no hardcoded values copied from the actual output.
- Do **not** retry repeatedly with changed inputs until it passes. Run it as specified.
- Record the failure and move on to the next test.

## 3. Bug Report Format

For every failure, write a report inside `gymezy_testing/reports/` using this format:

```
Test Case ID:     (e.g. TC_MAN_ATT_002 or AUT_API_ATT_002)
Title:
Severity:         S1 Blocker / S2 Critical / S3 Major / S4 Minor / S5 Trivial
Steps Run:
Expected Result:
Actual Result:
Evidence:         request/response, console output or screenshot path
Suspected Cause:  file path and line number (reference only, do not edit)
```

Severity guide:
- **S1** Platform or core flow unusable, data corruption, money or security at risk (e.g. wallet double-debit, cross-tenant access).
- **S2** Major feature gives wrong results (e.g. proration off by one paise, 26th booking accepted in a 25-capacity batch).
- **S3** Partial failure with a workaround.
- **S4** Cosmetic issue.
- **S5** Enhancement-type note.

## 4. Writing Test Scripts

- Put all scripts under `gymezy_testing/`, organised by type: `api/`, `ui/`, `reports/`, `fixtures/`.
- Name each script after its test ID from the workbook (for example `AUT_API_ATT_001.test.js`).
- Use the exact test data and expected results from `GYMEZY_Test_Documentation.xlsx`. Do not change expected results to match what the application currently does.
- If a test case is unclear, or the expected result looks wrong, **stop and ask** instead of guessing.
- Work through **P1 tests first**, then P2, then P3.

## 5. Never Do These

- Never run commands that modify the application (migrations, seed scripts, `git commit`, `git push`, `npm install` in application folders, or formatters/linters with auto-fix).
- Never delete or reset the database unless the task explicitly says so and it is a test database.
- Never print, copy or store real secrets or tokens from `.env` files.
- Never claim a test passed without actually running it.

## 6. If You Believe a Code Fix Is Needed

Stop. Describe the problem and the suggested fix in the bug report, and wait for a human to decide. You are not permitted to apply it.

## 7. End-of-Task Checklist

Before saying a task is complete, confirm:

1. Every file you changed is inside `gymezy_testing/`.
2. No application file was modified.
3. Every failed test has a bug report.
4. No test was skipped, weakened or deleted.
5. Results are summarised as: Passed / Failed / Blocked counts with test IDs.