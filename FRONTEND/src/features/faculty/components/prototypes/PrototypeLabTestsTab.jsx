import React from 'react';
import { FlaskConical, Gauge, BatteryCharging, Zap, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export const PrototypeLabTestsTab = ({ prototypeData, onChangeData, isLocked }) => {
  const lab = prototypeData?.labTests || {
    status: 'In Progress',
    accuracy: '98.5',
    powerHours: '18',
    latencyMs: '42',
    thermalTemp: '38',
    failSafePassed: true,
    labNotes: ''
  };

  const updateLab = (key, value) => {
    if (isLocked) return;
    const updated = { ...lab, [key]: value };
    onChangeData('labTests', updated);
  };

  return (
    <div className="space-y-4 text-left select-none">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <FlaskConical className="w-4 h-4 text-[#007A61]" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              2. In-House University Lab Test Results & Benchmarks
            </h4>
          </div>
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
            lab.status === 'Passed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            lab.status === 'Needs Recalibration' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {lab.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Accuracy */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-600">
              <Gauge className="w-3.5 h-3.5 text-[#007A61]" />
              <label className="text-[10px] font-bold uppercase">Sensor Accuracy</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                disabled={isLocked}
                value={lab.accuracy || ''}
                onChange={(e) => updateLab('accuracy', e.target.value)}
                placeholder="98.5"
                className="w-full bg-white border border-slate-200 text-xs font-bold px-2 py-1 rounded-lg text-slate-800 focus:outline-[#007A61]"
              />
              <span className="text-xs font-black text-slate-500">%</span>
            </div>
          </div>

          {/* Battery / Power */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-600">
              <BatteryCharging className="w-3.5 h-3.5 text-amber-600" />
              <label className="text-[10px] font-bold uppercase">Power Endurance</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                disabled={isLocked}
                value={lab.powerHours || ''}
                onChange={(e) => updateLab('powerHours', e.target.value)}
                placeholder="24"
                className="w-full bg-white border border-slate-200 text-xs font-bold px-2 py-1 rounded-lg text-slate-800 focus:outline-[#007A61]"
              />
              <span className="text-xs font-black text-slate-500">Hrs</span>
            </div>
          </div>

          {/* Latency */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-600">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <label className="text-[10px] font-bold uppercase">Response Latency</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                disabled={isLocked}
                value={lab.latencyMs || ''}
                onChange={(e) => updateLab('latencyMs', e.target.value)}
                placeholder="45"
                className="w-full bg-white border border-slate-200 text-xs font-bold px-2 py-1 rounded-lg text-slate-800 focus:outline-[#007A61]"
              />
              <span className="text-xs font-black text-slate-500">ms</span>
            </div>
          </div>

          {/* Overall Status */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <label className="text-[10px] font-bold uppercase">Lab Verdict</label>
            </div>
            <select
              disabled={isLocked}
              value={lab.status || 'In Progress'}
              onChange={(e) => updateLab('status', e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs font-bold px-2 py-1 rounded-lg text-slate-800 focus:outline-[#007A61]"
            >
              <option value="In Progress">Testing in Progress</option>
              <option value="Passed">Bench Tests Passed</option>
              <option value="Needs Recalibration">Needs Recalibration</option>
              <option value="Action Required">Hardware Redesign Req</option>
            </select>
          </div>
        </div>

        {/* Safety & Redundancy Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center space-x-2.5 p-2.5 border border-slate-200 rounded-xl bg-slate-50/60 cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              disabled={isLocked}
              checked={Boolean(lab.failSafePassed)}
              onChange={(e) => updateLab('failSafePassed', e.target.checked)}
              className="w-4 h-4 text-[#007A61] rounded focus:ring-[#007A61]"
            />
            <div>
              <p className="text-xs font-bold text-slate-800">Automatic Fail-Safe & Circuit Protection</p>
              <p className="text-[10px] text-slate-500">Emergency auto-cutoff verified under peak load & short-circuit triggers.</p>
            </div>
          </label>

          <label className="flex items-center space-x-2.5 p-2.5 border border-slate-200 rounded-xl bg-slate-50/60 cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              disabled={isLocked}
              checked={Boolean(lab.calibrationCertified)}
              onChange={(e) => updateLab('calibrationCertified', e.target.checked)}
              className="w-4 h-4 text-[#007A61] rounded focus:ring-[#007A61]"
            />
            <div>
              <p className="text-xs font-bold text-slate-800">Faculty Lab Calibration Certification</p>
              <p className="text-[10px] text-slate-500">Sensors matched against standardized lab meters (ISO reference standard).</p>
            </div>
          </label>
        </div>

        {/* Lab Notes & Observations */}
        <div className="pt-2">
          <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
            Faculty Lab Observations & Stress-Testing Notes
          </label>
          <textarea
            disabled={isLocked}
            rows={3}
            value={lab.labNotes || ''}
            onChange={(e) => updateLab('labNotes', e.target.value)}
            placeholder="Document university lab test observation notes, voltage stability under full load, environmental chamber readings, and failure-point analysis..."
            className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-[#007A61] focus:ring-1 focus:ring-[#007A61]"
          />
        </div>
      </div>
    </div>
  );
};
