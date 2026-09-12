# JoharSetu — Frontend Architecture Specification

## 1. Executive Summary & Technology Stack

JoharSetu's frontend is an enterprise-grade, responsive Single Page Application (SPA) engineered for high-density administrative workflows and accessible citizen interactions across Jharkhand's 24 districts.

### Core Technology Stack

| Layer / Concern | Technology | Version | Purpose / Scope |
|---|---|---|---|
| **Core Framework** | React | `^18.3.1` | Concurrent rendering, declarative UI, component lifecycle |
| **Build Tool & Dev Server** | Vite | `^6.0.5` | Fast HMR, Rollup production bundling, ES module loading |
| **Styling & Design System** | Tailwind CSS & Autoprefixer | `^4.3.3` | Utility-first, responsive layouts, glassmorphism, accessible tokens |
| **Icons & Visual Language** | Lucide React | `^0.469.0` | Unified feather icon set for administrative & citizen UI |
| **Client-Side Routing** | Custom Browser Router | Internal | History API integration, URL query sync, role-based route guard |
| **Data Fetching & Cache** | Axios & TanStack Query | `^1.19.0` / `^5.102.0` | Centralized interceptors, optimistic caching, automatic retries |
| **GIS Mapping Engine** | Leaflet, Leaflet.heat, MarkerCluster | `^1.9.4` / `^0.2.0` / `^1.5.3` | Interactive geospatial mapping, polygon GeoJSON, heatmaps, clusters |
| **Real-Time WebSockets** | Socket.IO Client | `^4.8.3` | Low-latency bi-directional clarification chat & triage events |
| **Form Management** | React Hook Form & Zod | `^7.86.0` / `^4.4.3` | Schema-driven client-side validation, zero re-render overhead |
| **Data Visualization** | Recharts | `^3.10.1` | District KPIs, problem distribution bar/pie charts |
| **Document Export** | jsPDF & html2canvas | `^4.2.1` / `^1.4.1` | Administrative PDF dossier exports and work order generation |

---

## 2. Directory & Component Architecture

The frontend follows a **Feature-Driven Modular Architecture** where business domains are partitioned into self-contained feature slices, backed by shared infrastructure and UI foundations:

```text
FRONTEND/src/
├── app/                           # Core application orchestrator
│   ├── layout.jsx                 # Root wrapper (Toaster, Navigation, Modals)
│   ├── ProtectedRoute.jsx         # RBAC route guard enforcing role-based entry
│   └── router.jsx                 # Centralized view router & query parameter manager
├── assets/                        # Static emblems, government seals, sector imagery
├── infrastructure/                # Transport & networking layer
│   ├── api/client.js              # Axios singleton with Bearer token & error interceptors
│   └── socket/socketClient.js     # Socket.io connection manager with reconnect logic
├── shared/                        # Reusable atom/molecule components
│   ├── components/                # Universal Buttons, Modals, Loaders, Toasts, Badges
│   └── hooks/                     # useDebounce, useMediaQuery, useLocalStorage
└── features/                      # Domain-specific feature modules
    ├── auth/                      # Authentication (Login, Register, OTP, Password Reset)
    ├── citizen/                   # Citizen Portal (Submission, Tracker, Profile, Help)
    ├── nodal/                     # District Nodal Authority (Triage, Block Directory, Dossier)
    ├── block/                     # Block Development Officer (BDO assignment & monitoring)
    ├── department/                # Line Department In-Charge (Tech directory, Problem action)
    ├── technician/                # Field Technician Workspace (Accept, Mobile nav, Resolve)
    ├── university/                # HEI Research Portal (Challenge solving & innovation)
    ├── faculty/                   # Academic Faculty Research Workspace
    ├── industry/                  # Corporate/CSR Portal (Grants, Tech adoption, Mentorship)
    ├── government/                # State GIS Heatmap, Analytics & Overview Dashboard
    └── landing/                   # Public-facing Landing, About, Impact & Institutional pages
```

