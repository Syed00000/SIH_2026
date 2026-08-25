import React, { useState } from 'react';
import { ClassificationAnalytics } from './ClassificationAnalytics.jsx';
import { ClassificationTable } from './ClassificationTable.jsx';
import { IssueDetailModal } from './IssueDetailModal.jsx';

export const DomainClassificationTab = ({
  issues,
  onRefresh,
  onSelectIssueForOverride,
  onSelectIssueForEscalate,
  onNavigateTab
}) => {
  const [inspectedIssue, setInspectedIssue] = useState(null);

  const handleInspect = (issue) => {
    setInspectedIssue(issue);
  };

  const handleNavigateOverride = (issue) => {
    if (onSelectIssueForOverride) onSelectIssueForOverride(issue);
    setInspectedIssue(null);
    if (onNavigateTab) onNavigateTab('override');
  };

  const handleNavigateEscalate = (issue) => {
    if (onSelectIssueForEscalate) onSelectIssueForEscalate(issue);
    setInspectedIssue(null);
    if (onNavigateTab) onNavigateTab('escalation');
  };

  return (
    <div className="space-y-3.5">
      {/* Analytics & Engine Breakdown */}
      <ClassificationAnalytics />

      {/* Main Review Table */}
      <ClassificationTable
        issues={issues}
        onInspectIssue={handleInspect}
        onRefresh={onRefresh}
      />

      {/* Explainability & Deep Inspection Modal */}
      {inspectedIssue && (
        <IssueDetailModal
          issue={inspectedIssue}
          onClose={() => setInspectedIssue(null)}
          onNavigateOverride={handleNavigateOverride}
          onNavigateEscalate={handleNavigateEscalate}
        />
      )}
    </div>
  );
};

export default DomainClassificationTab;
