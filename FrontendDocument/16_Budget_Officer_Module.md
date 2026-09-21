# Module 16: Budget Officer & Estimation Portal

> **Module Path:** `src/features/budgetOfficer/`  
> **Type:** Cost Estimation, Financial Vetting & Project Budget Preparation  
> **Key Technologies:** Real-Time Subscriber Sync (`projectCsrSyncService`), Financial Cost Breakdown Modals

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module Departmental Accounts Officers, Quantity Surveyors, aur Government Cost Estimators ke liye dedicated portal hai. Jab kisi grassroots civic issue ya university prototype ke liye sarkari budget ya grant release hona hota hai, to engineer se aayi hui preliminary estimates ka inspection karna, market rates ke mutabiq actual material aur labor cost ka itemized budget prepare karna, aur use approval ke liye Department aur Treasury ko submit karna is module ka kaam hai.

---

## 2. Directory Structure & Files

```
src/features/budgetOfficer/
├── BudgetOfficerHeader.jsx                    # Header with user identity & refresh trigger
├── BudgetOfficerPortal.jsx                    # Master Budget Officer container
├── BudgetOfficerSidebar.jsx                   # Navigation sidebar with pending/submitted counts
├── BudgetOfficerTasksPanel.jsx                # Tabular list of assigned budget tasks
├── CreateActualBudgetModal.jsx                # Itemized budget creation form
└── ReviewAssignedBudgetModal.jsx              # Preliminary estimate inspection modal
```

---

## 3. Sub-Components & Core Operational Workflows

### 3.1 `BudgetOfficerPortal.jsx` & Real-Time Financial Sync
- **Service Integration:** `projectCsrSyncService.js` se bind rehta hai:
  - Subscribes to `projectCsrSyncService.subscribe()` so whenever a Department Head assigns a new problem for financial estimation, the budget officer's screen updates in real time.
- **Filter Scoping:**
  - Tasks are filtered specifically for the logged-in officer (`assignedBudgetOfficer.officerId === officerId`).
  - Tracks counts: *Pending Budgets* vs *Prepared & Submitted Budgets*.

### 3.2 Actual Budget Formulation (`CreateActualBudgetModal.jsx`)
- Budget Officer site parameters aur preliminary estimates review karta hai (`ReviewAssignedBudgetModal.jsx`).
- **Itemized Financial Fields:**
  - **Material Costs:** Cement, pipes, electronic sensors, solar panels, wiring.
  - **Labor & Execution Costs:** Masonry, technician daily allowances, site supervision.
  - **Machinery / Equipment Rental:** Excavator charges, testing lab fees.
  - **Contingency & Taxes:** 5% contingency margin + statutory GST.
  - **Implementation Timeline:** Expected duration in weeks.
- Clicks "Submit Budget" $\rightarrow$ `projectCsrSyncService.submitActualBudget(taskId, actualBudgetDetails)`.
- The vetted financial dossier is forwarded to the Department Executive Engineer for treasury fund sanction.
