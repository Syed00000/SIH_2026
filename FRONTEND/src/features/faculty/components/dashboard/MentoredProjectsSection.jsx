import React from 'react';
import { ClipboardList } from 'lucide-react';
import { MentoredProjectCard } from './MentoredProjectCard.jsx';

export const MentoredProjectsSection = ({ projects = [], onNavigateTab }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900">Your Mentored R&D Projects</h2>
          <p className="text-[11px] text-slate-500">
            Grassroots problem statements assigned to your innovation lab
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="py-8 text-center text-slate-400 space-y-1">
          <ClipboardList className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">No projects currently assigned.</p>
          <p className="text-[11px]">When Ranchi University assigns you as a Lead Mentor, problems will appear here.</p>
        </div>
      ) : (
        <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
          {projects.map((p, i) => (
            <MentoredProjectCard
              key={p.projectId || i}
              project={p}
              index={i}
              onNavigateTab={onNavigateTab}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MentoredProjectsSection;
