# Module 06: Public Portal & Landing Showcase

> **Module Path:** `src/features/landing/`  
> **Type:** Public Information Showcase, State Overview & District Interactive Mapping  
> **Key Technologies:** SVG Vector Graphics, Lucide Icons, CSS Animation Timers, Tailwind CSS v4

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module JoharSetu portal ka public face hai. Iska kaam state citizens, visiting researchers, academic institutions, aur corporate investors ko portal ke vision, working model, live statistics, impact stories, aur Jharkhand ke geographic sector capabilities ko showcase karna hai bina login kiye.

---

## 2. Directory Structure & Files

```
src/features/landing/
├── assets/                                    # Hero banners, state landscape photography
└── components/
    ├── AboutJharkhandPage.jsx                 # Geography, minerals, demographic overview
    ├── AboutPage.jsx                          # Portal governance model & tri-partite structure
    ├── ContactPage.jsx                        # Helplines & district nodal directory
    ├── HeroCarousel.jsx                       # Automated hero slider with key initiatives
    ├── ImpactPage.jsx                         # Ground case studies & deployed solutions
    ├── IndustryLandingPage.jsx                # CSR partnership incentives & lab benefits
    ├── InstitutionsPage.jsx                   # Directory of onboarded colleges & universities
    ├── JharkhandDistrictMapModal.jsx          # Interactive vector map of all 24 districts
    ├── JharkhandOverviewSection.jsx           # State highlights and societal challenges
    ├── LandingPage.jsx                        # Master landing page layout
    ├── LiveTickersSection.jsx                 # Live counter statistics banner
    ├── QuickActionCards.jsx                   # Primary action triggers (Submit, Track, Directory)
    ├── SectorsGallery.jsx                     # Focus domain showcase cards
    └── layout/
        ├── LandingFooter.jsx                  # Official government footer
        ├── LandingHeader.jsx                  # State emblem & sticky navigation bar
        └── LandingLayout.jsx                  # Public wrapper shell
```

---

## 3. Sub-Components & Key Functionality

### 3.1 `LandingPage.jsx` (Master Showcase)
- **`HeroCarousel.jsx`:** Automated slideshow featuring:
  - Slide 1: Connecting Grassroots Problems with University Innovation Labs.
  - Slide 2: Corporate CSR Grants Fueling Student Prototypes.
  - Slide 3: Government of Jharkhand Departmental Problem Resolution.
- **`LiveTickersSection.jsx`:** Live statistical KPI counters:
  - 1,240+ Problems Identified.
  - 86 Universities & Research Colleges Onboarded.
  - 340+ Student & Faculty Prototypes Tested.
  - ₹ 4.8 Cr+ Corporate CSR Capital Deployed.
- **`QuickActionCards.jsx`:** Fast navigation triggers for users to:
  - File a Grassroots Problem (`/register` or `/citizen`).
  - Track Problem by Reference ID.
  - Access Higher Education Directory (`/institutions`).
- **`SectorsGallery.jsx`:** Interactive cards for key development domains (Water & Sanitation, Clean Energy, Smart Agriculture, Rural Healthcare, Tribal Livelihoods).

### 3.2 Interactive Jharkhand District Map Modal (`JharkhandDistrictMapModal.jsx`)
- **Technology:** SVG Vector Mapping, Dynamic Geo-Tooltip, State Coordinate Mapping.
- **Functionality:**
  - Jharkhand ke sabhi 24 districts ka high-precision interactive vector SVG map display karta hai.
  - District hover par real-time highlight aur population/sub-division details show karta hai.
  - District par click karne par popup modal open hota hai jisme:
    - Active Civic Problems count.
    - Assigned Local Universities (e.g. BIT Mesra for Ranchi, IIT ISM for Dhanbad, NIT for Jamshedpur).
    - Resolved Grassroots Projects list.

### 3.3 Informative Pages
1. **`AboutPage.jsx`:** Tri-partite model (Citizen $\leftrightarrow$ Higher Education Institution $\leftrightarrow$ Government Line Department) aur policy framework ka detailed walkthrough.
2. **`AboutJharkhandPage.jsx`:** Jharkhand state ki topography, major river basins (Subarnarekha, Damodar), mineral belts, aur rural development targets.
3. **`ImpactPage.jsx`:** Real-world case studies of low-cost water filtration systems, solar agricultural irrigation units, and rural telemetry deployments designed by students.
4. **`IndustryLandingPage.jsx`:** Corporate enterprises ke liye CSR compliance (Section 135) roadmap and test facility tax deduction incentives.
5. **`InstitutionsPage.jsx`:** State & Central university index with AISHE code directory.
6. **`ContactPage.jsx`:** Toll-free state helpline (1800-345-6789) and district nodal office addresses.
