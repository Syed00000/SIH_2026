# JoharSetu — End-to-End System Architecture

## 1. System Overview

**JoharSetu** is an integrated governance, civic problem resolution, and academic-industry innovation platform built specifically for the Government of Jharkhand. It bridges the gap between grassroots citizens, administrative authorities across three tiers (District Nodal Cell, Block Development Office, Line Departments), on-ground field technicians, and higher education / industry researchers.

---

## 2. Dedicated Architecture Documents

For granular, file-by-file technical blueprints, refer to the dedicated specifications:

- 🖥️ **[Frontend Architecture Specification](file:///c:/Users/Shadan/Desktop/SIH_2026/FRONTEND_ARCHITECTURE.md)**:
  - React 18, Vite, and Tailwind CSS v4 design system.
  - 8 Specialized Role Portals (Citizen, Nodal, Block, Department, Technician, University, Faculty, Industry).
  - Leaflet GIS engine with choropleths, heatmaps, and marker clustering.
  - Mobile-first responsive layouts, drawer sidebars, and fixed bottom navigation.

- ⚙️ **[Backend Architecture Specification](file:///c:/Users/Shadan/Desktop/SIH_2026/BACKEND_ARCHITECTURE.md)**:
  - Node.js ES Modules & Express.js 4 modular layered architecture.
  - MongoDB Atlas persistence layer with Mongoose ODM models.
  - Real-time Socket.IO clustering for bi-directional clarification chat.
  - Multi-role JWT authentication and field technician credentialing.
  - Resilient server lifecycle, graceful shutdown, and port retry mechanisms.

---

## 3. High-Level System Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER (FRONTEND - VITE / REACT)                        │
├────────────────────────────────┬────────────────────────────┬───────────────────────────────┤
│  Citizens / General Public     │   Administrative Tiers     │   Ground Field Technicians    │
│  - Citizen Portal (Mobile Nav) │   - Nodal Authority Portal │   - Technician Workspace      │
│  - Issue Submission & Evidence │   - Block Portal (BDO)     │   - Acceptance & "Mark Done"  │
│  - Live Timeline Tracking      │   - Department In-Charge   │   - Mobile-First Action Panel │
│  - Clarification Chat          │   - State GIS Heatmap      │   - Direct Citizen Dialing    │
└────────────────────────────────┴─────────────┬──────────────┴───────────────────────────────┘
                                               │
                                               │ HTTPS / WSS
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                               SERVER TIER (BACKEND - NODE.JS / EXPRESS)                     │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  REST API Gateway & Security Pipeline:                                                      │
│  - Helmet HTTP Protection, CORS Guard, JSON Parser, Rate Throttling                         │
│  - JWT Bearer Authentication & Multi-Role RBAC Authorization Engine                         │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  Modular Domain Services (Presentation -> Application -> Persistence):                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────────┐  │
│  │ Auth & Sessions  │  │ Citizen & Triage │  │ Line Departments │  │ Block Governance    │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  └─────────────────────┘  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────────┐  │
│  │ Field Technician │  │ GIS Spatial Engine│ │ ClarificationChat│  │ University / Grants │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  Real-Time Socket.IO Server:                                                                │
│  - Live Clarification Rooms (`challenge:<id>`) & Instant Notification Bus                   │
└──────────────────────┬───────────────────────────────────────────────┬──────────────────────┘
                       │                                               │
        Mongoose Driver│                                 Media Streams │ CDN / Cloudinary
                       ▼                                               ▼
┌──────────────────────────────────────────────┐        ┌─────────────────────────────────────┐
│             DATABASE TIER                    │        │            EXTERNAL SERVICES        │
├──────────────────────────────────────────────┤        ├─────────────────────────────────────┤
│  MongoDB Atlas (Managed Database)            │        │  - Cloudinary / Local Upload Media  │
│  - Collections: challenges, departments,     │        │  - OpenStreetMap & ESRI Tile Servers│
│    blocks, technicians, users, messages      │        │  - Nodemailer SMTP Email Dispatch   │
│  - Geospatial Coordinates & Compound Indexes │        │  - MapTiler Geospatial APIs         │
└──────────────────────────────────────────────┘        └─────────────────────────────────────┘
```

---

## 4. End-to-End Problem Remediation Lifecycle

JoharSetu digitizes the complete lifecycle of a civic issue from initial citizen observation to verified on-ground field execution:

```text
[ Citizen ]
    │
    ▼ (1. Submits problem with GPS coordinates & photo evidence)
[ Backend: /api/v1/citizen/challenges ]
    │
    ▼ (2. Stores challenge in MongoDB with status: "Submitted")
[ Nodal Authority Portal (/nodal) ]
    │
    ▼ (3. Reviews Dossier, sets priority & assigns to Block / Department)
[ Block Portal (/block) ]
    │
    ▼ (4. BDO delegates civic issue to specific Line Department)
[ Department Portal (/department) ]
    │
    ▼ (5. In-Charge assigns specific technician from Technician Directory)
[ Technician Portal (/technician) ]
    │
    ├──► (6. Technician clicks "Accept Problem" -> unlocks contact number)
    │
    ├──► (7. Conducts on-site repair & clicks "Mark as Done" with remarks)
    │
    ▼
[ Status: "Resolved" ]
    │
    ├──► Citizen Portal: Timeline advances to "Resolved" with completion details.
    └──► State GIS Map: Real-time heatmap recalculates district problem density.
```

---

## 5. Security & Governance Principles

1. **Strict Real Data Flow (`RULE.md`)**:
   - Zero mock or dummy data at any tier.
   - All runtime entities originate from MongoDB Atlas via verified REST endpoints.
2. **Codebase Maintainability**:
   - Maximum 200 lines of code per source file strictly maintained through modular component extraction.
   - Centralized reusable helpers for status formatting, API communication, and error dispatch.
3. **Defense-in-Depth Authentication**:
   - Passwords salted with bcrypt (10 rounds).
   - Scoped JWT claims ensure role boundaries are immutable on the server.
   - Dedicated authentication helpers for Block Officers and Field Technicians (`block-auth.helper.js`, `technician-auth.helper.js`).
