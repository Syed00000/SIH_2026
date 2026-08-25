import React, { useState } from 'react';
import { TriageHeaderStats } from './TriageHeaderStats.jsx';
import { TriageNavTabs } from './TriageNavTabs.jsx';
import { DomainClassificationSection } from './DomainClassificationSection.jsx';
import { ManualOverrideSection } from './ManualOverrideSection.jsx';
import { DeduplicationSection } from './DeduplicationSection.jsx';
import { PriorityEscalationSection } from './PriorityEscalationSection.jsx';

export const AITriageDashboard = () => {
  const [activeSubTab, setActiveSubTab] = useState('classification');
  const [selectedIssueForAction, setSelectedIssueForAction] = useState(null);

  const renderActiveTabContent = () => {
    switch (activeSubTab) {
      case 'classification':
        return (
          <DomainClassificationSection
            onNavigateTab={(tab) => setActiveSubTab(tab)}
            onSelectIssueForOverride={(iss) => setSelectedIssueForAction(iss)}
            onSelectIssueForEscalate={(iss) => setSelectedIssueForAction(iss)}
          />
        );
      case 'override':
        return (
          <ManualOverrideSection
            selectedIssueFromTriage={selectedIssueForAction}
          />
        );
      case 'deduplication':
        return <DeduplicationSection />;
      case 'escalation':
        return (
          <PriorityEscalationSection
            selectedIssueFromTriage={selectedIssueForAction}
          />
        );
      default:
        return (
          <DomainClassificationSection
            onNavigateTab={(tab) => setActiveSubTab(tab)}
            onSelectIssueForOverride={(iss) => setSelectedIssueForAction(iss)}
            onSelectIssueForEscalate={(iss) => setSelectedIssueForAction(iss)}
          />
        );
    }
  };

  return (
    <div className="space-y-3 pb-8">
      {/* 1. Global Header KPI Metrics */}
      <TriageHeaderStats />

      {/* 2. Top 4-Workflow Tabs */}
      <TriageNavTabs
        activeTab={activeSubTab}
        onSelectTab={(tabId) => setActiveSubTab(tabId)}
      />

      {/* 3. Dedicated Full Workspace for Active Workflow */}
      <div>{renderActiveTabContent()}</div>
    </div>
  );
};

export const GovernmentTriage = AITriageDashboard;
export default AITriageDashboard;
