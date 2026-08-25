import React from 'react';
import { Check } from 'lucide-react';

export const MilestoneApprovals = ({
  filteredMilestones,
  milestoneTypeFilter,
  setMilestoneTypeFilter,
  handleMilestoneReview,
  setSelectedRecord,
  setReviewType,
  milestoneSummary,
  recentApprovals,
  donutTotal,
  strokeDash
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">3. Milestone Review & Approvals</h3>
              <p className="text-[10.5px] text-slate-400 font-medium">Approve solution designs, lab analysis results, and pilot prototypes.</p>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex border-b border-slate-100">
            {['All', 'Proposal', 'Lab Testing', 'Prototype'].map((tabName) => {
              const isActive = milestoneTypeFilter === tabName;
              return (
                <button
                  key={tabName}
                  onClick={() => setMilestoneTypeFilter(tabName)}
                  className={`px-3 py-1.8 font-bold border-b-2 text-[10.5px] transition-all cursor-pointer ${
                    isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tabName} {tabName === 'All' ? '(24)' : tabName === 'Proposal' ? '(8)' : tabName === 'Lab Testing' ? '(7)' : '(6)'}
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10.5px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-2 px-3">Project ID</th>
                  <th className="py-2 px-3">Project Title</th>
                  <th className="py-2 px-3">HEI</th>
                  <th className="py-2 px-3">Milestone Type</th>
                  <th className="py-2 px-3">Submitted On</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMilestones.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-500">{item.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 max-w-[140px] truncate">{item.title}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{item.hei}</td>
                    <td className="py-3 px-3 font-semibold text-slate-500">{item.type}</td>
                    <td className="py-3 px-3 text-slate-500 font-medium">{item.date}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.8 rounded-lg text-[9.5px] font-bold ${
                        item.status === 'Submitted'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : item.status === 'Under Review'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : item.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.status !== 'Approved' ? (
                        <button
                          onClick={() => handleMilestoneReview(item)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedRecord(item);
                            setReviewType('milestone-view');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200/60 transition-colors cursor-pointer"
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

      {/* Donut and Sidebar */}
      <div className="lg:col-span-4 space-y-3.5">
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs space-y-3">
          <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">Milestone Action Summary</h4>
          <div className="flex items-center justify-between">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center select-none">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="25" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                <circle 
                  cx="30" cy="30" r="25" fill="transparent" stroke="#22c55e" strokeWidth="6" 
                  strokeDasharray={`${strokeDash}`} 
                  strokeDashoffset={`${strokeDash * (1 - milestoneSummary.approved / donutTotal)}`} 
                />
                <circle 
                  cx="30" cy="30" r="25" fill="transparent" stroke="#f59e0b" strokeWidth="6" 
                  strokeDasharray={`${strokeDash}`} 
                  strokeDashoffset={`${strokeDash * (1 - (milestoneSummary.approved + milestoneSummary.underReview) / donutTotal)}`} 
                />
                <circle 
                  cx="30" cy="30" r="25" fill="transparent" stroke="#3b82f6" strokeWidth="6" 
                  strokeDasharray={`${strokeDash}`} 
                  strokeDashoffset={`${strokeDash * (1 - (milestoneSummary.approved + milestoneSummary.underReview + milestoneSummary.submitted) / donutTotal)}`} 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-sm font-extrabold text-slate-900 leading-none">{donutTotal}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Total</span>
              </div>
            </div>

            <div className="space-y-1.2 text-[10px] font-semibold text-slate-600 flex-1 pl-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center"><span className="w-2 h-2 rounded-xs bg-blue-500 mr-1.5" />Submitted</div>
                <span className="font-bold text-slate-900">{milestoneSummary.submitted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center"><span className="w-2 h-2 rounded-xs bg-amber-500 mr-1.5" />Under Review</div>
                <span className="font-bold text-slate-900">{milestoneSummary.underReview}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center"><span className="w-2 h-2 rounded-xs bg-red-400 mr-1.5" />Changes Req.</div>
                <span className="font-bold text-slate-900">{milestoneSummary.changesRequested}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center"><span className="w-2 h-2 rounded-xs bg-emerald-500 mr-1.5" />Approved</div>
                <span className="font-bold text-slate-900">{milestoneSummary.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center"><span className="w-2 h-2 rounded-xs bg-slate-400 mr-1.5" />Rejected</div>
                <span className="font-bold text-slate-900">{milestoneSummary.rejected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Approvals */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs space-y-3.5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-900 text-xs">Recent Approvals</span>
            <button className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">View All</button>
          </div>

          <div className="space-y-3">
            {recentApprovals.map((appr, idx) => (
              <div key={appr.id + idx} className="flex items-start justify-between text-[11px] font-medium">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">{appr.id}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{appr.title}</span>
                    <span className="text-[9.5px] text-slate-500 font-bold block mt-0.2">{appr.hei}</span>
                  </div>
                </div>
                <span className="text-[9.5px] text-slate-400 font-semibold shrink-0">{appr.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MilestoneApprovals;
