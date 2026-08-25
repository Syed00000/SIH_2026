import React, { useState } from 'react';
import { TriageNavTabs } from './common/TriageNavTabs.jsx';
import { TriageHeaderStats } from './common/TriageHeaderStats.jsx';
import { DomainClassificationTab } from './classification/DomainClassificationTab.jsx';
import { ManualOverrideTab } from './override/ManualOverrideTab.jsx';
import { DeduplicationTab } from './deduplication/DeduplicationTab.jsx';
import { PriorityEscalationTab } from './escalation/PriorityEscalationTab.jsx';

export const AITriageDashboard = () => {
  const [activeTriageTab, setActiveTriageTab] = useState('classification');

  const initialIssues = [
    {
      id: 'IS-2026-00521',
      title: 'Contaminated Drinking Water in Village',
      submittedBy: 'Ramesh Mahto',
      district: 'Dhanbad',
      domain: 'Water',
      confidence: 94,
      submittedOn: '22 May 2026 10:30 AM'
    },
    {
      id: 'IS-2026-00520',
      title: 'Harvest Loss Due to Pest Attack',
      submittedBy: 'Savitri Devi',
      district: 'Godda',
      domain: 'Agriculture',
      confidence: 87,
      submittedOn: '22 May 2026 09:15 AM'
    },
    {
      id: 'IS-2026-00519',
      title: 'Broken Road Affecting School Access',
      submittedBy: 'Arjun Kumar',
      district: 'Ranchi',
      domain: 'Infrastructure',
      confidence: 91,
      submittedOn: '22 May 2026 08:40 AM'
    },
    {
      id: 'IS-2026-00518',
      title: 'No Street Lights in Main Road',
      submittedBy: 'Mohammad Imran',
      district: 'Jamshedpur',
      domain: 'Infrastructure',
      confidence: 88,
      submittedOn: '22 May 2026 08:05 AM'
    },
    {
      id: 'IS-2026-00517',
      title: 'Anganwadi Worker Not Available',
      submittedBy: 'Poonam Kumari',
      district: 'Gumla',
      domain: 'Health',
      confidence: 76,
      submittedOn: '22 May 2026 07:45 AM'
    }
  ];

  const [issues, setIssues] = useState(initialIssues);
  const [selectedIssue, setSelectedIssue] = useState(initialIssues[0]);

  const handleApplyOverride = (issueId, newDomain) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, domain: newDomain } : iss))
    );
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) => ({ ...prev, domain: newDomain }));
    }
  };

  const handleRefresh = () => {
    setIssues(initialIssues);
    setSelectedIssue(initialIssues[0]);
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Sleek 4-Pipeline Tabs (Without Numbers) */}
      <TriageNavTabs
        activeTab={activeTriageTab}
        onSelectTab={(tabId) => setActiveTriageTab(tabId)}
      />

      {/* 2. Global AI Triage KPI Header */}
      <TriageHeaderStats />

      {/* 3. Dedicated Full-Page Workspace for Active Tab */}
      {activeTriageTab === 'classification' && (
        <DomainClassificationTab
          issues={issues}
          onRefresh={handleRefresh}
          onSelectIssueForOverride={(iss) => setSelectedIssue(iss)}
          onSelectIssueForEscalate={(iss) => setSelectedIssue(iss)}
          onNavigateTab={(tab) => setActiveTriageTab(tab)}
        />
      )}

      {activeTriageTab === 'override' && (
        <ManualOverrideTab
          selectedIssue={selectedIssue}
          issues={issues}
          onSelectIssue={(iss) => setSelectedIssue(iss)}
          onApplyOverride={handleApplyOverride}
        />
      )}

      {activeTriageTab === 'deduplication' && <DeduplicationTab />}

      {activeTriageTab === 'escalation' && (
        <PriorityEscalationTab selectedIssue={selectedIssue} />
      )}
    </div>
  );
};

export default AITriageDashboard;
