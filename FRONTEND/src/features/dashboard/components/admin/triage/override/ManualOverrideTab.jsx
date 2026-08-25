import React from 'react';
import { TaxonomyQuickPills } from './TaxonomyQuickPills.jsx';
import { OverrideWorkspace } from './OverrideWorkspace.jsx';
import { OverrideHistoryTable } from './OverrideHistoryTable.jsx';

export const ManualOverrideTab = ({
  selectedIssue,
  issues,
  onSelectIssue,
  onApplyOverride
}) => {
  return (
    <div className="space-y-3.5">
      {/* Sector Pills */}
      <TaxonomyQuickPills />

      {/* Main Studio */}
      <OverrideWorkspace
        selectedIssue={selectedIssue}
        issues={issues}
        onSelectIssue={onSelectIssue}
        onApplyOverride={onApplyOverride}
      />

      {/* Audit Trail */}
      <OverrideHistoryTable />
    </div>
  );
};

export default ManualOverrideTab;
