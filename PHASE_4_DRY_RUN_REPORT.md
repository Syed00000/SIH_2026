# JoharSetu — Phase 4 Dry-Run Readiness Validation Report

**Document**: `PHASE_4_DRY_RUN_REPORT.md`  
**Author**: Senior Staff Backend Engineer & MongoDB Database Architect  
**Status**: READ-ONLY DRY-RUN COMPLETE (No production modifications, no database writes, no schema mutations)  
**Execution Environment**: MongoDB Atlas Cluster (`joharsetu`) via Read-Only Queries  

---

## 1. Executive Summary

A comprehensive, read-only Phase 4 readiness validation was conducted across the JoharSetu codebase (Backend & Frontend) and the live MongoDB Atlas cluster. Every claim in `PHASE_3_MIGRATION_DESIGN.md` was cross-referenced with actual source code, repository implementations, controllers, and database documents.

The in-memory simulation proved that the target 13-collection model is architecturally sound and capable of **zero data loss**. However, the deep codebase trace discovered **active legacy authentication fallbacks** in `login.service.js` and **active dual-write paths** to `university_challenges` that would cause runtime failures if legacy collections were migrated or retired immediately.

In accordance with Rule 18 Stop Conditions, the final determination is:
**`BLOCKED_FOR_PHASE_4`** pending resolution of 3 specific code-level blockers.

---

## 2. Environment Safety Verification

- **Environment**: `development` / staging configuration (`.env`).
- **Cluster Target**: MongoDB Atlas ReplicaSet (SRV Protocol).
- **Database Name**: `joharsetu`.
- **Query Mode**: Strictly Read-Only (Audits and simulations executed in-memory).
- **Data Protection**: Zero mutations executed; zero documents inserted, updated, or deleted; all connection strings, tokens, and passwords masked.

---

## 3. Current Collection Inventory (Live Atlas Cluster)

| Collection Name | Document Count | Authoritative State | Phase 3 Design Target |
|---|:---:|---|---|
| `users` | 9 | Core Authentication & RBAC | Retain & Expand |
| `refreshtokens` | 1 | Active JWT Sessions | Retain |
| `admins` | 2 | Redundant Nodal/Govt Officers | Consolidate into `users.profile` |
| `universities` | 2 | Master HEI Registry | Retain |
| `industries` | 1 | Master Corporate & CSR Registry | Retain |
| `citizen_challenges` | 1 | Canonical Ground Problems | Retain (Sole Source of Truth) |
| `university_challenges` | 0 | Shadow Mirror | Dual-write target (Retire later) |
| `university_projects` | 1 | Solution Prototypes & Execution | Retain |
| `university_faculty` | 2 | Academic Faculty Profiles | Retain (Strip credentials) |
| `university_teams` | 0 | Innovation Teams | Retain (Authoritative Roster) |
| `university_partners` | 0 | Dormant Partner Table | Retire (Reads map to `industries`) |
| `university_approvals` | 1 | Budget & Prototype Proposals | Retain |
| `university_activities` | 5 | Audit & Activity Stream | Retain |
| `university_industry_requests` | 0 | CSR Partnership Proposals | Retain |
| `clarification_messages` | 0 | Real-time Audited Nodal-HEI Chat | Retain |
| `government_grant_funds` | 0 | State R&D Grant Allocations | Retain |

---

## 4. Full Legacy Dependency Matrix

