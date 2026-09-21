# Module 11: Apex Government & State Innovation Cell

> **Module Path:** `src/features/government/`  
> **Type:** Strategic State Dashboard, Geospatial (GIS) Analytics & Policy Governance  
> **Key Technologies:** **Leaflet** (`^1.9.4`), **React Leaflet** (`^4.2.1`), **Leaflet Heat** (`^0.2.0`), **Leaflet Markercluster** (`^1.5.3`), **Recharts** (`^3.10.1`), jsPDF Export Services

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module State Government Leadership (Hon'ble Chief Minister's Office, Department of Higher & Technical Education, Planning & Development, District Collectors) ke liye apex monitoring dashboard hai. Iska primary kaam pure Jharkhand me chal rahe societal innovation projects ki macro picture dikhana, interactive GIS map par problem hotspots aur university clusters analyze karna, corporate CSR funds ke deployment ko track karna, aur administrative governance audit karna hai.

---

## 2. Directory Structure & Files

```
src/features/government/
├── index.js                                   # Barrel export
├── data/                                      # Static district boundaries & geo data
├── hooks/                                     # Custom data query hooks
├── services/
│   ├── adminService.js                        # System administrator accounts API
│   ├── exportPdfService.js                    # High-resolution bulk PDF directory export
│   ├── governmentDataService.js               # State KPIs, live database stats & triage
│   ├── industryService.js                     # State corporate industry registry
│   ├── projectCsrSyncService.js               # Financial CSR grant synchronizer
│   └── universityService.js                   # State university directory API
├── utils/                                     # Government calculations & formatters
└── components/
    ├── common/                                # Printable official dossiers & header tags
    ├── csr/                                   # CSR grant allocation & corporate funds panel
    ├── gis/                                   # Geospatial Information System (GIS) Engine
    │   ├── DistrictBoundariesLayer.jsx        # GeoJSON boundaries of all 24 districts
    │   ├── DistrictLabelsLayer.jsx            # Text labels for districts
    │   ├── DistrictOverviewCard.jsx           # Selected district telemetry & metrics
    │   ├── DistrictSearchAutocomplete.jsx     # Rapid search for districts / blocks
    │   ├── GisDetailedReportModal.jsx         # Full-screen GIS intelligence report
    │   ├── GisFilterBar.jsx                   # Sector, district, layer controls
    │   ├── GisMapCanvas.jsx                   # React Leaflet map canvas container
    │   ├── GisOverlays.jsx                    # Satellite / Street map tiles selector
    │   ├── GisProblemDetailModal.jsx          # Pinpoint problem detail popup
    │   ├── GisReportContent.jsx               # Tabular report content inside modal
    │   ├── GovernmentGisDashboard.jsx         # Master GIS module view
    │   ├── MapControls.jsx                    # Zoom, reset, layer toggles
    │   ├── MapLayersCard.jsx                  # Heatmap / Marker clustering layer toggles
    │   ├── MapLegendCard.jsx                  # Color intensity legend (High/Medium/Low)
    │   ├── ProblemHeatmapLayer.jsx            # Dynamic kernel density heatmap overlay
    │   └── ProblemMarkersLayer.jsx            # Clustered problem location pins
    ├── governance/                            # Admin, university & industry governance
    ├── heis/                                  # Higher Education Institutions monitoring
    ├── industries/                            # Corporate partners & CSR compliance
    ├── layout/                                # Government shell, header, sidebar & footer
    │   ├── govNavConfig.js                    # Navigation items & tab title definitions
    │   ├── GovernmentFooter.jsx
    │   ├── GovernmentHeader.jsx               # District & sector selectors + PDF export trigger
    │   ├── GovernmentLayout.jsx               # Master government container with 5s refresh
    │   ├── GovernmentSidebar.jsx              # Collapsible government sidebar
    │   └── GovernmentTabRouter.jsx            # Tab content switcher
    ├── overview/                              # Macro KPI cards, sector graphs & triage feed
    ├── projects/                              # Active state projects, proposals & prototypes
    ├── reports/                               # Strategic reports & parliamentary briefs
    ├── state-departments/                     # Line ministries coordination panel
    ├── triage/                                # Urgent government triage review
    ├── universities/                          # Campus innovation rankings & analytics
    └── updates/                               # Real-time state innovation notices
```

---

## 3. Specialized Technologies & Key Capabilities

### 3.1 Jharkhand Geospatial Information System (GIS) (`components/gis/`)
- **Technologies:** `leaflet`, `react-leaflet`, `leaflet.heat`, `leaflet.markercluster`.
- **Key GIS Capabilities:**
  - **`DistrictBoundariesLayer.jsx`:** Renders exact GeoJSON polygonal boundaries for all 24 Jharkhand districts with dynamic stroke highlighting and hover fill animations.
  - **`ProblemHeatmapLayer.jsx`:** Utilizes `leaflet.heat` to generate continuous density heatmaps reflecting areas with high civic problem density (e.g. industrial pollution in Dhanbad, water scarcity in Palamu).
  - **`ProblemMarkersLayer.jsx`:** High-performance clustered pins (`leaflet.markercluster`) preventing browser lag when rendering thousands of problem coordinates across the state.
  - **Pinpoint Inspection (`GisProblemDetailModal.jsx`):** Clicking any marker opens an immediate geospatial dossier showing local photos, reporting citizen, and assigned university lab.
  - **Layer Controls:** Toggle between OpenStreetMap standard tiles, satellite imagery, heatmap layer, and marker cluster layer.

### 3.2 Strategic State KPI Engine (`services/governmentDataService.js`)
- Auto-refreshes every 5 seconds (`refreshStats()`).
- Filters all metrics, charts, and triage feeds dynamically by **District** (All, Ranchi, Dhanbad, East Singhbhum, etc.) and **Sector** (Water, Energy, Healthcare, Agriculture, Infrastructure).
- Renders sector allocation distribution using `recharts` (Bar charts, Area charts, Pie distribution).

### 3.3 Corporate CSR Grant Allocation (`csr/`)
- Tracks corporate contributions under Section 135 Companies Act.
- Matches corporate funds (Tata Steel, SAIL, Coal India) with high-priority university research projects requiring prototype fabrication capital.

### 3.4 Multi-Directory PDF Export Services (`services/exportPdfService.js`)
- Generates official government printouts using `jspdf`:
  - `exportAdminDirectoryPdf`: Official roster of district and ministry admins.
  - `exportIndustryDirectoryPdf`: Active corporate CSR sponsors and committed budgets.
  - `exportUniversityDirectoryPdf`: Accredited HEI hubs and innovation capacities.
  - `exportGenericReportPdf`: Instant formatted report for any active tab.
