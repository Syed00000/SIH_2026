import React from 'react';
import { MapPin, Eye, MoreVertical, Loader2 } from 'lucide-react';
import { ChallengesPagination } from './ChallengesPagination.jsx';

export const ChallengesTable = ({
  loading = false,
  filteredChallenges = [],
  onViewDetails
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
      <h3 className="font-bold text-slate-900 text-sm pb-2.5 border-b border-slate-100 mb-3">
        My Submitted Challenges
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="text-slate-400 font-bold border-b border-slate-100 bg-slate-50/60">
              <th className="py-2.5 px-3">Challenge ID</th>
              <th className="py-2.5 px-3">Challenge Title</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Submitted On</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                    <span>Loading your submitted challenges...</span>
                  </div>
                </td>
              </tr>
            ) : filteredChallenges.length > 0 ? (
              filteredChallenges.map((ch) => {
                const IconComponent = ch.icon;
                return (
                  <tr key={ch.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{ch.id}</td>
                    <td className="py-2.5 px-3 max-w-[220px] truncate font-medium text-slate-800">
                      {ch.title}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
                        {ch.location}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${ch.iconBg} ${ch.iconColor}`}
                      >
                        <IconComponent className="w-3 h-3 mr-1" />
                        {ch.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {ch.submittedOn}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${ch.statusBg}`}>
                        {ch.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-center">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => onViewDetails && onViewDetails(ch.id)}
                          className="inline-flex items-center border border-slate-200 rounded px-2 py-0.5 bg-white text-[10px] font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </button>
                        <button
                          className="p-1 border border-transparent rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="More options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                  No challenges found. Click "Submit New Challenge" to report a community problem.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ChallengesPagination
        currentCount={filteredChallenges.length}
        totalCount={filteredChallenges.length}
      />
    </div>
  );
};

export default ChallengesTable;
