import React from 'react';
import { Eye } from 'lucide-react';

export const DashboardChallengeRow = ({
  c,
  globalIndex,
  normStatus,
  onActionClick
}) => {
  const title = c.title || 'Challenge';
  const firstLetter = title.charAt(0).toUpperCase();
  const loc = c.location || c.locationDetails || {};
  const panchayat = loc.panchayatOrWard || loc.gramPanchayat || 'Gram Panchayat';

  return (
    <tr
      onClick={() => onActionClick && onActionClick(c)}
      className="hover:bg-emerald-50/30 transition-colors group select-none cursor-pointer"
    >
      <td className="py-3 px-3 text-center font-mono text-[11px] font-bold text-slate-400">
        {globalIndex}
      </td>

      <td className="py-3 px-3">
        <div className="flex items-center space-x-2.5">
          <div className="min-w-0 max-w-[220px]">
            <div
              className="font-extrabold text-slate-900 group-hover:text-[#007A61] text-xs truncate leading-tight transition-colors"
              title={title}
            >
              {title}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
              ID: {c.id || c.challengeId} &bull; {c.aiCategory || c.domain}
            </div>
          </div>
        </div>
      </td>

      <td className="py-3 px-3">
        <div className="font-bold text-slate-800 text-xs truncate max-w-[150px]" title={c.domain}>
          {c.domain}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">
          {panchayat}, {c.district || 'Ranchi'}
        </div>
      </td>

      <td className="py-3 px-3">
        {c.assignedFaculty?.name ? (
          <div>
            <div className="font-extrabold text-slate-900 text-xs leading-tight truncate max-w-[150px]">
              {c.assignedFaculty.name}
            </div>
            <div className="text-[10px] text-[#007A61] font-semibold mt-0.5 truncate max-w-[150px]">
              {c.assignedFaculty.department || 'Lead Faculty Mentor'}
            </div>
          </div>
        ) : (
          <div>
            <div className="font-semibold text-amber-800 text-xs italic">Not Assigned Yet</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Click to Assign</div>
          </div>
        )}
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center space-x-1.5 text-[11px] font-bold ${
            c.priority === 'High' || c.priority === 'Critical' ? 'text-rose-600' : c.priority === 'Low' ? 'text-slate-600' : 'text-amber-600'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              c.priority === 'High' || c.priority === 'Critical' ? 'bg-rose-500' : c.priority === 'Low' ? 'bg-slate-400' : 'bg-amber-500'
            }`}
          />
          <span>{c.priority || 'Medium'}</span>
        </span>
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        {normStatus === 'Accepted' ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e6f2ef] text-[#007A61] text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#007A61] mr-1.5"></span>
            Completed
          </span>
        ) : normStatus === 'Pending' ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
            Pending
          </span>
        ) : normStatus === 'Clarification Requested' ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
            Rejected
          </span>
        )}
      </td>

      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => onActionClick && onActionClick(c)}
          className="text-xs font-bold text-[#007A61] hover:underline cursor-pointer"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

export default DashboardChallengeRow;
