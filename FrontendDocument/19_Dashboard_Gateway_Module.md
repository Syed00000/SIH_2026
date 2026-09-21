# Module 19: Unified Authenticated Dashboard Gateway

> **Module Path:** `src/features/dashboard/`  
> **Type:** Central Session Gateway, Role Dispatcher & Accessibility Preference Hub  
> **Key Technologies:** Role-Based Route Forwarding, Global Font Size Scaling, Language Preference Controls

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module authenticated session ka master gateway hai. Jab koi user login karke root portal URL (`/` ya `/dashboard`) par land karta hai, ye module uske session aur role ko verify karta hai. Agar user ke paas koi specific role hai (jaise CITIZEN, UNIVERSITY, FACULTY, NODAL, GOVERNMENT, DEPARTMENT, BLOCK, WARD, TECHNICIAN, ya BUDGET_OFFICER), to ye use unke dedicated portal par forward karta hai. Sath hi ye Industry users ke liye embedded dashboard render karta hai aur portal-wide accessibility preferences (font scaling, language selection) provide karta hai.

---

## 2. Directory Structure & Files

```
src/features/dashboard/
├── index.js                                   # Barrel export
└── components/
    ├── AccountSettings.jsx                    # User credentials & notification preferences
    ├── DashboardContainer.jsx                 # Master session orchestrator & role router
    ├── RoleProfile.jsx                        # Institutional identity & jurisdiction badges
    ├── citizen/                               # Fallback citizen dashboard cards
    ├── footer/                                # Authenticated session footer
    ├── header/                                # Government header with language & font toggles
    └── sidebar/                               # Universal collapsible dashboard sidebar
```

---

## 3. Sub-Components & Core Functionality

### 3.1 `DashboardContainer.jsx` (Central Role Router)
- **Role Forwarding Guard:**
  - Jab koi logged-in user generic `/dashboard` ya `/` par visit karta hai, ye component use immediately unke specialized portal par push karta hai:
    - `DEPARTMENT` $\rightarrow$ `/department`
    - `WARD` $\rightarrow$ `/ward`
    - `BLOCK` $\rightarrow$ `/block`
    - `TECHNICIAN` $\rightarrow$ `/technician`
    - `BUDGET_OFFICER` $\rightarrow$ `/budget-officer`
    - `NODAL` $\rightarrow$ `/nodal`
    - `FACULTY` $\rightarrow$ `/faculty`
    - `UNIVERSITY` / `HEI` $\rightarrow$ `/university`
    - `GOVERNMENT` / `ADMIN` / `SUPER_ADMIN` $\rightarrow$ `/government`
    - `CITIZEN` / `USER` $\rightarrow$ `/citizen`
- **Industry Portal Host:**
  - Agar user role `INDUSTRY` hai, to ye dedicated `IndustrySidebar` aur `IndustryDashboard` ko directly embed karke session render karta hai.

### 3.2 Accessibility Preferences Engine (`header/DashboardHeader.jsx`)
- **Global Font Size Scaler:**
  - Options: `small` (`text-xs`), `normal` (`text-sm`), `large` (`text-base`).
  - Container-level class dynamic injection se pooray dashboard ke labels, cards aur tables instantaneously resize ho jate hain.
- **Language Preference Switcher:**
  - Toggle between **English** aur **Hindi** (हिंदी).

### 3.3 Account & Security Settings (`AccountSettings.jsx`)
- Email verification alert banner if email is unverified.
- Change password form with current password validation.
- Notification preferences toggle (SMS alerts, Email notifications, System audit logs).

### 3.4 Role Profile & Jurisdiction Badges (`RoleProfile.jsx`)
- Displays:
  - User Full Name and Official Role Badge.
  - Assigned Institution (e.g. Ranchi University) or Department (Drinking Water & Sanitation).
  - Geographic Jurisdiction: District, Block, and Ward tags.
  - Session Security: Last active timestamp and authentication strength.
