import { useState, useEffect } from 'react';
import { universityApiService } from '../../services/universityApiService.js';
import apiClient from '../../../../infrastructure/api/client.js';

export const usePartnershipModalData = (isOpen, initialPartner, initialProblem) => {
  const [partners, setPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [problemStatements, setProblemStatements] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [outcome, setOutcome] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([
      universityApiService.getPartners('RU001'),
      universityApiService.getAssignedChallenges('RU001'),
      apiClient.get('citizen/challenges?limit=100').catch(() => ({ data: { challenges: [] } })),
      universityApiService.getProjects('RU001')
    ]).then(([partnersList, chlData, citizenRes, prjList]) => {
      const pList = Array.isArray(partnersList) ? partnersList : (Array.isArray(partnersList?.data) ? partnersList.data : []);
      setPartners(pList);
      if (initialPartner) setSelectedPartnerId(initialPartner.partnerId || initialPartner._id);
      else if (pList.length > 0) setSelectedPartnerId(pList[0].partnerId || pList[0]._id);

      const assigned = chlData?.challenges || (Array.isArray(chlData) ? chlData : []);
      const citizenList = citizenRes?.data?.challenges || (Array.isArray(citizenRes?.data) ? citizenRes.data : []);
      const allChallenges = [...assigned];
      citizenList.forEach((c) => {
        const cId = c.challengeId || c.id || c._id;
        if (!allChallenges.some((a) => (a.challengeId || a.id || a._id) === cId)) {
          allChallenges.push(c);
        }
      });

      const chls = allChallenges.map((c) => ({
        id: c.challengeId || c.id || c._id || `CHL-${Date.now()}`,
        title: c.title,
        problemStatement: c.problemStatement || c.description || c.title,
        domain: c.domain || c.aiCategory || 'Urban Development',
        location: c.location?.district || c.locationDetails?.district || (typeof c.location === 'string' ? c.location : 'Jharkhand'),
        facultyName: c.assignedFaculty?.name || c.assignedUniversity?.mentorName || c.nodalOfficer?.name || '',
        studentTeam: 'Student Research Team',
        type: 'CHALLENGE'
      }));

      const prjs = (Array.isArray(prjList) ? prjList : (Array.isArray(prjList?.data) ? prjList.data : []))
        .filter((p) => !chls.some((c) => c.id === p.challengeId || c.title?.toLowerCase() === p.title?.toLowerCase()))
        .map((p) => ({
          id: p.projectId || p.id,
          title: p.title,
          problemStatement: p.problemStatement || p.title,
          domain: p.domain || 'University R&D',
          location: 'Jharkhand',
          facultyName: p.leadMentor || p.facultyMentor?.name || '',
          studentTeam: p.studentTeam || 'University Research Team',
          type: 'PROJECT'
        }));

      const allCombined = [...chls, ...prjs, { id: 'custom', title: '+ Other / Custom Problem Statement', problemStatement: '' }];
      setProblemStatements(allCombined);

      if (allCombined.length > 0) {
        let chosen = allCombined[0];
        if (initialProblem) {
          const matched = allCombined.find((p) => p.id === initialProblem.id || p.title?.toLowerCase() === initialProblem.title?.toLowerCase());
          if (matched) chosen = matched;
        }
        setSelectedProblem(chosen);
        setOutcome(`R&D validation & lab testing for problem statement: "${chosen.problemStatement || chosen.title}". Technical facilities and sample testing required.`);
      }
    }).catch((err) => console.error('Error fetching modal data:', err));
  }, [isOpen, initialPartner, initialProblem]);

  return {
    partners,
    selectedPartnerId,
    setSelectedPartnerId,
    problemStatements,
    selectedProblem,
    setSelectedProblem,
    outcome,
    setOutcome
  };
};

export default usePartnershipModalData;
