# 🏛️ JoharSetu — Frontend

> **Smart India Hackathon (SIH 2026) Official Repository**  
> A State-Grade Digital Public Infrastructure connecting Citizens, Universities, Industries, and Government Departments.

📖 **For detailed architecture, component design, departmental flowcharts, and technical evaluation, see [ARCHITECTURE_README.md](./ARCHITECTURE_README.md).**

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Local development server runs on: `http://localhost:5173`

### 3. Production Build Compilation
```bash
npm run build
```

---

## 🎨 Design System & Theme
- **Primary Aesthetic**: JoharSetu Official Forest Green (`#007A61`) and Emerald Accent (`#005C48`).
- **Typography**: Inter & Outfit (Google Fonts).
- **Icons**: Lucide React.
- **Micro-Animations**: Framer Motion.
- **GIS Heatmap**: Leaflet & Leaflet-Heat.

---

## 🛡️ Role-Based Portal Access

| Role | Default Route | Target Audience |
| :--- | :--- | :--- |
| **Public / Guest** | `/` (Landing Page) | All citizens, visitors, transparency portal |
| **Citizen** | `/citizen` | Challenge submission, status tracker, guidelines |
| **Government Admin** | `/government` | AI triage feed, GIS heatmaps, department management, PDF exports |
| **Nodal Officer** | `/nodal` | District level triage, university coordination |
| **University / HEI** | `/university` | Academic lab allocation, project claims, milestone telemetry |
| **Industry Partner** | `/industry-portal` | CSR funding commitments, prototype commercialization |
| **Department** | `/department` | Field execution, municipal verification |
