import React, { useState } from 'react';
import { ClassificationAnalytics } from './ClassificationAnalytics.jsx';
import { ClassificationTable } from './ClassificationTable.jsx';
import { IssueDetailModal } from './IssueDetailModal.jsx';

export const DomainClassificationSection = ({ onNavigateTab, onSelectIssueForOverride, onSelectIssueForEscalate }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  const initialIssues = [
    {
      id: 'IS-2026-00481',
      title: 'Solar Microgrid Inverter Failure affecting 120 tribal households',
      district: 'Khunti',
      domain: 'Water Resources',
      subSector: 'Solar Drinking Pumps',
      confidence: 89,
      status: 'Auto-Routed',
      date: '24 Aug 2026',
      submittedBy: 'Birsa Munda SHG',
      assignedDepartment: 'Drinking Water and Sanitation Department',
      description: 'The solar microgrid inverter feeding the borehole filtration setup malfunctioned following lightning activity.',
      keywords: ['Solar', 'Inverter Failure', 'Drinking Water', 'Microgrid']
    },
    {
      id: 'IS-2026-00482',
      title: 'Heavy soil erosion endangering paddy terraces along Swarnarekha',
      district: 'Ranchi',
      domain: 'Agriculture',
      subSector: 'Terrace Farming & Soil',
      confidence: 94,
      status: 'Auto-Routed',
      date: '24 Aug 2026',
      submittedBy: 'Kisan Samiti Namkum',
      assignedDepartment: 'Department of Agriculture, Animal Husbandry & Co-operative',
      description: 'Runoff from unlined embankment is washing away topsoil on fertile riverbed terraces.',
      keywords: ['Soil Erosion', 'Paddy', 'Embankment', 'Agriculture']
    },
    {
      id: 'IS-2026-00485',
      title: 'Rural bridge approach washed away during flash flood',
      district: 'Latehar',
      domain: 'Public Infrastructure',
      subSector: 'Bridges & Culverts',
      confidence: 91,
      status: 'Review Required',
      date: '23 Aug 2026',
      submittedBy: 'Gram Pradhan Mahuadanr',
      assignedDepartment: 'Road Construction Department',
      description: 'Concrete culvert approach road washed away, cutting off school access for 3 villages.',
      keywords: ['Bridge', 'Culvert', 'Road Cutoff', 'Infrastructure']
    }
  ];

  return (
    <div className="space-y-3">
      <ClassificationAnalytics />
      <ClassificationTable
        issues={initialIssues}
        onInspectIssue={(iss) => setSelectedIssue(iss)}
        onRefresh={() => {}}
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
