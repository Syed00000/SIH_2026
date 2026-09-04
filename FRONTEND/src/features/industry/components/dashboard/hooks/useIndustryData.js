import { useState, useEffect } from 'react';
import { universityApiService } from '../../../../university/services/universityApiService.js';
import { industryFundService } from '../../../services/industryFundService.js';

export const useIndustryData = (user) => {
  const [loading, setLoading] = useState(true);
  const [industryProfile, setIndustryProfile] = useState(null);
  const [stats, setStats] = useState({
    activeProjectsCount: 0,
    collaborationsCount: 0,
    totalCommitted: 0,
    totalDisbursed: 0,
    totalCommittedFormatted: '₹ 0.00 L'
  });

  const [collaborationRequests, setCollaborationRequests] = useState({
    received: [],
    sent: [],
    matched: []
  });

  const [projects, setProjects] = useState({
    ongoing: [],
    completed: []
  });

  // Dynamic industry funding state from backend
  const [fundingData, setFundingData] = useState({
    totalCommitted: 0,
    totalCommittedFormatted: '₹ 0.00 L',
    totalDisbursed: 0,
    totalRemaining: 0,
    distribution: [],
    funds: [],
    disbursements: [],
    incomingRequests: [],
    availableUniversities: []
  });

  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Real Industry Profile & Global Stats from MongoDB
      let profileData = null;
      try {
        const pRes = await industryFundService.getProfile();
        if (pRes?.data) {
          profileData = pRes.data.industry;
          setIndustryProfile(pRes.data.industry);
          if (pRes.data.stats) {
            setStats(pRes.data.stats);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch real industry profile:', err);
      }

      // 2. Fetch Real Industry Funds & Available Universities from MongoDB
      let liveFunds = null;
      try {
        const fRes = await industryFundService.getFunds(profileData?.legalName || user?.organizationName);
        if (fRes) {
          liveFunds = fRes;
          setFundingData(fRes);
        }
      } catch (err) {
        console.warn('Failed to fetch real industry funds:', err);
      }

      // 3. Extract Real Incoming Collaboration Requests from MongoDB
      let formattedRequests = [];
      if (liveFunds?.incomingRequests && liveFunds.incomingRequests.length > 0) {
        formattedRequests = liveFunds.incomingRequests.map((r) => {
          let requiredParts = [];
          if (r.fundingRequested) requiredParts.push('Funding');
          if (r.labAccessRequested) requiredParts.push('Testing & Lab');
          if (r.mentorshipRequested) requiredParts.push('Mentorship');
          return {
            id: r.requestId || r._id,
            requestId: r.requestId,
            title: r.projectTitle || 'N/A',
            university: r.universityName || r.universityCode || 'Ranchi University',
            universityCode: r.universityCode,
            required: requiredParts.join(' + ') || (r.fundingRequested ? 'Funding Support' : 'Research Collaboration'),
            budget: r.estimatedBudget || '₹ 0',
            amountNumber: r.amountNumber || 0,
            status: r.status || 'Pending',
            faculty: r.facultyName || 'Faculty Nodal Officer',
            date: r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-IN') : 'Recent'
          };
        });
      } else {
        try {
          const reqs = await universityApiService.getIndustryRequests();
          if (Array.isArray(reqs)) {
            formattedRequests = reqs.map((r) => ({
              id: r.requestId || r._id,
              requestId: r.requestId,
              title: r.projectTitle || 'N/A',
              university: r.universityName || r.universityCode || 'Ranchi University',
              universityCode: r.universityCode,
              required: r.fundingRequested ? 'Funding Support' : 'Research Collaboration',
              budget: r.estimatedBudget || '₹ 0',
              status: r.status || 'Pending',
              date: r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-IN') : 'Recent'
            }));
          }
        } catch {}
      }

      setCollaborationRequests({
        received: formattedRequests,
        sent: [],
        matched: []
      });

      // 4. Extract Real Active Projects from MongoDB (Zero Mock Data)
      let activeProjectsList = [];
      if (liveFunds?.availableUniversities && liveFunds.availableUniversities.length > 0) {
        liveFunds.availableUniversities.forEach((uni) => {
          if (Array.isArray(uni.activeProjects)) {
            uni.activeProjects.forEach((proj) => {
              activeProjectsList.push({
                id: proj.id,
                title: proj.title,
                university: uni.name,
                stage: proj.status || 'In Progress',
                budget: proj.sanctionedBudget || '₹ 0',
                disbursed: proj.disbursedAmount || '₹ 0',
                status: proj.disbursedAmount && proj.disbursedAmount !== '₹ 0' ? 'Funded' : 'Active'
              });
            });
          }
        });
      }

      setProjects({
        ongoing: activeProjectsList,
        completed: []
      });

    } catch (error) {
      console.error('Error loading real industry data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Real capabilities directly from Industry's registered domains in MongoDB
  const capabilitiesData = {
    expertise: industryProfile?.thematicDomains?.length 
      ? industryProfile.thematicDomains 
      : (industryProfile?.thematicDomain ? [industryProfile.thematicDomain] : [])
  };

  return {
    loading,
    industryProfile,
    stats,
    collaborationRequests,
    projects,
    capabilitiesData,
    fundingData,
    labsData: [],
    expertsData: [],
    documentsData: [],
    internshipsData: [],
    refreshData: loadData
  };
};

export default useIndustryData;
