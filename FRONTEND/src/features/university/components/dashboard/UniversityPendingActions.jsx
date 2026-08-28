import React from 'react';
import { FileText, UserPlus, Users, ClipboardList, AlertCircle, ArrowRight } from 'lucide-react';

const ACTION_ICONS = {
  review_challenges: FileText,
  assign_faculty: UserPlus,
  complete_teams: Users,
  review_proposals: ClipboardList,
  view_milestones: AlertCircle
};

export const UniversityPendingActions = ({
  actions = [],
  onTriggerAction,
  onViewAll
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-none flex flex-col justify-between h-full">
      {/* Header */}
      <div className="px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Pending Actions
        </h2>
      </div>

      {/* Action Items List */}
      <div className="p-2.5 divide-y divide-slate-100">
        {actions.map((item) => {
          const Icon = ACTION_ICONS[item.actionType] || FileText;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 px-1 text-xs hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-slate-100 text-slate-700 rounded-none border border-slate-200">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-900">
                  {item.title}
                </span>
                <span className="text-slate-500 font-mono text-[11px] font-bold">
                  ({item.count})
                </span>
              </div>

              <button
                onClick={() => onTriggerAction && onTriggerAction(item)}
                className="px-2.5 py-1 rounded-none text-xs font-bold transition-colors cursor-pointer bg-slate-900 hover:bg-black text-white"
              >
                {item.actionText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="px-3.5 py-2 border-t border-slate-200 text-center bg-slate-50">
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-slate-900 hover:text-black flex items-center justify-center space-x-1 mx-auto cursor-pointer"
        >
          <span>View all pending actions</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default UniversityPendingActions;
