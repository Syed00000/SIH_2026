import React, { useState } from 'react';
import {
  User,
  Building2,
  GraduationCap,
  Eye,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const NodalPendingApprovalsTable = ({
  approvalsData,
  onViewAll,
  onApproveItem,
  onViewItem
}) => {
  const [activeTab, setActiveTab] = useState('challenges');

  const defaultTabs = [
    { id: 'challenges', label: 'Challenges', count: 23 },
    { id: 'projects', label: 'Projects', count: 17 },
    { id: 'csr', label: 'CSR Proposals', count: 5 },
    { id: 'universities', label: 'Universities', count: 3 }
  ];

  const defaultItems = [
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

  const items = approvalsData || defaultItems;

  const renderSubmitterIcon = (type) => {
    switch (type) {
      case 'citizen':
        return <User className="w-3.5 h-3.5 text-blue-500 mr-1.5" />;
      case 'industry':
        return <Building2 className="w-3.5 h-3.5 text-blue-500 mr-1.5" />;
      case 'university':
        return <GraduationCap className="w-3.5 h-3.5 text-blue-500 mr-1.5" />;
      default:
        return <User className="w-3.5 h-3.5 text-blue-500 mr-1.5" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs w-full">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-6">
          <h3 className="font-bold text-slate-900 text-sm">Pending Approvals</h3>
          {/* Tab Selection */}
          <div className="flex items-center space-x-4">
            {defaultTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs font-semibold pb-1 relative transition-colors cursor-pointer ${
                    isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="ml-1 text-[11px] font-bold opacity-80">{tab.count}</span>
                  {isActive && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline self-end sm:self-auto cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold">
              <th className="py-2.5 px-2">ID</th>
              <th className="py-2.5 px-2">Title</th>
              <th className="py-2.5 px-2">Submitted By</th>
              <th className="py-2.5 px-2">Type</th>
              <th className="py-2.5 px-2">Submitted On</th>
              <th className="py-2.5 px-2">Priority</th>
              <th className="py-2.5 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-2 font-bold text-slate-700">{row.id}</td>
                <td className="py-3 px-2 font-semibold text-slate-900">{row.title}</td>
                <td className="py-3 px-2 text-slate-600">
                  <div className="flex items-center">
                    {renderSubmitterIcon(row.submitterType)}
                    <span>{row.submittedBy}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${row.typeBadge}`}>
                    {row.type}
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-500">{row.submittedOn}</td>
                <td className="py-3 px-2">
                  {row.priority ? (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${row.priorityBadge}`}>
                      {row.priority}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-bold">—</span>
                  )}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onViewItem && onViewItem(row)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onApproveItem && onApproveItem(row)}
                      className="p-1 text-emerald-600 hover:text-emerald-700 rounded transition-colors cursor-pointer"
                      title="Approve"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom CTA */}
      <div className="mt-3 text-center border-t border-slate-100 pt-3">
        <button
          onClick={onViewAll}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <span>View All Pending Items</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default NodalPendingApprovalsTable;
