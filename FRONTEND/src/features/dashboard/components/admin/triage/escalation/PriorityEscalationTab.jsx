import React from 'react';
import { DepartmentRoutingMatrix } from './DepartmentRoutingMatrix.jsx';
import { EscalationActionPanel } from './EscalationActionPanel.jsx';
import { EscalationQueueTable } from './EscalationQueueTable.jsx';

export const PriorityEscalationTab = ({ selectedIssue }) => {
  return (
    <div className="space-y-3.5">
      {/* Top Routing Matrix Indicators */}
      <DepartmentRoutingMatrix />

      {/* Main Escalation Action Studio */}
      <EscalationActionPanel selectedIssue={selectedIssue} />

      {/* SLA & Active Escalation Queue */}
      <EscalationQueueTable />
    </div>
  );
};

export default PriorityEscalationTab;
