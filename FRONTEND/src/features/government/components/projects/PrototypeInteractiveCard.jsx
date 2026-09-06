import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Check,
  Activity,
  Zap,
  FileCheck2,
  FileText
} from 'lucide-react';
import { getStageDetails } from './prototypeStages.helper.js';
import { openPdf } from '../../../../shared/utils/openPdf.js';

export const PrototypeInteractiveCard = ({ project, onInspect, onAdvanceTrl }) => {
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-black bg-slate-900 text-white">
                {project.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {project.prototypeType || 'Hardware'}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[10.5px] font-bold border ${currentStageInfo.badgeColor}`}>
                {project.trlLevel || 'TRL-7'} · Stage {selectedStageTab}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 pt-1">{project.title}</h3>
            <p className="text-[11px] text-slate-500 font-medium">{project.hei} · {project.district} District</p>
          </div>
        </div>

        {/* 4 Interactive Stage Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200 text-center text-xs select-none">
          {[
            { num: 1, label: '1. Lab Design' },
            { num: 2, label: '2. Field Test' },
            { num: 3, label: '3. State Cert' },
            { num: 4, label: '4. Public Deploy' }
          ].map((tab) => {
            const stageMeta = getStageDetails(project, tab.num);
            const isTabActive = selectedStageTab === tab.num;
            return (
              <button
                key={tab.num}
                type="button"
                onClick={() => setSelectedStageTab(tab.num)}
                className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isTabActive ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center space-x-0.5">
                  {stageMeta.isCompleted ? (
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
                  ) : stageMeta.isCurrent ? (
                    <Zap className="w-2.5 h-2.5 text-amber-500 inline shrink-0 animate-pulse" />
                  ) : null}
                  <span className="truncate">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Stage Content */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-900 text-xs">{currentStageInfo.title}</span>
              <span className="text-[10px] font-bold text-slate-500">({currentStageInfo.trlRange})</span>
            </div>
            {currentStageInfo.isCompleted ? (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3" />
                <span>Passed & Verified</span>
              </span>
            ) : isDeployed ? (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full border border-teal-200">
                <span>🔒 Deployed</span>
              </span>
            ) : currentStageInfo.isCurrent ? (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
                <Activity className="w-3 h-3 animate-spin" />
                <span>In Progress</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full border border-slate-300">
                <span>Pending Stage</span>
              </span>
            )}
          </div>

          {/* Deliverables */}
          <div className="space-y-1 pt-1 text-[11px]">
            {currentStageInfo.details.deliverables.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-slate-700 font-medium">
                <CheckCircle2 className="w-3 h-3 text-[#007A61] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Verified Lab Report & Blueprint strips */}
          {(reportUrl || blueprintUrl) && (
            <div className="pt-2 border-t border-slate-200/70 flex flex-wrap gap-2">
              {reportUrl && (
                <button
                  type="button"
                  onClick={() => openPdf(reportUrl)}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-800 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <FileCheck2 className="w-3 h-3 text-emerald-600" />
                  <span>Lab Report ({project.testingReportPdfName || 'Verified Report'})</span>
                </button>
              )}
              {blueprintUrl && (
                <button
                  type="button"
                  onClick={() => openPdf(blueprintUrl)}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-[10px] font-bold text-blue-800 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <FileText className="w-3 h-3 text-blue-600" />
                  <span>Blueprint ({project.pdfName || 'Prototype Blueprint'})</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stage Step Switcher Bar & Bottom Actions */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedStageTab((prev) => (prev > 1 ? prev - 1 : 4))}
            className="px-2.5 py-1 text-slate-700 hover:bg-white hover:shadow-2xs rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>
          <span className="text-[11px] font-bold text-slate-600">Viewing Stage {selectedStageTab} of 4</span>
          <button
            type="button"
            onClick={() => setSelectedStageTab((prev) => (prev < 4 ? prev + 1 : 1))}
            className="px-2.5 py-1 text-blue-700 hover:bg-white hover:shadow-2xs rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onInspect(project)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
          >
            <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
            <span>Inspect Tests & Specs</span>
          </button>
          {isDeployed ? (
            <span className="px-3 py-1.5 bg-teal-50 border border-teal-300 text-teal-800 rounded-xl font-bold text-xs flex items-center space-x-1 shadow-2xs">
              <span>🔒 Deployed Statewide — Locked</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onAdvanceTrl(project.id)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            >
              <span>Advance Stage (+1 TRL)</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrototypeInteractiveCard;
