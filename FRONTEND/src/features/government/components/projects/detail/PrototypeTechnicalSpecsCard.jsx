import React from 'react';
import { Cpu, FileText, Layers, IndianRupee } from 'lucide-react';
import { openPdf } from '../../../../../shared/utils/openPdf.js';

export const PrototypeTechnicalSpecsCard = ({ project }) => {
  const pData = project.prototypeData || {};
  const specs = pData.specs || {
    architecture: 'Microcontroller IoT Gateway + Sensor Array',
    sensors: 'Multi-parameter Optical/Electrochemical Sensors',
    telemetry: 'LoRaWAN / 4G NB-IoT encrypted uplink',
    power: 'Solar PV 25W with Lithium LiFePO4 backup'
  };
  const unitCost = pData.unitCost || '₹14,500 / unit (at 100+ scale)';
  const bomSummary = pData.bomSummary || '12 Core Assemblies (Indigenously Sourced - 92% Make in India)';

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Technical Architecture & Specifications</h3>
        </div>
        {project.pdfUrl && (
          <button
            type="button"
            onClick={() => openPdf(project.pdfUrl)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <FileText className="w-3 h-3 text-slate-600" />
            <span>Blueprint Spec PDF</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Core Architecture</span>
          <p className="font-bold text-slate-900 truncate">{specs.architecture}</p>
        </div>
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Sensor / Hardware Array</span>
          <p className="font-bold text-slate-900 truncate">{specs.sensors}</p>
        </div>
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Telemetry Uplink</span>
          <p className="font-bold text-slate-900 truncate">{specs.telemetry}</p>
        </div>
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Power System</span>
          <p className="font-bold text-slate-900 truncate">{specs.power}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>Bill of Materials (BOM): <strong className="text-slate-900">{bomSummary}</strong></span>
        </div>
        <div className="flex items-center space-x-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Target Production Cost: <strong className="text-[#007A61] font-bold">{unitCost}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default PrototypeTechnicalSpecsCard;
