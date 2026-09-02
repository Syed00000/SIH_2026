# JoharSetu — Phase 4 Migration Execution Checklist

**Document**: `BACKEND/PHASE_4_MIGRATION_EXECUTION_CHECKLIST.md`  
**Author**: Senior Staff Backend Engineer & MongoDB Database Architect  
**Status**: STANDING OPERATING PROCEDURE (Pending Explicit Execution Authorization)  
**Prerequisites**: Pre-Migration Gate Passed (`GO_FOR_PHASE_4_MIGRATION`)  

---

## Controlled Execution Phasing (Expand-and-Contract)

```
[ Gate 0: Verified GO_FOR_PHASE_4_MIGRATION ]
                      │
                      ▼
[ Phase 4.1: Pre-Migration Full Snapshot (mongodump) ]
                      │
                      ▼
[ Phase 4.2: Target Schema Expansion (users.profile.adminDetails) ]
                      │
                      ▼
[ Phase 4.3: Idempotent Admin Data Backfill into users ]
                      │
                      ▼
[ Phase 4.4: Dual-Read Shadow Verification ]
                      │
                      ▼
[ Phase 4.5: Switch Reads to Canonical Entities ]
                      │
                      ▼
[ Phase 4.6: Switch Writes to Canonical Entities ]
                      │
                      ▼
[ Phase 4.7: 14-Day Production Soak & Monitoring ]
                      │
                      ▼
[ Phase 4.8: Cold Storage Archive of Legacy Collections ]
                      │
                      ▼
[ Phase 4.9: Controlled Legacy Collection Drop (admins, university_challenges, university_partners) ]
```

---

## Step-by-Step Execution Gates

### Gate 4.1: Pre-Migration Full Snapshot
- [ ] Run automated `mongodump` with `--gzip` on Atlas cluster.
- [ ] Verify BSON archive checksum and document counts.
- [ ] Store snapshot in secure pre-migration backup directory.

### Gate 4.2: Target Schema Expansion
- [ ] Register `users.profile.adminDetails` schema fields in `users/infrastructure/model.js` (Non-breaking addition).
- [ ] Verify existing users load without validation errors.

### Gate 4.3: Idempotent Admin Data Backfill
- [ ] Execute idempotent backfill script mapping `admins` attributes (`assignedDepartment`, `accessLevel`, `primaryRole`, `avatarColor`, `dateOfJoining`, `address`, `employeeId`) into `users.profile.adminDetails`.
- [ ] Run dry-run validation comparing `admins` records against `users`.
- [ ] Zero overwrites; detect and log any field conflicts.

### Gate 4.4: Dual-Read Shadow Verification
- [ ] Route `AdminService.getAdmins` to compare output from `users` vs `admins` in shadow mode.
- [ ] Verify 100% field equality.

### Gate 4.5: Switch Reads to Canonical Entities
- [ ] Switch `AdminService.getAdmins` and `getAdminById` to read exclusively from `users`.
- [ ] Verify `AdminManagement.jsx` frontend renders seamlessly with zero contract changes.

### Gate 4.6: Switch Writes to Canonical Entities
- [ ] Switch `AdminService.createAdmin`, `updateAdmin`, `updateAdminStatus`, and `deleteAdmin` to mutate `users` directly.
- [ ] Verify new admin creation, status toggles, and profile edits work natively on `users`.

### Gate 4.7: 14-Day Production Soak & Monitoring
- [ ] Monitor error logs, auth requests, and API latency for 14 consecutive days.
- [ ] Verify zero regressions in admin management, HEI dashboard, and ground challenges.

### Gate 4.8: Cold Storage Archive
- [ ] Export `admins`, `university_challenges`, and `university_partners` to compressed BSON archives.
- [ ] Verify archive readability and offline queryability.

### Gate 4.9: Controlled Legacy Collection Drop
- [ ] Drop empty/dormant collections:
  - `admins`
  - `university_challenges`
  - `university_partners`
- [ ] Run final `readonly-integrity-audit.js` to verify cluster health: **12/12 PASS**.

---

**IMPORTANT NOTE**: This checklist is a controlled standard operating procedure. Execution must be initiated only upon explicit stakeholder instruction.