| Collection | Readers (File & Method) | Writers (File & Method) | API Endpoints | Frontend Consumers | Migration Status | Hidden Risk |
|---|---|---|---|---|:---:|---|
| **`admins`** | 1. `AdminService.getAdmins`<br>2. `AdminService.getAdminById`<br>3. `login.service.js:83` (District fallback) | 1. `AdminService.createAdmin`<br>2. `AdminService.updateAdmin`<br>3. `AdminService.updateAdminStatus`<br>4. `AdminService.deleteAdmin` | `/api/v1/government/admins/*` | `AdminManagement.jsx`, `AdminDirectoryTable.jsx`, `AdminViewModal.jsx` | Blocked until district fallback is removed from `login.service.js` | Login fallback creates dependency on `Admin.findOne` |
| **`university_challenges`**| 1. `ChallengeRepository.getChallengesByUniversity` | 1. `ChallengeRepository.updateChallengeStatus`<br>2. `ChallengeRepository.assignFaculty`<br>3. `ChallengeTriageService.triageChallenge`<br>4. `project-faculty-sync.helper.js:48`<br>5. `citizenRepository.deleteById` | `/api/v1/university/challenges/*` | `UniversityDashboard.jsx`, `ChallengesTab.jsx` | Blocked until dual-writes are decommissioned | 5 active write paths will fail if collection is dropped |
| **`university_faculty`** | 1. `FacultyTeamRepository.getFacultyByUniversity`<br>2. `login.service.js:61` (Password fallback) | 1. `FacultyTeamRepository.createFaculty`<br>2. `FacultyTeamRepository.updateFaculty`<br>3. `FacultyTeamRepository.deleteFaculty`<br>4. `project-faculty-sync.helper.js:31` | `/api/v1/university/faculty/*` | `FacultyManagement.jsx`, `UniversityActionModal.jsx`, `useFacultyTeams.js` | Retained as Academic Profile; Blocked from credential stripping | Login fallback executes `bcrypt.compare` on `facDoc.passwordHash` |
| **`university_partners`** | 1. `PartnerRequestRepository.getPartnersByUniversity` (empty fallback) | None (0 active writes) | `/api/v1/university/partners` | `UniversityPartnersTab.jsx` | Ready for retirement | Zero risk; code already prefers `industries` |

---

## 5. Users & Authentication Canonical Authority Audit

### Check Results against Rule 3:
1. **Login checks `users`**: **PASS** (`userService.getUserByIdentifier` queries `users`).
2. **Password validation checks `users` only**: ⚠️ **FAIL / AUTH LEGACY DEPENDENCY FOUND** (See below).
3. **Refresh token generation uses `users._id`**: **PASS** (`tokenService.generateAndSaveRefreshToken(user.id)`).
4. **Refresh token validation uses `users._id`**: **PASS** (`storedToken.userId` verified against `userService.getUserById`).
5. **Logout/revocation uses `users._id`**: **PASS** (`tokenRepo.revokeTokensByUserId`).
6. **Admin authentication does not require `admins.passwordHash`**: **PASS** (JWT auth uses `User.passwordHash`).
7. **Faculty authentication does not require `university_faculty.passwordHash`**: ⚠️ **FAIL / AUTH LEGACY DEPENDENCY FOUND** (See below).
8. **No middleware depends on `admins` credentials**: **PASS** (`authenticate.js` uses JWT payload `sub`).
9. **No middleware depends on `university_faculty` credentials**: **PASS** (`authenticate.js` uses JWT payload `sub`).
10. **Password reset does not depend on legacy collections**: **PASS** (`PasswordService` resets `users.passwordHash`).
11. **Account suspension/blocking checks `users.accountStatus`**: **PASS** (`LoginService` and `TokenService` verify `user.accountStatus`).
12. **Role authorization checks `users.role`**: **PASS** (`authorize()` validates `req.user.role`).

