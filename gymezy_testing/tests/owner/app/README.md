# Owner Mobile Scanner App Automation (Upcoming)

**Target Application:** Owner / Trainer Scanner Application  
**Framework:** Appium / WebdriverIO  
**Reference Document:** `GYMEZY_Test_Documentation.xlsx` (Sheet: `UI_Automation_Cases`)

---

## 📱 Upcoming Mobile Test Cases

| Automation ID | Module | Priority | Description | Key Target Selectors |
| :--- | :--- | :---: | :--- | :--- |
| **`AUT_UI_ATT_002`** | Attendance & Turnstiles | **P1** | **Scanner state verification**: Scanner detects dynamic QR and displays green check-in indicator, cooldown warning on repeat, and checkout on exit. | `~camera-preview`<br>`~scanner-status-badge`<br>`~member-name-text` |
| **`AUT_UI_ATT_003`** | Attendance & Turnstiles | **P2** | **Manual 6-Digit OTP Fallback**: Owner/desk manually enters 6-digit member OTP when scanner camera fails; verifies valid OTP check-in and expired rejection. | `~otp-input-field`<br>`~btn-verify-otp`<br>`~toast-checkin-success` |

---

## 🛠️ Execution Prerequisites
1. Connected Android / iOS physical device or simulator running the Owner Scanner APK/build.
2. Appium server running at `http://localhost:4723`.
3. Pre-seeded gym scanner credentials for Super Max Gym (`super@gmail.com`).
