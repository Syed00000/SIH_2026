import React from 'react';
import { Building2, Users, FileText, ExternalLink, Cpu, Sparkles, Layers, Wrench } from 'lucide-react';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const IndustryGrantTechProblemSelector = ({
  eligibleProblems = [],
  currentProblem,
  selectedProblemId,
  onSelectProblemId,
  currentTool
}) => {
  const proto = currentProblem?.prototypeData || {};
  const protoDept = proto.department || currentProblem?.department || currentProblem?.domain || '';
  const protoTool = proto.requiredTechTool || currentProblem?.requiredTechTool || '';
  const protoStack = proto.techStack || currentProblem?.techStack || '';
  const protoSensors = proto.bomSensors || currentProblem?.bomSensors || '';

  const isToolMatch = Boolean(
    (protoTool && currentTool?.name && protoTool.toLowerCase() === currentTool.name.toLowerCase()) ||
    (protoDept && currentTool?.category && protoDept.toLowerCase() === currentTool.category.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
      <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 block">
        Select University Research Problem Statement *
      </label>

      {eligibleProblems.length === 0 ? (
        <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
          No active research projects eligible for tool transfer at this moment.
        </div>
      ) : (
        <>
          <select
            value={currentProblem?.projectId || selectedProblemId || ''}
            onChange={(e) => onSelectProblemId(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
          >
            {eligibleProblems.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.title} &bull; {p.studentTeam || 'Squad'} &bull; {p.projectId}
              </option>
            ))}
          </select>

          {currentProblem && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-slate-600 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {currentProblem.challengeId || currentProblem.projectId}
                </span>
                <span className="text-xs font-bold text-[#007A61] flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Ranchi University</span>
                </span>
              </div>

              <h5 className="text-sm font-black text-slate-900">{currentProblem.title}</h5>
              <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
                "{currentProblem.problemStatement || currentProblem.title}"
              </p>

              {/* Prototype Department & Requisition Spec Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {protoDept && (
                  <span className="px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded text-[10px] font-bold flex items-center space-x-1">
                    <Layers className="w-2.5 h-2.5 text-sky-600" />
                    <span>Dept: {protoDept}</span>
                  </span>
                )}
                {protoTool && (
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded text-[10px] font-bold flex items-center space-x-1">
                    <Wrench className="w-2.5 h-2.5 text-purple-600" />
                    <span>Required: {protoTool}</span>
                  </span>
                )}
              </div>

              {isToolMatch && (
                <div className="px-2.5 py-1.5 bg-emerald-100/90 text-emerald-900 border border-emerald-300 rounded-lg text-[10.5px] font-black flex items-center space-x-1.5 shadow-2xs animate-fadeIn">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>✨ Direct Tech Match: Student prototype specifically requested this domain / tool!</span>
                </div>
              )}

              {protoStack && (
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 mr-1">Prototype Stack:</span>
                  {protoStack.split(',').map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-700 border border-emerald-200 shadow-2xs">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {protoSensors && (
                <p className="text-[11px] text-slate-600 font-medium">
                  <span className="font-bold text-slate-700">Hardware BOM / Sensors:</span> {protoSensors}
                </p>
              )}

              <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-600">
                <span className="flex items-center space-x-1 font-semibold">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentProblem.studentTeam || 'Student Research Squad'}</span>
                </span>
              </div>

              {currentProblem.pdfUrl && (
                <div className="pt-2">
                  <a
                    href={getPdfViewUrl(currentProblem.pdfUrl, currentProblem.pdfName || 'Blueprint.pdf')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-600" />
                    <span>View Technical Blueprint PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IndustryGrantTechProblemSelector;
