export const FULL_PROJECTS_DATA = [
  {
    projectId: 'PRJ-1024',
    challengeId: 'CHL-1024',
    universityCode: 'RU001',
    title: 'Water Quality Monitoring in Rural Areas',
    domain: 'Water & Sanitation',
    district: 'Ranchi',
    status: 'In Progress',
    stage: 'Field Pilot & Telemetry',
    trlLevel: 'TRL-5',
    progressPercentage: 64,
    leadMentor: 'Dr. Priya Sharma',
    facultyMentor: {
      name: 'Dr. Priya Sharma',
      department: 'Water Resources Engineering',
      email: 'priya.sharma@ru.ac.in',
      phone: '+91 98351 22334'
    },
    studentTeam: 'Aqua Sentinel',
    teamMembersCount: 5,
    teamMembers: [
      { name: 'Ali Khan', role: 'Team Lead', department: 'Computer Science', avatar: 'AK' },
      { name: 'Neha Verma', role: 'IoT Hardware', department: 'Electronics', avatar: 'NV' },
      { name: 'Rahul Kumar', role: 'Data Analytics', department: 'Information Technology', avatar: 'RK' }
    ],
    problemStatement: 'Unsafe drinking water in rural areas of Ranchi is causing waterborne diseases. Real-time IoT sensor network tracks arsenic, fluoride, and pH levels with LoRaWAN telemetry.',
    budget: {
      total: 75000,
      utilized: 45000,
      thisMonthExpense: 12000,
      expenses: [
        { description: 'Sensor rig & LoRa nodes', amount: 28000, date: '15 May 2026' },
        { description: 'Water test reagents & calibration', amount: 17000, date: '22 May 2026' }
      ]
    },
    startDate: '20 May 2026',
    deadline: '30 Nov 2026',
    daysLeft: '192 days left',
    milestonesTotal: 4,
    milestonesCompleted: 3,
    milestones: [
      { id: 'M-1', title: 'Problem Mapping & Field Survey', status: 'Completed', dueDate: '10 Jun 2026', completedBy: 'Ali Khan' },
      { id: 'M-2', title: 'Sensor Rig Prototyping (TRL-4)', status: 'Completed', dueDate: '20 Jul 2026', completedBy: 'Neha Verma' },
      { id: 'M-3', title: 'NABL Water Calibration Testing', status: 'Completed', dueDate: '15 Aug 2026', completedBy: 'Dr. Priya Sharma' },
      { id: 'M-4', title: 'LoRa Gateway Field Installation', status: 'In Progress', dueDate: '30 Sep 2026', completedBy: 'Rahul Kumar' }
    ],
    impact: {
      beneficiaries: 14500,
      villages: 8,
      efficiencyGain: 34
    },
    documents: [
      { id: 'D-1', name: 'Survey Report.pdf', size: '2.4 MB', uploadedBy: 'Neha Verma', date: '21 May 2026' },
      { id: 'D-2', name: 'Sensor Calibration Log.pdf', size: '1.1 MB', uploadedBy: 'Ali Khan', date: '18 May 2026' }
    ],
    recentActivity: [
      { text: "Milestone 'NABL Water Calibration Testing' completed", user: 'Dr. Priya Sharma', time: '22 May 2026, 11:30 AM', type: 'milestone' },
      { text: "Document 'Sensor Calibration Log.pdf' uploaded", user: 'Ali Khan', time: '21 May 2026, 04:15 PM', type: 'document' },
      { text: "New comment on 'LoRa Gateway Field Installation'", user: 'Rahul Kumar', time: '20 May 2026, 02:30 PM', type: 'comment' }
    ]
  }
];
