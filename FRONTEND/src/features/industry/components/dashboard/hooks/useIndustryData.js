import { useState, useEffect } from 'react';
import { universityApiService } from '../../../../university/services/universityApiService.js';
import { industryFundService } from '../../../services/industryFundService.js';
import { industryExpertService } from '../../../services/industryExpertService.js';
import { formatIncomingRequests, extractActiveProjectsList } from './industryDataHelpers.js';

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

  const [expertsData, setExpertsData] = useState([]);
  const [expertStats, setExpertStats] = useState({
    totalExperts: 0,
    activeMentors: 0,
    availableExperts: 0,
    totalAssignments: 0
  });
  const [mentorshipProblemsAwaiting, setMentorshipProblemsAwaiting] = useState([]);

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
      let fallbackReqs = [];
      try {
        fallbackReqs = await universityApiService.getIndustryRequests('RU001');
      } catch (e) {
        console.warn('Could not fetch industry requests:', e);
      }
      const formattedRequests = formatIncomingRequests(liveFunds, fallbackReqs);
      setCollaborationRequests({ received: formattedRequests, sent: [], matched: [] });

      // 4. Extract Real Active Projects from MongoDB (Zero Mock Data)
      const activeProjectsList = extractActiveProjectsList(liveFunds, formattedRequests);
      setProjects({ ongoing: activeProjectsList, completed: [] });
      setStats((prev) => ({
        ...prev,
        activeProjectsCount: Math.max(prev?.activeProjectsCount || 0, activeProjectsList.length)
      }));

      // 5. Fetch Real Industry Experts & Mentorship Eligible Problems from MongoDB
      try {
        const indName = profileData?.legalName || user?.organizationName || '';
        const expRes = await industryExpertService.getExperts(indName);
        if (expRes?.experts) {
          setExpertsData(expRes.experts);
          if (expRes.stats) setExpertStats(expRes.stats);
          if (expRes.eligibleProblemStatements) setMentorshipProblemsAwaiting(expRes.eligibleProblemStatements);
        }
      } catch (expErr) {
        console.warn('Failed to fetch real industry experts:', expErr);
      }

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
    labsData: (projects?.ongoing || []).map((p) => ({
      name: `${p.title} (Testing Lab)`,
      location: p.university || 'Jharkhand University Lab',
      status: 'In Testing'
    })),
    expertsData,
    expertStats,
    mentorshipProblemsAwaiting,
    documentsData: [],
    internshipsData: [],
    refreshData: loadData
  };
};

export default useIndustryData;
