// Comprehensive datasets for JoharSetu Government & Admin Portal
export const MOCK_KPI_SUMMARY = {
  problemsReceived: {
    value: "12,450",
    numeric: 12450,
    growthText: "+320 this week",
    growthDirection: "up",
    icon: "clipboard"
  },
  activeHeis: {
    value: "340",
    numeric: 340,
    growthText: "+18 this month",
    growthDirection: "up",
    icon: "building"
  },
  csrFunds: {
    value: "₹4.2 Cr",
    numeric: 42000000,
    growthText: "+1.1 Cr this month",
    growthDirection: "up",
    icon: "rupee"
  },
  problemsSolved: {
    value: "10,850",
    numeric: 10850,
    growthText: "+410 this week",
    growthDirection: "up",
    icon: "check"
  }
};

export const MOCK_AI_TRIAGE_FEED = [
  {
    id: "tri-001",
    category: "WATER",
    title: "Water Supply Issue",
    district: "Dhanbad",
    ward: "Ward 15",
    locationDetail: "Tube Well Disrupted",
    fullAddress: "Dhanbad | Ward 15 | Tube Well Disrupted",
    confidence: 94,
    submittedBy: "Rajesh Mahto (Citizen)",
    severity: "HIGH",
    timeAgo: "12 mins ago",
    status: "PENDING",
    aiAnalysis: "Identified urgent community drinking water outage. Priority match recommended for BIT Sindri Water Dept.",
    recommendedHei: "BIT Sindri"
  },
  {
    id: "tri-002",
    category: "ROAD",
    title: "Road Damage",
    district: "Ranchi",
    ward: "Ormanjhi",
    locationDetail: "Main Road",
    fullAddress: "Ranchi | Village Ormanjhi | Main Road",
    confidence: 91,
    submittedBy: "Sunil Munda (Panchayat Nodal)",
    severity: "MEDIUM",
    timeAgo: "34 mins ago",
    status: "PENDING",
    aiAnalysis: "Pothole clusters creating dangerous transit bottleneck. Civil Engineering rapid soil survey requested.",
    recommendedHei: "BIT Mesra"
  },
  {
    id: "tri-003",
    category: "GARBAGE",
    title: "Garbage Accumulation",
    district: "Jamshedpur",
    ward: "Sakchi",
    locationDetail: "Public Area",
    fullAddress: "Jamshedpur | Sakchi | Public Area",
    confidence: 89,
    submittedBy: "Pooja Verma (Citizen)",
    severity: "MEDIUM",
    timeAgo: "1 hour ago",
    status: "PENDING",
    aiAnalysis: "Severe municipal overflow near commercial market. Bio-waste recycling intervention needed.",
    recommendedHei: "NIT Jamshedpur"
  },
  {
    id: "tri-004",
    category: "SCHOOL",
    title: "School Infrastructure",
    district: "Dumka",
    ward: "Govt. School",
    locationDetail: "Classroom Issue",
    fullAddress: "Dumka | Govt. School | Classroom Issue",
    confidence: 88,
    submittedBy: "Principal S. Soren (Educator)",
    severity: "HIGH",
    timeAgo: "2 hours ago",
    status: "PENDING",
    aiAnalysis: "Roof seepage risk during monsoon. Structural stability assessment by University team recommended.",
    recommendedHei: "Sido Kanhu Murmu University"
  },
  {
    id: "tri-005",
    category: "HEALTH",
    title: "Health Facility Issue",
    district: "Giridih",
    ward: "PHC Deori",
    locationDetail: "Staff Shortage",
    fullAddress: "Giridih | PHC Deori | Staff Shortage",
    confidence: 87,
    submittedBy: "Dr. Ananya Roy (Medical Officer)",
    severity: "HIGH",
    timeAgo: "3 hours ago",
    status: "PENDING",
    aiAnalysis: "Primary healthcare center staff deficit. Tele-medicine triage and nursing college rotation advised.",
    recommendedHei: "AIIMS Deoghar / VBU"
  }
];

export const MOCK_SECTORS_DATA = [
  { name: "Water Management", count: 2850, percentage: 22, color: "#3b82f6" },
  { name: "Infrastructure", count: 2430, percentage: 20, color: "#f97316" },
  { name: "Education", count: 1980, percentage: 16, color: "#a855f7" },
  { name: "Health", count: 1560, percentage: 12, color: "#ef4444" },
  { name: "Sanitation", count: 1350, percentage: 11, color: "#10b981" },
  { name: "Agriculture", count: 1150, percentage: 9, color: "#eab308" },
  { name: "Others", count: 1130, percentage: 9, color: "#64748b" }
];

