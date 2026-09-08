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
    submittedOn: '24 May 2026',
    priority: 'High'
  },
  {
    id: 'CHL-1023',
    title: 'Smart Irrigation System',
    submittedBy: 'Industry Partner',
    submitterType: 'industry',
    type: 'Challenge',
    submittedOn: '24 May 2026',
    priority: 'Medium'
  },
  {
    id: 'PRJ-215',
    title: 'Rural Healthcare Mobile Unit',
    submittedBy: 'Ranchi University',
    submitterType: 'university',
    type: 'Project',
    submittedOn: '23 May 2026',
    priority: 'High'
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
    <div className="bg-white border border-slate-100 rounded-none overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] select-none">
      <div className="p-4 bg-white border-b border-slate-100">
        <ApprovalsTableHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="overflow-x-auto custom-scrollbar w-full">
        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
          <thead className="bg-white border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-24">ID</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Submitter</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
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
