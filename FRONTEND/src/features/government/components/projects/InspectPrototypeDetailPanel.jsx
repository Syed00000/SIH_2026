import React, { useState } from 'react';
import {
  FlaskConical, Radio, ShieldCheck, Users, Printer, FileCheck2,
  RotateCcw, Rocket, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Send, Lock, Building2
} from 'lucide-react';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import { openPdf } from '../../../../shared/utils/openPdf.js';
import { universityApiService } from '../../../university/services/universityApiService.js';
import { PrototypePhase1LabView } from './detail/PrototypePhase1LabView.jsx';
import { PrototypePhase2TestingView } from './detail/PrototypePhase2TestingView.jsx';
import { PrototypePhase3CertificationView } from './detail/PrototypePhase3CertificationView.jsx';
import { PrototypePhase4DeploymentView } from './detail/PrototypePhase4DeploymentView.jsx';

const STAGE_CONFIG = [
  { num: 1, key: 'labDesign',    label: '1. Lab Prototype & Hardware (TRL 1-3)',       icon: FlaskConical },
  { num: 2, key: 'fieldTest',    label: '2. Field Testing & Lab Audit (TRL 4-6)',       icon: Radio },
  { num: 3, key: 'stateCert',    label: '3. State Sanction & Handover (TRL 7-8)',       icon: ShieldCheck },
  { num: 4, key: 'publicDeploy', label: '4. Public Deploy & Citizen Resolution (TRL 9)', icon: Users }
];

