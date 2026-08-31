import React from 'react';
import { Users, FolderGit2, FlaskConical, Award } from 'lucide-react';

export const ProfileStatsGrid = ({ profile }) => {
  const stats = profile?.stats || {};
  const cards = [
    { label: 'Faculty Mentors', val: stats.facultyMembers || 128, sub: 'Across 8 Depts', icon: Users, color: 'emerald' },
    { label: 'Enrolled Students', val: stats.students || 6240, sub: 'Undergrad & Postgrad', icon: Users, color: 'blue' },
    { label: 'Active R&D Projects', val: stats.activeProjects || 28, sub: 'Grassroots Innovation', icon: FolderGit2, color: 'purple' },
    { label: 'Core Research Labs', val: profile.facilities?.length || 7, sub: 'State-of-the-art', icon: FlaskConical, color: 'amber' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold text-slate-500">{c.label}</span>
              <Icon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl font-black text-slate-900 font-mono tracking-tight">{c.val}</div>
            <div className="text-[10.5px] text-slate-400 font-medium">{c.sub}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileStatsGrid;
