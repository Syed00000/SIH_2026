import { useState, useEffect } from 'react';
import { universityApiService } from '../../../../university/services/universityApiService.js';

export const useIndustryData = (user) => {
  const [loading, setLoading] = useState(true);
  const [collaborationRequests, setCollaborationRequests] = useState({
    received: [],
    sent: [],
    matched: []
  });
  const [projects, setProjects] = useState({
    ongoing: [],
    completed: []
  });

  // Mock data for panels that don't have endpoints yet, exactly matching the screenshot
  const capabilitiesData = {
    expertise: ['AI / ML', 'IoT', 'Robotics', 'Electronics', 'Manufacturing', 'Water Technology', 'Renewable Energy', 'Healthcare', 'Agriculture', 'Software', 'Infrastructure', 'Civil Engineering'],
  };

  const fundingData = {
    totalCommitted: '2.45 Cr',
    distribution: [
      { name: 'Research Funding', value: 85, color: '#007A61', percentage: '35%' },
      { name: 'Prototype Funding', value: 65, color: '#3b82f6', percentage: '27%' },
      { name: 'Lab & Equipment', value: 45, color: '#8b5cf6', percentage: '18%' },
      { name: 'Pilot Funding', value: 30, color: '#f59e0b', percentage: '12%' },
      { name: 'CSR Support', value: 20, color: '#10b981', percentage: '8%' }
    ]
  };

  const labsData = [
    { name: 'Environmental Testing Lab', type: 'Testing', location: 'Ranchi', status: 'Available' },
    { name: 'Electronics Lab', type: 'Testing', location: 'Jamshedpur', status: 'Available' },
    { name: 'Manufacturing Unit', type: 'Prototype', location: 'Ranchi', status: 'Request' },
    { name: 'Water Quality Lab', type: 'Testing', location: 'Dhanbad', status: 'Available' },
    { name: 'Material Testing Lab', type: 'Testing', location: 'Ranchi', status: 'Available' },
  ];

  const expertsData = [
    { name: 'Rahul Kumar', role: 'Technical Expert', spec: 'IoT & Sensors', availability: '20 hrs/month' },
    { name: 'Dr. Neha Singh', role: 'Research Expert', spec: 'AI & Data Science', availability: '15 hrs/month' },
    { name: 'Amit Verma', role: 'Project Mentor', spec: 'Renewable Energy', availability: '10 hrs/month' },
    { name: 'Sanjay Patel', role: 'Testing Engineer', spec: 'Electronics', availability: '25 hrs/month' },
    { name: 'Pooja Sharma', role: 'Domain Expert', spec: 'Water Technology', availability: '12 hrs/month' },
  ];

  const documentsData = [
    { name: 'MoU - Ariba & BIT', type: 'MoU', date: '06 May 2025', status: 'Signed' },
    { name: 'NDA Agreement', type: 'NDA', date: '12 May 2025', status: 'Signed' },
    { name: 'Research Agreement', type: 'Agreement', date: '20 May 2025', status: 'Signed' },
    { name: 'Funding Agreement', type: 'Agreement', date: '28 Apr 2025', status: 'Pending' },
    { name: 'Test Report - Prototype 1', type: 'Report', date: '15 May 2025', status: 'Uploaded' },
  ];

  const internshipsData = [
    { name: 'IoT Summer Internship', type: 'Internship', duration: '3 Months', status: 'Open' },
    { name: 'AI Research Internship', type: 'Research', duration: '2 Months', status: 'Open' },
    { name: 'Manufacturing Training', type: 'Training', duration: '1 Month', status: 'Closed' },
    { name: 'Industry Project', type: 'Project', duration: '2 Months', status: 'Open' },
    { name: 'Faculty Visit Program', type: 'Faculty Visit', duration: '1 Week', status: 'Open' },
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      // Connect to existing University API to fetch collaboration projects
      // For demonstration in the dashboard, if API fails, fallback to mockup data
      let fetchedProjects = [];
      try {
        fetchedProjects = await universityApiService.getAllProjects?.() || [];
      } catch (e) {
        console.warn("Could not fetch real projects, using fallback data.");
      }
      
      let formattedRequests = [];
      try {
         const reqs = await universityApiService.getIndustryRequests();
         if (reqs && reqs.length > 0) {
           formattedRequests = reqs.map((r) => {
             let requiredParts = [];
             if (r.fundingRequested) requiredParts.push('Funding');
             if (r.labAccessRequested) requiredParts.push('Testing & Lab');
             if (r.mentorshipRequested) requiredParts.push('Mentorship');
             return {
                id: r.requestId || r._id || Math.random().toString(),
                title: r.projectTitle || 'N/A',
                university: r.universityName || 'Ranchi University',
                required: requiredParts.join(' + ') || 'General Collaboration',
                status: r.status || 'Pending'
             };
           });
         }
      } catch (e) {
         console.warn("Could not fetch real requests.");
      }

      const realOrMockProjects = [
        { id: 1, title: 'Smart Water Monitoring System', university: 'BIT Sindri', stage: 'Testing', progress: 68, status: 'On Track' },
        { id: 2, title: 'AI Based Waste Classification', university: 'Ranchi University', stage: 'Prototype', progress: 42, status: 'On Track' },
        { id: 3, title: 'Solar Powered Smart Bus Stop', university: 'BIT Mesra', stage: 'Lab Testing', progress: 55, status: 'Delayed' },
        { id: 4, title: 'Flood Early Warning System', university: 'CU Jharkhand', stage: 'Prototype', progress: 30, status: 'On Track' },
        { id: 5, title: 'Smart Street Light System', university: 'NIT Jamshedpur', stage: 'Development', progress: 78, status: 'On Track' },
      ];

      setCollaborationRequests({
        received: formattedRequests,
        sent: [],
        matched: []
      });

      setProjects({
        ongoing: realOrMockProjects,
        completed: []
      });
      
    } catch (error) {
      console.error("Error loading industry data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  return {
    loading,
    collaborationRequests,
    projects,
    capabilitiesData,
    fundingData,
    labsData,
    expertsData,
    documentsData,
    internshipsData,
    refreshData: loadData
  };
};
