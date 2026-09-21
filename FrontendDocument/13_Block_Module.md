# Module 13: Block / Tehsil Administration

> **Module Path:** `src/features/block/`  
> **Type:** Sub-Divisional & Block Development Office (BDO) Administration  
> **Key Technologies:** Multi-Entity Aggregation, Scoped Query Parameters (`?blockId=...`), Modal Steppers

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module Block Development Officers (BDOs), Circle Officers (COs), aur Tehsil Administrators ke liye administrative control room hai. Iska primary kaam block boundary ke andar aane wale sabhi gram panchayaton aur wards ke civic grievances ko monitor karna, block-level line department sub-branches (Block Agriculture Office, Block Primary Health Unit) ko manage karna, aur ward administrators ko login credentials issue karna hai.

---

## 2. Directory Structure & Files

```
src/features/block/
├── index.js                                   # Barrel export
├── BlockPortal.jsx                            # Master Block administration container
└── components/
    ├── AddBlockDepartmentModal.jsx            # Create block-level department office
    ├── BlockAddWardModal.jsx                  # Add new Gram Panchayat / Ward unit
    ├── BlockAssignToDeptModal.jsx             # Assign block problem to department
    ├── BlockChallengesPanel.jsx               # Problems filtered to this block
    ├── BlockDepartmentNav.jsx                 # Department sub-navigation tab
    ├── BlockDepartmentsPanel.jsx              # Block line departments management
    ├── BlockHeader.jsx                        # Block title & active issues header
    ├── BlockIssueDetailModal.jsx              # Block problem inspection dialog
    ├── BlockIssuesTable.jsx                   # High-density tabular listing of issues
    ├── BlockModals.jsx                        # Central modals controller
    ├── BlockOverviewPanel.jsx                 # Block KPIs, panchayats & summary
    ├── BlockSidebar.jsx                       # Navigation sidebar with counts
    ├── BlockWardsPanel.jsx                    # Gram Panchayats & Wards directory
    ├── EditBlockDepartmentModal.jsx
    ├── ViewBlockDepartmentModal.jsx
    └── WardCredentialsSuccessModal.jsx        # Credentials card for new ward officer
```

---

## 3. Sub-Components & Core Operational Workflows

### 3.1 `BlockPortal.jsx` (Scoped Jurisdiction Controller)
- **Automatic Scoping:**
  - URL parameter `?blockId=...` ya logged-in user ke profile data se current block detect karta hai (e.g. `BLK-JH-RN-01`, Kanke Block, Ranchi).
  - Parallel API aggregation:
    - Block-specific problems (`citizenService.fetchChallenges`).
    - Block departments (`departmentService.getDepartments`).
    - Block wards / panchayats (`wardService.getWards`).
    - Block technicians (`technicianService.getTechnicians`).

### 3.2 Block Line Departments Oversight (`BlockDepartmentsPanel.jsx`)
- Oversees grassroots departmental offices:
  - Block Drinking Water & Sanitation Cell.
  - Block Rural Road Maintenance Wing.
  - Block Health & Primary Care Center.
- Allows BDOs to route escalated citizen problems to the appropriate block department (`BlockAssignToDeptModal.jsx`).

### 3.3 Ward & Panchayat Administration (`BlockWardsPanel.jsx`)
- Monitors all Gram Panchayats and Urban Wards under the block.
- **Onboard New Ward (`BlockAddWardModal.jsx`):**
  - Enter Panchayat/Ward Name, Ward Number, Mukhiya/Secretary Name, and Mobile.
- **Secure Credentials Generation (`WardCredentialsSuccessModal.jsx`):**
  - Generates auto-generated Login ID and initial Access Key.
  - One-click print/copy format so the block officer can issue official credentials to the elected ward representative.

### 3.4 Local Field Technician Oversight
- Integrates `DepartmentTechniciansPanel` to assign block technicians for fast local civic problem resolution.
