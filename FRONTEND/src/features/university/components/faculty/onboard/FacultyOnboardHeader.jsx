import React from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';

export const FacultyOnboardHeader = ({ onBack }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 text-left">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span className="cursor-pointer hover:text-slate-900" onClick={onBack}>Faculty Mentors</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Onboard New Faculty</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <UserPlus className="w-5 h-5 text-slate-900" />
          <span>Onboard New Faculty Mentor</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Register academic faculty researchers and verify domain specialization for grassroots innovation mentorship.
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Faculty Directory</span>
      </button>
    </div>
  );
};

export default FacultyOnboardHeader;
