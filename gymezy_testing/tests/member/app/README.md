# Member Mobile Application Automation (Upcoming)

**Target Application:** GYMEZY Member React Native Mobile App (`mobile-application/user-react`)  
**Framework:** Detox (End-to-End Mobile Automation)  
**Reference Document:** `GYMEZY_Test_Documentation.xlsx` (Sheet: `UI_Automation_Cases`)

---

## 📱 Upcoming Member App Test Cases

| Automation ID | Module | Priority | Description | Key Target Selectors |
| :--- | :--- | :---: | :--- | :--- |
| **`AUT_UI_AUTH_001`** | Authentication | **P1** | **Google SSO Stub**: Member signs in via Google SSO and lands on Discover feed. | `testID=btn-google-signin`<br>`testID=tab-discover`<br>`text='Priya Raman'` |
| **`AUT_UI_MEM_001`** | Memberships | **P1** | **Plan Switch Preview**: Switch plan preview calculates and shows proration quote. | `testID=btn-switch-plan`<br>`testID=proration-quote-card`<br>`testID=net-payable-amount` |
| **`AUT_UI_SES_001`** | Sessions & Classes | **P1** | **3-Step Funnel**: SessionBookingFlow with date, time-slot, and trainer selection. | `testID=trainer-card`<br>`testID=slot-pill`<br>`testID=btn-confirm-session` |
| **`AUT_UI_SES_002`** | Sessions & Classes | **P2** | **Capacity Cap**: Full group class shows disabled join button and waitlist CTA. | `testID=class-card-full`<br>`testID=badge-sold-out`<br>`testID=btn-join-waitlist` |
| **`AUT_UI_WAL_001`** | Wallet & Payments | **P1** | **Split-Payment**: Wallet toggle deducts available balance and recalculates gateway amount. | `testID=toggle-use-wallet`<br>`testID=wallet-deduction`<br>`testID=gateway-amount` |
| **`AUT_UI_WAL_002`** | Wallet & Payments | **P1** | **Cross-Tenant Lock**: Gym B checkout shows 0 usable balance from Gym A wallet. | `testID=wallet-balance-display`<br>`testID=incompatible-wallet-hint` |
| **`AUT_UI_ATT_001`** | Attendance | **P1** | **Digital Pass Card**: Dynamic QR code re-generates every 30 seconds with biometric unlock. | `testID=pass-card-qr`<br>`testID=qr-timer-countdown`<br>`testID=btn-unmask-qr` |
| **`AUT_UI_BAN_002`** | Banners & Ads | **P2** | **Home Carousel**: Carousel displays priority promotional banners before proximity banners. | `testID=banner-carousel`<br>`testID=priority-banner-slide`<br>`testID=banner-gym-chip` |
