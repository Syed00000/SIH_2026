export const INDUSTRY_TECH_DEPARTMENTS = [
  {
    id: 'IoT & Embedded',
    name: 'IoT & Embedded',
    description: 'Sensors, microcontrollers, long-range gateways & telemetry',
    tools: [
      {
        id: 'TECH-LORA-8901',
        name: 'Industrial LoRaWAN Gateway & Cloud Telemetry Suite',
        stack: ['LoRaWAN', 'ESP32', 'Arduino', 'MQTT', 'Node.js']
      }
    ]
  },
  {
    id: 'AI & Analytics',
    name: 'AI & Analytics',
    description: 'Edge computer vision, deep neural networks & predictive AI',
    tools: [
      {
        id: 'TECH-AIVIS-4202',
        name: 'Edge AI Computer Vision & Anomaly Detector SDK',
        stack: ['Python', 'OpenCV', 'PyTorch', 'TensorFlow Lite', 'Flask']
      }
    ]
  },
  {
    id: 'Hardware & Simulation',
    name: 'Hardware & Simulation',
    description: 'CAD modeling, turbulent CFD, stress testing & digital twin',
    tools: [
      {
        id: 'TECH-CAD-7719',
        name: 'Hydro-Mechanical CFD Simulation & Stress Bench',
        stack: ['CAD', 'SolidWorks', 'CFD', 'FEA', 'MATLAB']
      }
    ]
  },
  {
    id: 'Cloud & APIs',
    name: 'Cloud & APIs',
    description: 'Cloud microservices, streaming event bus & REST/gRPC endpoints',
    tools: [
      {
        id: 'TECH-CLOUD-5510',
        name: 'Enterprise Cloud Telemetry API & Kafka Stream',
        stack: ['Docker', 'Kubernetes', 'AWS', 'Kafka', 'REST']
      }
    ]
  },
  {
    id: 'Proprietary IP & Patents',
    name: 'Proprietary IP & Patents',
    description: 'Exclusive state technology patents, proprietary licenses & R&D rigs',
    tools: [
      {
        id: 'TECH-PATENT-3108',
        name: 'Proprietary IP & Patent R&D Pipeline',
        stack: ['Patents', 'Proprietary IP', 'Embedded R&D', 'Hardware Bench']
      }
    ]
  }
];

export const getAllIndustryTools = () => {
  return INDUSTRY_TECH_DEPARTMENTS.flatMap((dept) =>
    dept.tools.map((t) => ({ ...t, department: dept.name }))
  );
};
