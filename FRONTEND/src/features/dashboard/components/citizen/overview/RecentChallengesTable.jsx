import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export const RecentChallengesTable = ({
  loading = false,
  challenges = [],
  onViewAll
}) => {
  return (
    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <h3 className="font-bold text-slate-900 text-sm">My Recent Challenges</h3>
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-slate-400 font-bold border-b border-slate-100 bg-slate-50/60">
                <th className="py-2 px-2.5">Challenge ID</th>
                <th className="py-2 px-2.5">Title</th>
                <th className="py-2 px-2.5">Location</th>
                <th className="py-2 px-2.5">Category</th>
                <th className="py-2 px-2.5">Status</th>
                <th className="py-2 px-2.5">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400 font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
                      <span>Loading recent challenges...</span>
                    </div>
                  </td>
                </tr>
              ) : challenges.length > 0 ? (
                challenges.map((ch) => {
                  const IconComponent = ch.icon;
                  return (
                    <tr key={ch.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-2.5 font-semibold text-slate-900">{ch.id}</td>
                      <td className="py-2.5 px-2.5 max-w-[180px] truncate font-medium text-slate-800">
                        {ch.title}
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-500 whitespace-nowrap">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
                          {ch.location}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${ch.iconBg} ${ch.iconColor}`}>
                          <IconComponent className="w-3 h-3 mr-1" />
                          {ch.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${ch.statusBg}`}>
                          {ch.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-400 whitespace-nowrap">{ch.submittedOn || ch.updated}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400 font-medium">
                    No submitted challenges found. Click "Submit a Challenge" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentChallengesTable;
