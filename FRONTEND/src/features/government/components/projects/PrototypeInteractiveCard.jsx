import React, { useState, useEffect } from 'react';
import {
  FlaskConical, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight,
  Check, Activity, Zap, FileCheck2, FileText, Building2
} from 'lucide-react';
import { getStageDetails } from './prototypeStages.helper.js';
import { openPdf } from '../../../../shared/utils/openPdf.js';

export const PrototypeInteractiveCard = ({ project, onInspect, onAdvanceTrl, onOpenDeployTerms }) => {
  const curTrlNum = parseInt(String(project.trlLevel || '4').replace('TRL-', ''), 10) || 4;
  const defaultStage = curTrlNum <= 3 ? 1 : curTrlNum <= 6 ? 2 : curTrlNum <= 8 ? 3 : 4;
  const [selectedStageTab, setSelectedStageTab] = useState(defaultStage);
  const isDeployed = project.status === 'Deployed' || Boolean(project.isDeployed) || Boolean(project.isLocked);

  useEffect(() => {
    const nextStage = curTrlNum <= 3 ? 1 : curTrlNum <= 6 ? 2 : curTrlNum <= 8 ? 3 : 4;
    setSelectedStageTab(nextStage);
  }, [curTrlNum]);

  const currentStageInfo = getStageDetails(project, selectedStageTab);
  const reportUrl = project.testingReportPdfUrl || project.reportPdfUrl;
  const blueprintUrl = project.pdfUrl;

  return (
    <div className="bg-white border border-slate-200 rounded-xs p-4.5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3.5">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-xs font-mono text-[10px] font-bold bg-slate-900 text-white">
                {project.id}
              </span>
              <span className="px-2 py-0.5 rounded-xs text-[10.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {project.prototypeType || 'Hardware'}
              </span>
              <span className="px-2.5 py-0.5 rounded-xs text-[10.5px] font-bold border bg-[#007A61]/10 text-[#007A61] border-[#007A61]/30">
                {project.trlLevel || 'TRL-7'} · Stage {selectedStageTab}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 pt-1">{project.title}</h3>
            <p className="text-[11px] text-slate-500 font-medium">{project.hei} · {project.district} District</p>
          </div>
        </div>

        {/* 4 Interactive Stage Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xs border border-slate-200 text-center text-xs select-none">
          {[
            { num: 1, label: '1. Lab' },
            { num: 2, label: '2. Field' },
            { num: 3, label: '3. State Cert' },
            { num: 4, label: '4. Deployed' }
          ].map((tab) => {
            const stageMeta = getStageDetails(project, tab.num);
            const isTabActive = selectedStageTab === tab.num;
            return (
              <button
                key={tab.num}
                type="button"
                onClick={() => setSelectedStageTab(tab.num)}
                className={`py-1.5 px-1 rounded-xs text-[10.5px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isTabActive ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-0.5">
                  {stageMeta.isCompleted ? (
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
                  ) : stageMeta.isCurrent ? (
                    <Zap className="w-2.5 h-2.5 text-amber-500 inline shrink-0" />
                  ) : null}
                  <span className="truncate">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Stage Content */}
        <div className="p-3 bg-slate-50 rounded-xs border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 text-xs">{currentStageInfo.title}</span>
              <span className="text-[10px] font-bold text-slate-500">({currentStageInfo.trlRange})</span>
            </div>
            {currentStageInfo.isCompleted ? (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs border border-emerald-300">
                <Check className="w-3 h-3" />
                <span>Passed &amp; Verified</span>
              </span>
            ) : isDeployed ? (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-[#007A61] bg-[#007A61]/10 px-2 py-0.5 rounded-xs border border-[#007A61]/30">
                <span>🔒 Deployed</span>
              </span>
            ) : currentStageInfo.isCurrent ? (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-xs border border-amber-300">
                <Activity className="w-3 h-3" />
                <span>In Progress</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-xs border border-slate-300">
                <span>Pending Stage</span>
              </span>
            )}
          </div>

          <div className="space-y-1 pt-1 text-[11px]">
            {currentStageInfo.details.deliverables.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-slate-700 font-medium">
                <CheckCircle2 className="w-3 h-3 text-[#007A61] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {(reportUrl || blueprintUrl) && (
            <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
              {reportUrl && (
                <button
                  type="button"
                  onClick={() => openPdf(reportUrl)}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xs text-[10px] font-bold text-emerald-800 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <FileCheck2 className="w-3 h-3 text-emerald-600" />
                  <span>Lab Report ({project.testingReportPdfName || 'Verified Report'})</span>
                </button>
              )}
              {blueprintUrl && (
                <button
                  type="button"
                  onClick={() => openPdf(blueprintUrl)}
                  className="px-2.5 py-1 bg-[#007A61]/10 hover:bg-[#007A61]/20 border border-[#007A61]/30 rounded-xs text-[10px] font-bold text-[#007A61] flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <FileText className="w-3 h-3 text-[#007A61]" />
                  <span>Blueprint ({project.pdfName || 'Blueprint'})</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stage Step Switcher Bar & Bottom Actions */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs bg-slate-50 p-1.5 rounded-xs border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedStageTab((prev) => (prev > 1 ? prev - 1 : 4))}
            className="px-2 py-0.5 text-slate-700 hover:bg-white rounded-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>
          <span className="text-[10.5px] font-bold text-slate-600">Stage {selectedStageTab} of 4</span>
          <button
            type="button"
            onClick={() => setSelectedStageTab((prev) => (prev < 4 ? prev + 1 : 1))}
            className="px-2 py-0.5 text-[#007A61] hover:bg-white rounded-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 gap-2">
          <button
            type="button"
            onClick={() => onInspect(project)}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300 rounded-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-xs hover:border-[#007A61] hover:text-[#007A61]"
          >
            <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
            <span>Specs</span>
          </button>
          {isDeployed ? (
            <button
              type="button"
              onClick={() => onOpenHandoverModal && onOpenHandoverModal(project)}
              className="px-2.5 py-1.5 bg-[#007A61]/10 hover:bg-[#007A61]/20 border border-[#007A61]/30 hover:border-[#007A61] text-[#007A61] rounded-xs font-bold text-[11px] flex items-center space-x-1 shadow-xs cursor-pointer transition-all"
              title="Allocate to Department"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{project.handoverDepartment ? `Handed Over: ${project.handoverDepartment}` : 'Handover to Dept'}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => onAdvanceTrl(project.id)}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-xs"
                title="Advance TRL Level"
              >
                <span>+1 TRL</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => onOpenDeployTerms ? onOpenDeployTerms(project) : onInspect(project)}
                className="px-2.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-xs"
                title="Move / Handover Solution to State Department"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>Move to Dept</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrototypeInteractiveCard;
