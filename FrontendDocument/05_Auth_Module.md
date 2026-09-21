# Module 05: Authentication & Identity Management

> **Module Path:** `src/features/auth/`  
> **Type:** User Authentication, Role-Based Onboarding, Session Management  
> **Key Technologies:** **Zod** (`^4.4.3`), React Hook Form, Context API, Axios/Fetch Client

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module user identity verification, multi-role registration (Citizen, University, Industry), login authentication, email OTP verification, aur password lifecycle management handle karta hai. Iska sabse critical kaam login ke baad user ke role aur jurisdiction (deptId, wardId, blockId, technicianId) ke base par use uske specific portal par route karna hai.

---

## 2. Directory Structure & Files

```
src/features/auth/
├── api.js                                     # Auth API endpoints (login, register, refresh, logout)
├── AuthContext.jsx                            # React context maintaining session & tokens
├── hooks.js                                   # Custom query hooks
├── index.js                                   # Public API export barrel
├── schemas.js                                 # Zod validation schemas
├── useAuth.js                                 # Hook helper for AuthContext
└── components/
    ├── ForgotPassword.jsx                     # Password recovery request form
    ├── IndustryRegistration/                  # Multi-section industrial partner application
    │   ├── IndustryAddressSection.jsx
    │   ├── IndustryContactSection.jsx
    │   ├── IndustryDomainSupportSection.jsx
    │   ├── IndustryHeaderNotice.jsx
    │   ├── IndustryOrgDetailsSection.jsx
    │   ├── IndustryRegistrationPage.jsx
    │   ├── IndustrySuccessScreen.jsx
    │   ├── industryRegistrationConstants.js
    │   └── useIndustryRegistration.js
    ├── Login/                                 # Secure login card & subcomponents
    │   ├── LoginForm.jsx
    │   ├── LoginFormCard.jsx
    │   ├── LoginHeroBanner.jsx
    │   ├── LoginSidebars.jsx
    │   ├── loginHelpers.js                    # Role-based route dispatcher & error parser
    │   └── useLoginForm.js                    # Login form state & validation hook
    ├── Register/                              # 4-Step Stepper registration
    │   ├── RegisterCitizenFields.jsx          # District, Block, Panchayat selectors
    │   ├── RegisterForm.jsx                   # Master registration container
    │   ├── RegisterIndustryFields.jsx         # CIN, GSTIN, NGO-Darpan, CSR sectors
    │   ├── RegisterStepAccount.jsx            # Name, Mobile, Email, Password
    │   ├── RegisterStepReview.jsx             # Final data summary & confirmation
    │   ├── RegisterStepRole.jsx               # Role selection cards
    │   ├── RegisterStepRoleDetails.jsx        # Role details dispatcher
    │   ├── RegisterStepTerms.jsx              # Legal terms & conditions
    │   ├── RegisterStepper.jsx                # Step nodes progress indicator
    │   ├── RegisterUniversityFields.jsx       # AISHE code, Dean designation, Domains
    │   └── registerConstants.js               # 24 Jharkhand districts & sub-division datasets
    ├── ResetPassword.jsx                      # Set new password form with token validation
    └── VerifyEmail.jsx                        # 6-digit OTP email verification screen
```

---

## 3. Specialized Technologies & Schema Validation

### 3.1 Zod Validation Schemas (`schemas.js`)
- **`loginSchema`:**
  - `email`: Required, valid email string format.
  - `password`: Required, minimum 6 characters.
- **`registerSchema`:**
  - `firstName` & `lastName`: Required, min 2 characters, max 50 characters.
  - `email`: Valid email syntax check.
  - `password`: Minimum 8 characters constraint synchronized with backend security policies.

### 3.2 Role-Based Navigation Engine (`Login/loginHelpers.js`)
Login successful hone par API se prapt `user.role` ke base par `navigateByRole()` user ko appropriate destination par bhejta hai:
```javascript
export const navigateByRole = (loggedUser, onNavigate) => {
  const role = (loggedUser?.role || '').toUpperCase();
  if (role === 'DEPARTMENT' || loggedUser?.deptId) return goTo('/department', { deptId: targetId });
  if (role === 'WARD' || loggedUser?.wardId) return goTo('/ward', { wardId: targetId });
  if (role === 'BLOCK' || loggedUser?.blockId) return goTo('/block', { blockId: targetId });
  if (role === 'TECHNICIAN' || loggedUser?.technicianId) return goTo('/technician', { techId: targetId });
  if (role === 'BUDGET_OFFICER') return goTo('/budget-officer');
  if (role === 'FACULTY') return goTo('/faculty');
  if (role === 'UNIVERSITY' || role === 'HEI') return goTo('/university');
  if (role === 'NODAL') return goTo('/nodal');
  if (role === 'INDUSTRY') return goTo('/industry-portal');
  if (role === 'CITIZEN' || role === 'USER') return goTo('/citizen');
  if (role === 'GOVERNMENT' || role === 'ADMIN' || role === 'SUPER_ADMIN') return goTo('/government');
  return goTo('/dashboard');
};
```

### 3.3 Multi-Step Registration System (`Register/RegisterForm.jsx`)
- **Step 1 (Select Role):** Citizen (Grassroots problem reporting), University / HEI (Research & academic R&D), Corporate Industry (CSR sponsorship & lab testing).
- **Step 2 (Account Setup):** Full Name, Indian 10-digit Mobile (`/^[6-9]\d{9}$/`), Email, Password with dynamic visual strength meter (`getPasswordStrength`: Weak, Medium, Strong).
- **Step 3 (Jurisdiction & Institutional Details):**
  - *Citizen:* Dropdown with all **24 Jharkhand Districts** (Ranchi, Dhanbad, East Singhbhum, Bokaro, Hazaribagh, Deoghar, etc.) aur unke specific Blocks/ULBs and Panchayats/Wards (`registerConstants.js`).
  - *University:* AISHE Code, Institution Name, Institution Type (State, Central, Deemed, Private, IIT/NIT), Academic Focus Domains (AI, Water, Infrastructure, Agriculture, Healthcare, Clean Energy).
  - *Industry:* Organization Name, Entity Type (Corporate, PSU, NGO Foundation, Industry Association), CIN, GSTIN, CSR Support Sectors.
- **Step 4 (Review & Legal Terms):** Summary confirmation, terms acceptance, and submission.

### 3.4 Email Verification & Recovery Workflows
- **`VerifyEmail.jsx`:** 6-digit OTP verification code screen. Unverified users ko login karne par automatic yaha redirect kiya jata hai.
- **`ForgotPassword.jsx` & `ResetPassword.jsx`:** Password recovery via secure time-limited tokens.
