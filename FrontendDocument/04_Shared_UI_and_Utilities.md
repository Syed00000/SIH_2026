# Module 04: Shared UI Primitives, Helpers & AI Assistant

> **Module Path:** `src/shared/`  
> **Type:** Universal Design System, Reusable UI Components, PDF Export Engine & AI Chatbot  
> **Key Technologies:** Tailwind CSS v4, **jsPDF** (`^4.2.1`), **Framer Motion** (`^13.1.1`), Lucide React, HTML Sanitization

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module pure portal ke visual presentation, design system tokens, universal atomic UI components, export engines, aur public AI assistant ko house karta hai. Is layer me koi business-specific workflow (jaise direct login ya registration code) nahi hota. Ye sirf generic, highly accessible aur test-proven building blocks provide karta hai jise baaki sabhi feature modules reuse karte hain.

---

## 2. Directory Structure & Files

```
src/shared/
├── components/
│   ├── ai/
│   │   └── JoharSetuAiAssistant.jsx   # Floating public AI conversational drawer
│   ├── layout/
│   │   └── FullPageDetailPanel.jsx    # Full-bleed slide-over details container
│   ├── SafeHtml.jsx                   # XSS-proof safe HTML sanitizer & parser
│   └── ui/
│       ├── alert.jsx                  # Contextual alert notifications (success, warning, etc.)
│       ├── badge.jsx                  # Status tags, role badges & pulsing indicators
│       ├── button.jsx                 # Styled buttons with loading state & hover scaling
│       ├── card.jsx                   # Structural container (Header, Title, Content, Footer)
│       ├── index.js                   # Barrel file exporting UI primitives
│       ├── input.jsx                  # Labelled text field with error descriptions
│       ├── PortalSkeleton.jsx         # Full dashboard skeleton during network latency
│       ├── progress.jsx               # Horizontal progress meter
│       ├── skeleton.jsx               # Atomic pulsating placeholder
│       ├── table.jsx                  # Accessible responsive data table
│       ├── tableSkeleton.jsx          # Multi-column skeleton for table fetches
│       ├── tabs.jsx                   # Tab switcher primitive
│       └── textarea.jsx               # Multiline form text field
├── config/
│   └── designSystem.js                # Design tokens, standard colors & spacing
├── hooks/
│   └── useDelayedLoading.js           # Debounced loading hook to prevent UI flashes
└── utils/
    ├── cn.js                          # Classnames merger helper
    ├── milestonesHelper.js            # Standard 5-stage milestone progression calculator
    ├── openPdf.js                     # In-browser PDF preview helper
    └── pdfExport.js                   # High-resolution Official Government PDF Dossier Engine
```

---

## 3. Deep-Dive: Key Sub-Systems

### 3.1 Official Government PDF Investigation Dossier Engine (`pdfExport.js`)
- **Technology:** `jspdf` (`^4.2.1`).
- **Functionality:**
  - Citizen ke problem statement ka official, high-resolution A4 portrait Government Dossier generate karta hai (`exportChallengeDossierPdf`).
  - **Visual Elements:**
    - Top header banner in forest green (`#064e3b`) with "GOVERNMENT OF JHARKHAND" emblem text.
    - Reference bar: Unique Dossier ID (e.g. `CHL-JH-2026-0042`), Filing Date, Status, Domain.
    - **Section 1:** Citizen Submitter Profile & Aadhaar/Mobile Verification state.
    - **Section 2:** Ground Problem Statement, citizen testimony, affected population, estimated R&D scope.
    - **Section 3:** Administrative Location & GIS Telemetry (District, Block, Panchayat/Ward, Landmark, GPS Coordinates).
    - **Section 4:** Allocated Higher Education Institution (HEI), assigned department/lab, and nodal directives.
    - **Section 5:** 5-Stage Government Resolution Milestones Table with status tags (`COMPLETED`, `CURRENT`, `PENDING`).
    - Footer with digital timestamp, verification barcode/reference, and departmental seal watermark.
  - Automatically triggers client download: `${chlId}_Government_Investigation_Dossier.pdf`.

### 3.2 JoharSetu AI Sahayak (`JoharSetuAiAssistant.jsx`)
- **Technologies:** `framer-motion`, `lucide-react`, `apiClient`.
- **Functionality:**
  - Public pages par bottom-right floating trigger button with pulsing online ping indicator.
  - Clicking expands a 400px interactive conversational drawer.
  - Multilingual guidance (Hindi/English) for grassroots problem submission, live tracking, and university grants.
  - Submits rolling conversation history to backend endpoint `/api/v1/citizen/ai-chat`.
  - Includes quick-prompt chips for common questions, conversation reset button, and automatic scroll-to-bottom.

### 3.3 Atomic UI Primitives (`components/ui/`)
- **`button.jsx`:** Variants (`primary`, `secondary`, `outline`, `destructive`, `ghost`). Includes micro-hover animation, disabled state indicators, and inline loading spinners.
- **`input.jsx` & `textarea.jsx`:** Accessible inputs with label tags, validation error boundaries, aria description bindings, and focus ring styling.
- **`badge.jsx`:** Status tags (e.g. `Under Review`, `In Progress`, `Resolved`) and AI pulsing indicators.
- **`alert.jsx`:** Contextual notification boxes (`success`, `warning`, `error`, `info`).
- **`card.jsx`:** Structural container with header, title, description, content, and footer sections.
- **`table.jsx` & `tableSkeleton.jsx`:** Responsive table primitive for high-density tabular records.
- **`tabs.jsx`:** Accessible tab controller for switching views without reloading.
- **`SafeHtml.jsx`:** HTML sanitization component that safely parses descriptions preventing XSS vulnerabilities.
