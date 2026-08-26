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
  Sparkles,
  Zap
} from 'lucide-react';

export const PrototypesEvaluationView = ({ projects = [], onManageProject }) => {
  const [selectedTrl, setSelectedTrl] = useState('All TRL');

  const filteredProjects = projects.filter((p) => {
    if (selectedTrl === 'All TRL') return true;
    if (selectedTrl === 'High TRL (7-9)') {
      const num = parseInt(p.trlLevel?.replace('TRL-', '') || '0', 10);
      return num >= 7;
    }
    if (selectedTrl === 'Mid TRL (4-6)') {
      const num = parseInt(p.trlLevel?.replace('TRL-', '') || '0', 10);
      return num >= 4 && num <= 6;
    }
    if (selectedTrl === 'Early TRL (1-3)') {
      const num = parseInt(p.trlLevel?.replace('TRL-', '') || '0', 10);
      return num <= 3;
    }
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            Prototypes & Technology Readiness Levels (TRL)
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Hardware, software, and hybrid engineering prototypes verified in university laboratories
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {['All TRL', 'High TRL (7-9)', 'Mid TRL (4-6)', 'Early TRL (1-3)'].map((trl) => (
            <button
              key={trl}
              type="button"
              onClick={() => setSelectedTrl(trl)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                selectedTrl === trl
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {trl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((prj) => {
          return (
            <div
              key={prj.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-900 text-white">
                        {prj.trlLevel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {prj.prototypeType} Architecture
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{prj.title}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{prj.trlDescription}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">({prj.id})</span>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Hardware / Stack Specs:
                    </span>
                    <p className="text-slate-700 text-[11px] mt-0.5 line-clamp-2">
                      {prj.hardwareSpecs || 'Embedded IoT Microcontroller with RF Sub-GHz links.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-1 text-[11px]">
                    <span className="text-slate-500">Institution & Lab:</span>
                    <span className="font-semibold text-slate-800">{prj.hei}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600">
                  Status: <strong className="text-slate-900">{prj.deploymentStatus}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => onManageProject && onManageProject(prj)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
                  <span>Inspect Prototype</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrototypesEvaluationView;
