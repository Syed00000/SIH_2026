import React, { useState } from 'react';
import { TaxonomyQuickPills } from './TaxonomyQuickPills.jsx';
import { OverrideWorkspace } from './OverrideWorkspace.jsx';
import { OverrideHistoryTable } from './OverrideHistoryTable.jsx';

export const ManualOverrideSection = ({ selectedIssueFromTriage }) => {
  const [selectedIssue, setSelectedIssue] = useState(selectedIssueFromTriage || null);

  const sampleIssues = [
    {
      id: 'IS-2026-00481',
      title: 'Solar Microgrid Inverter Failure affecting 120 tribal households',
      district: 'Khunti',
      currentDomain: 'Water Resources',
      confidence: 89,
      submittedBy: 'Birsa Munda SHG',
      description: 'The solar microgrid inverter feeding the borehole filtration setup malfunctioned.'
    }
  ];

  return (
    <div className="space-y-3">
      <TaxonomyQuickPills onSelectCategory={() => {}} />
      <OverrideWorkspace
        selectedIssue={selectedIssue}
        issues={sampleIssues}
        onSelectIssue={(iss) => setSelectedIssue(iss)}
        onApplyOverride={() => {}}
      />
      <OverrideHistoryTable />
    </div>
  );
};

export default ManualOverrideSection;
