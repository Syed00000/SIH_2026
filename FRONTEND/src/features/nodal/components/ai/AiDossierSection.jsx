import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Building2,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  RefreshCw,
  Send,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Info,
  Check,
  MapPin,
  Landmark
} from 'lucide-react';
import { apiClient } from '../../../../infrastructure/api/client.js';
import { AiRouteConfirmModal } from './AiRouteConfirmModal.jsx';

export const AiDossierSection = ({ challenge, onApplySuccess, onOpenDuplicateModal }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [applyingType, setApplyingType] = useState(null); // 'department' | 'university'
  const [aiData, setAiData] = useState(challenge?.aiIntelligence || null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    routeType: null,
    targetData: null
  });

  const chlId = challenge?.challengeId || challenge?.id;

  const handleRunAiAnalysis = async () => {
    setAnalyzing(true);
    setFeedbackMsg('');
    try {
      const data = await apiClient.post(`citizen/challenges/${chlId}/ai-analyze`);
      setAiData(data.data);
      setFeedbackMsg('✓ AI triage analysis completed with live state vector matching.');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      setFeedbackMsg(`⚠️ ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOpenConfirm = (type) => {
    if (type === 'department') {
      setConfirmModal({
        isOpen: true,
        routeType: 'department',
        targetData: aiData?.recommendedDepartment
      });
    } else if (type === 'university') {
      setConfirmModal({
        isOpen: true,
        routeType: 'university',
        targetData: aiData?.recommendedHEI
      });
    }
  };

  const handleConfirmRoute = async (payload) => {
    setApplyingType(payload.type);
    setFeedbackMsg('');
    try {
      const res = await apiClient.post(`citizen/challenges/${chlId}/ai-apply`, payload);
      const entityName =
        payload.type === 'department'
          ? payload.department?.name || 'Line Authority'
          : payload.university?.name || 'University Lab';

      setFeedbackMsg(`✓ Successfully routed to ${entityName} with live citizen notification!`);
      onApplySuccess?.(res.data);
    } catch (err) {
      setFeedbackMsg(`⚠️ ${err.message || 'Routing dispatch failed'}`);
      throw err;
    } finally {
      setApplyingType(null);
    }
  };

  const deduplication = aiData?.deduplication;
  const isDuplicate = deduplication?.isDuplicate;
  const simScore = Math.round((deduplication?.similarityScore || 0) * 100);
  const deptConfidence = aiData?.recommendedDepartment?.confidence || 92;
  const heiConfidence = aiData?.recommendedHEI?.confidence || 82;

  const problemScope = aiData?.problemScope;
  const isMacro = Boolean(problemScope?.isMacroChallenge);
  const isWardScope = problemScope?.level === 'WARD' || aiData?.recommendedDepartment?.category === 'Ward Commissioner';
  const isBlockScope = problemScope?.level === 'BLOCK' || aiData?.recommendedDepartment?.category === 'Block / Tehsil Office';
  const isAcademicRequired = aiData?.recommendedHEI?.isAcademicRequired ?? isMacro;

  // Check if current challenge assignment matches AI suggestion
  const assignedDept = challenge?.assignedDepartment?.name || challenge?.assignedTo || '';
  const recommendedDept = aiData?.recommendedDepartment?.name || '';
  const isDeptAligned = assignedDept && recommendedDept &&
    (assignedDept.toLowerCase().includes(recommendedDept.toLowerCase()) || recommendedDept.toLowerCase().includes(assignedDept.toLowerCase()));

  return (
    <div className="space-y-4 select-none text-left">
      {/* Top Banner & Trigger - Clean White + Emerald Government Aesthetic */}
      <div className="bg-gradient-to-r from-emerald-50/90 via-white to-slate-50 rounded-xl p-4 shadow-xs border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#007A61] text-white rounded-lg shadow-xs shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                Jharkhand State AI Governance & Triage Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Neural Triage Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Automated civic domain classification, high-precision vector deduplication radar, and statutory departmental routing
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunAiAnalysis}
          disabled={analyzing}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 shrink-0 self-start sm:self-auto cursor-pointer disabled:opacity-50 hover:border-slate-400"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#007A61] ${analyzing ? 'animate-spin' : ''}`} />
          <span>{analyzing ? 'Processing Triage...' : aiData ? 'Re-Analyze Problem' : 'Run Live AI Triage'}</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold animate-in fade-in duration-200 flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* If No AI Data Yet */}
      {!aiData && !analyzing && (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3">
          <Cpu className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">AI Triage Not Yet Initiated</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click &quot;Run Live AI Triage&quot; to vectorize this challenge, perform semantic deduplication against the state database, and identify the responsible Line Department.
          </p>
          <button
            type="button"
            onClick={handleRunAiAnalysis}
            className="px-4 py-2 bg-[#007A61] hover:bg-[#00634f] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Start Live AI Triage
          </button>
        </div>
      )}

      {aiData && (
        <div className="space-y-4">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classified Domain</span>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{aiData.classifiedDomain || challenge.domain || 'Civic Infrastructure'}</span>
              </div>
              <span className="text-[10.5px] text-slate-500 mt-0.5 block">
                Citizen Stated: <span className="font-medium text-slate-700">{challenge.domain || 'General'}</span>
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority & Severity</span>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>{aiData.priorityAssessment?.priority || 'Medium'} Priority</span>
                {aiData.priorityAssessment?.severityScore ? (
                  <span className="text-xs text-slate-500 font-mono">({aiData.priorityAssessment.severityScore}/100)</span>
                ) : null}
              </div>
              <span className="text-[10.5px] text-slate-500 truncate block mt-0.5">
                {aiData.priorityAssessment?.urgencyReason || 'Standard response time'}
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Affected Population</span>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>{aiData.priorityAssessment?.affectedEstimate || 'Local Ward'}</span>
              </div>
              <span className="text-[10.5px] text-slate-500 mt-0.5 block">Estimated civic impact footprint</span>
            </div>
          </div>

          {/* Deduplication Radar Box */}
          <div
            className={`border rounded-xl p-4 shadow-2xs transition-colors ${
              isDuplicate ? 'bg-amber-50/80 border-amber-300' : 'bg-emerald-50/50 border-emerald-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg text-white shrink-0 mt-0.5 ${
                    isDuplicate ? 'bg-amber-600' : 'bg-[#007A61]'
                  }`}
                >
                  {isDuplicate ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5 text-emerald-100" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      {isDuplicate ? 'Deduplication Radar: Potential Duplicate Issue Flagged' : 'Deduplication Radar: Verified Unique Problem'}
                    </h4>
                    {isDuplicate && (
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-200 text-amber-950 font-mono border border-amber-300">
                        {simScore}% Vector Overlap
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {isDuplicate
                      ? deduplication.duplicateReason || `Identical issue exists in ${challenge.district || 'district'}.`
                      : 'Verified unique. No duplicate or conflicting problem statements detected across state vector indices.'}
                  </p>
                  {isDuplicate && deduplication?.matchedChallengeId && (
                    <div className="mt-2 text-xs font-medium text-slate-800 flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-slate-500">Matched Parent Dossier:</span>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300 text-slate-900">
                        {deduplication.matchedChallengeId}
                      </span>
                      <span className="italic text-slate-700 line-clamp-1 max-w-sm">{deduplication.matchedTitle}</span>
                    </div>
                  )}
                </div>
              </div>

              {isDuplicate && (
                <button
                  type="button"
                  onClick={() => onOpenDuplicateModal?.(deduplication)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Review & Reject Duplicate</span>
                </button>
              )}
            </div>
          </div>

          {/* Administrative Jurisdictional Scope Banner */}
          <div
            className={`border rounded-xl p-3.5 shadow-2xs flex items-start space-x-3 ${
              isMacro
                ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            }`}
          >
            <div
              className={`p-2 rounded-lg text-white shrink-0 mt-0.5 ${
                isMacro ? 'bg-blue-600' : 'bg-[#007A61]'
              }`}
            >
              {isMacro ? <Landmark className="w-4 h-4" /> : <MapPin className="w-4 h-4 text-emerald-100" />}
            </div>
            <div className="text-xs flex-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                  Administrative Jurisdiction:
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10.5px] border ${
                    isMacro
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  {problemScope?.tierLabel || (isMacro ? 'Macro State Innovation Challenge' : 'Local Ward Grievance')}
                </span>
                <span className="text-slate-500 font-medium">
                  {isMacro ? '• State Line Ministry & University R&D Track' : '• Municipal Ward Field Maintenance Track'}
                </span>
              </div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {problemScope?.scopeReason ||
                  (isMacro
                    ? 'Statewide systemic disruption requiring line ministry oversight and academic research prototypes.'
                    : 'Routine municipal grievance affecting neighborhood ward. Routed directly to local ward field crew to avoid state administrative overhead.')}
              </p>
            </div>
          </div>

          {/* Department Recommendation Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                {isWardScope ? (
                  <MapPin className="w-4 h-4 text-[#007A61]" />
                ) : (
                  <Building2 className="w-4 h-4 text-[#007A61]" />
                )}
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {isWardScope
                    ? 'Recommended Local Ward Routing'
                    : isBlockScope
                    ? 'Recommended Block Office Routing'
                    : 'Recommended Line Department Routing'}
                </h4>
                {isDeptAligned && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Currently Assigned</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">AI Fit Score:</span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  {deptConfidence}% Match
                </span>
              </div>
            </div>

            {/* Confidence Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#007A61] h-full rounded-full transition-all duration-500"
                style={{ width: `${deptConfidence}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <div className="flex items-center space-x-2">
                  <h5 className="text-sm font-bold text-slate-900 capitalize">
                    {aiData.recommendedDepartment?.name || (isWardScope ? 'Ward Commissioner' : 'Line Department')}
                  </h5>
                  {aiData.recommendedDepartment?.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {aiData.recommendedDepartment.category}
                    </span>
                  )}
                </div>
                <div className="mt-1 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-xs text-slate-600 leading-relaxed max-w-xl">
                  <span className="font-semibold text-slate-800">Statutory Reason: </span>
                  {aiData.recommendedDepartment?.reasoning || 'Jurisdictional authority responsible for resolving this civic problem.'}
                </div>
                {aiData.recommendedDepartment?.code && (
                  <span className="text-[10.5px] font-mono text-slate-400 mt-1 block">
                    Entity Department Code: {aiData.recommendedDepartment.code}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleOpenConfirm('department')}
                disabled={Boolean(applyingType)}
                className="px-4 py-2 bg-[#007A61] hover:bg-[#00634f] text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5 shrink-0 self-start sm:self-auto cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {applyingType === 'department'
                    ? 'Routing...'
                    : isWardScope
                    ? 'Route to Ward Commissioner'
                    : isBlockScope
                    ? 'Route to Block Office'
                    : 'Route to Department'}
                </span>
              </button>
            </div>
          </div>

          {/* HEI / University Matching Card */}
          {isAcademicRequired ? (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Academic Innovation & University Lab Matching
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-700">R&D Match:</span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-full">
                    {heiConfidence}% Confidence
                  </span>
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${heiConfidence}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <h5 className="text-sm font-bold text-slate-900 capitalize">
                    {aiData.recommendedHEI?.name || 'Jharkhand University Research Lab'}
                  </h5>
                  <div className="mt-1 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-xs text-slate-600 leading-relaxed max-w-xl">
                    <span className="font-semibold text-slate-800">Innovation Scope: </span>
                    {aiData.recommendedHEI?.reasoning || 'Equipped with dedicated faculty, student innovation cells and technical prototyping labs.'}
                  </div>
                  {aiData.recommendedHEI?.code && (
                    <span className="text-[10.5px] font-mono text-slate-400 mt-1 block">
                      HEI Institutional Code: {aiData.recommendedHEI.code}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenConfirm('university')}
                  disabled={Boolean(applyingType)}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5 shrink-0 self-start sm:self-auto cursor-pointer disabled:opacity-50"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{applyingType === 'university' ? 'Allocating...' : 'Allocate to Academic R&D'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Academic Innovation & University Lab Matching
                  </h4>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-200/80 px-2.5 py-0.5 rounded-full border border-slate-300">
                  Routine Maintenance • R&D Not Required
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <h5 className="text-sm font-bold text-slate-800">
                    {aiData.recommendedHEI?.name || 'Not Applicable (Routine Ward Maintenance)'}
                  </h5>
                  <div className="mt-1 bg-white border border-slate-200/90 rounded-lg p-2.5 text-xs text-slate-600 leading-relaxed max-w-xl">
                    <span className="font-semibold text-slate-800">Academic Scope: </span>
                    {aiData.recommendedHEI?.reasoning ||
                      'Routine municipal repair problem. University engineering prototyping, faculty research grants, and student innovation labs are reserved for large-scale systemic challenges.'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenConfirm('university')}
                  disabled={Boolean(applyingType)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 hover:border-slate-400 text-xs font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1.5 shrink-0 self-start sm:self-auto cursor-pointer disabled:opacity-50"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>Optional Academic Study</span>
                </button>
              </div>
            </div>
          )}

          {/* Solution Precedent & Industry Matching Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-slate-800 font-bold text-xs">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span>Standard Operating Precedent (SOP)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {aiData.solutionStatus?.precedentSummary || 'No prior solutions in state registry; novel civic intervention needed.'}
              </p>
              {aiData.solutionStatus?.recommendedAction && (
                <div className="text-[11px] font-semibold text-slate-800 pt-1 border-t border-slate-200/60 mt-2">
                  Recommended SOP: <span className="font-normal text-slate-600">{aiData.solutionStatus.recommendedAction}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-slate-800 font-bold text-xs">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span>Industry & CSR Grant Potential</span>
              </div>
              <p className="text-xs font-bold text-slate-900">
                {aiData.recommendedIndustry?.name || 'Civil Engineering & Utilities'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {aiData.recommendedIndustry?.reasoning || 'Eligible for CSR infrastructure grants and technological assistance.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Official Route Confirmation Alert Modal */}
      <AiRouteConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, routeType: null, targetData: null })}
        challenge={challenge}
        routeType={confirmModal.routeType}
        targetData={confirmModal.targetData}
        problemScope={problemScope}
        onConfirm={handleConfirmRoute}
      />
    </div>
  );
};

export default AiDossierSection;
