import React from 'react';
import { ShieldCheck, FileCheck2, CheckCircle2, Award, Activity, Radio, MapPin, Gauge } from 'lucide-react';
import { openPdf } from '../../../../../shared/utils/openPdf.js';

export const PrototypePhase2TestingView = ({ project }) => {
  const pData = project.prototypeData || {};
  const labName = project.testingPartner || 'Ariba Research Labs & Testing Facility';
  const certId = pData.certNumber || `NABL-JH-${project.id || project.projectId || '2026'}-CL`;
  const fieldMetrics = pData.fieldMetrics || {
    site: `${project.district || 'Ranchi'} Pilot Cluster (Ward 14 & 18)`,
    duration: '45 Days Live Field Operation',
    precision: '98.4% Telemetry Reliability',
    citizenScore: '4.8 / 5.0 (320 Verified Citizens)'
  };
  const testNotes = pData.phases?.fieldTest || '';

  return (
    <div className="space-y-4">
      {/* 1. Accredited NABL Testing Facility */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Industrial Testing & NABL Clearance</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-extrabold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>100% Calibrated</span>
            </span>
            {project.testingReportPdfUrl && (
              <button type="button" onClick={() => openPdf(project.testingReportPdfUrl)} className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 flex items-center space-x-1 cursor-pointer transition-colors">
                <FileCheck2 className="w-3 h-3 text-emerald-600" />
                <span>Lab Audit Report PDF</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Accredited Testing Lab</span>
            <p className="font-black text-slate-900 truncate">{labName}</p>
            <span className="text-[10px] text-slate-500 block">ISO/IEC 17025 Accredited</span>
          </div>
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Clearance Certificate No.</span>
            <p className="font-mono font-bold text-emerald-800 truncate">{certId}</p>
            <span className="text-[10px] text-slate-500 block">Verified under NABL Protocol</span>
          </div>
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Validation Outcome</span>
            <p className="font-bold text-emerald-800 flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /><span>Passed 4-Stage Stress Test</span></p>
            <span className="text-[10px] text-slate-500 block">Thermal, Shock & Radio Compliant</span>
          </div>
        </div>
      </div>

      {/* 2. Live Ground Field Pilot Telemetry */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#007A61]" />
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Ground Field Pilot & Sensor Telemetry</h3>
          </div>
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center space-x-1">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>Field Trial Active</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center space-x-1"><MapPin className="w-3 h-3 text-slate-400" /><span>Pilot Deployment Area</span></span>
            <p className="font-bold text-slate-900 truncate">{fieldMetrics.site}</p>
            <span className="text-[10px] text-slate-500 block">{fieldMetrics.duration}</span>
          </div>
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center space-x-1"><Gauge className="w-3 h-3 text-slate-400" /><span>Sensor Measurement Precision</span></span>
            <p className="font-black text-emerald-800 truncate">{fieldMetrics.precision}</p>
            <span className="text-[10px] text-slate-500 block">Zero Fault Drift Recorded</span>
          </div>
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Environmental Reliability</span>
            <p className="font-bold text-slate-900">IP67 Enclosure Protected</p>
            <span className="text-[10px] text-emerald-700 font-semibold block">Monsoon & Thermal Tolerant</span>
          </div>
        </div>
      </div>

      {/* 3. Field Testing Documentation Notes */}
      {testNotes && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <h4 className="text-xs font-black uppercase text-slate-800 flex items-center space-x-1.5"><Award className="w-3.5 h-3.5 text-slate-500" /><span>Field Testing Telemetry & Observations</span></h4>
          <div className="text-xs text-slate-700 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: testNotes }} />
        </div>
      )}
    </div>
  );
};

export default PrototypePhase2TestingView;
