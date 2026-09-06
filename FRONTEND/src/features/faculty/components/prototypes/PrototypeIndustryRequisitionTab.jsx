import React, { useMemo } from 'react';
import { Factory, Building2, Clock, ShieldCheck, FileCheck2 } from 'lucide-react';
import { INDUSTRY_TESTING_PARTNERS, STANDARDIZED_TESTING_STAGES } from './industryTestingStages.data.js';
import { PrototypeTestingStageCard } from './PrototypeTestingStageCard.jsx';

export const PrototypeIndustryRequisitionTab = ({ project, prototypeData, onChangeData, isLocked }) => {
  const initialPartner = project?.partnerName || project?.testingPartner || INDUSTRY_TESTING_PARTNERS[0];
  const allDefaultTestIds = useMemo(() => {
    return STANDARDIZED_TESTING_STAGES.flatMap((st) => st.tests.map((t) => t.id));
  }, []);

  const req = prototypeData?.industryRequisition || {
    selectedPartner: initialPartner,
    priority: 'High',
    checklist: allDefaultTestIds,
    instructions: '',
    dispatchStatus: 'Drafted'
  };

  const updateReq = (key, value) => {
    if (isLocked) return;
    const updated = { ...req, [key]: value };
    onChangeData('industryRequisition', updated);

    // Also sync structured testingStages for backend and industry portal consumption
    const resolvedStages = STANDARDIZED_TESTING_STAGES.map((st) => ({
      stageNumber: st.stageNumber,
      title: st.title,
      description: st.description,
      expectedDays: st.expectedDays,
      status: 'Pending',
      notes: '',
      selectedTests: (key === 'checklist' ? value : req.checklist || []).filter((id) =>
        st.tests.some((t) => t.id === id)
      )
    }));
    onChangeData('testingStages', resolvedStages);
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
    <div className="space-y-4 text-left select-none animate-fadeIn">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-blue-50/60 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#007A61] text-white flex items-center justify-center shrink-0">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
              3. Industry Partner Field-Testing Checklist & Pilot Requisition
            </h4>
            <p className="text-[11px] text-slate-600 font-medium">
              Standardized 3-stage NABL industrial testing lifecycle for state engineering certification.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full border bg-white text-emerald-800 border-emerald-200 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-emerald-600" />
            <span>22 Days Cycle</span>
          </span>
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300">
            {req.dispatchStatus || 'Drafted'}
          </span>
        </div>
      </div>

      {/* Top Controls: Partner Selection & Priority */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
              Designated Industry Testing Facility / Laboratory
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                disabled={isLocked}
                value={req.selectedPartner || initialPartner}
                onChange={(e) => updateReq('selectedPartner', e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 focus:bg-white focus:outline-[#007A61]"
              >
                {INDUSTRY_TESTING_PARTNERS.map((p) => (
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
                  className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
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
      </div>

      {/* 3 Sequential Testing Stages */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-[#007A61]" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Mandatory Industrial Testing Stages & Checklist (Stage 1 ➔ Stage 2 ➔ Stage 3)
            </h3>
          </div>
          <span className="text-[10.5px] font-bold text-slate-500">
            {(req.checklist || []).length}/{allDefaultTestIds.length} Checks Included
          </span>
        </div>

        {STANDARDIZED_TESTING_STAGES.map((stage) => (
          <PrototypeTestingStageCard
            key={stage.stageNumber}
            stage={stage}
            selectedTests={req.checklist || []}
            onToggleTest={toggleChecklist}
            isLocked={isLocked}
          />
        ))}
      </div>

      {/* Special Instructions */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
        <label className="text-[10.5px] font-bold text-slate-500 uppercase block">
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
  );
};

export default PrototypeIndustryRequisitionTab;
