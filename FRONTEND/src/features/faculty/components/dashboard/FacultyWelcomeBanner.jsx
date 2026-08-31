import React from 'react';
import { Sparkles } from 'lucide-react';

export const FacultyWelcomeBanner = ({ faculty }) => {
  return (
    <div className="bg-gradient-to-r from-[#007A61] via-[#00604c] to-emerald-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
        <Sparkles className="w-48 h-48" />
      </div>
      <div className="relative z-10 space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10.5px] font-bold text-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          <span>Faculty Research & Mentorship Portal Node</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">
          Welcome, {faculty?.name || 'Faculty Mentor'}
        </h1>
        <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
          {faculty?.designation || 'Lead Faculty Mentor'} • {faculty?.department || 'Department of Engineering'} • {faculty?.universityCode || 'RU001'}
        </p>
      </div>
    </div>
  );
};

export default FacultyWelcomeBanner;