export const InspectPrototypeDetailPanel = ({ project, onClose, onOpenDeployTerms }) => {
  const curTrlNum = parseInt(String(project.trlLevel || '4').replace('TRL-', ''), 10) || 4;
  const [activeStageTab, setActiveStageTab] = useState(curTrlNum <= 3 ? 1 : curTrlNum <= 6 ? 2 : curTrlNum <= 8 ? 3 : 4);
  const [govRemarks, setGovRemarks] = useState('');
  const [showFeedbackBox, setShowFeedbackBox] = useState(false);
  const [isRequestingChanges, setIsRequestingChanges] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const isApproved = project.governmentStatus === 'Approved' || project.isDeployed || project.status === 'Completed' || curTrlNum >= 9;

  const handleRequestRevisions = async () => {
    if (isApproved || !govRemarks.trim()) { setShowFeedbackBox(true); return; }
    setIsRequestingChanges(true);
    try {
      const pId = project.projectId || project.id;
      await universityApiService.updateGovernmentPrototypeStatus(pId, 'Changes Required', project.trlLevel || 'TRL-4', govRemarks);
      setActionSuccess('Revision directives dispatched to University team.');
      setTimeout(() => { setIsRequestingChanges(false); setActionSuccess(null); setShowFeedbackBox(false); }, 2500);
    } catch { setIsRequestingChanges(false); }
  };

  const handlePrintCertificate = () => {
    const w = window.open('', '_blank', 'width=850,height=750');
    if (!w) return alert('Please allow popups to print certificate');
    w.document.write(`<html><head><title>TRL Certificate - ${project.id || project.projectId}</title><style>body{font-family:serif;padding:40px;text-align:center}.box{border:4px double #0d1b3e;padding:30px}table{width:100%;text-align:left;border-collapse:collapse;margin:20px 0}td{padding:8px;border:1px solid #ccc}</style></head><body><div class="box"><h2>Government of Jharkhand</h2><p>Department of Higher & Technical Education</p><h3>★ ${project.trlLevel || 'TRL-9'} STATE CERTIFIED INNOVATION ★</h3><table><tr><td>Project ID</td><td><strong>${project.id || project.projectId}</strong></td></tr><tr><td>Title</td><td><strong>${project.title}</strong></td></tr><tr><td>Host HEI</td><td>${project.hei || 'Nodal University'}</td></tr><tr><td>Lead Mentor</td><td>${project.teamLead || project.leadMentor || 'Faculty Mentor'}</td></tr></table></div></body></html>`);
    w.document.close(); setTimeout(() => w.print(), 400);
  };

  return (
    <FullPageDetailPanel
      onBack={onClose}
      backLabel="Back to Prototypes Registry"
      breadcrumbs={['Projects & Solutions', 'Prototypes & TRL', project.id || project.projectId]}
      idBadge={project.id || project.projectId}
      statusBadge={
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center space-x-1 ${isApproved ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
          {isApproved ? (
            <>
              <Lock className="w-3 h-3 text-emerald-700" />
              <span>✓ Deployed & State Certified (TRL-9) · Locked</span>
            </>
          ) : (
            <span>{project.trlLevel || 'TRL-4'} · Under Evaluation</span>
          )}
        </span>
      }
      title={project.title}
      subtitle={`Host HEI: ${project.hei || 'Nodal University'} (${project.district || 'Ranchi'} District) · Industrial Testing: ${project.testingPartner || 'Ariba Research Labs'}`}
      headerActions={
        <div className="flex items-center space-x-2">
          {project.testingReportPdfUrl && (
            <button type="button" onClick={() => openPdf(project.testingReportPdfUrl)} className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /><span>Lab Report PDF</span>
            </button>
          )}
          {project.pdfUrl && (
            <button type="button" onClick={() => openPdf(project.pdfUrl)} className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" /><span>Blueprint PDF</span>
            </button>
          )}
          <button type="button" onClick={handlePrintCertificate} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer">
            <Printer className="w-3.5 h-3.5 text-emerald-300" /><span>Print Certificate</span>
          </button>
        </div>
      }
      tabs={STAGE_CONFIG.map(t => ({ id: t.num, label: t.label, icon: t.icon }))}
      activeTab={activeStageTab}
      onTabChange={(id) => setActiveStageTab(id)}
      stickyFooter={
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button type="button" disabled={activeStageTab === 1} onClick={() => setActiveStageTab(p => Math.max(1, p - 1))} className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl disabled:opacity-30 cursor-pointer flex items-center space-x-1">
              <ChevronLeft className="w-3.5 h-3.5" /><span>Prev Step</span>
            </button>
            <button type="button" disabled={activeStageTab === 4} onClick={() => setActiveStageTab(p => Math.min(4, p + 1))} className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl disabled:opacity-30 cursor-pointer flex items-center space-x-1">
              <span>Next Step</span><ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center space-x-2.5">
            {!isApproved && (
              <button type="button" onClick={() => setShowFeedbackBox(!showFeedbackBox)} className="px-4 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 cursor-pointer flex items-center space-x-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" /><span>Request Revision</span>
              </button>
            )}
            {isApproved ? (
              <div className="px-5 py-2.5 rounded-md text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-2 cursor-default select-none shadow-xs">
                <Lock className="w-4 h-4 text-emerald-800" />
                <span>✓ Handed Over & Deployed (TRL-9) · Locked</span>
              </div>
            ) : (
              <button type="button" onClick={() => onOpenDeployTerms?.(project)} className="px-6 py-2.5 rounded-md text-xs font-black bg-[#007A61] hover:bg-[#00604c] text-white cursor-pointer shadow-md flex items-center space-x-2 transition-all">
                <Building2 className="w-4 h-4 text-emerald-200" />
                <span>Move to Department (TRL-9 Handover)</span>
              </button>
            )}
          </div>
        </div>
      }
    >
      {actionSuccess && <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>{actionSuccess}</span></div>}

      {/* Dynamic Tab-Specific View */}
      {activeStageTab === 1 && <PrototypePhase1LabView project={project} />}
      {activeStageTab === 2 && <PrototypePhase2TestingView project={project} />}
      {activeStageTab === 3 && <PrototypePhase3CertificationView project={project} onPrintCertificate={handlePrintCertificate} />}
      {activeStageTab === 4 && <PrototypePhase4DeploymentView project={project} isApproved={isApproved} onOpenDeployTerms={onOpenDeployTerms} />}

      {/* Revision Directives Input */}
      {showFeedbackBox && !isApproved && (
        <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-amber-900 flex items-center space-x-1.5"><AlertCircle className="w-4 h-4 text-amber-600" /><span>State Innovation Council Revision Directives *</span></label>
          <textarea value={govRemarks} onChange={(e) => setGovRemarks(e.target.value)} rows={2} placeholder="Specify required corrections or telemetry needed from university..." className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-900 focus:outline-[#007A61]" />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setShowFeedbackBox(false)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
            <button type="button" onClick={handleRequestRevisions} disabled={isRequestingChanges} className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer"><Send className="w-3 h-3" /><span>{isRequestingChanges ? 'Dispatching...' : 'Dispatch Directives'}</span></button>
          </div>
        </div>
      )}
    </FullPageDetailPanel>
  );
};

export default InspectPrototypeDetailPanel;