---

## 3. Role-Based Portals & Workspace Matrix

The client orchestrates **8 dedicated specialized portals** mapped dynamically to the authenticated user's credentials and role claims:

```text
                                  ┌────────────────────────┐
                                  │   Browser Request      │
                                  └───────────┬────────────┘
                                              ▼
                                  ┌────────────────────────┐
                                  │  router.jsx (AuthCtx)  │
                                  └───────────┬────────────┘
         ┌───────────────┬────────────────────┼────────────────────┬───────────────┐
         ▼               ▼                    ▼                    ▼               ▼
┌─────────────────┐ ┌─────────┐      ┌─────────────────┐ ┌─────────────────┐ ┌─────────┐
│ Public Landing  │ │ Citizen │      │ Nodal Authority │ │ Block Officer   │ │ Dept    │
│ & Transparency  │ │ Portal  │      │ Portal          │ │ Portal (BDO)    │ │ Portal  │
└─────────────────┘ └─────────┘      └─────────────────┘ └─────────────────┘ └─────────┘
         ▲                                    ▲                    ▲               ▲
         │                                    │                    │               │
         └───────────────┬────────────────────┴────────────────────┴───────────────┘
                         ▼
       ┌──────────────────────────────────┐
       │   Field Technician Portal        │ ◄─── (Mobile First / Ground Ops)
       └──────────────────────────────────┘
       ┌──────────────────────────────────┐
       │   University & Faculty Portal    │ ◄─── (R&D / Innovation)
       └──────────────────────────────────┘
       ┌──────────────────────────────────┐
       │   Industry & CSR Portal          │ ◄─── (CSR Grants / Solutions)
       └──────────────────────────────────┘
```

### Portal Profiles

1. **Citizen Portal** (`/citizen`):
   - Intuitive challenge submission wizard with GPS coordinate detection and photo evidence upload.
   - Live milestone progress tracker (Submitted $\rightarrow$ Triaged $\rightarrow$ Assigned $\rightarrow$ Field Work $\rightarrow$ Resolved).
   - Citizen bottom navigation bar on mobile viewports.
2. **Nodal Authority Portal** (`/nodal`):
   - District-wide triage table, problem assessment dossier, and directive dispatch engine.
   - **District Block Directory** with CRUD management for BDO office credentials and problem assignment.
3. **Block Portal** (`/block`):
   - BDO operations workspace: filters problems by block jurisdiction.
   - Direct delegation to line departments (Electricity, Water, Road, Sanitation, Health).
4. **Department Portal** (`/department`):
   - Department In-Charge workspace: oversees allocated civic problems.
   - **Technician Directory**: management of field technicians, auto-generated login credentials, and workload.
   - **Department Problem Action Panel**: single dedicated remediation panel with directive logs.
5. **Technician Portal** (`/technician`):
   - Mobile-first, on-ground interface for technicians in the field.
   - Work order acceptance (**"Accept Problem"** unhiding citizen contact) and completion workflow (**"Mark as Done"** with remedial remarks).
   - Responsive off-canvas drawer sidebar and fixed bottom navigation.
6. **University & Faculty Portal** (`/university`):
   - Problem statement bank accessible by academic institutions for R&D solutions and grant proposals.
7. **Industry & CSR Portal** (`/industry`):
   - Corporate co-funding, CSR fund deployment, and technology transfer workflows.
8. **State GIS Dashboard** (`/government`):
   - Comprehensive state-level map with district boundary choropleths, problem clustering, and severity heatmaps.

---

## 4. GIS & Geospatial Mapping Engine

The GIS architecture is encapsulated in `src/features/government/components/gis/` and utilizes a layered composite model:

