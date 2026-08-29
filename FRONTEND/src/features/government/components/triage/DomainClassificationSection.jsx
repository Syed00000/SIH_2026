import React, { useState, useEffect } from 'react';
import { ClassificationAnalytics } from './ClassificationAnalytics.jsx';
import { ClassificationTable } from './ClassificationTable.jsx';
import { IssueDetailModal } from './IssueDetailModal.jsx';
import { citizenService } from '../../../citizen/services/citizenService.js';

export const DomainClassificationSection = ({ onNavigateTab, onSelectIssueForOverride, onSelectIssueForEscalate }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await citizenService.fetchChallenges({ limit: 50 });
      const mapped = (res.challenges || []).map((c) => ({
        id: c.challengeId,
        title: c.title,
        district: c.location?.district || c.district || 'Ranchi',
        domain: c.domain || 'General',
        subSector: c.domain || 'Infrastructure',
        confidence: 90,
        status: c.status === 'Resolved' ? 'Resolved' : c.status === 'In Progress' ? 'Assigned' : 'Review Required',
        date: c.submittedAt ? new Date(c.submittedAt).toLocaleDateString('en-GB') : '',
        submittedBy: c.submitter?.name || 'Citizen',
        assignedDepartment: c.assignedUniversity?.name || 'Department of Higher & Technical Education',
        description: c.description,
        keywords: [c.domain || 'General', c.location?.district || 'Jharkhand']
      }));
      setIssues(mapped);
    } catch (err) {
      console.warn('Could not fetch triage issues:', err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="space-y-3">
      <ClassificationAnalytics issuesCount={issues.length} />
      <ClassificationTable
        issues={issues}
        loading={loading}
        onInspectIssue={(iss) => setSelectedIssue(iss)}
        onRefresh={fetchIssues}
      />
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onNavigateOverride={(iss) => {
            setSelectedIssue(null);
            onSelectIssueForOverride?.(iss);
            onNavigateTab('override');
          }}
          onNavigateEscalate={(iss) => {
            setSelectedIssue(null);
            onSelectIssueForEscalate?.(iss);
            onNavigateTab('escalation');
          }}
        />
      )}
    </div>
  );
};

export default DomainClassificationSection;
