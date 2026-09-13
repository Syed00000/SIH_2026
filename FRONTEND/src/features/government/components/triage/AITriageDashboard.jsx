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
      {/* Official Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
              AI Problem Triage & Departmental Verification
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
              Official Triage Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Automated classification, duplicate identification, and verified departmental routing across Jharkhand
          </p>
        </div>
      </div>

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