export const MOCK_TREND_DATA = {
  points: [
    { month: "Dec 2025", count: 6240 },
    { month: "Jan 2026", count: 6980 },
    { month: "Feb 2026", count: 7120 },
    { month: "Mar 2026", count: 8050 },
    { month: "Apr 2026", count: 9200 },
    { month: "May 2026", count: 12450 }
  ],
  thisMonth: "12,450",
  lastMonth: "9,200",
  growth: "35.33% ↑"
};

export const MOCK_TOP_HEIS = [
  { id: "hei-1", name: "BIT Mesra", projects: 28, solved: 156, leadDistrict: "Ranchi", ranking: 1, fundsReceived: "₹68 Lakh" },
  { id: "hei-2", name: "Ranchi University", projects: 22, solved: 132, leadDistrict: "Ranchi / Khunti", ranking: 2, fundsReceived: "₹52 Lakh" },
  { id: "hei-3", name: "NIT Jamshedpur", projects: 19, solved: 118, leadDistrict: "East Singhbhum", ranking: 3, fundsReceived: "₹45 Lakh" },
  { id: "hei-4", name: "Kolhan University", projects: 16, solved: 98, leadDistrict: "West Singhbhum", ranking: 4, fundsReceived: "₹38 Lakh" },
  { id: "hei-5", name: "Vinoba Bhave University", projects: 14, solved: 87, leadDistrict: "Hazaribagh", ranking: 5, fundsReceived: "₹34 Lakh" },
  { id: "hei-6", name: "IIT (ISM) Dhanbad", projects: 12, solved: 82, leadDistrict: "Dhanbad", ranking: 6, fundsReceived: "₹40 Lakh" },
  { id: "hei-7", name: "Sido Kanhu Murmu University", projects: 11, solved: 74, leadDistrict: "Dumka", ranking: 7, fundsReceived: "₹29 Lakh" }
];

export const MOCK_CSR_GRANTS = [
  { id: "csr-1", partner: "Tata Steel Foundation", committed: "₹1.8 Cr", disbursed: "₹1.2 Cr", activeProjects: 14, focus: "Water & Skill Dev" },
  { id: "csr-2", partner: "Coal India Limited (CIL)", committed: "₹1.2 Cr", disbursed: "₹85 Lakh", activeProjects: 9, focus: "Mine Land Solar" },
  { id: "csr-3", partner: "Jindal Steel & Power (JSPL)", committed: "₹75 Lakh", disbursed: "₹45 Lakh", activeProjects: 6, focus: "Health & Nutrition" },
  { id: "csr-4", partner: "NTPC CSR Trust", committed: "₹45 Lakh", disbursed: "₹30 Lakh", activeProjects: 4, focus: "Education Infra" }
];

export const MOCK_AUDIT_LOGS = [
  { id: "aud-101", timestamp: "2026-05-22 11:24 AM", actor: "Admin (Super Admin)", action: "Approved AI Triage #tri-001 for BIT Sindri", ip: "10.0.12.4" },
  { id: "aud-102", timestamp: "2026-05-22 10:45 AM", actor: "Dr. K. Sharma (Nodal Officer)", action: "Allocated ₹12L CSR Grant from Tata Steel to NIT Jamshedpur", ip: "10.0.12.8" },
  { id: "aud-103", timestamp: "2026-05-22 09:15 AM", actor: "System AI Engine", action: "Completed Jharkhand GIS District Heatmap sync", ip: "127.0.0.1" },
  { id: "aud-104", timestamp: "2026-05-21 04:30 PM", actor: "Admin (Super Admin)", action: "Sanctioned 8 new innovation projects for Ranchi University", ip: "10.0.12.4" }
];

export const JHARKHAND_DISTRICTS_LIST = [
  "All",
  "Ranchi", "Dhanbad", "East Singhbhum", "Bokaro", "Hazaribagh", 
  "Deoghar", "Dumka", "Giridih", "Palamu", "Latehar", 
  "Gumla", "Simdega", "West Singhbhum", "Seraikela Kharsawan", "Jamtara", 
  "Pakur", "Godda", "Sahibganj", "Koderma", "Chatra", 
  "Lohardaga", "Khunti", "Garhwa", "Ramgarh"
];

export const SECTORS_LIST = [
  "All",
  "Water Management", "Infrastructure", "Education", 
  "Health", "Sanitation", "Agriculture", "Others"
];
