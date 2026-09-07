import React, { useState } from 'react';
import { FileText, Sparkles, CheckCircle2, FlaskConical, TestTube2, ShieldCheck, Rocket } from 'lucide-react';

const PROTO_PHASES = [
  { key: 'labDesign', label: 'Lab Design', icon: FlaskConical, color: 'amber' },
  { key: 'fieldTest', label: 'Field Test', icon: TestTube2, color: 'blue' },
  { key: 'stateCert', label: 'State Cert', icon: ShieldCheck, color: 'purple' },
  { key: 'publicDeploy', label: 'Public Deploy', icon: Rocket, color: 'emerald' },
];

const PROTO_COLORS = {
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', activeBg: 'bg-amber-500' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', activeBg: 'bg-blue-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', activeBg: 'bg-purple-500' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', activeBg: 'bg-emerald-500' },
};

export const PrototypePhasesView = ({ approval }) => {
  const [activeTab, setActiveTab] = useState(0);
  const phases = approval.metadata?.phases || null;
  const legacyContent = approval.metadata?.prototypeContent || '';
  const timeline = approval.metadata?.timeline;

  const hasPhases = phases && Object.values(phases).some((v) => v && v.replace(/<[^>]*>/g, '').trim().length > 0);

  if (!hasPhases) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-[#007A61]" />
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex justify-between w-full">
            <span>Prototype Blueprint Details</span>
            {timeline && (
              <span className="bg-emerald-50 text-[#007A61] border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                Timeline: {timeline}
              </span>
            )}
          </h3>
        </div>
        {legacyContent ? (
          <div
            className="ql-editor prose prose-sm prose-slate max-w-none text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-lg border border-slate-200/60"
            dangerouslySetInnerHTML={{ __html: legacyContent }}
          />
        ) : (
          <p className="text-xs text-slate-500">No prototype details provided.</p>
        )}
      </div>
    );
  }

  const phaseContents = {
    labDesign: phases.labDesign || '',
    fieldTest: phases.fieldTest || '',
    stateCert: phases.stateCert || '',
    publicDeploy: phases.publicDeploy || '',
  };

  const completedCount = PROTO_PHASES.filter((p) => {
    const v = phaseContents[p.key];
    return v && v.replace(/<[^>]*>/g, '').trim().length > 0;
  }).length;

  const activePhase = PROTO_PHASES[activeTab];
  const colors = PROTO_COLORS[activePhase.color];
  const Icon = activePhase.icon;
  const content = phaseContents[activePhase.key];
  const hasContent = content && content.replace(/<[^>]*>/g, '').trim().length > 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
      <div className="px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#007A61]" />
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Prototype Blueprint — 4 Phase Dossier</span>
        </div>
        {timeline && (
          <span className="bg-emerald-50 text-[#007A61] border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            Timeline: {timeline}
          </span>
        )}
      </div>

      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center space-x-1.5">
          {PROTO_PHASES.map((p) => {
            const v = phaseContents[p.key];
            const done = v && v.replace(/<[^>]*>/g, '').trim().length > 0;
            const c = PROTO_COLORS[p.color];
            return <div key={p.key} className={`flex-1 h-1.5 rounded-full ${done ? c.activeBg : 'bg-slate-200'}`} />;
          })}
        </div>
        <p className="text-[10px] font-bold text-slate-400 mt-1">{completedCount}/4 Phases Documented</p>
      </div>

      <div className="flex border-b border-slate-200">
        {PROTO_PHASES.map((p, i) => {
          const isActive = i === activeTab;
          const pColors = PROTO_COLORS[p.color];
          const v = phaseContents[p.key];
          const isDone = v && v.replace(/<[^>]*>/g, '').trim().length > 0;

          return (
            <button
              key={p.key}
              onClick={() => setActiveTab(i)}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-3 px-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
                isActive
                  ? `${pColors.bg} ${pColors.text} border-b-2 ${pColors.border}`
                  : isDone
                  ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-b-2 border-transparent'
                  : 'bg-white text-slate-400 hover:text-slate-500 hover:bg-slate-50 border-b-2 border-transparent'
              }`}
            >
              {isDone && !isActive && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
              {isActive && <Sparkles className="w-3 h-3 animate-pulse opacity-70" />}
              <span>{i + 1}. {p.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-5">
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-7 h-7 rounded-lg ${colors.activeBg} flex items-center justify-center`}>
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <h4 className={`text-xs font-extrabold uppercase tracking-wider ${colors.text}`}>
            Phase {activeTab + 1}: {activePhase.label}
          </h4>
        </div>

        {hasContent ? (
          <div
            className="ql-editor prose prose-sm prose-slate max-w-none text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-lg border border-slate-200/60"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200/60 text-center">
            <p className="text-xs text-slate-400 font-semibold">No documentation provided for this phase yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrototypePhasesView;
