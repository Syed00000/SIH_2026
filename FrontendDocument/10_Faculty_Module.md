# Module 10: Faculty Researcher & Student Workspace

> **Module Path:** `src/features/faculty/`  
> **Type:** Academic R&D Workspace, Prototype Stage-Gate Tracking & Student Mentorship  
> **Key Technologies:** **React Quill New** (`^3.8.3`), Browser Window Focus Sync, TRL Lifecycle Engine, API Services

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module University Professors, Principal Investigators (PIs), aur Student Innovator Teams ke liye dedicated technical laboratory workspace hai. Iska kaam University Nodal Officer dwara assign kiye gaye civic challenges par actual research conduct karna, formal research proposals prepare karna, student project teams banana, prototype ki progress ko Technology Readiness Level (TRL 1–9) par track karna, aur lab testing ke results submit karna hai.

---

## 2. Directory Structure & Files

```
src/features/faculty/
├── hooks/
│   └── useFacultyNotifications.js             # Notification counter & revision alerts hook
├── services/
│   └── facultyApiService.js                   # API connector (workspace, proposals, milestones)
└── components/
    ├── challenges/                            # Assigned grassroots problems list
    ├── dashboard/                             # Faculty overview metrics & active project cards
    ├── layout/                                # Faculty layout container & headers
    │   ├── FacultyHeader.jsx                  # Header with department badge & print trigger
    │   ├── FacultySidebar.jsx                 # Sidebar with revision count badges
    │   ├── FacultyTabContent.jsx              # Tab content router
    │   └── FacultyLayout.jsx                  # Master container with 4s sync & focus listener
    ├── profile/                               # Academic profile, publications & department
    ├── projects/                              # Active R&D project workspace & telemetry logs
    ├── proposals/                             # Research methodology & budget proposal editor
    ├── prototypes/                            # Prototype TRL 1 to 9 stage gate tracker
    ├── revisions/                             # Feedback revision inbox from university admin
    └── teams/                                 # Student team formation & task assignments
```

---

## 3. Sub-Components & Core Functionality

### 3.1 `FacultyLayout.jsx` (Real-Time Laboratory Shell)
- **Continuous Sync with Window Focus:**
  - 4-second polling interval (`setInterval(() => loadData(true), 4000)`).
  - Listens to `window.addEventListener('focus')` so whenever the professor switches back to the tab, the latest approvals or revision notes sync immediately.
- **Deep-Linking Workspace:** Supports URL query parameters `?tab=project-workspace&projectId=PRJ-001` so specific projects can be bookmarked or shared directly with team members.

### 3.2 Research Proposals & Budget Builder (`proposals/`)
- When assigned a problem (e.g. developing a low-cost fluoride filter for rural wells):
  - Faculty creates a formal proposal.
  - **Methodology Editor:** Integrated rich-text editor (`react-quill-new`) for formulas, experimental design, and schematics.
  - **Itemized Budget Creator:**
    - Raw materials & hardware components.
    - Specialized laboratory testing fees.
    - Ground field testing & travel allowance.
    - Student stipends.
  - Submitted directly to University Nodal Officer for financial approval.

### 3.3 Prototype Stage-Gate & TRL Tracker (`prototypes/`)
- Tracks project evolution across global **Technology Readiness Levels (TRL 1 to 9)**:
  - **TRL 1–3 (Discovery Phase):** Basic principles observed, analytical proof of concept.
  - **TRL 4–6 (Development Phase):** Component validation in laboratory, prototype integrated in simulated environment.
  - **TRL 7–9 (Deployment Phase):** Prototype demonstration in field operational environment, final production resolution.
- Live progress bars, milestone checklists, and telemetry upload fields for sensor data.

### 3.4 Student Teams Management (`teams/`)
- Form student project teams with student leads, roll numbers, and assigned sub-tasks.
- Issue project completion certificates upon successful deployment of the civic solution.

### 3.5 Revisions Inbox (`revisions/` & `useFacultyNotifications.js`)
- If the University Admin or State Ministry requests changes in the methodology or budget, it lands in the Revisions tab with highlighted remarks.
- Faculty can modify the parameters and resubmit with one click.


