import React from 'react';
import { Cpu, FileText, Layers, IndianRupee, MapPin, Building2, User, Users, BookOpen } from 'lucide-react';
import { openPdf } from '../../../../../shared/utils/openPdf.js';

export const PrototypePhase1LabView = ({ project }) => {
  const pData = project.prototypeData || {};
  const specs = pData.specs || {
    architecture: 'Microcontroller IoT Gateway + Sensor Array',
    sensors: 'Multi-parameter Optical/Electrochemical Sensors',
    telemetry: 'LoRaWAN / 4G NB-IoT encrypted uplink',
    power: 'Solar PV 25W with Lithium LiFePO4 backup'
  };
  const unitCost = pData.unitCost || '₹14,500 / unit (at 100+ scale)';
  const bomSummary = pData.bomSummary || '12 Core Assemblies (Indigenously Sourced - 92% Make in India)';
  const labContent = pData.phases?.labDesign || pData.content || '';

  return (
    <div className="space-y-4">
      {/* 1. Problem Statement Dossier */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ground Citizen Problem Dossier</span>
          <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{project.challengeId || 'CHL-JH-2026-3857'}</span>
        </div>
        <p className="text-sm font-extrabold text-slate-900 leading-relaxed">"{project.problemStatement || project.title}"</p>
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <span className="flex items-center space-x-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>District: <strong className="text-slate-900">{project.district || 'Ranchi'}</strong></span></span>
          <span>•</span>
          <span>Target Sector: <strong className="text-slate-900">{project.domain || project.sector || 'Urban Development'}</strong></span>
        </div>
      </div>

      {/* 2. Research Team & Host Institution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1"><Building2 className="w-3 h-3 text-[#007A61]" /><span>Host Institution</span></span>
          <span className="text-xs font-black text-slate-900 block truncate">{project.hei || 'Ranchi University'}</span>
          <span className="text-[11px] text-[#007A61] font-semibold">{project.district || 'Ranchi'} District</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1"><User className="w-3 h-3 text-slate-500" /><span>Lead Faculty PI</span></span>
          <span className="text-xs font-black text-slate-900 block truncate">{project.teamLead || project.leadMentor || 'Faculty Mentor'}</span>
          <span className="text-[11px] text-slate-500">Nodal Faculty Guide</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1"><Users className="w-3 h-3 text-slate-500" /><span>Student Researchers</span></span>
          <span className="text-xs font-black text-slate-900 block truncate">{project.studentTeam || 'Student Innovation Team'}</span>
          <span className="text-[11px] text-slate-500">Allocated Innovators</span>
        </div>
      </div>

      {/* 3. Hardware Architecture & BOM */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Hardware Architecture & Technical Specifications</h3>
          </div>
          {project.pdfUrl && (
            <button type="button" onClick={() => openPdf(project.pdfUrl)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg flex items-center space-x-1 cursor-pointer transition-colors">
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
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sensor Array</span>
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
          <div className="flex items-center space-x-1.5"><Layers className="w-3.5 h-3.5 text-slate-500" /><span>Bill of Materials (BOM): <strong className="text-slate-900">{bomSummary}</strong></span></div>
          <div className="flex items-center space-x-1.5"><IndianRupee className="w-3.5 h-3.5 text-[#007A61]" /><span>Target Unit Cost: <strong className="text-[#007A61] font-bold">{unitCost}</strong></span></div>
        </div>
      </div>

      {/* 4. Lab Documentation Notes */}
      {labContent && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <h4 className="text-xs font-black uppercase text-slate-800 flex items-center space-x-1.5"><BookOpen className="w-3.5 h-3.5 text-slate-500" /><span>Lab Prototype Schematics & Design Log</span></h4>
          <div className="text-xs text-slate-700 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: labContent }} />
        </div>
      )}
    </div>
  );
};

export default PrototypePhase1LabView;
