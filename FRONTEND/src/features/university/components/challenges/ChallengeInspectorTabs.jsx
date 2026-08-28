import React from 'react';
import { MapPin, FileText, Quote, CheckCircle2, AlertTriangle, Compass } from 'lucide-react';

export const ChallengeInspectorLocationTab = ({ challenge }) => (
  <div className="space-y-2.5 text-xs text-slate-700">
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-none space-y-2">
      <div className="flex items-center space-x-2">
        <MapPin className="w-4 h-4 text-slate-800" />
        <span className="font-bold text-slate-900">{challenge.district}, Jharkhand</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200">
        <div>
          <span className="text-slate-500 font-semibold block">Administrative Block:</span>
          <span className="font-bold text-slate-800">{challenge.locationDetails?.block || 'Sadar Block'}</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold block">GPS Coordinates:</span>
          <span className="font-mono font-bold text-slate-800">{challenge.locationDetails?.coordinates || '24.2698° N, 87.2560° E'}</span>
        </div>
      </div>
      <div className="pt-1">
        <span className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">Affected Hamlets & Villages</span>
        <div className="flex flex-wrap gap-1">
          {(challenge.locationDetails?.villages || ['Haripur', 'Gopinathpur', 'Kadamdih']).map((v, i) => (
            <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded-none text-[10px] font-semibold text-slate-800">
              📍 {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ChallengeInspectorEvidenceTab = ({ challenge }) => (
  <div className="space-y-2.5 text-xs text-slate-700">
    {/* Textual Field Measurement Log */}
    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-none space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Field Lab Analysis Report (Textual)</span>
        <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 border border-rose-200">FAIL / CRITICAL</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 border border-slate-200">
        <div><span className="text-slate-500">TDS Level:</span> <strong className="text-slate-900">840 mg/L</strong></div>
        <div><span className="text-slate-500">Turbidity:</span> <strong className="text-rose-700">14.2 NTU</strong></div>
        <div><span className="text-slate-500">pH Index:</span> <strong className="text-slate-900">6.1 (Acidic)</strong></div>
        <div><span className="text-slate-500">Fluoride / Fe:</span> <strong className="text-rose-700">1.8 mg/L (High)</strong></div>
      </div>
    </div>

    {/* Citizen Testimony Quotes */}
    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-none space-y-1">
      <div className="flex items-center space-x-1.5 text-slate-700">
        <Quote className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-[10.5px] font-bold text-slate-900">Recorded Citizen Testimony</span>
      </div>
      <p className="text-[11px] text-slate-700 italic leading-relaxed bg-white p-2 border border-slate-200">
        "Handpump water turns yellowish within 2 hours of drawing. Children in primary school are suffering from stomach infections regularly."
      </p>
      <div className="text-[10px] text-slate-400 font-mono text-right">Verified by Gram Panchayat Mukhiya • 18 May 2026</div>
    </div>
  </div>
);

export const ChallengeInspectorSimilarTab = ({ challenge }) => (
  <div className="space-y-2 text-xs text-slate-700">
    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-none space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-900 text-xs">CHL-1092 • Fluoride Outage & Deep Aquifer Treatment</span>
        <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.2 font-mono font-bold">96% Match</span>
      </div>
      <p className="text-[11px] text-slate-600">District: Palamu • Pilot successfully deployed by BIT Mesra</p>
    </div>
    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-none space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-900 text-xs">CHL-1101 • Micro-Catchment Runoff Harvester</span>
        <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 font-mono font-bold">89% Match</span>
      </div>
      <p className="text-[11px] text-slate-600">District: Simdega • Assigned to BAU Ranchi</p>
    </div>
  </div>
);

export default {
  ChallengeInspectorLocationTab,
  ChallengeInspectorEvidenceTab,
  ChallengeInspectorSimilarTab
};
