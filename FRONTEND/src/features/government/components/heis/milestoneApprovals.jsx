import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, FileText, Info } from 'lucide-react';

const getStatusDisplay = (status) => {
  switch (status) {
    case 'Submitted':
      return (
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-[#007A61]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#007A61]" />
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
          <span>{status || 'Pending'}</span>
        </span>
      );
  }
};

export const MilestoneApprovals = ({
  milestones = [],
  filteredMilestones = [],
  milestoneTypeFilter = 'All',
  setMilestoneTypeFilter,
  onReview,
  handleMilestoneReview,
  setSelectedRecord,
  setReviewType,
  milestoneSummary = {},
  recentApprovals = []
}) => {
  const items = filteredMilestones?.length > 0 ? filteredMilestones : (milestones || []);

  const summaryCards = [
    { label: 'Pending Review', count: milestoneSummary?.submitted || 0, color: 'text-[#007A61]', icon: Clock },
    { label: 'Under Review', count: milestoneSummary?.underReview || 0, color: 'text-amber-500', icon: AlertTriangle },
    { label: 'Changes Req.', count: milestoneSummary?.changesRequested || 0, color: 'text-rose-500', icon: FileText },
    { label: 'Approved', count: milestoneSummary?.approved || 0, color: 'text-emerald-500', icon: CheckCircle2 }
  ];

  const onActionClick = (item) => {
    if (onReview) {
      onReview(item);
    } else if (handleMilestoneReview) {
      handleMilestoneReview(item);
    } else if (setSelectedRecord && setReviewType) {
      setSelectedRecord(item);
      setReviewType('milestone');
    }
  };

  return (
    <div className="space-y-4">
      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <span className={`text-xl font-extrabold ${card.color} block mt-1.5`}>{card.count}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Main Verification Queue */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">2. Milestone Approvals & Verification Queue</h3>
              <p className="text-[10.5px] text-slate-400 font-medium">Verify university deliverables and award academic credits.</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={milestoneTypeFilter}
                onChange={(e) => setMilestoneTypeFilter && setMilestoneTypeFilter(e.target.value)}
                className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 font-medium text-slate-700"
              >
                <option value="All">All Types</option>
                <option value="Proposal Approval">Proposal Approval</option>
                <option value="Lab Test Results">Lab Test Results</option>
                <option value="Prototype">Prototype</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10.5px] uppercase font-bold text-slate-400">
                  <th className="py-2 px-3">Project ID</th>
                  <th className="py-2 px-3">Project Title</th>
                  <th className="py-2 px-3">HEI</th>
                  <th className="py-2 px-3">Deliverable Type</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                      <Info className="w-5 h-5 mx-auto text-slate-300 mb-1.5" />
                      No milestone deliverables pending approval in the queue.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-500">{item.id}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 max-w-[180px] truncate">{item.title}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{item.hei}</td>
                      <td className="py-3 px-3 font-medium text-slate-600">{item.type}</td>
                      <td className="py-3 px-3 text-slate-400">{item.date}</td>
                      <td className="py-3 px-3">{getStatusDisplay(item.status)}</td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onActionClick(item)}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors cursor-pointer"
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Approvals */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-xs">Recent Approvals</h4>
            <p className="text-[10px] text-slate-400 font-medium">Recently awarded NEP credit batches</p>
          </div>

          <div className="space-y-2.5">
            {(recentApprovals || []).length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No recent approvals recorded yet.
              </div>
            ) : (
              recentApprovals.map((app) => (
                <div key={app.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-[11px] block">{app.title}</span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{app.hei} • {app.date}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    +120 Cr
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneApprovals;
