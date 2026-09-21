# Module 07: Citizen Portal & Grassroots Problem Submission

> **Module Path:** `src/features/citizen/`  
> **Type:** Citizen Grievance Intake, Multimedia Evidence Upload & Live Milestone Tracking  
> **Key Technologies:** Multipart FormData Uploads, Responsive Mobile-First Navigation, Lucide React, API Services

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module Jharkhand ke aam nagrikon (citizens, gram panchayat residents, farmers, urban local residents) ko apni buniyaadi samasyaon (pani ki samasya, road damage, electricity shortage, crop disease) ko seedhe portal par darj karne, photos/documents as evidence attach karne, aur live real-time dekhne ki suvidha deta hai ki kaun si university ya sarkari vibhaag unke problem par kaam kar raha hai.

---

## 2. Directory Structure & Files

```
src/features/citizen/
├── CitizenPortal.jsx                          # Main portal shell with tab & viewport controller
├── services/
│   └── citizenService.js                      # API connectors (submit, fetch, evidence, withdraw)
└── components/
    ├── CitizenBottomNav.jsx                   # Fixed bottom navigation bar for mobile devices
    ├── CitizenChallengeDetailModal.jsx        # Complete challenge detail with milestone stepper
    ├── CitizenHeader.jsx                      # Header with notification popover & profile link
    ├── CitizenHeroBanner.jsx                  # Motivational banner with quick 'Submit' trigger
    ├── CitizenHome.jsx                        # Citizen home tab with status cards & recent problems
    ├── CitizenMyChallenges.jsx                # Full challenge listing with multi-status filters
    ├── CitizenNotificationPopover.jsx         # Notifications drawer for state updates
    ├── CitizenProfile.jsx                     # Citizen profile, location settings & stats
    ├── CitizenSidebar.jsx                     # Collapsible desktop sidebar navigation
    ├── CitizenThemedSelect.jsx                # Custom dropdown for sectors & districts
    ├── ImpactStatsBanner.jsx                  # Personal impact numbers (Submitted, Solved)
    ├── MyActivitiesTracker.jsx                # Activity summary tracker card
    ├── PopularChallengeAreas.jsx              # Domain suggestion cards (Water, Solar, Road)
    ├── RecentChallengesCard.jsx               # Snapshot card of the latest reported issue
    ├── StayUpdatedSection.jsx                 # Citizen helpline & policy guidelines links
    ├── SubmitChallengeFormFields.jsx          # Form input controls for problem filing
    ├── SubmitChallengeModal.jsx               # Full-screen modal / inline problem filing flow
    ├── SubmitChallengeSuccessView.jsx         # Submission success view with Reference ID
    ├── detail/                                # Modular detail subcomponents
    ├── evidence/                              # Photo & media upload preview cards
    └── sections/                              # Section layout helpers
```

---

## 3. Sub-Components & Core Workflows

### 3.1 `CitizenPortal.jsx` (Master Layout Controller)
- **Tabs State Management:** `home`, `challenges`, `submit`, `profile`, `guidelines`.
- **Desktop & Mobile Dual Navigation:**
  - Desktop par collapsible `CitizenSidebar.jsx`.
  - Mobile (< 768px) par fixed 5-tab `CitizenBottomNav.jsx` with elevated center (+) green button.

### 3.2 Problem Submission Engine (`SubmitChallengeModal.jsx`)
- **Step-by-Step Problem Submission:**
  - **Category / Domain:** Water Resources, Agriculture & Irrigation, Smart Infrastructure, Rural Healthcare, Clean Energy, Sanitation.
  - **Title & Description:** Citizen ground testimony in simple terms.
  - **Impact Metrics:** Estimated affected population count (e.g. 5,000 residents).
  - **Location Jurisdiction:** Auto-populated from citizen profile (District, Block, Panchayat/Ward, Landmark, Pincode).
- **Multipart Evidence Upload System (`citizenService.uploadEvidence`):**
  - Allows uploading site photos, videos, or documents directly via `FormData` to `/api/v1/citizen/media/upload`.
  - Image preview lightbox and file size validations.
- **Success State:** Generates unique tracking reference ID (e.g. `CHL-JH-2026-0089`).

### 3.3 Live Problem Tracking (`CitizenMyChallenges.jsx`)
- **Status Filter Chips:** `All`, `Submitted` (Green), `Under Review` (Amber), `In Progress` (Blue), `Resolved` (Emerald).
- **Domain Filter:** Filter challenges by specific technical sectors.
- **Challenge Cards Display:**
  - Title, Date Filed, Unique Reference ID, Priority badge.
  - Assigned University or Department name.
  - Current Milestone Status.

### 3.4 Deep-Inspection Modal (`CitizenChallengeDetailModal.jsx`)
- **5-Stage Milestone Stepper:**
  1. *Citizen Submission Logged*
  2. *Nodal Screening & Triage*
  3. *HEI / Department Allocation*
  4. *Field Testing & Prototype R&D*
  5. *Final Ground Resolution & Verification*
- **Evidence Lightbox:** View uploaded ground photographs.
- **Clarification Chat Trigger:** One-click launch of real-time discussion with assigned university faculty and nodal officer (`ClarificationChatModal`).
- **Challenge Withdrawal:** Citizen has the formal ability to withdraw their submission if the issue is solved locally (`citizenService.withdrawChallenge`).

### 3.5 API Service Layer (`services/citizenService.js`)
- `submitChallenge(challengeData)` $\rightarrow$ `POST citizen/challenges`
- `fetchChallenges(params)` $\rightarrow$ `GET citizen/challenges`
- `fetchMyChallenges(params)` $\rightarrow$ `GET citizen/challenges/my`
- `fetchStats()` $\rightarrow$ `GET citizen/stats`
- `uploadEvidence(file, metadata)` $\rightarrow$ `POST citizen/media/upload`
- `withdrawChallenge(challengeId, reason)` $\rightarrow$ `PATCH citizen/challenges/:id/withdraw`
