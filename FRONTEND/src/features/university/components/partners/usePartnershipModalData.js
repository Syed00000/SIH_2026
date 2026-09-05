import { useState, useEffect } from 'react';
import { universityApiService } from '../../services/universityApiService.js';

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
      universityApiService.getProjects('RU001')
    ]).then(([partnersList, prjList]) => {
      const pList = Array.isArray(partnersList) ? partnersList : (Array.isArray(partnersList?.data) ? partnersList.data : []);
      setPartners(pList);
      if (initialPartner) setSelectedPartnerId(initialPartner.partnerId || initialPartner._id);
      else if (pList.length > 0) setSelectedPartnerId(pList[0].partnerId || pList[0]._id);

      const prjs = (Array.isArray(prjList) ? prjList : (Array.isArray(prjList?.data) ? prjList.data : []));
      // ONLY projects submitted by student research teams to university!
      const submitted = prjs
        .filter((p) => p.sentToUniversity === true || p.prototypeStatus === 'In Review' || p.prototypeStatus === 'Approved')
        .map((p) => ({
          id: p.projectId || p.id,
          title: p.title,
          problemStatement: p.problemStatement || p.title,
          domain: p.domain || 'University R&D',
          location: 'Jharkhand',
          facultyName: p.leadMentor || p.facultyMentor?.name || 'Dr. Binod Kumar',
          studentTeam: p.studentTeam || 'Student Research Squad',
          studentLead: p.studentLead || 'Student Team Leader',
          prototypeData: p.prototypeData,
          pdfUrl: p.pdfUrl || p.prototypeData?.pdfUrl,
          pdfName: p.pdfName || p.prototypeData?.pdfName || 'Prototype_Report.pdf',
          sanctionedBudget: p.sanctionedBudget || p.disbursedAmount || '₹ 80,000',
          type: 'SUBMITTED_PROTOTYPE'
        }));

      setProblemStatements(submitted);

      if (submitted.length > 0) {
        let chosen = submitted[0];
        if (initialProblem) {
          const matched = submitted.find((p) => p.id === initialProblem.id || p.title?.toLowerCase() === initialProblem.title?.toLowerCase());
          if (matched) chosen = matched;
        }
        setSelectedProblem(chosen);
        setOutcome(`R&D validation & lab testing for student prototype "${chosen.title}" by squad ${chosen.studentTeam}. Technical documentation attached.`);
      } else {
        setSelectedProblem(null);
        setOutcome('');
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
