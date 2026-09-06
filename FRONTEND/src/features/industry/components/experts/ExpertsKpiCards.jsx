import React from 'react';
import { Users, Award, UserCheck, GraduationCap } from 'lucide-react';

export const ExpertsKpiCards = ({ stats = {} }) => {
  const cards = [
    {
      title: 'Total Experts Registered',
      value: stats.totalExperts || 0,
      sub: 'Industrial R&D pool',
      icon: Users,
      bg: 'bg-emerald-50 text-[#007A61] border-emerald-200'
    },
    {
      title: 'Active Technical Mentors',
      value: stats.activeMentors || 0,
      sub: 'Mentoring university squads',
      icon: Award,
      bg: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Available Specialists',
      value: stats.availableExperts || 0,
      sub: 'Ready for assignment',
      icon: UserCheck,
      bg: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      title: 'Mentorship Engagements',
      value: stats.totalAssignments || 0,
      sub: 'Problem statements guided',
      icon: GraduationCap,
      bg: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-sm transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 block">
                {c.title}
              </span>
              <div className="text-xl font-black text-slate-900 mt-1">{c.value}</div>
              <span className="text-[10px] text-slate-500 font-medium">{c.sub}</span>
            </div>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${c.bg}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpertsKpiCards;
