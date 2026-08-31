import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ChallengeJourneyTimeline = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-900 text-sm">Challenge Journey</h3>
        <p className="text-[10px] text-slate-400 font-medium">
          Track the progress of your challenge
        </p>
      </div>

      <div className="mt-4 space-y-3.5 flex-1">
        {/* Stage 1 */}
        <div className="flex items-start relative pb-3">
          <div className="absolute left-2 top-4 w-0.5 h-full bg-emerald-500 z-0"></div>
          <div className="w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 z-10">
            <CheckCircle2 className="w-3 h-3" />
          </div>
          <div className="ml-2.5 flex-1 flex justify-between items-start">
            <div className="pr-1">
              <p className="text-xs font-bold text-slate-800 leading-none">Submitted</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Challenge has been submitted successfully
              </p>
            </div>
            <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
              12 May 2026
            </span>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="flex items-start relative pb-3">
          <div className="absolute left-2 top-4 w-0.5 h-full bg-emerald-500 z-0"></div>
          <div className="w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 z-10">
            <CheckCircle2 className="w-3 h-3" />
          </div>
          <div className="ml-2.5 flex-1 flex justify-between items-start">
            <div className="pr-1">
              <p className="text-xs font-bold text-slate-800 leading-none">Initial Screening</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Challenge is under initial screening
              </p>
            </div>
            <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
              13 May 2026
            </span>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="flex items-start relative pb-3">
          <div className="absolute left-2 top-4 w-0.5 h-full bg-slate-200 z-0"></div>
          <div className="w-4.5 h-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 z-10 border border-blue-200">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <div className="ml-2.5 flex-1 flex justify-between items-start">
            <div className="pr-1">
              <p className="text-xs font-bold text-blue-600 leading-none">Expert Evaluation</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Challenge is being evaluated by experts
              </p>
            </div>
            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded whitespace-nowrap">
              In Progress
            </span>
          </div>
        </div>

        {/* Stage 4 */}
        <div className="flex items-start relative pb-3">
          <div className="absolute left-2 top-4 w-0.5 h-full bg-slate-200 z-0"></div>
          <div className="w-4.5 h-4.5 rounded-full bg-white border border-slate-300 flex items-center justify-center flex-shrink-0 z-10"></div>
          <div className="ml-2.5 flex-1">
            <p className="text-xs font-bold text-slate-400 leading-none">
              Solution Development
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Solution is being developed by HEIs
            </p>
          </div>
        </div>

        {/* Stage 5 */}
        <div className="flex items-start relative">
          <div className="w-4.5 h-4.5 rounded-full bg-white border border-slate-300 flex items-center justify-center flex-shrink-0 z-10"></div>
          <div className="ml-2.5 flex-1">
            <p className="text-xs font-bold text-slate-400 leading-none">Pilot & Deployment</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Solution will be piloted and deployed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeJourneyTimeline;
