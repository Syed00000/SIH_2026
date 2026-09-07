import React from 'react';
import { CheckCircle2, Upload, MessageSquare, UserPlus, Activity } from 'lucide-react';

export const ProjectActivityFeed = ({ activities = [] }) => (
  <div className="space-y-2 pt-2 border-t border-slate-100">
    <div className="flex items-center justify-between">
      <span className="text-[10.5px] font-extrabold text-slate-900 uppercase">Recent Activity</span>
      <span className="text-[10px] font-mono text-slate-400">{activities.length} Events</span>
    </div>

    {activities.length === 0 ? (
      <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl text-center space-y-1">
        <Activity className="w-5 h-5 text-slate-300 mx-auto" />
        <div className="text-xs font-bold text-slate-700">No activity logs yet</div>
        <p className="text-[11px] text-slate-500">
          Activity logs will be recorded as milestone updates and mentor actions occur.
        </p>
      </div>
    ) : (
      <div className="space-y-2">
        {activities.map((act, i) => (
          <div
            key={i}
            className="flex items-start space-x-2.5 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-[#007A61] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
              {act.type === 'milestone' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : act.type === 'document' ? (
                <Upload className="w-3.5 h-3.5 text-slate-800" />
              ) : act.type === 'comment' ? (
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <UserPlus className="w-3.5 h-3.5 text-[#007A61]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-slate-900 leading-tight">{act.text}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                By {act.user || 'System'} {act.time ? `• ${act.time}` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ProjectActivityFeed;