```text
┌─────────────────────────────────────────────────────────────────┐
│                     GisMapCanvas.jsx                            │
│  ├── MapControls.jsx (Zoom, Recenter, Satellite/Light Toggle)   │
│  ├── MapLegendCard.jsx (Severity & Density Scale)               │
│  └── DistrictOverviewCard.jsx (Selected District KPI Summary)   │
├─────────────────────────────────────────────────────────────────┤
│ 1. Basemap Layer (mapTileConfig.js)                             │
│    ├── Light Vector Tiles: OpenStreetMap / MapTiler Streets     │
│    └── Satellite Imagery: ESRI World Imagery                    │
├─────────────────────────────────────────────────────────────────┤
│ 2. Administrative Boundary Layer (DistrictBoundariesLayer.jsx)  │
│    └── GeoJSON: jharkhand-districts.geojson (24 Districts)      │
│    └── Dynamic Choropleth styling based on problem density      │
├─────────────────────────────────────────────────────────────────┤
│ 3. District Floating Labels Layer (DistrictLabelsLayer.jsx)     │
│    └── Centroid labels with live problem count badges           │
├─────────────────────────────────────────────────────────────────┤
│ 4. Clustered Problem Markers Layer (ProblemMarkersLayer.jsx)    │
│    └── L.markerClusterGroup with spiderfying on zoom            │
│    └── L.divIcon with radar pulsing animation & severity color  │
├─────────────────────────────────────────────────────────────────┤
│ 5. Dynamic Heatmap Layer (ProblemHeatmapLayer.jsx)              │
│    └── L.heatLayer with weighted coordinates & blur gradient    │
└─────────────────────────────────────────────────────────────────┘
```

- **Bounding Box Guard**: Map restricts view to Jharkhand geographic boundaries (`[[21.9, 83.2], [25.4, 88.0]]`).
- **Tile Abstraction**: Environment-aware switching (`VITE_MAP_PROVIDER`, `VITE_MAPTILER_API_KEY`) with graceful fallback to OpenStreetMap.

---

## 5. State Management, Data Flow & Real-Time Sync

### Data Flow Architecture

```text
[ Database (MongoDB Atlas) ]
             ▲
             │ HTTP REST (JSON) / WebSockets (Events)
             ▼
[ Axios Client Interceptor (client.js) ]
             ▲
             │ Promises / Reactive State
             ▼
[ Service Layer (e.g. citizenService.js, technicianService.js) ]
             ▲
             │ React Hooks (useState, useEffect, useMemo)
             ▼
[ Feature Components (e.g. TechnicianProblemsList.jsx) ]
             ▲
             │ User Gestures (Taps, Filters, Clicks)
             ▼
[ DOM / Canvas / Leaflet Renderer ]
```

### State Management Strategy
1. **Global Auth State (`AuthContext.jsx`)**:
   - Stores JWT token in `localStorage`, keeps current user profile, role claims, and session expiry status.
2. **Component & Tab State**:
   - URL-synchronized tab state via query parameters (`?tab=problems&deptId=...`).
   - Pure functional lifting: modals and action panels are driven by explicit props (`challenge`, `isOpen`, `onClose`, `onUpdate`).
3. **Real-Time Communication**:
   - Socket.io connection (`socketClient.js`) connects to port `3000`.
   - Listens on challenge-specific clarification channels (`chat:message`, `chat:typing`, `challenge:updated`).

---

## 6. Mobile Responsiveness & Architectural Constraints

- **Mobile First Navigation**:
  - Desktop: Collapsible sidebar (`w-60` $\leftrightarrow$ `w-16`).
  - Mobile: Sidebar is hidden (`hidden md:flex`) and opens as an off-canvas drawer with backdrop overlay.
  - Portals (Citizen, Department, Technician) feature **Fixed Bottom Navigation Bars** with elevated touch targets and status badges.
- **Architectural Discipline (`RULE.md`)**:
  - Maximum **200 lines per file** strictly enforced via component decomposition.
  - Pure database-driven data flow with zero client-side mock/seed data.
  - Universal bottom-left pinned **Sign Out** button across all portal sidebars.
