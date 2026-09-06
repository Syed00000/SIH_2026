// Prototype Stage Data Generator for all 4 distinct stages
export const getStageDetails = (project, stageIndex) => {
  const curTrlNum = parseInt(String(project.trlLevel || '4').replace('TRL-', ''), 10) || 4;

  if (stageIndex === 1) {
    const isUnlocked = curTrlNum >= 1;
    return {
      stageNum: 1,
      title: '1. College Lab Design',
      shortTitle: 'Lab Design',
      trlRange: 'TRL 1-3',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      isCompleted: curTrlNum >= 4,
      isCurrent: curTrlNum <= 3,
      isUnlocked,
      details: {
        labName: `${project.hei} Embedded & Robotics Innovation Lab`,
        leadScientist: project.teamLead || 'Lead Faculty Investigator',
        problemOrigin: project.problemOrigin || `${project.district} Rural Community Area`,
        labScope: 'Circuit schematic CAD simulation, PCB layout routing, and initial breadboard testing.',
        sensorRig: project.hardwareSpecs || 'Integrated embedded microcontroller with LoRaWAN wireless telemetry.',
        deliverables: [
          '3D CAD housing model fabricated',
          'Power consumption & solar battery profiling cleared',
          'Initial sensor calibration against baseline standards'
        ]
      }
    };
  }

  if (stageIndex === 2) {
    const isUnlocked = curTrlNum >= 4;
    return {
      stageNum: 2,
      title: '2. Ground & Field Tested',
      shortTitle: 'Field Test',
      trlRange: 'TRL 4-6',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      isCompleted: curTrlNum >= 7,
      isCurrent: curTrlNum >= 4 && curTrlNum <= 6,
      isUnlocked,
      details: {
        fieldLocation: `${project.district} District Field Sites (Panchayats & Mining Clusters)`,
        environmentTested: 'Real environmental stress: coal dust, high humidity, monsoon rain & thermal heat.',
        telemetryUptime: '99.2% RF Packet Delivery to JoharSetu Gateway',
        batteryEndurance: '72+ Hours Continuous Autonomous Operation',
        fieldOfficerSignoff: `Verified by District Technical Inspection Cell (${project.district})`,
        deliverables: [
          'Real ground environmental stress tests passed',
          'Autonomous battery endurance verified over 72 hours',
          'Live data packets received on JoharSetu IoT server'
        ]
      }
    };
  }

  if (stageIndex === 3) {
    const isUnlocked = curTrlNum >= 7;
    return {
      stageNum: 3,
      title: '3. State & NABL Certified',
      shortTitle: 'State Certified',
      trlRange: 'TRL 7-8',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
      isCompleted: curTrlNum >= 9,
      isCurrent: curTrlNum >= 7 && curTrlNum <= 8,
      isUnlocked,
      details: {
        certRef: `NABL-JH-${project.id}-2026-CAL`,
        testingAgency: project.testingPartner || 'National Accreditation Board for Testing and Calibration Labs (NABL)',
        safetyStandards: 'Passed IS/IEC 60950 electrical safety & RF radiation emissions benchmarks.',
        handoverStatus: 'Official State Safety Clearance Accorded — Ready for District Handover',
        deliverables: [
          'NABL calibrated laboratory certification awarded',
          'State Government technical steering committee vetting cleared',
          'District administration procurement compliance signed'
        ]
      }
    };
  }

  // Stage 4
  const isUnlocked = curTrlNum >= 9;
  return {
    stageNum: 4,
    title: '4. Public Deployment',
    shortTitle: 'Public Deploy',
    trlRange: 'TRL 9',
    badgeColor: 'bg-slate-900 text-white border-slate-900',
    isCompleted: curTrlNum >= 9,
    isCurrent: curTrlNum >= 9,
    isUnlocked,
    details: {
      deploymentSite: `${project.district} District Community Centers, Hostels & Panchayats`,
      beneficiariesCount: '12,500+ Rural Citizens, Farmers & Students',
      liveSystemUptime: '99.8% Live Uptime on JoharSetu State Cloud Gateway',
      socialImpact: 'Local community challenge solved with zero ground leakage and automated public telemetry.',
      deliverables: [
        'Mass district-wide deployment operational',
        'Direct beneficiary tracking active on JoharSetu ledger',
        'Final state innovation completion certificate generated'
      ]
    }
  };
};
