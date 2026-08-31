import React from 'react';
import { Eye, MessageSquare } from 'lucide-react';

export const ChallengesTableRow = ({
  c,
  globalIndex,
  isSelected,
  normStatus,
  onSelectChallenge,
  onActionClick,
  onOpenChat
}) => {
  const title = c.title || 'Challenge';
  const firstLetter = title.charAt(0).toUpperCase();
  const loc = c.location || c.locationDetails || {};
  const panchayat = loc.panchayatOrWard || loc.gramPanchayat || 'Gram Panchayat';
  const skills = Array.isArray(c.requiredSkills) && c.requiredSkills.length > 0
    ? c.requiredSkills
    : typeof c.requiredSkills === 'string' && c.requiredSkills.trim()
    ? c.requiredSkills.split(',').map((s) => s.trim())
    : [c.domain || 'Field Research', 'Ground Innovation'];

  return (
    <tr
      onClick={() => onSelectChallenge(c)}
      className={`hover:bg-emerald-50/30 transition-colors group select-none cursor-pointer text-left ${
        isSelected ? 'bg-emerald-50/60 border-l-4 border-l-[#007A61]' : ''
      }`}
    >
      <td className="py-3 px-3 text-center font-mono text-[11px] font-bold text-slate-400">
        {globalIndex}
      </td>

      <td className="py-3 px-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] font-black text-xs flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
            {firstLetter}
          </div>
          <div className="min-w-0 max-w-[210px]">
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
        <div className="font-bold text-slate-800 text-xs truncate max-w-[140px]" title={c.domain}>
          {c.domain}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[140px]">
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
            <div className="text-[10px] text-slate-400 mt-0.5">Ready for Mentor</div>
          </div>
        )}
      </td>

      <td className="py-3 px-3">
        <div className="flex flex-wrap gap-1 max-w-[140px]">
          {skills.slice(0, 2).map((s, idx) => (
            <span
              key={idx}
              className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 truncate max-w-[65px]"
              title={s}
            >
              {s}
            </span>
          ))}
          {skills.length > 2 && (
            <span className="text-[9.5px] font-bold text-slate-400">+{skills.length - 2}</span>
          )}
        </div>
      </td>

      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center space-x-1.5 text-[11px] font-bold ${
            c.priority === 'High' || c.priority === 'Critical'
              ? 'text-rose-600'
              : c.priority === 'Low'
              ? 'text-slate-600'
              : 'text-amber-600'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              c.priority === 'High' || c.priority === 'Critical'
                ? 'bg-rose-500'
                : c.priority === 'Low'
                ? 'bg-slate-400'
                : 'bg-amber-500'
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
              : normStatus === 'Clarified'
              ? 'text-emerald-700'
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
                : normStatus === 'Clarified'
                ? 'bg-emerald-500'
                : normStatus === 'Clarification Requested'
                ? 'bg-amber-500'
                : normStatus === 'Pending'
                ? 'bg-slate-400 animate-pulse'
                : 'bg-rose-500'
            }`}
          />
          <span>{normStatus}</span>
        </span>
      </td>

      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end space-x-1">
          {onOpenChat && (
            <button
              type="button"
              onClick={() => onOpenChat(c)}
              className="p-1.5 text-slate-400 hover:text-[#007A61] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="Open Clarification Intercom"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onActionClick(c)}
            className="px-2.5 py-1 text-xs font-bold text-[#007A61] bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            title="Inspect Challenge"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ChallengesTableRow;
