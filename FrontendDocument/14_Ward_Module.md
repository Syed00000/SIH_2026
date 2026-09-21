# Module 14: Urban Ward & Gram Panchayat Portal

> **Module Path:** `src/features/ward/`  
> **Type:** Hyper-Local Governance, Ward Commissioner & Gram Panchayat Administration  
> **Key Technologies:** Micro-Jurisdiction Scoping (`?wardId=...`), Local Workforce Dispatch, Lucide React

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module Ward Commissioners, Municipal Ward Councilors, aur Gram Panchayat Mukhiyas ke liye ground-level operational platform hai. Iska primary kaam ward ke mohalle ya gaon ke niwasiyon dwara darj kiye gaye local issues (jaise naali blockage, street light dysfunction, handpump breakdown, waste dumping) ko monitor karna, local safai karmi ya line worker ko turant dispatch karna, aur ground status verify karke issue close ya escalate karna hai.

---

## 2. Directory Structure & Files

```
src/features/ward/
├── index.js                                   # Barrel export
├── WardPortal.jsx                             # Master Ward administration portal
└── components/
    ├── AddBlockToWardModal.jsx
    ├── WardBlocksPanel.jsx
    ├── WardHeader.jsx                         # Ward number & municipal zone header
    ├── WardOverviewPanel.jsx                  # Ward overview metrics & recent issues
    ├── WardProblemDetailModal.jsx             # Ward level issue inspection dialog
    ├── WardProblemsPanel.jsx                  # List of issues inside this ward
    └── WardSidebar.jsx                        # Ward portal navigation sidebar
```

---

## 3. Sub-Components & Core Workflows

### 3.1 `WardPortal.jsx` (Ward Scope Controller)
- Identifies ward scope using URL query parameter `?wardId=...` or the authenticated user's assigned ward ID.
- Automatically fetches civic challenges submitted with matching `location.panchayatOrWard` or `assignedWard.wardId`.
- Integrates `DepartmentTechniciansPanel` directly scoped to local field workers operating within this ward.

### 3.2 Hyper-Local Issue Triage (`WardProblemsPanel.jsx` & `WardProblemDetailModal.jsx`)
- Ward Commissioner reviews localized complaints:
  - Inspects citizen photo proofs and exact landmark address.
  - Adds administrative ground notes.
  - **Local Resolution:** Dispatches a municipal field worker (`onAssignTechnician`).
  - **Upward Escalation:** If the problem requires civil engineering intervention (e.g. constructing a new culvert or deep borewell), marks the issue for Block/Line Department escalation.

### 3.3 Community CSR & Local Grants (`DepartmentCsrGrantPanel`)
- Allows the ward leadership to track small community CSR projects funded by corporate partners (e.g., solar water heaters, public park solar lighting, Anganwadi building repairs).
