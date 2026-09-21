# Module 03: Domain Entities

> **Module Path:** `src/entities/`  
> **Type:** Domain Models & Enterprise Business Rules Layer  
> **Key Technologies:** Pure Domain-Driven Design (DDD), RBAC Permission Checking, Pure Utility Functions

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module pure enterprise ka core business truth represent karta hai. Kisi bhi ERP ya societal governance system me user roles, permissions aur business models ko UI components me hardcode karne se security vulnerabilities aur architectural chaos ban jata hai. Is module ka kaam pooray frontend ke liye Role Enums, Action Permissions, aur Authorization validation functions (`hasRole`, `hasPermission`) provide karna hai.

---

## 2. Directory Structure & Files

```
src/entities/
└── user/
    ├── index.js          # Core User entity, Roles Enum, Permissions Enum & helpers
    └── index.test.js     # Unit tests for domain models & permission functions
```

---

## 3. Detailed Breakdown & Business Rules

### 3.1 Roles Enumeration (`ROLES`)
System me 11 standard enterprise actor roles defined hain:
```javascript
export const ROLES = {
  USER: 'user',                        // Basic citizen or student
  STAFF: 'staff',                      // Operational administrative staff
  UNIVERSITY_ADMIN: 'university_admin',// HEI Nodal Officer / Institutional Dean
  ADMIN: 'admin',                      // District Nodal Officer / Ministry Admin
  SUPER_ADMIN: 'super_admin',          // State IT Cell / Apex Director
};
```
*(Application router level par CITIZEN, UNIVERSITY, FACULTY, NODAL, GOVERNMENT, DEPARTMENT, BLOCK, WARD, TECHNICIAN, BUDGET_OFFICER, aur INDUSTRY roles ke mapped access codes ko manage karta hai).*

### 3.2 Granular Permissions Enumeration (`PERMISSIONS`)
Feature actions ke liye standardized action keys:
```javascript
export const PERMISSIONS = {
  REVIEW_PROBLEMS: 'review_problems',      // Grassroots problems ko screen aur triage karna
  ROUTE_PROBLEMS: 'route_problems',        // Problems ko right university ya department me assign karna
  RESOLVE_PROBLEMS: 'resolve_problems',    // Problem ko officially resolved mark karna
  MANAGE_SYSTEM: 'manage_system',          // System configurations aur credentials create karna
  MANAGE_UNIVERSITY: 'manage_university',  // Institutional profiles aur faculty verify karna
};
```

### 3.3 Role-Permission Mapping Matrix
```javascript
const ROLE_PERMISSIONS = {
  [ROLES.USER]: [],
  [ROLES.STAFF]: [PERMISSIONS.RESOLVE_PROBLEMS],
  [ROLES.UNIVERSITY_ADMIN]: [PERMISSIONS.ROUTE_PROBLEMS, PERMISSIONS.RESOLVE_PROBLEMS],
  [ROLES.ADMIN]: [PERMISSIONS.REVIEW_PROBLEMS, PERMISSIONS.ROUTE_PROBLEMS, PERMISSIONS.RESOLVE_PROBLEMS],
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.REVIEW_PROBLEMS,
    PERMISSIONS.ROUTE_PROBLEMS,
    PERMISSIONS.RESOLVE_PROBLEMS,
    PERMISSIONS.MANAGE_SYSTEM,
    PERMISSIONS.MANAGE_UNIVERSITY,
  ],
};
```

### 3.4 Entity Helper Functions
1. **`formatFullName(user)`:**
   - User object me se `firstName` aur `lastName` ko sanitize karke clean full name string return karta hai.
2. **`hasPermission(user, permission)`:**
   - Check karta hai ki user ke paas required permission flag active hai ya nahi:
     ```javascript
     if (!user || !user.role) return false;
     const permissions = ROLE_PERMISSIONS[user.role] || [];
     return permissions.includes(permission);
     ```
3. **`hasRole(user, allowedRoles)`:**
   - Single string ya array of roles ko accept karke verify karta hai ki current user authorized hai ya nahi.

---

## 4. Architectural Dependency Rules
- `src/entities` independent layer hai. Ye `shared`, `features`, ya `app` ko import **nahi** karti.
- Isse clean testability milti hai (`index.test.js` bina DOM ya API mock kiye unit test ho sakta hai).
