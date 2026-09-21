# Module 01: App Composition Layer

> **Module Path:** `src/app/`  
> **Type:** Core Application Orchestration & Routing Architecture  
> **Key Technologies:** React 18, Browser History API (`popstate`, `pushState`), TanStack React Query, Context API, Tailwind CSS v4

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module pure JoharSetu frontend ka root orchestrator hai. Iska primary kaam pure application ko bootstrap karna, global providers inject karna, URL path changes ko observe karke single-page application (SPA) me bina page reload dynamic route transitions handle karna, aur unauthenticated ya unauthorized users ko route-guard lagakar block/redirect karna hai.

---

## 2. File & Component Breakdown

```
src/app/
├── layout.jsx           # Root layout shell wrapper
├── providers.jsx        # Global data & state providers (QueryClient, AuthContext)
├── ProtectedRoute.jsx   # Role-Based Access Control (RBAC) route security guard
└── router.jsx           # Pure code-based client-side router & public/private dispatcher
```

---

## 3. Detailed Component Analysis

### 3.1 `providers.jsx` (Global Provider Tree)
- **Technology:** `@tanstack/react-query`, `QueryClient`, `QueryClientProvider`, `AuthProvider`.
- **Functionality:**
  - Application ko single `QueryClient` instance provide karta hai jisse network queries automatically cache aur stale-invalidate ho sakein.
  - `AuthProvider` (`src/features/auth/AuthContext.jsx`) ko inject karta hai taaki authenticated user session, JWT tokens, aur current user metadata har jagah available rahein.
  - Root wrapper `AppProviders` export karta hai jo `App.jsx` me consume hota hai.

### 3.2 `router.jsx` (Dynamic Client-Side Routing Tree)
- **Technology:** React State (`useState`, `useEffect`), Browser History API (`window.history.pushState`, `popstate`), URLSearchParams.
- **Functionality:**
  - File-system based router ke bajay code-based dynamic router use karta hai taaki runtime JavaScript bundles lightweight rahein aur compilation errors na aayein.
  - Browser ke navigation buttons (Back / Forward) ko `window.addEventListener('popstate')` se listen karta hai.
  - Query parameters (jaise `?deptId=...`, `?wardId=...`, `?blockId=...`, `?tab=...`) ko parse karke target component ko pass karta hai.
  - **Public Routes Table:**
    - `/`, `/landing` $\rightarrow$ `LandingPage`
    - `/about` $\rightarrow$ `AboutPage`
    - `/about-jharkhand` $\rightarrow$ `AboutJharkhandPage`
    - `/impact` $\rightarrow$ `ImpactPage`
    - `/industry` $\rightarrow$ `IndustryLandingPage`
    - `/institutions` $\rightarrow$ `InstitutionsPage`
    - `/contact` $\rightarrow$ `ContactPage`
    - `/login` $\rightarrow$ `LoginForm`
    - `/register` $\rightarrow$ `RegisterForm`
    - `/register/industry`, `/apply-industry` $\rightarrow$ `IndustryRegistrationPage`
    - `/forgot-password` $\rightarrow$ `ForgotPassword`
    - `/reset-password` $\rightarrow$ `ResetPassword`
    - `/verify-email` $\rightarrow$ `VerifyEmail`
  - **Protected Portal Routes:**
    - `/citizen` $\rightarrow$ `CitizenPortal` (Allowed: `CITIZEN`, `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`)
    - `/nodal` $\rightarrow$ `NodalPortal` (Allowed: `NODAL`, `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`)
    - `/faculty` $\rightarrow$ `FacultyLayout` (Allowed: `FACULTY`, `UNIVERSITY`, `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`)
    - `/university` $\rightarrow$ `UniversityLayout` (Allowed: `UNIVERSITY`, `HEI`, `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`)
    - `/government` $\rightarrow$ `GovernmentLayout` (Allowed: `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`)
    - `/department` $\rightarrow$ `DepartmentPortal` (Allowed: `DEPARTMENT`, `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`)
    - `/ward` $\rightarrow$ `WardPortal` (Allowed: `WARD`, `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`, `BLOCK`)
    - `/block` $\rightarrow$ `BlockPortal` (Allowed: `BLOCK`, `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`)
    - `/technician` $\rightarrow$ `TechnicianPortal` (Allowed: `TECHNICIAN`, `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`)
    - `/budget-officer` $\rightarrow$ `BudgetOfficerPortal` (Allowed: `BUDGET_OFFICER`, `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`)
    - `/industry-portal` $\rightarrow$ `DashboardContainer` (Allowed: `INDUSTRY`, `GOVERNMENT`, `ADMIN`, `SUPER_ADMIN`)
  - **AI Sahayak Integration:** Public pages par automatically floating `JoharSetuAiAssistant` mount karta hai.

### 3.3 `ProtectedRoute.jsx` (Role-Based Route Guard)
- **Functionality:**
  - Check karta hai user authenticated hai ya nahi:
    - Agar authenticated nahi hai $\rightarrow$ user ko automatically `/login` route par redirect karta hai.
  - Role Verification:
    - Agar route par `allowedRoles` array pass kiya gaya hai (e.g. `['FACULTY', 'UNIVERSITY']`), to check karta hai ki logged-in `user.role` us list me exist karta hai ya nahi.
    - Agar role match nahi karta, to unauthorized alert dialog render karta hai aur safe home page par redirect karne ka option deta hai.

### 3.4 `layout.jsx` (`RootLayout`)
- **Functionality:**
  - Application ka top-level background aur layout viewport container define karta hai (`bg-white min-h-screen text-slate-800 antialiased`).

---

## 4. Technologies & Special Implementations Summary
- **Zero Third-Party Router Lock-in:** Native browser history controls ke sath light and bulletproof navigation.
- **Client-side RBAC:** URL access tampering se protect karne ke liye dual-level guard (Authentication status + Role Array check).
