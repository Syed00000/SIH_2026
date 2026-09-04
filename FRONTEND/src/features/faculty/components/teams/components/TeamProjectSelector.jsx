import React from 'react';
import { Layers, Info } from 'lucide-react';

export const TeamProjectSelector = ({
  projects = [],
  challenges = [],
  selectedProjectId = '',
  onProjectSelect
}) => {
  const options = [];
  const seen = new Set();

  projects.forEach((p) => {
    const id = p.projectId || p.challengeId || p._id;
    if (id && !seen.has(id)) {
      seen.add(id);
      options.push({ id, title: p.title || 'Project', domain: p.domain || 'Project', type: 'Project' });
    }
  });

  challenges.forEach((c) => {
    const id = c.challengeId || c.id || c._id;
    if (id && !seen.has(id)) {
      seen.add(id);
      options.push({ id, title: c.title || 'Challenge', domain: c.domain || 'Ground Problem', type: 'Problem' });
    }
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Linked Problem Statement / Project (Optional)</span>
        </label>
        <span className="text-[10px] text-slate-400 font-semibold">Can be assigned later</span>
      </div>

      <select
        value={selectedProjectId}
        onChange={(e) => onProjectSelect(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs cursor-pointer"
      >
        <option value="">-- None / Not Assigned Yet (Independent Research Lab Team) --</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            [{opt.type}: {opt.id}] {opt.title} ({opt.domain})
          </option>
        ))}
      </select>

      <div className="flex items-center space-x-1.5 text-[10.5px] text-slate-500 pt-0.5">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          {!selectedProjectId
            ? 'Team will be created as an independent faculty research lab group.'
            : 'Team will be formally allocated to this ground challenge.'}
        </span>
      </div>
    </div>
  );
};

export default TeamProjectSelector;
