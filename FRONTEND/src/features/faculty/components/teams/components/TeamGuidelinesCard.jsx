import React from 'react';
import { BookOpen, Users, Award, ShieldCheck, Sparkles } from 'lucide-react';

export const TeamGuidelinesCard = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3.5 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#007A61]" />
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Team Guidelines &amp; Formation Policies
          </h3>
        </div>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Faculty Mentorship Norms
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Team Identity</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Set a distinctive <strong>Team Name</strong> representing your innovation lab or project focus.
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-xs">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Optimal Roster</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Teams typically consist of <strong>3 to 5 student researchers</strong> under 1 Lead Faculty Mentor.
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Student Team Leader</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Designate 1 <strong>Student Team Leader</strong> who coordinates lab fabrication and field telemetry.
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Grant Priority</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Interdisciplinary teams receive priority consideration during Government grant sanction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamGuidelinesCard;
