import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  FlaskConical,
  Building2,
  Sliders,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  ArrowRight,
  Check,
  Activity,
  Radio,
  ShieldCheck,
  Users
} from 'lucide-react';
import { InspectPrototypeModal } from './InspectPrototypeModal.jsx';

export const PrototypesEvaluationView = ({ projects = [], onManageProject, onAdvanceTrl }) => {
  const [selectedTrl, setSelectedTrl] = useState('All Stages');
  const [inspectModalProject, setInspectModalProject] = useState(null);

  const filteredProjects = projects.filter((p) => {
    const num = parseInt(String(p.trlLevel || 'TRL-4').replace('TRL-', ''), 10) || 4;
    if (selectedTrl === 'All Stages') return true;
    if (selectedTrl === 'Stage 1: Lab Concept') return num <= 3;
    if (selectedTrl === 'Stage 2: Field Tested') return num >= 4 && num <= 6;
    if (selectedTrl === 'Stage 3: Certified') return num >= 7 && num <= 8;
    if (selectedTrl === 'Stage 4: Deployed') return num >= 9;
    return true;
  });

  return (
    <>
      <div className="space-y-4 select-none animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
              Prototypes & Technology Readiness Levels (TRL)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Interactive 4-stage tracking: <strong>1. Lab Design</strong> ➔ <strong>2. Field Tested</strong> ➔ <strong>3. State Certified</strong> ➔ <strong>4. Public Deployment</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['All Stages', 'Stage 1: Lab Concept', 'Stage 2: Field Tested', 'Stage 3: Certified', 'Stage 4: Deployed'].map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setSelectedTrl(stage)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  selectedTrl === stage
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
              No prototypes forwarded from Universities yet matching this filter.
            </div>
          ) : (
            filteredProjects.map((prj) => {
            const curTrlNum = parseInt(String(prj.trlLevel || '4').replace('TRL-', ''), 10) || 4;

            return (
              <div
                key={prj.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-black bg-slate-900 text-white">
                          {prj.trlLevel}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {prj.prototypeType || 'Hardware'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-2">{prj.title}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {prj.hei} · {prj.district} District
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">({prj.id})</span>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Hardware & Sensors (Simple Summary):
                      </span>
                      <p className="text-slate-800 text-[11px] mt-0.5 leading-relaxed font-medium">
                        {prj.hardwareSpecs || 'Embedded IoT Microcontroller with RF Sub-GHz links.'}
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                        <span>Readiness Pipeline</span>
                        <span className="text-slate-900">{curTrlNum >= 9 ? '100% Ready' : curTrlNum >= 7 ? '75% Ready' : curTrlNum >= 4 ? '50% Ready' : '25% Ready'}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-[9.5px] text-center font-bold pt-1">
                        <span className={`p-1 rounded ${curTrlNum >= 1 ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-400'}`}>1. Lab</span>
                        <span className={`p-1 rounded ${curTrlNum >= 4 ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-400'}`}>2. Field</span>
                        <span className={`p-1 rounded ${curTrlNum >= 7 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-400'}`}>3. Cert</span>
                        <span className={`p-1 rounded ${curTrlNum >= 9 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>4. Deploy</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setInspectModalProject(prj)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
                    <span>Inspect Tests & Specs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onAdvanceTrl) onAdvanceTrl(prj.id);
                      else if (onManageProject) onManageProject(prj);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <span>Advance Stage (+1 TRL)</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <InspectPrototypeModal
        isOpen={Boolean(inspectModalProject)}
        onClose={() => setInspectModalProject(null)}
        project={inspectModalProject}
        onAdvanceStage={(id) => {
          onAdvanceTrl?.(id);
          setInspectModalProject(null);
        }}
      />
    </>
  );
};

export default PrototypesEvaluationView;
