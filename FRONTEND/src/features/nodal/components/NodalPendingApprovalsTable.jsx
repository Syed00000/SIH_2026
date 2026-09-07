import React, { useState } from 'react';
import { ApprovalsTableHeader } from './approvals/ApprovalsTableHeader.jsx';
import { ApprovalsTableRow } from './approvals/ApprovalsTableRow.jsx';
import { SkeletonTable } from './common/NodalSkeletonLoaders.jsx';

const DEFAULT_TABS = [
  { id: 'challenges', label: 'Challenges', count: 23 },
  { id: 'projects', label: 'Projects', count: 17 },
  { id: 'csr', label: 'CSR Proposals', count: 5 },
  { id: 'universities', label: 'Universities', count: 3 }
];

const DEFAULT_ITEMS = [
  {
    id: 'CHL-1024',
    title: 'AI based Water Quality Monitoring',
    submittedBy: 'Citizen',
    submitterType: 'citizen',
    type: 'Challenge',
    typeBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    submittedOn: '24 May 2026',
    priority: 'High',
    priorityBadge: 'bg-red-50 text-red-600 border-red-200'
  },
  {
    id: 'CHL-1023',
    title: 'Smart Irrigation System',
    submittedBy: 'Industry Partner',
    submitterType: 'industry',
    type: 'Challenge',
    typeBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    submittedOn: '24 May 2026',
    priority: 'Medium',
    priorityBadge: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'PRJ-215',
    title: 'Rural Healthcare Mobile Unit',
    submittedBy: 'Ranchi University',
    submitterType: 'university',
    type: 'Project',
    typeBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    submittedOn: '23 May 2026',
    priority: 'High',
    priorityBadge: 'bg-red-50 text-red-600 border-red-200'
  }
];

export const NodalPendingApprovalsTable = ({
  loading,
  items = DEFAULT_ITEMS,
  tabs = DEFAULT_TABS,
  onActionClick
}) => {
  const [activeTab, setActiveTab] = useState('challenges');

  if (loading) {
    return <SkeletonTable rows={5} cols={5} />;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-2xs select-none">
      <ApprovalsTableHeader
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="overflow-x-auto custom-scrollbar w-full">
        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Title & Submitter</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Submitted On</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {items.map((item) => (
              <ApprovalsTableRow
                key={item.id}
                item={item}
                onActionClick={onActionClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NodalPendingApprovalsTable;
