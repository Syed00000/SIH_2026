import React, { useState } from 'react';
import { X, Rocket, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Building2, Bell, FileCheck2, FileText, User } from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import { openPdf } from '../../../../shared/utils/openPdf.js';

const DEPARTMENTS = [
  'Urban Development & Housing Department', 'Department of Higher & Technical Education (DHTE)',
  'Health, Medical Education & Family Welfare', 'Panchayati Raj & Rural Development',
  'Drinking Water & Sanitation Department', 'Mines & Geology Department', 'Agriculture, Animal Husbandry & Co-operative'
];

export const PrototypeDeploymentWizardModal = ({ isOpen, onClose, project, onDeploySuccess }) => {
  const [page, setPage] = useState(1);
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [sendToDept, setSendToDept] = useState(true);
  const [issueCert, setIssueCert] = useState(true);
  const [notifyCitizen, setNotifyCitizen] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  if (!isOpen || !project) return null;

  const handleConfirmDeploy = async () => {
    setIsDeploying(true);
    try {
      const pId = project.projectId || project.id;
      await universityApiService.updateGovernmentPrototypeStatus(
        pId,
        'Approved',
        'TRL-9',
        `State Certified (TRL-9) & Handed over to ${selectedDept}. Citizen problem statement officially resolved.`,
        'RU001',
        { department: selectedDept, sendToDepartment: sendToDept, notifyCitizen }
      );
      await projectCsrSyncService.initializeFromBackend();
      setDeploySuccess(true);
      setTimeout(() => {
        setIsDeploying(false);
        setDeploySuccess(false);
        onDeploySuccess?.(pId);
        onClose();
      }, 1800);
    } catch (e) {
      console.error('Deployment error:', e);
      setIsDeploying(false);
    }
  };

  const reportUrl = project.testingReportPdfUrl || project.reportPdfUrl;
  const blueprintUrl = project.pdfUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden text-left">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-black text-emerald-400">{project.id}</span>
                <span className="text-xs text-slate-300">· Final State Deployment Wizard</span>
              </div>
              <h2 className="text-sm font-black text-white line-clamp-1">{project.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Step Pagination Nav */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-center text-xs select-none">
          {[
            { num: 1, label: '1. Citizen Problem Dossier' },
            { num: 2, label: '2. Prototype & Lab Specs' },
            { num: 3, label: '3. Handover & Citizen Delivery' }
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setPage(s.num)}
              className={`py-3 px-2 font-black transition-all cursor-pointer border-b-2 flex items-center justify-center space-x-1.5 ${
                page === s.num ? 'border-[#007A61] text-[#007A61] bg-white' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content by Page */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* PAGE 1: Citizen Problem Statement Dossier */}
          {page === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Citizen Problem Statement:</span>
                <p className="text-sm font-extrabold text-slate-900 leading-relaxed">
                  "{project.problemStatement || project.title}"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                  <div><span className="text-[10px] font-bold text-slate-400 block uppercase">Challenge ID:</span><span className="font-mono font-bold text-slate-800">{project.challengeId || 'CHL-JH-2026-3857'}</span></div>
                  <div><span className="text-[10px] font-bold text-slate-400 block uppercase">Target District:</span><span className="font-bold text-slate-800">{project.district || 'Ranchi'}</span></div>
                  <div><span className="text-[10px] font-bold text-slate-400 block uppercase">Domain Sector:</span><span className="font-bold text-slate-800">{project.sector || 'Urban Development'}</span></div>
                </div>
              </div>
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-[10px] font-extrabold text-[#007A61] uppercase block">Ground Verification Status</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Verified by District Nodal Technical Cell. Ready for final handover to the administrative department for citizen resolution.
                </p>
              </div>
            </div>
          )}

          {/* PAGE 2: Prototype Architecture & Lab Testing Specs */}
          {page === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Technical Rig & Partner Specs:</span>
                  <span className="text-[10.5px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">100% Lab Verified (NABL)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-[10px] font-bold text-slate-400 block uppercase">Lead Faculty Investigator:</span><span className="font-bold text-slate-900">{project.teamLead || project.facultyMentor?.name || 'Faculty Mentor'}</span></div>
                  <div><span className="text-[10px] font-bold text-slate-400 block uppercase">Testing Partner Lab:</span><span className="font-bold text-slate-900">{project.testingPartner || 'Ariba Research Labs'}</span></div>
                </div>
                <div><span className="text-[10px] font-bold text-slate-400 block uppercase">Hardware / IoT Specs:</span><p className="text-xs font-semibold text-slate-800 mt-0.5">{project.hardwareSpecs || 'Embedded Microcontroller with LoRaWAN wireless telemetry & environmental sensors.'}</p></div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {reportUrl && <button type="button" onClick={() => openPdf(reportUrl)} className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"><FileCheck2 className="w-4 h-4 text-emerald-600" /><span>View Verified Lab Report PDF ({project.testingReportPdfName || 'napkin.pdf'})</span></button>}
                {blueprintUrl && <button type="button" onClick={() => openPdf(blueprintUrl)} className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"><FileText className="w-4 h-4 text-[#007A61]" /><span>View Student Blueprint PDF ({project.pdfName || 'napkin.pdf'})</span></button>}
              </div>
            </div>
          )}

          {/* PAGE 3: Department Handover & Citizen Delivery */}
          {page === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-slate-500 uppercase block">Designated Handover Department for Implementation:</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 focus:bg-white focus:outline-[#007A61]">
                    {DEPARTMENTS.map((d) => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
              </div>

              {/* Mandatory Handover & Notification Checkboxes */}
              <div className="space-y-2 pt-1">
                <label className="flex items-start space-x-3 p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={sendToDept} onChange={(e) => setSendToDept(e.target.checked)} className="w-4 h-4 text-[#007A61] rounded mt-0.5" />
                  <div className="text-xs"><span className="font-black text-slate-900 block">Send & Handover Prototype Dossier to {selectedDept}</span><span className="text-slate-600 text-[11px]">Officially transfer hardware blueprint, lab testing report & IP compliance to the department for on-ground rollout.</span></div>
                </label>
                <label className="flex items-start space-x-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={notifyCitizen} onChange={(e) => setNotifyCitizen(e.target.checked)} className="w-4 h-4 text-[#007A61] rounded mt-0.5" />
                  <div className="text-xs"><span className="font-black text-slate-900 block">Dispatch Instant Resolution Notification to Citizen</span><span className="text-slate-600 text-[11px]">Send real-time completion alert to citizen's notification bell and resolve problem status in public tracker.</span></div>
                </label>
              </div>

              {/* Citizen Notification Preview Box */}
              <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-1 text-xs">
                <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[10px] uppercase"><Bell className="w-3.5 h-3.5" /><span>Citizen Live Notification Preview</span></div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "🎉 Problem Solved & Deployed: Your citizen problem statement '{project.title}' has been successfully solved! The engineered prototype has completed NABL lab testing and has been officially deployed on-ground to {selectedDept} for public benefit."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Pagination Controls & Final Action */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div>{page > 1 && (<button type="button" onClick={() => setPage(page - 1)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 flex items-center space-x-1 cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /><span>Previous Page</span></button>)}</div>
          <div className="flex items-center space-x-2">
            {page < 3 ? (
              <button type="button" onClick={() => setPage(page + 1)} className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center space-x-1.5 cursor-pointer"><span>Next Page</span><ArrowRight className="w-3.5 h-3.5 text-emerald-400" /></button>
            ) : (
              <button type="button" onClick={handleConfirmDeploy} disabled={isDeploying || deploySuccess || !sendToDept} className="px-6 py-2 text-xs font-bold text-white bg-[#007A61] hover:bg-[#00604c] rounded-xl flex items-center space-x-2 cursor-pointer shadow-md disabled:opacity-50">
                <Rocket className="w-4 h-4 text-emerald-200" />
                <span>{deploySuccess ? 'Deployed Successfully! 🎉' : isDeploying ? 'Deploying & Notifying...' : 'Confirm Final Deployment & Notify Citizen (TRL-9)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypeDeploymentWizardModal;
