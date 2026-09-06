import React from 'react';
import { CheckCircle2, Clock, FlaskConical, ShieldCheck } from 'lucide-react';

const COLOR_MAP = {
  blue: {
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    headerBg: 'bg-blue-50/40',
    border: 'border-blue-200',
    activeCheck: 'bg-blue-50/70 border-blue-300 text-blue-900',
    tag: 'text-blue-700'
  },
  purple: {
    badge: 'bg-purple-50 text-purple-800 border-purple-200',
    headerBg: 'bg-purple-50/40',
    border: 'border-purple-200',
    activeCheck: 'bg-purple-50/70 border-purple-300 text-purple-900',
    tag: 'text-purple-700'
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    headerBg: 'bg-emerald-50/40',
    border: 'border-emerald-200',
    activeCheck: 'bg-emerald-50/70 border-emerald-300 text-emerald-900',
    tag: 'text-emerald-700'
  }
};

export const PrototypeTestingStageCard = ({
  stage,
  selectedTests = [],
  onToggleTest,
  isLocked
}) => {
  const colors = COLOR_MAP[stage.color] || COLOR_MAP.blue;
  const stageCheckedCount = stage.tests.filter((t) => selectedTests.includes(t.id)).length;

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden shadow-2xs transition-all ${colors.border}`}>
      {/* Stage Header */}
      <div className={`px-4 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${colors.headerBg} ${colors.border}`}>
        <div className="flex items-center space-x-2.5">
          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${colors.badge}`}>
            Stage {stage.stageNumber}
          </span>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
            {stage.title}
          </h4>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-600 bg-white/90 border border-slate-200 px-2.5 py-0.5 rounded-lg">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{stage.expectedDays}</span>
          </span>
          <span className="text-[10.5px] font-bold text-slate-500">
            {stageCheckedCount}/{stage.tests.length} Selected
          </span>
        </div>
      </div>

      {/* Stage Body */}
      <div className="p-4 space-y-3">
        <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed">
          {stage.description}
        </p>

        {/* Sub-Tests List */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[9.5px] font-extrabold uppercase text-slate-400 tracking-wider block">
            Required Stage Testing Protocols & Verification Checks:
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {stage.tests.map((test) => {
              const isChecked = selectedTests.includes(test.id);
              return (
                <label
                  key={test.id}
                  className={`flex items-center space-x-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isChecked ? colors.activeCheck : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={isLocked}
                    checked={isChecked}
                    onChange={() => onToggleTest(test.id)}
                    className="w-4 h-4 text-[#007A61] rounded focus:ring-[#007A61] cursor-pointer"
                  />
                  <span className={`text-xs ${isChecked ? 'font-bold' : 'font-medium'}`}>
                    {test.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypeTestingStageCard;
