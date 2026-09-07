import React from 'react';
import { Cpu, Globe } from 'lucide-react';
import { PrototypeMilestonesSection } from './PrototypeMilestonesSection.jsx';
import { PrototypePdfSection } from './PrototypePdfSection.jsx';
import { PrototypeTechStackFields } from './PrototypeTechStackFields.jsx';

export const PrototypeDetailsTab = ({
  project,
  prototypeData,
  onChangeData,
  isLocked,
  onRefresh,
  milestoneStages
}) => {
  const pId = project?.projectId || project?.challengeId || project?._id;
  const currentPdfUrl = prototypeData?.pdfUrl || project?.pdfUrl || project?.prototypeData?.pdfUrl;
  const currentPdfName = prototypeData?.pdfName || project?.pdfName || project?.prototypeData?.pdfName || 'Prototype_Blueprint_Dossier.pdf';

  return (
    <div className="space-y-4 text-left select-none">
      {/* 1. Architecture & Tech Stack Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Cpu className="w-4 h-4 text-[#007A61]" />
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            1. Prototype Architecture & Hardware-Software Stack
          </h4>
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
            Prototype Working Title / Nomenclature *
          </label>
          <input
            type="text"
            value={prototypeData?.title || ''}
            onChange={(e) => onChangeData('title', e.target.value)}
            placeholder="e.g., IoT Solar Telemetry Node v2.1"
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-[#007A61]"
          />
        </div>

        {/* Department / Category & Required Industry Tech Tool & Stack */}
        <PrototypeTechStackFields
          department={prototypeData?.department || ''}
          requiredTechTool={prototypeData?.requiredTechTool || ''}
          techStack={prototypeData?.techStack || ''}
          onChangeData={onChangeData}
          isLocked={false}
        />

        <div>
          <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
            Working Mechanism & Methodology
          </label>
          <textarea
            rows={3}
            value={prototypeData?.mechanism || ''}
            onChange={(e) => onChangeData('mechanism', e.target.value)}
            placeholder="Describe the end-to-end mechanism, circuit loops, sensor integration, real-time telemetry pipelines, and fail-safe automation..."
            className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-[#007A61]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
              Bill of Materials (BOM) & Key Sensors
            </label>
            <input
              type="text"
              value={prototypeData?.bomSensors || ''}
              onChange={(e) => onChangeData('bomSensors', e.target.value)}
              placeholder="e.g., MQ-135, DHT22, SX1276 LoRa, LiFePO4 5000mAh"
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-[#007A61]"
            />
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1 flex items-center space-x-1">
              <Globe className="w-3 h-3 text-[#007A61]" />
              <span>Live Simulation / Demo URL (Optional)</span>
            </label>
            <input
              type="url"
              value={prototypeData?.demoUrl || ''}
              onChange={(e) => onChangeData('demoUrl', e.target.value)}
              placeholder="https://wokwi.com/projects/... or live telemetry dashboard"
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-[#007A61]"
            />
          </div>
        </div>
      </div>

      {/* 2. Technical Dossier & CAD Schematic (PDF Upload) */}
      <PrototypePdfSection
        pId={pId}
        currentPdfUrl={currentPdfUrl}
        currentPdfName={currentPdfName}
        isLocked={isLocked}
        onChangeData={onChangeData}
        onRefresh={onRefresh}
      />

      {/* 3. Research Stages & Milestone Roadmap (Read-Only from Proposal) */}
      <PrototypeMilestonesSection stages={milestoneStages || []} />
    </div>
  );
};

export default PrototypeDetailsTab;
