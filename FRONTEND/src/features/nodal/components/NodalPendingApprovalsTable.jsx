import React, { useState } from 'react';
import { ApprovalsTableHeader } from './approvals/ApprovalsTableHeader.jsx';
import { ApprovalsTableRow } from './approvals/ApprovalsTableRow.jsx';

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
  },
  {
    id: 'CSR-089',
    title: 'STEM Education in Rural Schools',
    submittedBy: 'ABC Foundation',
    submitterType: 'industry',
    type: 'CSR Proposal',
    typeBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    submittedOn: '23 May 2026',
    priority: 'Medium',
    priorityBadge: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'UNI-12',
    title: 'Birsa Institute of Technology',
    submittedBy: 'University',
    submitterType: 'university',
    type: 'University',
    typeBadge: 'bg-sky-50 text-sky-700 border-sky-200',
    submittedOn: '22 May 2026',
    priority: null
  }
];

export const NodalPendingApprovalsTable = ({
  approvalsData,
  onViewAll,
  onApproveItem,
  onViewItem
}) => {
  const [activeTab, setActiveTab] = useState('challenges');
  const items = approvalsData || DEFAULT_ITEMS;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs w-full space-y-3.5">
      <ApprovalsTableHeader
        tabs={DEFAULT_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onViewAll={onViewAll}
      />

      <div className="overflow-x-auto border border-slate-200/90 rounded-lg">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-3.5">ID</th>
              <th className="py-2.5 px-3.5">Title / Subject</th>
              <th className="py-2.5 px-3.5">Submitted By</th>
              <th className="py-2.5 px-3.5">Category</th>
              <th className="py-2.5 px-3.5">Priority</th>
              <th className="py-2.5 px-3.5">Date</th>
              <th className="py-2.5 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {items.map((item) => (
              <ApprovalsTableRow
                key={item.id}
                item={item}
                onViewItem={onViewItem}
                onApproveItem={onApproveItem}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NodalPendingApprovalsTable;