### ⚠️ AUTH LEGACY DEPENDENCY FOUND (Critical Finding #1)
- **File**: [`BACKEND/src/modules/auth/application/services/login.service.js`](file:///e:/SIH_2026/BACKEND/src/modules/auth/application/services/login.service.js#L60-L76)
- **Function**: `LoginService.login()`
- **Reason**: Lines 60-76 contain explicit fallback authentication logic:
  ```javascript
  if (!isMatch && user.role === 'FACULTY') {
    const { UniversityFaculty } = await import('../../../university/infrastructure/model.js');
    const facDoc = await UniversityFaculty.findOne({ email: user.email?.toLowerCase() });
    if (facDoc?.passwordHash) {
      isMatch = await bcrypt.compare(password, facDoc.passwordHash);
      if (isMatch) {
        await this.userService.updateResetCredentials(user.id, { passwordHash: facDoc.passwordHash ... });
      }
    }
  }
  ```
- **Impact**: If `university_faculty.passwordHash` were stripped or deleted as planned in Phase 3 without first removing this code block, faculty members with legacy password hashes would fail authentication.

### ⚠️ AUTH LEGACY DEPENDENCY FOUND (Critical Finding #2)
- **File**: [`BACKEND/src/modules/auth/application/services/login.service.js`](file:///e:/SIH_2026/BACKEND/src/modules/auth/application/services/login.service.js#L83-L94)
- **Function**: `LoginService.login()`
- **Reason**: Lines 83-94 query `Admin.findOne({ email })` if `user.profile.district` is absent:
  ```javascript
  if (['NODAL', 'GOVERNMENT'].includes(user.role) && !user.profile?.district) {
    const { Admin } = await import('../../../government/admins/infrastructure/model.js');
    const adminDoc = await Admin.findOne({ email: user.email?.toLowerCase() });
    if (adminDoc?.district) {
      user.profile.district = adminDoc.district; ...
    }
  }
  ```
- **Impact**: If `admins` collection were dropped, this import and query would throw an unhandled rejection.

---

## 6. Admin Migration Readiness

- **Source Records**: 2 documents on Atlas (`ritu.verma@jh.gov.in`, `pooja@gov.in`).
- **User Record Matches**: 100% matched to existing `User` documents.
- **Field Mappings**:
  - `fullName` ➔ `users.fullName` (Direct match)
  - `username` ➔ `users.profile.username` (Mappable)
  - `email` ➔ `users.email` (Direct match)
  - `mobileNumber` ➔ `users.mobileNumber` (Direct match)
  - `role` ➔ `users.role = 'NODAL'` (Direct match)
  - `status` ➔ `users.accountStatus = 'ACTIVE'` (Direct match)
  - `district` ➔ `users.profile.district` (Direct match)
  - `assignedDepartment` ➔ `users.profile.adminDetails.assignedDepartment` (Mappable)
  - `accessLevel` ➔ `users.profile.adminDetails.accessLevel` (Mappable)
  - `primaryRole` ➔ `users.profile.adminDetails.primaryRole` (Mappable)
  - `avatarColor` ➔ `users.profile.adminDetails.avatarColor` (Mappable)
  - `dateOfJoining` ➔ `users.profile.adminDetails.dateOfJoining` (Mappable)
  - `address` ➔ `users.profile.adminDetails.address` (Mappable)
  - `employeeId` ➔ `users.profile.adminDetails.employeeId` (Mappable)
- **API DTO Contract**: `AdminManagement.jsx` expects records with `{ id, fullName, email, role, district, status, avatarColor, assignedDepartment }`. A simple DTO transformer in `AdminService` can serve this from `User.find({ role: { $in: ['NODAL', 'ADMIN'] } })` without breaking the frontend.
- **Status**: **`ADMIN_MIGRATION_READINESS = READY`** (Data mapping is 100% verified; execution blocked only by Rule 18 auth dependency).

---

## 7. Faculty Migration Readiness

- **Source Records**: 2 documents on Atlas (`binod@gmail.com`, `yumna@gmail.com`).
- **User Linkage**: Both documents have valid `userId` references matching active `User` documents (`role: 'FACULTY'`, `accountStatus: 'ACTIVE'`).
- **Academic Role**: `university_faculty` stores vital academic fields (`specialization`, `experience`, `qualification`, `researchAreas`, `activeProjects`, `completedProjects`, `currentLoad`, `availabilityStatus`, `assignedChallenges`).
- **Architectural Decision**: `university_faculty` **MUST NOT BE DELETED**. It must remain the Academic Profile collection.
- **Credential Separation**: `passwordHash` must NOT be removed from `university_faculty` until `LoginService` lines 60-76 are decommissioned and verified in production.
- **Status**: **`FACULTY_MIGRATION_READINESS = READY`** (Preserving collection as Academic Profile).

---

## 8. Challenge Single Source of Truth Audit

- **`citizen_challenges` Count**: 1 active document (`CHL-JH-2026-8544`).
- **`university_challenges` Count**: 0 documents.
- **State Fields Analysis**:
  - `citizen_challenges.status`: `'Submitted'`, `'Under Review'`, `'In Progress'`, `'Resolved'`, `'Rejected'`, `'Clarified'`, `'Accepted'`.
  - `citizen_challenges.assignedUniversity.acceptanceStatus`: `'Pending Review'`, `'Accepted'`, `'Declined'`, `'Clarified'`.
  - `university_challenges.status`: `'Review'`, `'In Progress'`, `'Accepted'`, `'Declined'`.
  - `university_challenges.actionLabel`: `'Accept / Decline'`, `'Assign Faculty'`, `'View'`.
- **Finding**: In `ChallengeRepository.getChallengesByUniversity()`, the query reads `UniversityChallenge` first, then reads `CitizenChallenge`, dedupes seen IDs, and transforms both via `formatChallengeItem()`. Because `university_challenges` has 0 documents, **100% of live UI data is already served by `CitizenChallenge`**.
- **Active Dual-Writes Discovered**:
  1. `ChallengeRepository.updateChallengeStatus` writes to `UniversityChallenge`.
  2. `ChallengeRepository.assignFaculty` writes to `UniversityChallenge`.
  3. `ChallengeTriageService.triageChallenge` lines 21-55 writes to `UniversityChallenge`.
  4. `project-faculty-sync.helper.js` line 48 writes to `UniversityChallenge`.
  5. `citizenRepository.deleteById` deletes from `UniversityChallenge`.
- **Status**: **`CHALLENGE_MIGRATION_READINESS = BLOCKED`** (Blocked until the 5 dual-write paths are redirected to `CitizenChallenge` exclusively).

---

## 9. University Tenant & Identifier Audit (High Priority)

### Live Cluster Tenant Identifiers:
1. **Ranchi University**:
   - Internal Code: `RU001`
   - AISHE Code: `U-0205`
   - Mongo ObjectId: `6a92cb179bad20d1910e74ff`
   - Short Name: `RU`
2. **Central University of Jharkhand**:
   - Internal Code: `CUJ001`
   - AISHE Code: `U-0209`
   - Mongo ObjectId: `6a93fc72805f7ff82207c32f`
   - Short Name: `CUJ`

### Critical Identifier Discrepancy Found:
- `university_faculty` documents store `universityCode = 'RU001'`.
- `citizen_challenges` stores `assignedUniversity.id = 'U-0205'`.
- `university_projects` stores `universityCode = 'U-0205'`.
- **Evaluation**: Ranchi University's faculty records use the internal code (`RU001`), while projects and challenges use the AISHE code (`U-0205`).
- **Validation of Phase 2 Fix**: The canonical resolver `findUniversityIdentity` implemented in Phase 2 correctly maps both `RU001` and `U-0205` into `validIdentifiers = ['RU001', 'U-0205', '6a92cb179bad20d1910e74ff']`, preventing cross-university data leakage.
- **Target Recommendation**: In child collections (`university_projects`, `university_faculty`, `university_teams`, `university_approvals`), backfill `universityId: ObjectId('6a92cb179bad20d1910e74ff')` as the immutable primary tenant reference while retaining `universityCode: 'RU001'` as the human-readable identifier.

---

## 10. Project Relationship Audit

- **Challenge ➔ Project Cardinality**: Exactly 1 accepted challenge creates 1 project stub in `ProjectCrudRepository.getProjectsByUniversity`.
- **Uniqueness**: `challengeId` is queried with `{ challengeId: chl.challengeId }` during upserts.
- **Reassignment Handling**: When a challenge moves from University A to University B, University A's project is soft-transferred (`status: 'Transferred'`, `isDeleted: true`), allowing University B to initialize its own active project stub.
- **Validation**: 0 orphan projects detected on Atlas; all active projects reference valid challenges.

---

## 11. Team / Project Source-of-Truth Audit

- **`university_teams`**: Authoritative store for student innovation teams.
- **`UniversityProject.teamMembers`**: Compatibility/read projection for project modal dialogs.
- **Cardinality**: Architecture supports 1:N teams per project (`teamCode` is indexed; `projectId` is non-unique).
- **Authoritative Write Path**: Established in `ProjectApprovalRepository.updateProject`: faculty submissions validate project tenant ownership, upsert into `university_teams`, and mirror the array onto `project.teamMembers`.
- **Status**: **`TEAM_SOURCE_OF_TRUTH = READY`**.

---

## 12. Industry & Partner Relationship Audit

- **`industries`**: Master corporate and CSR partner registry (1 verified document on Atlas: `Tata Steel CSR Division`, `industryId = 'IND-0001'`).
- **`university_partners`**: 0 documents on Atlas.
- **`partnerId` Clarification**: In `UniversityIndustryRequest`, `partnerId` stores the canonical string identifier `ind.industryId` (e.g. `'IND-0001'`). It does NOT store mutable partner names.
- **Status**: `university_partners` is confirmed dormant and ready for future retirement.

---

## 13. Refresh Token Audit

- **Token Count on Atlas**: 1 active token.
- **User Reference**: `userId` points to valid `User` document.
- **TTL Index**: `{ expiresAt: 1 }` with `expireAfterSeconds: 0` is verified active.
- **Compound Index**: `{ userId: 1, revoked: 1 }` is verified active.
- **Cascade Deletion**: Mongoose pre-delete hooks on `User` and `tokenRepo.deleteTokensByUserId` ensure zero orphan tokens remain after account deletion.

---

## 14. Current Index Audit

All critical query patterns are supported by verified compound indexes:
- `citizen_challenges`: `{"assignedUniversity.id": 1, "status": 1}` & `{"assignedUniversity.id": 1, "acceptanceStatus": 1}`
- `university_projects`: `{"universityCode": 1, "isDeleted": 1, "updatedAt": -1}`
- `refreshtokens`: `{"userId": 1, "revoked": 1}` & `{"expiresAt": 1}` (TTL: 0)
- `university_faculty`: `{"universityCode": 1, "email": 1}` (UNIQUE) & `{"userId": 1}`
- `university_teams`: `{"universityCode": 1, "projectId": 1}`
- `university_activities`: `{"universityCode": 1, "timestamp": -1}`
- `university_industry_requests`: `{"universityCode": 1, "partnerId": 1}`

---

## 15. Proposed Index Plan for Target Architecture

When child collections adopt `universityId` (ObjectId):
1. `university_projects`: Add `{ universityId: 1, isDeleted: 1, updatedAt: -1 }`.
2. `university_faculty`: Add `{ universityId: 1, status: 1 }`.
3. `university_teams`: Add `{ universityId: 1, projectId: 1 }`.
4. `university_activities`: Add `{ universityId: 1, timestamp: -1 }`.

---

## 16. Read-Only Integrity Check Results

Executed via [`BACKEND/scripts/readonly-integrity-audit.js`](file:///e:/SIH_2026/BACKEND/scripts/readonly-integrity-audit.js):

| # | Integrity Check Name | Status | Anomaly Count | Sanitized Details |
|---|---|:---:|:---:|---|
| 1 | `DUPLICATE_USER_IDENTITIES` | **PASS** | 0 | No duplicate emails or mobile numbers in `users` |
| 2 | `ADMIN_WITHOUT_USER` | **PASS** | 0 | 100% of admins matched to active `User` |
| 3 | `FACULTY_WITHOUT_USER` | **PASS** | 0 | 100% of faculty matched to active `User` |
| 4 | `USER_WITHOUT_PROFILE` | ⚠️ **FAIL** | 1 | **Legacy orphan user account found**: `_id: 6a94965e936e1ecfa43c085c`, `role: 'FACULTY'`, `status: 'ACTIVE'`, `createdAt: 2026-08-30`. No corresponding profile in `university_faculty`. |
| 5 | `ORPHAN_PROJECTS` | **PASS** | 0 | All projects linked to valid challenges |
| 6 | `ORPHAN_TEAMS` | **PASS** | 0 | No orphan teams |
| 7 | `TEAMS_WRONG_UNIVERSITY` | **PASS** | 0 | Team university codes match parent project codes |
| 8 | `PROJECTS_WRONG_UNIVERSITY`| **PASS** | 0 | Project university codes match assigned challenges |
| 9 | `CHALLENGES_INVALID_UNIVERSITY` | **PASS** | 0 | Assigned universities match registered HEIs |
| 10| `DUPLICATE_CHALLENGES` | **PASS** | 0 | All `challengeId`s unique |
| 11| `DUPLICATE_INDUSTRIES` | **PASS** | 0 | All `industryId`s unique |
| 12| `BROKEN_INDUSTRY_REQUESTS`| **PASS** | 0 | All requests point to valid verified industries |

---

## 17. API Compatibility Audit

Inspection of frontend consumer components (`AdminManagement.jsx`, `UniversityDashboard.jsx`, `ChallengesTab.jsx`, `UniversityPartnersTab.jsx`, `FacultyManagement.jsx`):
- **Zero Frontend Breaking Changes**: The target architecture maintains 100% DTO backward compatibility through existing helper transformers (`formatChallengeItem`, DTO builders).
- Frontend routes, payload structures, and response contracts will remain unchanged.

---

## 18. Migration Simulation Results (In-Memory Dry Run)

Executed via [`BACKEND/scripts/simulate-phase4-migration.js`](file:///e:/SIH_2026/BACKEND/scripts/simulate-phase4-migration.js):
- **Admins Migrated In-Memory**: 2 / 2 (0 conflicts, 0 unmappable fields).
- **Faculty Academic Profiles Decoupled**: 2 / 2 (0 conflicts).
- **Challenges Consolidated**: 1 / 1 (0 conflicts).
- **Industries Consolidated**: 1 / 1 (0 conflicts).
- **Expected Collection Reduction**: 16 collections ➔ 13 collections.
- **Expected Data Loss**: **0.0%**.

---

## 19. Risks Discovered During Trace

1. **Dual-Write Breakage**: If `university_challenges` is dropped before removing the 5 active write calls in `challenge.repository.js`, `challenge-triage.service.js`, and `project-faculty-sync.helper.js`, those services will throw unhandled Mongoose collection errors.
2. **Faculty Authentication Regression**: If `passwordHash` is stripped from `university_faculty` before removing the fallback in `login.service.js`, faculty login could fail if `user.passwordHash` ever diverges.
3. **Orphan User Account**: 1 orphan user account (`6a94965e936e1ecfa43c085c`, role: `FACULTY`) exists in `users` with no academic profile. It must be resolved (either profile backfilled or account deactivated) before enforcing strict 1:1 referential integrity.

---

## 20. Blockers Preventing Immediate Migration

In accordance with Rule 18, migration is currently **BLOCKED** by the following 3 code-level issues:

| Blocker # | Blocker Description | Location in Codebase | Required Resolution |
|---|---|---|---|
| **B-1** | Fallback password authentication against `UniversityFaculty` | [`BACKEND/.../login.service.js:60-76`](file:///e:/SIH_2026/BACKEND/src/modules/auth/application/services/login.service.js#L60-L76) | Remove fallback query; verify all faculty authenticate strictly against `users.passwordHash`. |
| **B-2** | Fallback district query against `Admin` collection | [`BACKEND/.../login.service.js:83-94`](file:///e:/SIH_2026/BACKEND/src/modules/auth/application/services/login.service.js#L83-L94) | Remove fallback query; ensure `user.profile.district` is populated during admin onboarding. |
| **B-3** | 5 Active dual-write paths to `UniversityChallenge` | [`challenge.repository.js:99`](file:///e:/SIH_2026/BACKEND/src/modules/university/infrastructure/repositories/challenge.repository.js#L99), [`challenge-triage.service.js:25`](file:///e:/SIH_2026/BACKEND/src/modules/citizen/application/services/challenge-triage.service.js#L25), [`project-faculty-sync.helper.js:48`](file:///e:/SIH_2026/BACKEND/src/modules/university/infrastructure/helpers/project-faculty-sync.helper.js#L48) | Decommission dual-writes so writes only target canonical `CitizenChallenge`. |

---

## 21. Required Changes Before Migration Can Proceed

Before requesting approval to execute Phase 4 data migrations:
1. **Code Edit 1**: Decommission the 2 auth fallback blocks in `login.service.js`.
2. **Code Edit 2**: Decommission the dual-write paths to `UniversityChallenge`.
3. **Data Triage**: Review orphan user `6a94965e936e1ecfa43c085c` and mark `accountStatus: 'BLOCKED'` or attach to a valid faculty profile.
4. **Validation Test**: Re-run `phase2-verification.js` and `readonly-integrity-audit.js` to verify zero blockers remain.

---

## 22. Recommended Migration Sequence (Post-Unblocking)

1. **Step 1**: Expand `users` schema with `profile.adminDetails` (Non-destructive).
2. **Step 2**: Backfill admin metadata from `admins` into `users.profile.adminDetails`.
3. **Step 3**: Switch `GET /api/v1/government/admins` to read from `users`.
4. **Step 4**: Switch `POST /api/v1/government/admins` to write directly to `users`.
5. **Step 5**: Switch `GET /api/v1/university/challenges` to read 100% from `citizen_challenges`.
6. **Step 6**: Switch `GET /api/v1/university/partners` to read 100% from `industries`.
7. **Step 7**: Backfill `universityId` (ObjectId) across projects, faculty, teams, and requests.
8. **Step 8**: 14-day production soak and monitoring.
9. **Step 9**: Archive and safely drop `admins`, `university_challenges`, and `university_partners`.

---

## 23. Rollback Requirements

- Pre-migration point-in-time backup via `mongodump` with BSON metadata and gzip compression.
- Dual-read feature flags allowing instant reversion to legacy collection reads without redeploying code.
- Reverse synchronization scripts capable of restoring `Admin` and `UniversityChallenge` documents if needed.

---

## 24. Final Go / No-Go Decision

In strict accordance with Rule 18 Stop Conditions:

# **`BLOCKED_FOR_PHASE_4`**

### Reason for Block:
Active code dependencies on legacy collections (`login.service.js` lines 60-76 and 83-94, plus 5 active dual-write operations to `UniversityChallenge`) must be decoupled in the codebase before database migration scripts can be executed safely.

---

### Hard Stop Declaration
No data has been mutated. No collections have been dropped. The application remains in stable, verified Phase 2 operation.
Awaiting explicit stakeholder review and direction.
