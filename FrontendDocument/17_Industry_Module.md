# Module 17: Industry & CSR Partner Portal

> **Module Path:** `src/features/industry/`  
> **Type:** Corporate CSR Capital Deployment, Testing Lab Access & Industry Mentorship  
> **Key Technologies:** Quotation Modals, CSR KPI Analytics, Service Adapters

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module Jharkhand me operational corporate enterprises (jaise Tata Steel, SAIL, Coal India, Adani Power, Jindal Steel, Vedantu) ke CSR Heads, R&D Directors, aur Testing Lab Managers ke liye dedicated portal hai. Iska kaam university ke research projects ko corporate CSR funding (Companies Act Section 135) se sponsor karna, university student teams ko unke specialized corporate testing labs (metallurgical labs, spectrometer facilities, high-voltage test bays) ka access provide karna aur testing charges quote karna hai.

---

## 2. Directory Structure & Files

```
src/features/industry/
├── services/
│   ├── industryExpertService.js               # Industry mentors & technical advisors API
│   ├── industryFundService.js                 # CSR grant disbursement & tracking API
│   └── industryTechService.js                 # Testing facility scheduling API
└── components/
    ├── common/                                # Status tags & badges
    ├── dashboard/                             # Industry dashboard & testing quote modals
    │   ├── IndustryDashboard.jsx              # Master industry dashboard container
    │   ├── IndustryRequestActionModal.jsx     # Lab fee quote & request action modal
    │   ├── IndustryRequestDetailPanel.jsx     # Full technical details of student project
    │   ├── hooks/                             # Industry data hooks
    │   └── panels/                            # Sub-dashboard panels
    ├── experts/                               # Corporate mentorship assignment
    ├── funding/                               # CSR capital deployment cards
    ├── labs/                                  # Testing facilities catalogue
    ├── layout/                                # Industry layout & navigation sidebar
    │   └── IndustrySidebar.jsx                # Collapsible industry navigation sidebar
    ├── projects/                              # Sponsored projects monitoring
    └── tech/                                  # Technology transfer & IP commercialization
```

---

## 3. Sub-Components & Core Operational Workflows

### 3.1 `IndustryDashboard.jsx` (Corporate Overview)
- Key Metrics Dashboard:
  - **Total CSR Capital Committed vs Disbursed.**
  - **Active Sponsored Student Innovation Projects.**
  - **Testing Lab Requests Received from Universities.**
  - **Commercialization & Patent Licensing Opportunities.**

### 3.2 Testing Lab Requests & Quote Management (`IndustryRequestActionModal.jsx`)
- When a university research team requests access to specialized industrial testing facilities:
  - Industry Lab Manager reviews the request (`IndustryRequestDetailPanel.jsx`).
  - Evaluates testing parameters (e.g. chemical purity test, tensile strength test).
  - **Quote Lab Charges:** Enters the testing fees (e.g. ₹ 15,000) and scheduled test date.
  - **Approve or Waive:** Corporate partners have the option to waive testing fees under CSR grants.
  - Once accepted by the university, testing laboratory access is officially unlocked.

### 3.3 CSR Grant Deployment (`services/industryFundService.js`)
- Direct matching of corporate CSR capital with verified grassroots problems:
  - Corporate partners select challenges aligned with their priority CSR sectors (Drinking Water, Tribal Livelihoods, Green Energy, Rural Education).
  - Approves milestone-based grant disbursement directly to the university innovation account.

### 3.4 Industry Expert Mentorship (`services/industryExpertService.js`)
- Allows senior corporate engineers and metallurgists to join as co-mentors alongside university professors to accelerate the deployment of civic solutions.
