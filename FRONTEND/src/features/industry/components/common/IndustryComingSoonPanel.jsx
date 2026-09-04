import React from 'react';
import { Sparkles, Clock, ArrowLeft } from 'lucide-react';

export const IndustryComingSoonPanel = ({ title = 'Module', description = '', icon: Icon = Sparkles, onBackToDashboard }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-2xs text-center space-y-5 max-w-2xl mx-auto my-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#007A61] mx-auto shadow-inner">
        <Icon className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#007A61] text-xs font-black uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Under Active Development</span>
        </div>
        <h2 className="text-xl font-black text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          {description || `The ${title} module is being connected to the Jharkhand Higher Education & Industry R&D pipeline. Stay tuned for updates in the upcoming release.`}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-center space-x-3">
        {onBackToDashboard && (
          <button
            type="button"
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default IndustryComingSoonPanel;
