import React, { useState } from 'react';
import { DepartmentRoutingMatrix } from './DepartmentRoutingMatrix.jsx';
import { EscalationActionPanel } from './EscalationActionPanel.jsx';
import { EscalationQueueTable } from './EscalationQueueTable.jsx';

export const PriorityEscalationSection = ({ selectedIssueFromTriage }) => {
  const [selectedIssue, setSelectedIssue] = useState(selectedIssueFromTriage || null);

  return (
    <div className="space-y-3">
      <DepartmentRoutingMatrix />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <EscalationActionPanel selectedIssue={selectedIssue} />
        <EscalationQueueTable />
      </div>
    </div>
  );
};

export default PriorityEscalationSection;
