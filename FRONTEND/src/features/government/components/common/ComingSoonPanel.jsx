import React from 'react';
import { Sparkles, ArrowLeft, Clock } from 'lucide-react';

export const ComingSoonPanel = ({ title = 'Module', description, onBackToOverview }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-lg mx-auto text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs">
        <Clock className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        {/* <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full mb-1">
          <Sparkles className="w-3 h-3 mr-1 text-blue-500" />
          Under Active Development
        </span> */}
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {title} — Coming Soon
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          {description || 'This government innovation module is currently being calibrated and will be live in the next release.'}
        </p>
      </div>

      {onBackToOverview && (
        <button
          onClick={onBackToOverview}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview Dashboard</span>
        </button>
      )}
    </div>
  );
};

export default ComingSoonPanel;
