# JoharSetu Frontend

JoharSetu portal ka React SPA frontend application hai. Isme clean Light Mode styling, Protected Route guards, 5-Step Registration Wizard, aur Single Role-Aware User Dashboard implemented hai.

---

## 1. Quick Start Setup

1. Install Dependencies:
```bash
npm install
```

2. Run Development Server:
```bash
npm run dev
```

3. Production Build Compilation:
```bash
npm run build
```

---

## 2. Theme & Design System (`src/index.css`)

- **Color Palette**:
  - Background: `#f8fafc` (Soft Off-White)
  - Container/Cards: `#ffffff` (Pure Crisp White)
  - Borders: `#e2e8f0` (Light Slate Border)
  - Text Primary: `#0f172a` (Dark Slate Text)
  - Text Secondary: `#64748b` (Muted Slate)
  - Primary Action Button: `#2563eb` (Royal Blue)
- **UI Constraints**: Dark mode, heavy AI gradients, aur arbitrary glowing slopes disabled hain. UI clean, sharp, aur responsive hai.

---

## 3. Protected Routing & Navigation Guards (`src/app/router.jsx`)

Router user ke authentication state (`AuthContext`) ko observe karke automatic navigation handle karta hai:

### Guest Route Guards (`/login`, `/register`, `/forgot-password`, `/reset-password`)
- Agar user already authenticated (`isAuthenticated === true`) hai, to login/register routes par jane par router use seedhe `/dashboard` par redirect kar deta hai. Bina logout kiye login screen open nahi ho sakti.

### Protected Route Guards (`/dashboard`, `/profile`, `/settings`, `/`)
- Agar user authenticated nahi hai (`isAuthenticated === false`), to dashboard ya profile access karne par router user ko seedhe `/login` page par bhej deta hai.

---

## 4. Public Auth Screens

### 1. Login Page (`src/features/auth/components/LoginForm.jsx`)
- **Fields**: Email Address, Password (with Show/Hide toggle button), Remember Me checkbox.
- **Validation**: Required field checks, inline error alert, loading spinner state (`Signing in...`).
- **Error Handling**: Agar backend `EMAIL_NOT_VERIFIED` error return karta hai, to form user ko auto-redirect karke `/verify-email` page par bhej deta hai.

### 2. Multi-Step Registration Wizard (`src/features/auth/components/RegisterForm.jsx`)
Registration 5-step wizard me divided hai:
- **Step 1 (Select Role)**: Role selection cards (`CITIZEN`, `UNIVERSITY / HEI`, `INDUSTRY / CSR`). Role change karne par previous role data clear ho jata hai.
- **Step 2 (Basic Info)**: Full Name, 10-digit Indian Mobile Number, Email, Password, Confirm Password, aur Password Strength Bar (Weak / Medium / Strong).
- **Step 3 (Role Details)**:
  - Citizen: District dropdown, Block/ULB dropdown (cascading), Panchayat/Ward, Preferred Language.
  - University: Institution Name, AISHE Code, Registration Number, Institution Type, Nodal Officer Designation, Academic Focus Domains (multi-select pill toggles).
  - Industry: Organization Name, Entity Type, CIN / GSTIN / NGO Darpan, Primary Contact Designation, Support Sectors (multi-select pill toggles).
- **Step 4 (Review)**: Summary view with section-wise Edit controls.
- **Step 5 (Terms & Submit)**: Mandatory confirmation checkbox & Create Account button.

### 3. Email OTP Verification Screen (`src/features/auth/components/VerifyEmail.jsx`)
- **Features**: Masked email display (`r***@gmail.com`), 6 individual digit inputs with auto-focus, paste OTP support, backspace navigation, 05:00 countdown timer, aur Resend OTP button.

### 4. Forgot & Reset Password Screens (`ForgotPassword.jsx` & `ResetPassword.jsx`)
- `/forgot-password`: Registered email input & reset OTP request.
- `/reset-password`: Email, 6-digit OTP code, New Password (with strength indicator), Confirm New Password.

---

## 5. Single Shared User Dashboard (`src/features/dashboard/components/DashboardContainer.jsx`)

Dashboard Citizen, University, aur Industry sabhi problem senders ke liye single common dashboard hai:

- **Sidebar Navigation**: JoharSetu logo, User name badge with role tag (`CITIZEN`, `UNIVERSITY`, `INDUSTRY`), navigation links (Dashboard Overview, My Profile, My Challenges, Notifications, Account Settings), Sign Out button.
- **Email Verification Warning Bar**: Unverified users ke liye top alert bar with direct `Verify Email` button.
- **Overview Tab**: Welcome header, stat counters (Submitted, In Review, Solved), Quick Profile summary card, My Challenges empty state placeholder.
- **Role Profile Component (`RoleProfile.jsx`)**: `GET /api/v1/auth/me` endpoint se return hone wale stored profile document ke basis par role-specific details render karta hai.
- **Account Settings (`AccountSettings.jsx`)**: Account status badge, Email verification status, Mobile number, aur Change Password form.

---

## 6. API Client & Token Persistence (`src/infrastructure/api/client.js`)

- `localStorage` me `joharsetu_token` key ke under JWT access token persist hota hai.
- Outgoing API requests me `Authorization: Bearer <accessToken>` header automatically attached hota hai.
- HTTP 401 Unauthorized errors catch hone par automatic session cleanup aur login redirect execute hota hai.
