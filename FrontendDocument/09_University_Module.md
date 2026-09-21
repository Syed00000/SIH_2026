# Module 09: Higher Education Institution (HEI) Hub

> **Module Path:** `src/features/university/`  
> **Type:** Higher Education Institution (HEI) Operations, Faculty Assignment & Approvals Pipeline  
> **Key Technologies:** TanStack React Query, Real-Time Polling Engine, Multi-Tab Layout, Analytics Engine

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module colleges aur universities (State Universities, NITs, IITs, Deemed Universities) ke Nodal Officers aur Deans ke liye administrative platform hai. Iska kaam State Nodal Cell se aayi hui civic problems ko accept karna, internal departments aur faculty mentors ko assign karna, faculty dwara submit kiye gaye research project proposals aur budgets ko approve karna, aur corporate industry partners se testing lab access aur quotes manage karna hai.

---

## 2. Directory Structure & Files

```
src/features/university/
├── index.js                                   # Public API export barrel
├── services/
│   ├── analytics/                             # Advanced institutional KPI calculations
│   ├── analyticsService.js                    # Research metrics, TRL distribution & impact stats
│   ├── api/                                   # Lower-level HTTP adapters
│   ├── mockUniversityData.js                  # Fallback datasets
│   └── universityApiService.js                # Core API connector (summary, approvals, assign)
└── components/
    ├── approvals/                             # R&D proposals approval queue components
    ├── challenges/                            # Incoming & assigned challenge workflows
    ├── clarifications/                        # Institutional clarification chat views
    ├── dashboard/                             # Institutional overview KPIs & charts
    ├── faculty/                               # Faculty directory, workload & assignment cards
    ├── layout/                                # University layout shell & navigation
    │   ├── UniversityFooter.jsx
    │   ├── UniversityHeader.jsx
    │   ├── UniversityLayout.jsx               # Master layout container with 4s background sync
    │   ├── UniversitySidebar.jsx              # Navigation sidebar with dynamic badge counts
    │   ├── UniversityTabContent.jsx           # Tab view switcher
    │   └── useUniversityActiveTab.js          # Persistent tab state hook
    ├── notifications/                         # Institutional notifications list
    ├── partners/                              # Industry partners & lab quotation cards
    ├── profile/                               # University AISHE profile & nodal contacts
    ├── projects/                              # Active campus R&D projects
    ├── reports/                               # Institutional research & grant audit reports
    ├── settings/                              # Institutional configurations
    └── teams/                                 # Student innovation teams directory
```

---

## 3. Sub-Components & Core Functionality

### 3.1 `UniversityLayout.jsx` (Master Real-Time Hub)
- **Persistent Tab Navigation (`useUniversityActiveTab.js`):** URL parameter `?tab=...` and LocalStorage sync for tabs: `dashboard`, `challenges`, `approvals`, `faculty`, `projects`, `partners`, `reports`, `notifications`, `teams`, `clarifications`, `settings`.
- **Real-Time Polling Engine:** Background data fetch every 4 seconds (`loadData(true)`) ensures Nodal cell updates, industry quote approvals, and faculty submissions appear in real time without manual page refresh.
- **Dynamic Sidebar Badges:** Real-time badge indicators for pending proposals review count (`approvalCount`) and pending industry fee quotes (`partnerNotificationCount`).

### 3.2 Problem Assignment Workflow (`challenges/` & `faculty/`)
- When the state forwards a problem (e.g. arsenic water contamination in West Singhbhum):
  - University Nodal Officer reviews the problem scope.
  - Clicks "Assign Faculty" $\rightarrow$ opens faculty selection modal.
  - Matches the problem with specific faculty (e.g., Dr. Arvind, Chemistry Dept).
  - API call: `universityApiService.assignFaculty(challengeId, universityCode, facultyData)`.

### 3.3 Research Proposal Approvals Pipeline (`approvals/`)
- Faculty teams prepare detailed proposals and estimated budgets (e.g. ₹ 80,000 for sensor prototype).
- Nodal officer evaluates:
  - Technical feasibility and methodology.
  - Budget breakdown (materials, testing, field visit).
- Actions:
  - **Approve Proposal:** Releases university research seed fund and marks milestone as Active R&D.
  - **Request Revision:** Sends feedback comments back to the faculty workspace.
  - **Escalate to Government:** Requests higher grant funding from the state line ministry.

### 3.4 Industry Collaboration & Lab Quotations (`partners/`)
- Manages corporate lab testing partnerships:
  - Industry partners review requests for specialized laboratory testing (e.g. metallurgical stress analysis).
  - Industry quotes lab fee charges.
  - University Nodal Officer can approve or decline the quoted amount.
  - Unlocks corporate testing facilities and CSR co-funding for student prototypes.

### 3.5 Analytics & Grant Audits (`services/analyticsService.js`)
- Tracks:
  - Total Active Student Research Teams.
  - Technology Readiness Level (TRL) spread across projects (TRL 1 concept to TRL 7 field demo).
  - Institutional intellectual property (IP) and patent disclosures filed.
