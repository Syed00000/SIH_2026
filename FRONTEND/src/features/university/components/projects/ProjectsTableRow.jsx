import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

const getStatusColor = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'deployed') return { text: 'text-teal-700', dot: 'bg-teal-500' };
  if (s.includes('progress') || s.includes('track') || s.includes('active')) {
    return { text: 'text-emerald-600', dot: 'bg-emerald-500' };
  }
  if (s.includes('complete')) {
    return { text: 'text-purple-600', dot: 'bg-purple-500' };
  }
  if (s.includes('delay') || s.includes('risk') || s.includes('review')) {
    return { text: 'text-amber-600', dot: 'bg-amber-500 animate-pulse' };
  }
  return { text: 'text-slate-600', dot: 'bg-slate-400' };
};

export const ProjectsTableRow = ({
  project: p,
  globalIndex,
  isSelected,
  onSelectProject,
  onSoftDeleteProject
}) => {
  const title = p.title || 'Project';
  const firstLetter = title.charAt(0).toUpperCase();
  const hasMentor = Boolean(p.facultyMentor?.name || (p.leadMentor && p.leadMentor !== 'Unassigned'));
  const facultyName = p.facultyMentor?.name || p.leadMentor;
  const facultyDept = p.facultyMentor?.department || (p.facultyMentor?.name ? 'Department of Engineering' : '');
  const hasStudentTeam = Array.isArray(p.teamMembers) && p.teamMembers.length > 0;
  const statusStyle = getStatusColor(p.status || 'In Progress');
  const isDeployed = p.status === 'Deployed' || Boolean(p.isDeployed) || Boolean(p.isLocked);

  return (
    <tr
      onClick={() => onSelectProject(p)}
      className={`hover:bg-slate-50/80 transition-colors group select-none cursor-pointer ${
        isSelected ? 'bg-emerald-50/60 border-l-4 border-l-[#007A61]' : ''
      }`}
    >
      {/* Index */}
      <td className="py-2.5 px-2.5 text-center font-mono text-[11px] font-semibold text-slate-400">
        {globalIndex}
      </td>

      {/* Main Entity Tile */}
      <td className="py-2.5 px-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#007A61] font-bold text-[11px] flex items-center justify-center shrink-0 border border-emerald-200">
            {firstLetter}
          </div>
          <div className="min-w-0 max-w-[210px]">
            <div className="font-bold text-slate-900 hover:text-[#007A61] text-xs truncate leading-tight" title={title}>
              {title}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
              ID: {p.projectId} {p.challengeId ? `• Ref: ${p.challengeId}` : ''}
            </div>
          </div>
        </div>
      </td>

      {/* Domain & Budget */}
      <td className="py-2.5 px-2.5">
        <div className="font-semibold text-slate-800 text-xs truncate max-w-[130px]" title={p.domain}>
          {p.domain}
        </div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
          {p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0' ? (
            <div>
              <span className="text-emerald-600 font-bold">{p.disbursedAmount}</span>
              {p.testingLabFee ? (
                <span className="block text-[9px] text-amber-700 font-sans font-semibold">
                  (Net after {p.testingLabFee} Lab Fee)
                </span>
              ) : (
                <span className="text-slate-400 font-sans"> (Disbursed)</span>
              )}
            </div>
          ) : p.budget || 'N/A'}
        </div>
      </td>

      {/* Lead Mentor */}
      <td className="py-2.5 px-2.5">
        {hasMentor ? (
          <>
            <div className="font-bold text-slate-900 text-xs leading-tight truncate max-w-[150px]">
              {facultyName}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
              {facultyDept || 'Engineering Mentor'}
            </div>
          </>
        ) : (
          <>
            <span className="text-amber-800 font-bold text-[10.5px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
              Unassigned
            </span>
            <div className="text-[9.5px] text-slate-400 mt-0.5 font-mono">Needs Lead Mentor</div>
          </>
        )}
      </td>

      {/* Student Team */}
      <td className="py-2.5 px-2.5">
        {hasStudentTeam ? (
          <>
            <div className="font-semibold text-slate-800 text-xs truncate max-w-[130px]" title={p.studentTeam}>
              {p.studentTeam || 'Innovation Team'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {p.teamMembers.length} Members
            </div>
          </>
        ) : (
          <>
            <div className="text-[11px] text-slate-400 italic font-medium">Not Assigned</div>
            <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">Team pending</div>
          </>
        )}
      </td>

      {/* Timeline / Deadline */}
      <td className="py-2.5 px-2.5 whitespace-nowrap">
        <div className="font-semibold text-slate-800 text-xs">{p.timeline || p.deadline || '6 Months (Target: Nov 2026)'}</div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.daysLeft || 'Govt Schedule'}</div>
      </td>

      {/* Status */}
      <td className="py-2.5 px-2.5 whitespace-nowrap">
        {isDeployed ? (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
            🔒 Deployed
          </span>
        ) : (
          <span className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${statusStyle.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            <span>{p.status || 'In Progress'}</span>
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end space-x-1.5">
          <button
            type="button"
            onClick={() => onSelectProject(p)}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {onSoftDeleteProject && (
            <button
              type="button"
              onClick={() => onSoftDeleteProject(p)}
              disabled={isDeployed}
              className={`p-1.5 rounded-md transition-colors ${
                isDeployed
                  ? 'text-slate-200 cursor-not-allowed'
                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
              }`}
              title={isDeployed ? 'Deployed & Locked — Cannot archive' : 'Archive Project'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ProjectsTableRow;
