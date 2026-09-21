# Module 12: State & District Line Department Portal

> **Module Path:** `src/features/department/`  
> **Type:** Line Ministry Administration, Field Workforce Management & Budget Approvals  
> **Key Technologies:** Modal Workflows, Form Validation, Role Scoping, Custom Hooks (`useDepartmentPortal`)

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module Jharkhand ke alag-alag Line Departments (jaise Drinking Water & Sanitation, Road Construction, Energy & Power, Health & Family Welfare, Agriculture) ke Executive Engineers aur Departmental Heads ke liye operational platform hai. Iska primary kaam aayi hui samasyaon par turant karwayi karna, field technicians ko kaam assign karna, budget officers ko site estimation ke liye bhejna, aur CSR emergency grant funding approve karna hai.

---

## 2. Directory Structure & Files (44+ Components & Helpers)

```
src/features/department/
├── DepartmentPortal.jsx                       # Main department portal container
├── hooks/
│   └── useDepartmentPortal.js                 # Unified state, modal & action hook
├── index.js                                   # Barrel export
└── components/
    ├── AddBudgetOfficerModal.jsx              # Onboard new budget estimation officer
    ├── AddDistrictModal.jsx                   # Register district line department office
    ├── AddTechnicianModal.jsx                 # Onboard field worker / technician
    ├── AllocateFundModal.jsx                  # Direct treasury fund allocation modal
    ├── AssignBudgetOfficerModal.jsx           # Assign problem to budget officer for estimation
    ├── AssignToTechnicianModal.jsx            # Dispatch task to field technician
    ├── CivicProblemsFundingList.jsx           # Problems pending funding sanction
    ├── DepartmentBudgetOfficerCard.jsx        # Budget officer profile card
    ├── DepartmentBudgetOfficersPanel.jsx      # Budget officers team management panel
    ├── DepartmentBudgetReviewPanel.jsx        # Vetted budgets review & state submission
    ├── DepartmentCsrGrantPanel.jsx            # CSR grant application & tracking panel
    ├── DepartmentCsrKpis.jsx                  # Departmental CSR metrics cards
    ├── DepartmentDistrictContactsCard.jsx     # District office contacts
    ├── DepartmentDistrictCredentialsCard.jsx  # Administrative access credentials
    ├── DepartmentDistrictDetailCards.jsx      # District office statistics
    ├── DepartmentDistrictDetailView.jsx       # District office drilldown view
    ├── DepartmentDistrictStatsGrid.jsx        # Metrics grid for district branches
    ├── DepartmentDistrictsPanel.jsx           # District / Block sub-offices hierarchy
    ├── DepartmentDistrictsTable.jsx           # Tabular list of district offices
    ├── DepartmentHeader.jsx                   # Header with department selector dropdown
    ├── DepartmentMobileNav.jsx                # Mobile navigation bar
    ├── DepartmentModals.jsx                   # Central container for all 15+ modals
    ├── DepartmentOverview.jsx                 # Departmental overview KPIs & issue triage
    ├── DepartmentProblemActionPanel.jsx       # Detailed action & routing terminal for an issue
    ├── DepartmentProblemCard.jsx              # Civic issue snapshot card
    ├── DepartmentProblemEvidence.jsx          # Photographic evidence viewer
    ├── DepartmentProblemsPanel.jsx            # Full listing of department problems
    ├── DepartmentProfilePanel.jsx             # Department authority profile
    ├── DepartmentPrototypesPanel.jsx          # R&D prototypes developed by HEIs
    ├── DepartmentSidebar.jsx                  # Departmental navigation sidebar
    ├── DepartmentTechnicianCard.jsx           # Technician profile & current status card
    ├── DepartmentTechniciansPanel.jsx         # Field technicians roster & dispatch panel
    ├── EditBudgetOfficerModal.jsx
    ├── EditDepartmentBudgetModal.jsx
    ├── EditTechnicianModal.jsx
    ├── EmergencyGrantModal.jsx                # Request urgent government contingency grant
    ├── GrantFundsModal.jsx
    ├── GrantRequestsTable.jsx
    ├── RequestGrantModal.jsx
    ├── ViewBudgetOfficerModal.jsx
    ├── ViewDistrictModal.jsx
    ├── ViewTechnicianModal.jsx
    ├── departmentChallengeFilter.helper.js
    ├── departmentDistricts.helper.js
    └── state-ministry/                        # State ministry sub-components
```

---

## 3. Sub-Components & Core Operational Workflows

### 3.1 `DepartmentPortal.jsx` & `useDepartmentPortal.js`
- **Central State Controller (`useDepartmentPortal`):** Manages all modals, active department selection, problem updates, technician CRUD operations, and budget officer assignments.
- **Dynamic Category Scoping:** Adapts UI seamlessly whether the current user is a **State Ministry**, **District Department**, or **Urban Local Body (ULB)**.

### 3.2 Technician & Field Worker Dispatch (`DepartmentTechniciansPanel.jsx`)
- Complete workforce lifecycle management:
  - Add Technician (`AddTechnicianModal.jsx`): Name, mobile, designation (Electrician, Plumber, Junior Engineer), and assigned block/ward jurisdiction.
  - Dispatch Task (`AssignToTechnicianModal.jsx`): Assigns a reported citizen problem to a technician.
  - Live Status Tracking: Monitors whether the technician is *Idle*, *Assigned*, *Working*, or *Task Completed*.

### 3.3 Budget Estimation & Submission (`DepartmentBudgetOfficersPanel.jsx` & `DepartmentBudgetReviewPanel.jsx`)
- For complex infrastructural repairs (e.g. culvert reconstruction, transformer replacement):
  - Department Head assigns the problem to a Budget Officer (`AssignBudgetOfficerModal.jsx`).
  - Budget Officer inspects the site and submits an itemized cost estimate.
  - Department Head reviews the estimate and clicks "Submit to Government" (`handleSubmitBudgetToGovt`) to request treasury grant release.

### 3.4 CSR Emergency Grants (`DepartmentCsrGrantPanel.jsx`)
- Direct application for CSR funds or Emergency Government Grants (`EmergencyGrantModal.jsx`) when departmental maintenance budgets are insufficient for urgent public health or disaster hazards.
