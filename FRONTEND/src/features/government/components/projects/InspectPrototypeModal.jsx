import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  FlaskConical,
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  Printer,
  Sparkles,
  Zap,
  Activity,
  AlertCircle,
  Radio,
  Check,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Users,
  Send,
  RotateCcw,
  Clock
} from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';

const STAGE_CONFIG = [
  { num: 1, key: 'labDesign',    label: '1. Lab Design (TRL 1-3)',    short: 'Lab Design',    icon: FlaskConical, color: 'amber' },
  { num: 2, key: 'fieldTest',    label: '2. Field Test (TRL 4-6)',    short: 'Field Test',    icon: Radio,        color: 'blue' },
  { num: 3, key: 'stateCert',    label: '3. State Cert (TRL 7-8)',    short: 'State Cert',    icon: ShieldCheck,  color: 'emerald' },
  { num: 4, key: 'publicDeploy', label: '4. Public Deploy (TRL 9)',   short: 'Public Deploy', icon: Users,        color: 'purple' }
];

export const InspectPrototypeModal = ({
  isOpen,
  onClose,
  project,
  onAdvanceStage,
  onStateApproved
}) => {
  if (!isOpen || !project) return null;

  const curTrlNum = parseInt(String(project.trlLevel || '4').replace('TRL-', ''), 10) || 4;
  const defaultTab = curTrlNum <= 3 ? 1 : curTrlNum <= 6 ? 2 : curTrlNum <= 8 ? 3 : 4;
  const [activeStageTab, setActiveStageTab] = useState(defaultTab);
  const [isApproving, setIsApproving] = useState(false);
  const [isRequestingChanges, setIsRequestingChanges] = useState(false);
  const [govRemarks, setGovRemarks] = useState('');
  const [showFeedbackBox, setShowFeedbackBox] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    const nextTab = curTrlNum <= 3 ? 1 : curTrlNum <= 6 ? 2 : curTrlNum <= 8 ? 3 : 4;
    setActiveStageTab(nextTab);
  }, [curTrlNum]);

  const phases = project.prototypeData?.phases || {};
  const legacyContent = project.prototypeData?.content || '';

  const getPhaseContent = (stageNum) => {
    if (stageNum === 1) return phases.labDesign || legacyContent || '';
    if (stageNum === 2) return phases.fieldTest || '';
    if (stageNum === 3) return phases.stateCert || '';
    if (stageNum === 4) return phases.publicDeploy || '';
    return '';
  };

  const handleApproveAndCertify = async () => {
    setIsApproving(true);
    try {
      const pId = project.projectId || project.id;
      await universityApiService.updateGovernmentPrototypeStatus(
        pId,
        'Approved',
        'TRL-9',
        govRemarks || 'Officially verified and certified (TRL-9) by Department of Higher & Technical Education (DHTE). Problem statement resolved and cleared for district deployment.'
      );

      setActionSuccess('Prototype Certified & Deployed! Problem Statement marked as RESOLVED.');
      if (onStateApproved) onStateApproved(pId);
      if (onAdvanceStage) onAdvanceStage(pId);

      setTimeout(() => {
        setIsApproving(false);
        setActionSuccess(null);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Government approval error:', err);
      setIsApproving(false);
    }
  };

  const handleRequestRevisions = async () => {
    if (!govRemarks.trim()) {
      setShowFeedbackBox(true);
      return;
    }
    setIsRequestingChanges(true);
    try {
      const pId = project.projectId || project.id;
      await universityApiService.updateGovernmentPrototypeStatus(
        pId,
        'Changes Required',
        project.trlLevel || 'TRL-4',
        govRemarks
      );
      setActionSuccess('Revision directives dispatched to University & Faculty research team.');
      setTimeout(() => {
        setIsRequestingChanges(false);
        setActionSuccess(null);
        setShowFeedbackBox(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Government revision request error:', err);
      setIsRequestingChanges(false);
    }
  };

  const handlePrintCertificate = () => {
    const printWin = window.open('', '_blank', 'width=850,height=750');
    if (!printWin) {
      alert('Please allow popups to print certificate');
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Official TRL Testing Certificate - ${project.id || project.projectId}</title>
  <style>
    body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.6; font-size: 13px; text-align: center; }
    .border-box { border: 4px double #0d1b3e; padding: 30px; }
    .header h2 { margin: 0; font-size: 20px; text-transform: uppercase; color: #0d1b3e; }
    .header p { margin: 4px 0; font-size: 12px; color: #475569; }
    .gold-badge { font-size: 18px; font-weight: bold; color: #007A61; margin: 15px 0; }
    .details { text-align: left; margin: 20px 0; border-collapse: collapse; width: 100%; }
    .details td { padding: 8px 12px; border: 1px solid #cbd5e1; font-size: 12px; }
    .details td.lbl { background: #f8fafc; font-weight: bold; width: 32%; }
    .footer { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="border-box">
    <div class="header">
      <h2>Government of Jharkhand</h2>
      <p>Department of Higher & Technical Education · JoharSetu Innovation Hub</p>
      <p style="font-weight: bold; color: #007A61; letter-spacing: 1px;">OFFICIAL STATE TECHNOLOGY READINESS LEVEL (TRL) CERTIFICATE</p>
    </div>

    <div class="gold-badge">★ ${project.trlLevel || 'TRL-8'} STATE CERTIFIED INNOVATION ★</div>

    <p style="text-align: left;">This is to certify that the prototype system detailed below has successfully completed laboratory prototyping, district field evaluation, and official state technical review under the Jharkhand Innovation Framework:</p>

    <table class="details">
      <tr><td class="lbl">Project Identifier</td><td><strong>${project.id || project.projectId}</strong></td></tr>
      <tr><td class="lbl">Problem Statement / Title</td><td><strong>${project.title}</strong></td></tr>
      <tr><td class="lbl">Host Institution</td><td>${project.hei || 'Ranchi University (RU001)'} (${project.district || 'Ranchi'} District)</td></tr>
      <tr><td class="lbl">Lead Faculty Mentor</td><td>${project.teamLead || 'Dr. Binod Kumar'}</td></tr>
      <tr><td class="lbl">Student Innovation Team</td><td>${project.studentTeam || project.teamName || 'Binod GANG'}</td></tr>
      <tr><td class="lbl">Technology Readiness Cleared</td><td><strong>${project.trlLevel || 'TRL-8'}</strong> (State Certified)</td></tr>
      <tr><td class="lbl">State Resolution Status</td><td><strong>RESOLVED & DEPLOYED FOR PUBLIC BENEFIT</strong></td></tr>
    </table>

    <div class="footer">
      <div>
        <br/><br/>
        __________________________<br/>
        <strong>Chief Technical Evaluator</strong><br/>
        State Innovation Steering Committee
      </div>
      <div>
        <br/><br/>
        __________________________<br/>
        <strong>Principal Secretary</strong><br/>
        Department of Higher & Technical Education
      </div>
    </div>
  </div>
</body>
</html>`;

    printWin.document.write(html);
    printWin.document.close();
    setTimeout(() => {
      printWin.print();
    }, 500);
  };

  const activeStageConfig = STAGE_CONFIG.find(s => s.num === activeStageTab) || STAGE_CONFIG[0];
  const activeContent = getPhaseContent(activeStageTab);
  const isApprovedByGov = project.governmentStatus === 'Approved' || project.status === 'Completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-fadeIn">
      <div
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-black text-xs shadow-inner">
              {project.trlLevel || 'TRL-4'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs text-emerald-400">
                  {project.id || project.projectId}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  isApprovedByGov
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                }`}>
                  {isApprovedByGov ? '✓ State Certified & Approved' : 'Under State Evaluation'}
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-white mt-0.5 line-clamp-1">
                {project.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintCertificate}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print TRL Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4-Phase Stepper Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-white">
          {STAGE_CONFIG.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeStageTab === tab.num;
            const content = getPhaseContent(tab.num);
            const hasDoc = content && content.replace(/<[^>]*>/g, '').trim().length > 0;

            return (
              <button
                key={tab.num}
                type="button"
                onClick={() => setActiveStageTab(tab.num)}
                className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  isActive
                    ? 'border-[#007A61] text-[#007A61] bg-emerald-50/40 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-[#007A61]' : 'text-slate-400'}`} />
                <span className="text-xs font-bold truncate">{tab.label}</span>
                {hasDoc && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1 bg-[#fafafa]">
          {/* Action Success Alert */}
          {actionSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center space-x-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-[#007A61] shrink-0" />
              <p className="font-bold text-xs">{actionSuccess}</p>
            </div>
          )}

          {/* Core Metadata Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Originating Problem District
              </span>
              <span className="text-xs font-black text-slate-900 block truncate">
                {project.district || 'Ranchi'} District
              </span>
              <span className="text-[10.5px] text-[#007A61] font-semibold block">
                {project.hei || 'Ranchi University (RU001)'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Lead Faculty Investigator
              </span>
              <span className="text-xs font-black text-slate-900 block truncate">
                {project.teamLead || 'Dr. Binod Kumar'}
              </span>
              <span className="text-[10.5px] text-slate-500 font-medium block">
                Nodal Faculty Lead
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Student Research Team
              </span>
              <span className="text-xs font-black text-slate-900 block truncate">
                {project.studentTeam || project.teamName || 'Binod GANG'}
              </span>
              <span className="text-[10.5px] text-slate-500 font-medium block">
                Assigned Student Researchers
              </span>
            </div>
          </div>

          {/* Real Submitted Technical Documentation */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#007A61]">
                <FileCheck2 className="w-4 h-4" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Phase {activeStageTab}: {activeStageConfig.short} — Technical Blueprint Dossier
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-emerald-50 text-[#007A61] border border-emerald-200 rounded-lg">
                Phase {activeStageTab} of 4
              </span>
            </div>

            {activeContent && activeContent.replace(/<[^>]*>/g, '').trim().length > 0 ? (
              <div
                className="ql-editor prose prose-sm prose-slate max-w-none text-xs text-slate-800 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 min-h-[160px]"
                dangerouslySetInnerHTML={{ __html: activeContent }}
              />
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                <Clock className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">
                  Phase {activeStageTab} Documentation Pending
                </p>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  The faculty research team has not submitted documentation for Phase {activeStageTab} yet. Previous completed phases are available above.
                </p>
              </div>
            )}
          </div>

          {/* Government Feedback Box (if opened) */}
          {showFeedbackBox && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2.5 animate-fadeIn">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>State Innovation Council Revision Directives *</span>
              </label>
              <textarea
                value={govRemarks}
                onChange={(e) => setGovRemarks(e.target.value)}
                rows={2}
                placeholder="Specify required corrections or additional laboratory telemetry needed from University & Faculty..."
                className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackBox(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRequestRevisions}
                  disabled={isRequestingChanges}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>{isRequestingChanges ? 'Dispatching...' : 'Dispatch Directives to University'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Stage Switching & Advancement */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={activeStageTab === 1}
              onClick={() => setActiveStageTab((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 cursor-pointer flex items-center space-x-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev Phase</span>
            </button>

            <button
              type="button"
              disabled={activeStageTab === 4}
              onClick={() => setActiveStageTab((prev) => Math.min(4, prev + 1))}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 cursor-pointer flex items-center space-x-1"
            >
              <span>Next Phase</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => setShowFeedbackBox(!showFeedbackBox)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 cursor-pointer flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Request Revision</span>
            </button>

            <button
              type="button"
              onClick={handleApproveAndCertify}
              disabled={isApproving}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#007A61] hover:bg-[#00604c] text-white cursor-pointer shadow-md flex items-center space-x-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{isApproving ? 'Approving & Certifying...' : '✓ Approve & Grant State Certification (TRL-9)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectPrototypeModal;
