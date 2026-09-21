# Module 08: State & District Nodal Administration

> **Module Path:** `src/features/nodal/`  
> **Type:** Central Administrative Triage, HEI Allocation & Governance Directory  
> **Key Technologies:** AI Matching Algorithms, PDF Dossier Engine, Hierarchical Directories, TanStack Table

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module State Nodal Officers aur District Innovation Officers ke liye primary command centre hai. Iska main kaam incoming citizen submissions ko verify karna, ground evidence check karna, problem statement ko evaluate karke use ya to kisi Higher Education Institution (HEI) ke R&D lab me bhejna ya phir relevant government line department ko assign karna hai. Sath hi ye pure state, district, block aur ward level administrative directory ko manage karta hai.

---

## 2. Directory Structure & Files

```
src/features/nodal/
├── index.js                                   # Barrel export
├── NodalPortal.jsx                            # Main Nodal dashboard shell & tab router
└── components/
    ├── NodalAssignModal.jsx                   # Allocation modal to assign HEI / Department
    ├── NodalChallengeStatusCard.jsx           # Challenge lifecycle metrics card
    ├── NodalChallenges.jsx                    # Comprehensive problem listing & filter view
    ├── NodalFilterBar.jsx                     # Sector, district, and priority filter controls
    ├── NodalHeader.jsx                        # Nodal authority header & district tag
    ├── NodalOverview.jsx                      # Overview KPIs, urgent triage feed & alerts
    ├── NodalPendingApprovalsTable.jsx         # Immediate triage queue table
    ├── NodalRecentAlertsCard.jsx              # System audit alerts & notifications
    ├── NodalSidebar.jsx                       # Navigation sidebar (Dashboard, HEIs, Directories)
    ├── NodalStatCards.jsx                     # Top metrics summary cards
    ├── NodalUniversitiesPanel.jsx             # Active HEI capacity & lab allocation panel
    ├── ProblemEvidenceDossierModal.jsx        # Forensic modal displaying ground photo & GIS data
    ├── ProblemEvidenceDossierPanel.jsx        # Printable administrative investigation panel
    ├── UniversityProblemsDetailView.jsx       # Specific university workload drill-down
    ├── ai/                                    # AI laboratory matching suggestion algorithms
    ├── approvals/                             # Triage approval queues
    ├── assign/                                # Assignment workflow helpers
    ├── block-directory/                       # Block / Tehsil directory components
    ├── challenges/                            # Challenge card & table subcomponents
    ├── common/                                # Shared nodal badges & helpers
    ├── district-directory/                    # 24 Districts administrative registry
    ├── district-issues/                       # District-specific grievance heatmaps
    ├── dossier/                               # Forensic evidence subcomponents
    ├── notifications/                         # Nodal notice popovers
    ├── overview/                              # Overview charts & analytics
    ├── profile/                               # Nodal officer profile & designation view
    ├── state-directory/                       # State Ministries & Apex Secretariats
    ├── universities/                          # HEI directory cards & contact lists
    ├── universityDetail/                      # University department details
    └── ward-directory/                        # Ward Commissioners & Gram Panchayat records
```

---

## 3. Sub-Components & Core Functionality

### 3.1 `NodalPortal.jsx` (Central Navigation Router)
- **Tabs Managed:**
  - `overview` / `dashboard`: Executive KPIs and pending triage queue.
  - `challenges`: Full list of state problems with status filters.
  - `universities`: Directory of onboarded colleges, active faculties, and assigned R&D problems.
  - `state-directory`: Apex government line ministries.
  - `district-directory`: District administrative contacts and active grievance counts.
  - `block-directory`: Block development offices (BDOs) and tehsil contacts.
  - `ward-directory`: Ward commissioners and gram panchayat heads.
  - `profile`: Nodal officer profile and jurisdiction details.

### 3.2 Problem Triage & Assignment (`NodalAssignModal.jsx`)
- **Dual Routing Capability:**
  1. **Route to Higher Education Institution (HEI):**
     - Nodal officer selects the best-fit university (e.g. Ranchi University, BIT Mesra, NIT Jamshedpur) and specific engineering department (Civil, Environmental, Computer Science).
     - Specifies R&D directives and expected prototype timeline.
  2. **Route to Line Department:**
     - Agar problem routine maintenance type ki hai (e.g. pipeline leak, transformer replacement), to use seedhe District Drinking Water Department ya Energy Department ko forward kiya jata hai.

### 3.3 Problem Evidence Dossier & Export (`ProblemEvidenceDossierModal.jsx`)
- Full forensic examination of the citizen report:
  - Submitter verification state (Aadhaar/Mobile authentication).
  - High-resolution ground photographs and evidence documentation.
  - Exact GPS Telemetry Coordinates and administrative address.
  - **One-Click Official PDF Generation:** Uses `exportChallengeDossierPdf` (`src/shared/utils/pdfExport.js`) to produce an official Government of Jharkhand investigation report.

### 3.4 Hierarchical Governance Directories
- **`StateDirectory`:** List of all 15 State Line Ministries, Secretaries, and central nodal heads.
- **`DistrictDirectory`:** All 24 Jharkhand districts with active issue counters and District Collector contacts.
- **`BlockDirectory`:** 260+ Blocks across Jharkhand with assigned block officers.
- **`WardDirectory`:** Urban municipal wards and rural Gram Panchayats with mukhiya contacts.

### 3.5 AI Matching Assistant (`components/ai/`)
- Analyzes the citizen's problem description using NLP keyword classification and suggests the 3 top universities that possess matching lab infrastructure (e.g. water testing labs, solar research centers).
