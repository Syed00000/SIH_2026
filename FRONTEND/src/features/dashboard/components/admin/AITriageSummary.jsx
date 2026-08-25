import React from 'react';
import { FileText, Clock, Edit3, Users } from 'lucide-react';

export const AITriageSummary = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3">
      <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
        AI Triage Summary
      </h3>

      <div className="space-y-2.5">
        {/* Stat 1: Total Incoming */}
        <div className="flex items-center space-x-3 p-2.5 rounded-md bg-slate-50/70 border border-slate-100">
          <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Total Incoming Issues
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-base font-extrabold text-slate-900 leading-none">
                12,450
              </span>
              <span className="text-[10px] font-bold text-emerald-600 leading-none">
                +320 today
              </span>
            </div>
          </div>
        </div>

        {/* Stat 2: Pending Review */}
        <div className="flex items-center space-x-3 p-2.5 rounded-md bg-slate-50/70 border border-slate-100">
          <div className="w-8 h-8 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Pending Review
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-base font-extrabold text-slate-900 leading-none">
                128
              </span>
              <span className="text-[10px] font-semibold text-amber-700 leading-none">
                Needs attention
              </span>
            </div>
          </div>
        </div>

        {/* Stat 3: Overrides Done */}
        <div className="flex items-center space-x-3 p-2.5 rounded-md bg-slate-50/70 border border-slate-100">
          <div className="w-8 h-8 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <Edit3 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Overrides Done
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-base font-extrabold text-slate-900 leading-none">
                256
              </span>
              <span className="text-[10px] font-medium text-slate-500 leading-none">
                This month
              </span>
            </div>
          </div>
        </div>

        {/* Stat 4: Duplicates Detected */}
        <div className="flex items-center space-x-3 p-2.5 rounded-md bg-slate-50/70 border border-slate-100">
          <div className="w-8 h-8 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Duplicates Detected
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-base font-extrabold text-slate-900 leading-none">
                412
              </span>
              <span className="text-[10px] font-semibold text-purple-700 leading-none">
                Clusters pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITriageSummary;
