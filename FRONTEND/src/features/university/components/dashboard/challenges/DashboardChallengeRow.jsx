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
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] font-black text-xs flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
            {firstLetter}
          </div>
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
            <div className="text-[10px] text-emerald-800 font-semibold mt-0.5 truncate max-w-[150px]">
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
        <span
          className={`inline-flex items-center space-x-1.5 text-[11px] font-extrabold ${
            normStatus === 'Accepted'
              ? 'text-[#007A61]'
              : normStatus === 'Clarification Requested'
              ? 'text-amber-700'
              : normStatus === 'Pending'
              ? 'text-slate-600'
              : 'text-rose-600'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              normStatus === 'Accepted'
                ? 'bg-[#007A61]'
                : normStatus === 'Clarification Requested'
                ? 'bg-amber-500'
                : normStatus === 'Pending'
                ? 'bg-slate-400 animate-pulse'
                : 'bg-rose-500'
            }`}
          />
          <span>{normStatus === 'Clarification Requested' ? 'Clarification Active' : normStatus}</span>
        </span>
      </td>

      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => onActionClick && onActionClick(c)}
          className="px-2.5 py-1 text-xs font-bold text-[#007A61] bg-emerald-50 hover:bg-emerald-100/80 rounded-lg border border-emerald-200 transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs ml-auto"
          title="View Details"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </button>
      </td>
    </tr>
  );
};

export default DashboardChallengeRow;
