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
    <div className="bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between h-full shadow-xs select-none overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-white">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#007A61]"></span>
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Pending Institutional Actions
          </h2>
        </div>
      </div>

      {/* Action Items List */}
      <div className="p-3.5 divide-y divide-slate-100">
        {actions.map((item) => {
          const Icon = ACTION_ICONS[item.actionType] || FileText;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between py-2.5 px-2 text-xs hover:bg-emerald-50/30 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-50 text-[#007A61] rounded-xl border border-emerald-200 shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block">
                    {item.title}
                  </span>
                  <span className="text-slate-400 font-mono text-[10.5px]">
                    {item.count} items require institutional attention
                  </span>
                </div>
              </div>

              <button
                onClick={() => onTriggerAction && onTriggerAction(item)}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer bg-[#007A61] hover:bg-[#006650] text-white shadow-2xs"
              >
                {item.actionText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="px-5 py-3 border-t border-slate-100 text-center bg-slate-50/30">
        <button
          onClick={onViewAll}
          className="text-xs font-extrabold text-[#007A61] hover:underline flex items-center justify-center space-x-1.5 mx-auto cursor-pointer"
        >
          <span>View all institutional tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default UniversityPendingActions;
