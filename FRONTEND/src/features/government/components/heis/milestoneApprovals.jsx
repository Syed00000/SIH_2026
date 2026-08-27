import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

const getStatusDisplay = (status) => {
  switch (status) {
    case 'Submitted':
      return (
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-blue-600">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Submitted</span>
        </span>
      );
    case 'Under Review':
      return (
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-amber-600">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Under Review</span>
        </span>
      );
    case 'Changes Requested':
      return (
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-rose-600">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>Changes Req.</span>
        </span>
      );
    case 'Approved':
      return (
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Approved</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>{status}</span>
        </span>
      );
  }
};

export const MilestoneApprovals = ({
  filteredMilestones,
  milestoneTypeFilter,
  setMilestoneTypeFilter,
  handleMilestoneReview,
  setSelectedRecord,
  setReviewType,
  milestoneSummary
}) => {
  const summaryCards = [
    { label: 'Pending Review', count: milestoneSummary.submitted, color: 'text-blue-600', icon: Clock },
    { label: 'Under Review', count: milestoneSummary.underReview, color: 'text-amber-500', icon: AlertTriangle },
    { label: 'Changes Req.', count: milestoneSummary.changesRequested, color: 'text-rose-500', icon: FileText },
    { label: 'Approved', count: milestoneSummary.approved, color: 'text-emerald-500', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-4 select-none">
      {/* Top Metric Summary Cards - Clean Bare Icons without Background Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">
                  {stat.label}
                </span>
                <span className="text-xl font-extrabold text-slate-900 leading-tight mt-0.5 block">
                  {stat.count}
                </span>
              </div>
              <div className="shrink-0 pl-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4 space-y-3">
        {/* Header & Subtabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">3. Milestone Review & Approvals</h3>
            <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">
              Review and approve solution designs, lab analysis results, and pilot prototypes.
            </p>
          </div>

          {/* Subtabs Filter */}
          <div className="flex bg-slate-100/90 rounded-lg p-0.5 border border-slate-200/70 text-[10.5px] font-semibold self-start sm:self-auto">
            {[
              { id: 'All', label: 'All', count: 24 },
              { id: 'Proposal', label: 'Proposal', count: 8 },
              { id: 'Lab Testing', label: 'Lab Testing', count: 7 },
              { id: 'Prototype', label: 'Prototype', count: 6 }
            ].map((tab) => {
              const isActive = milestoneTypeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMilestoneTypeFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label} <span className="text-[9px] opacity-70 font-normal">({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Responsive Table with Bare Status Indicators */}
        <div className="w-full overflow-hidden">
          <table className="w-full text-left text-xs border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-2.5 px-3 w-[15%]">Project ID</th>
                <th className="py-2.5 px-3 w-[26%]">Project Title</th>
                <th className="py-2.5 px-3 w-[18%]">HEI</th>
                <th className="py-2.5 px-3 w-[16%]">Milestone Type</th>
                <th className="py-2.5 px-2.5 w-[12%]">Submitted On</th>
                <th className="py-2.5 px-2.5 w-[11%]">Status</th>
                <th className="py-2.5 px-3 w-[8%] text-right pr-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMilestones.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700 text-[11px]">
                    {item.id}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 text-[11.5px] truncate" title={item.title}>
                    {item.title}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 text-[11px] truncate" title={item.hei}>
                    {item.hei}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-600 text-[10.5px]">
                    {item.type}
                  </td>
                  <td className="py-3 px-2.5 text-slate-500 font-medium text-[10.5px] whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="py-3 px-2.5">
                    {getStatusDisplay(item.status)}
                  </td>
                  <td className="py-3 px-3 text-right pr-3">
                    {item.status !== 'Approved' ? (
                      <button
                        onClick={() => handleMilestoneReview(item)}
                        className="px-3 py-1 bg-slate-900 hover:bg-black text-white font-bold text-[10.5px] rounded-md transition-colors cursor-pointer shadow-xs inline-flex items-center gap-0.5"
                      >
                        Review
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedRecord(item);
                          setReviewType('milestone-view');
                        }}
                        className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[10.5px] rounded-md border border-slate-200 transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-0.5"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MilestoneApprovals;

