import React from 'react';
import { Layers, CheckCircle2, Cpu, Sparkles, Clock, Target } from 'lucide-react';

const DEFAULT_STAGES = [
  { stage: 1, title: 'Lab CAD & Circuit Rig', targetDays: 'Days 1-30', deliverable: 'Component procurement, PCB milling, sensor bench test' },
  { stage: 2, title: 'Field Ground Testing', targetDays: 'Days 31-75', deliverable: 'Telemetry calibration in rural pilot site' },
  { stage: 3, title: 'NABL Lab Certification', targetDays: 'Days 76-120', deliverable: 'Safety and quality standard test report' },
  { stage: 4, title: 'Public Rollout & Scale', targetDays: 'Days 121-180', deliverable: 'Deployment and handover to district administration' }
];

export const ProposalTechnicalTab = ({ proposal, linkedProject }) => {
  const customRoadmap =
    (Array.isArray(proposal?.milestoneRoadmap) && proposal.milestoneRoadmap.length > 0)
      ? proposal.milestoneRoadmap
      : (Array.isArray(linkedProject?.milestoneRoadmap) && linkedProject.milestoneRoadmap.length > 0)
      ? linkedProject.milestoneRoadmap
      : DEFAULT_STAGES;

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Technical Methodology Section */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/90 space-y-2 shadow-2xs">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-[#007A61]" />
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Technical Methodology & Research Plan
          </h4>
        </div>
        <p className="text-slate-700 leading-relaxed font-sans bg-slate-50/80 p-3 rounded-lg border border-slate-200/60 whitespace-pre-wrap">
          {proposal.methodology || linkedProject?.methodology || 'Technical methodology formulated by Lead Faculty Mentor focusing on real-time sensor calibration, field deployment, and cloud telemetry integration with JoharSetu portal.'}
        </p>
      </div>

      {/* Hardware & Prototype Specs */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/90 space-y-2 shadow-2xs">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Cpu className="w-4 h-4 text-slate-700" />
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Hardware & Lab Specifications
          </h4>
        </div>
        <p className="text-slate-700 leading-relaxed text-xs">
          {proposal.hardwareSpecs || linkedProject?.hardwareSpecs || 'Integrated embedded microcontroller unit, optical telemetry probes, 3D printed ABS casing, LoRaWAN wireless module, and solar battery charging pack.'}
        </p>
      </div>

      {/* Dynamic Faculty Milestone Roadmap */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/90 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-[#007A61]" />
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Faculty Milestone Roadmap & Research Stages
            </h4>
          </div>
          <span className="text-[10px] font-bold text-[#007A61] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Faculty Formulated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {customRoadmap.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl flex flex-col justify-between space-y-1.5 hover:bg-white hover:border-[#007A61] transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Stage {item.stage || idx + 1}
                </span>
                <span className="text-[9.5px] font-bold text-[#007A61] bg-white border border-emerald-200 px-1.5 py-0.2 rounded">
                  {item.targetDays || `Phase ${idx + 1}`}
                </span>
              </div>
              <div className="font-bold text-slate-900 text-xs leading-snug">
                {item.title}
              </div>
              {item.deliverable && (
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed pt-0.5 border-t border-slate-200/60">
                  {item.deliverable}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProposalTechnicalTab;
