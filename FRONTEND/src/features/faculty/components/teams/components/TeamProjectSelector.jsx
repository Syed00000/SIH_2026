import React from 'react';

export const TeamProjectSelector = ({
  projects = [],
  selectedProjectId,
  onProjectSelect
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
      <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600">
        Active Project Selection *
      </label>
      <select
        value={selectedProjectId}
        onChange={(e) => onProjectSelect(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs cursor-pointer"
      >
        {projects.map((p, i) => (
          <option key={p.projectId || i} value={p.projectId || p.challengeId}>
            {p.projectId} — {p.title} ({p.domain})
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeamProjectSelector;
