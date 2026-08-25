// Accurate GeoJSON feature collection representing Jharkhand's 24 districts with problem density metrics
export const JHARKHAND_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "dhanbad",
        name: "Dhanbad",
        density: "Very High",
        color: "#ef4444", // Red
        problems: 2180,
        solved: 1640,
        activeHeis: 14,
        topSector: "Infrastructure & Mining"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[86.15, 23.95], [86.55, 23.95], [86.65, 23.70], [86.40, 23.65], [86.15, 23.80], [86.15, 23.95]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "ranchi",
        name: "Ranchi",
        density: "High",
        color: "#fb923c", // Orange
        problems: 1840,
        solved: 1520,
        activeHeis: 28,
        topSector: "Water & Urban Waste"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[85.10, 23.55], [85.65, 23.55], [85.60, 23.15], [85.15, 23.20], [85.10, 23.55]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "bokaro",
        name: "Bokaro",
        density: "High",
        color: "#fb923c",
        problems: 1420,
        solved: 1110,
        activeHeis: 12,
        topSector: "Pollution & Industrial"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[85.70, 23.90], [86.15, 23.90], [86.15, 23.60], [85.70, 23.60], [85.70, 23.90]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "seraikela",
        name: "Seraikela Kharsawan",
        density: "High",
        color: "#fb923c",
        problems: 980,
        solved: 760,
        activeHeis: 8,
        topSector: "Roads & Rural Infra"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[85.70, 22.95], [86.20, 22.95], [86.10, 22.60], [85.60, 22.65], [85.70, 22.95]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "hazaribagh",
        name: "Hazaribagh",
        density: "Medium",
        color: "#fde047", // Yellow
        problems: 720,
        solved: 590,
        activeHeis: 16,
        topSector: "Agriculture & Water"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[85.15, 24.25], [85.70, 24.25], [85.70, 23.85], [85.15, 23.85], [85.15, 24.25]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "deoghar",
        name: "Deoghar",
        density: "Medium",
        color: "#fde047",
        problems: 680,
        solved: 530,
        activeHeis: 10,
        topSector: "Sanitation & Tourism"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[86.50, 24.60], [86.95, 24.60], [86.90, 24.20], [86.50, 24.20], [86.50, 24.60]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "dumka",
        name: "Dumka",
        density: "Medium",
        color: "#fde047",
        problems: 640,
        solved: 480,
        activeHeis: 9,
        topSector: "School Infrastructure"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[87.00, 24.50], [87.50, 24.50], [87.45, 24.10], [87.00, 24.10], [87.00, 24.50]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "khunti",
        name: "Khunti",
        density: "Medium",
        color: "#fde047",
        problems: 510,
        solved: 420,
        activeHeis: 6,
        topSector: "Livelihood & Forestry"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[85.10, 23.15], [85.55, 23.15], [85.50, 22.80], [85.10, 22.80], [85.10, 23.15]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "giridih",
        name: "Giridih",
        density: "Low",
        color: "#86efac", // Light Green
        problems: 430,
        solved: 370,
        activeHeis: 7,
        topSector: "Health Facility"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[85.80, 24.40], [86.40, 24.40], [86.35, 24.00], [85.80, 24.00], [85.80, 24.40]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "palamu",
        name: "Palamu",
        density: "Low",
        color: "#86efac",
        problems: 390,
        solved: 320,
        activeHeis: 6,
        topSector: "Drought & Water"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[83.90, 24.40], [84.60, 24.40], [84.55, 23.90], [83.90, 23.90], [83.90, 24.40]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "chatra",
        name: "Chatra",
        density: "Low",
        color: "#86efac",
        problems: 340,
        solved: 290,
        activeHeis: 5,
        topSector: "Rural Connectivity"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[84.65, 24.40], [85.15, 24.40], [85.10, 23.90], [84.65, 23.90], [84.65, 24.40]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "koderma",
        name: "Koderma",
        density: "Low",
        color: "#86efac",
        problems: 310,
        solved: 270,
        activeHeis: 4,
        topSector: "Education & Skills"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[85.45, 24.65], [85.90, 24.65], [85.85, 24.30], [85.45, 24.30], [85.45, 24.65]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "latehar",
        name: "Latehar",
        density: "Low",
        color: "#86efac",
        problems: 290,
        solved: 240,
        activeHeis: 4,
        topSector: "Forest Tribal Welfare"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[84.20, 23.90], [84.80, 23.90], [84.75, 23.50], [84.20, 23.50], [84.20, 23.90]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "lohardaga",
        name: "Lohardaga",
        density: "Low",
        color: "#86efac",
        problems: 260,
        solved: 220,
        activeHeis: 3,
        topSector: "Bauxite Transport Roads"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[84.50, 23.50], [84.95, 23.50], [84.90, 23.20], [84.50, 23.20], [84.50, 23.50]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "gumla",
        name: "Gumla",
        density: "Low",
        color: "#86efac",
        problems: 320,
        solved: 270,
        activeHeis: 5,
        topSector: "Agriculture & Storage"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[84.30, 23.20], [84.90, 23.20], [84.85, 22.70], [84.30, 22.70], [84.30, 23.20]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "simdega",
        name: "Simdega",
        density: "Low",
        color: "#86efac",
        problems: 240,
        solved: 210,
        activeHeis: 3,
        topSector: "Sports & Skill Training"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[84.10, 22.70], [84.70, 22.70], [84.65, 22.25], [84.10, 22.25], [84.10, 22.70]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "west-singhbhum",
        name: "West Singhbhum",
        density: "Very Low",
        color: "#22c55e", // Green
        problems: 480,
        solved: 430,
        activeHeis: 6,
        topSector: "Healthcare in Remote Pockets"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[85.00, 22.65], [85.80, 22.65], [85.75, 22.00], [85.00, 22.00], [85.00, 22.65]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "east-singhbhum",
        name: "East Singhbhum",
        density: "High",
        color: "#fb923c",
        problems: 1350,
        solved: 1140,
        activeHeis: 19,
        topSector: "Garbage & Industrial"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[86.10, 22.80], [86.70, 22.80], [86.60, 22.20], [86.10, 22.20], [86.10, 22.80]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "jamtara",
        name: "Jamtara",
        density: "Low",
        color: "#86efac",
        problems: 210,
        solved: 180,
        activeHeis: 3,
        topSector: "Cyber Awareness & Rural Infra"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[86.70, 24.15], [87.10, 24.15], [87.05, 23.85], [86.70, 23.85], [86.70, 24.15]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "pakur",
        name: "Pakur",
        density: "Low",
        color: "#86efac",
        problems: 280,
        solved: 230,
        activeHeis: 3,
        topSector: "Stone Quarry Safety & Health"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[87.60, 24.80], [87.95, 24.80], [87.90, 24.50], [87.60, 24.50], [87.60, 24.80]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "godda",
        name: "Godda",
        density: "Low",
        color: "#86efac",
        problems: 290,
        solved: 250,
        activeHeis: 4,
        topSector: "Rural Electricity & Irrigation"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[87.10, 25.10], [87.60, 25.10], [87.55, 24.60], [87.10, 24.60], [87.10, 25.10]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "sahibganj",
        name: "Sahibganj",
        density: "Low",
        color: "#86efac",
        problems: 310,
        solved: 260,
        activeHeis: 4,
        topSector: "Ganga Erosion & Water"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[87.60, 25.35], [88.00, 25.35], [87.95, 24.80], [87.60, 24.80], [87.60, 25.35]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "garhwa",
        name: "Garhwa",
        density: "Low",
        color: "#86efac",
        problems: 320,
        solved: 280,
        activeHeis: 3,
        topSector: "Water Scarcity & Irrigation"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[83.35, 24.35], [83.95, 24.35], [83.90, 23.85], [83.35, 23.85], [83.35, 24.35]]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "ramgarh",
        name: "Ramgarh",
        density: "Medium",
        color: "#fde047",
        problems: 590,
        solved: 480,
        activeHeis: 7,
        topSector: "Coal Mining Rehabilitation"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[85.40, 23.80], [85.85, 23.80], [85.80, 23.45], [85.40, 23.45], [85.40, 23.80]]]
      }
    }
  ]
};

export default JHARKHAND_GEOJSON;
