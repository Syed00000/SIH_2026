import React from 'react';
import { Factory, ClipboardCheck, Building2, Truck, AlertCircle, ShieldAlert } from 'lucide-react';

const INDUSTRY_PARTNERS = [
  'Tata Steel R&D Hub (Jamshedpur)',
  'BCCL Heavy Equipment & Mine Automation Lab (Dhanbad)',
  'MECON Ranchi Heavy Industry Testing Facility',
  'SAIL Bokaro Steel Automation & Embedded Division',
  'Jharkhand State Industrial Testing Council (JSITC)'
];

const DEFAULT_CHECKLIST = [
  { id: 'thermal', label: 'Environmental Stress & Thermal Range (-10°C to 55°C, 90% RH)' },
  { id: 'vibration', label: 'Heavy Vibration, Shock & Mechanical Drop Compliance' },
  { id: 'heavyLoad', label: 'Full Continuous Ground Payload Stress Cycle' },
  { id: 'reliability', label: '72-Hour Uninterrupted Live Field Reliability Trial' },
  { id: 'compliance', label: 'Industrial Safety & Electromagnetic Compatibility (EMC/EMI)' }
];

export const PrototypeIndustryRequisitionTab = ({ prototypeData, onChangeData, isLocked }) => {
  const req = prototypeData?.industryRequisition || {
    selectedPartner: INDUSTRY_PARTNERS[0],
    priority: 'High',
    checklist: ['thermal', 'reliability', 'compliance'],
    instructions: '',
    dispatchStatus: 'Drafted'
  };

  const updateReq = (key, value) => {
    if (isLocked) return;
    const updated = { ...req, [key]: value };
    onChangeData('industryRequisition', updated);
  };

  const toggleChecklist = (id) => {
    if (isLocked) return;
    const currentList = req.checklist || [];
    const updated = currentList.includes(id)
      ? currentList.filter((item) => item !== id)
      : [...currentList, id];
    updateReq('checklist', updated);
  };

  return (
    <div className="space-y-4 text-left select-none">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Factory className="w-4 h-4 text-[#007A61]" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              3. Industry Partner Field-Testing Checklist & Pilot Requisition
            </h4>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
            {req.dispatchStatus || 'Drafted'}
          </span>
        </div>

        {/* Partner Selection & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
              Designated Industry Testing Facility
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                disabled={isLocked}
                value={req.selectedPartner || INDUSTRY_PARTNERS[0]}
                onChange={(e) => updateReq('selectedPartner', e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 focus:bg-white focus:outline-[#007A61]"
              >
                {INDUSTRY_PARTNERS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
              Field Pilot Priority Level
            </label>
            <div className="flex space-x-2 pt-0.5">
              {['Normal', 'High', 'Urgent Requisition'].map((prio) => (
                <button
                  type="button"
                  key={prio}
                  disabled={isLocked}
                  onClick={() => updateReq('priority', prio)}
                  className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl border transition-all ${
                    req.priority === prio
                      ? 'bg-[#007A61] text-white border-[#007A61] shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Testing Checklist Matrix */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-slate-700">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#007A61]" />
            <label className="text-[10.5px] font-extrabold uppercase">
              Mandatory Industrial Field Tests Requested from Partner
            </label>
          </div>
          <div className="space-y-2">
            {DEFAULT_CHECKLIST.map((item) => {
              const isChecked = (req.checklist || []).includes(item.id);
              return (
                <label
                  key={item.id}
                  className={`flex items-center space-x-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={isLocked}
                    checked={isChecked}
                    onChange={() => toggleChecklist(item.id)}
                    className="w-4 h-4 text-[#007A61] rounded focus:ring-[#007A61]"
                  />
                  <span className={`text-xs ${isChecked ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                    {item.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
            Special Instructions for Industrial Trial Engineers
          </label>
          <textarea
            disabled={isLocked}
            rows={3}
            value={req.instructions || ''}
            onChange={(e) => updateReq('instructions', e.target.value)}
            placeholder="Specify test rig calibration, safety clearance requirements, hazardous handling protocols, and live data telemetry reporting frequency..."
            className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-[#007A61] focus:ring-1 focus:ring-[#007A61]"
          />
        </div>
      </div>
    </div>
  );
};
