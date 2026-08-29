import React, { useState, useEffect } from 'react';
import { TaxonomyQuickPills } from './TaxonomyQuickPills.jsx';
import { OverrideWorkspace } from './OverrideWorkspace.jsx';
import { OverrideHistoryTable } from './OverrideHistoryTable.jsx';
import { citizenService } from '../../../citizen/services/citizenService.js';

export const ManualOverrideSection = ({ selectedIssueFromTriage }) => {
  const [selectedIssue, setSelectedIssue] = useState(selectedIssueFromTriage || null);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (selectedIssueFromTriage) {
      setSelectedIssue(selectedIssueFromTriage);
    }
  }, [selectedIssueFromTriage]);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const res = await citizenService.fetchChallenges({ limit: 20 });
        const mapped = (res.challenges || []).map((c) => ({
          id: c.challengeId,
          title: c.title,
          district: c.location?.district || c.district || 'Ranchi',
          currentDomain: c.domain || 'General',
          confidence: 90,
          submittedBy: c.submitter?.name || 'Citizen',
          description: c.description
        }));
        setIssues(mapped);
        if (!selectedIssue && mapped.length > 0) {
          setSelectedIssue(mapped[0]);
        }
      } catch {
        setIssues([]);
      }
    };
    loadIssues();
  }, []);

  return (
    <div className="space-y-3">
      <TaxonomyQuickPills onSelectCategory={() => {}} />
      <OverrideWorkspace
        selectedIssue={selectedIssue}
        issues={issues}
        onSelectIssue={(iss) => setSelectedIssue(iss)}
        onApplyOverride={() => {}}
      />
      <OverrideHistoryTable history={[]} />
    </div>
  );
};

export default ManualOverrideSection;
