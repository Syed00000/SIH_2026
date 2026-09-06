import React, { useState } from 'react';
import { X, Rocket, ShieldCheck, Building2, CheckCircle2, FileCheck2 } from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

const DEPARTMENTS = [
  'Urban Development & Housing Department', 'Department of Higher & Technical Education (DHTE)',
  'Health, Medical Education & Family Welfare', 'Panchayati Raj & Rural Development',
  'Drinking Water & Sanitation Department', 'Mines & Geology Department', 'Agriculture, Animal Husbandry & Co-operative'
];

export const PrototypeDeploymentTermsModal = ({ isOpen, onClose, project, onDeploySuccess }) => {
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  if (!isOpen || !project) return null;

  const handleConfirmDeploy = async () => {
    if (!agreedToTerms) return;
    setIsDeploying(true);
    try {
      const pId = project.projectId || project.id;
      await universityApiService.updateGovernmentPrototypeStatus(
        pId, 'Approved', 'TRL-9',
        `State Certified (TRL-9) & Handed over to ${selectedDept}. Citizen problem statement officially resolved.`,
        project.universityCode || 'U-0205',
        { department: selectedDept, sendToDepartment: true, notifyCitizen: true }
      );
      await projectCsrSyncService.initializeFromBackend();
      setDeploySuccess(true);
      setTimeout(() => {
        setIsDeploying(false);
        setDeploySuccess(false);
        onDeploySuccess?.(pId);
        onClose();
      }, 1500);
    } catch (e) {
      console.error('Deployment error:', e);
      setIsDeploying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden text-left">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-black text-emerald-400">{project.id || project.projectId}</span>
                <span className="text-xs text-slate-300">· State Handover & Deployment Undertaking</span>
              </div>
              <h2 className="text-sm font-black text-white line-clamp-1">{project.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Quick Problem Dossier */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Target Problem Statement:</span>
            <p className="font-extrabold text-slate-900 text-xs leading-relaxed">"{project.problemStatement || project.title}"</p>
            <div className="flex items-center space-x-3 pt-1 text-[10.5px] text-slate-500">
              <span>Challenge ID: <strong className="font-mono text-slate-800">{project.challengeId || 'CHL-JH-2026-3857'}</strong></span>
              <span>•</span>
              <span>NABL Lab: <strong className="text-emerald-700">{project.testingPartner || 'Ariba Research Labs'}</strong></span>
            </div>
          </div>

          {/* Department Selection */}
          <div className="space-y-1.5">
            <label className="text-[10.5px] font-bold text-slate-600 uppercase block">Designated State Handover Department:</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 focus:bg-white focus:outline-[#007A61]">
                {DEPARTMENTS.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
          </div>

          {/* Formal Terms & Conditions */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10.5px] font-bold text-slate-600 uppercase flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#007A61]" />
                <span>State Deployment Terms & Handover Undertaking (7 Clauses):</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Scroll to review all clauses</span>
            </div>
            <div className="p-3.5 bg-slate-50/90 border border-slate-200 rounded-xl space-y-2.5 text-[11px] text-slate-600 leading-relaxed max-h-56 overflow-y-auto pr-2 divide-y divide-slate-100">
              <p className="pt-0.5"><strong>1. Laboratory Benchmark Acceptance:</strong> The prototype has successfully satisfied all rigorous quality, calibration, and environmental stress protocols at accredited facilities (NABL certified under {project.testingPartner || 'Ariba Research Labs'}).</p>
              <p className="pt-2"><strong>2. Operational Handover & Asset Transfer:</strong> All engineering schematics, firmware source binaries, CAD models, and operating manuals are officially handed over to {selectedDept} for physical statewide public implementation.</p>
              <p className="pt-2"><strong>3. Public Safety & Standard Compliance:</strong> The solution complies with Bureau of Indian Standards (BIS) norms, failsafe electrical/mechanical isolation standards, and Jharkhand Industrial Innovation guidelines.</p>
              <p className="pt-2"><strong>4. Citizen Resolution & Grievance Closure:</strong> An automated official resolution dispatch will be transmitted to the reporting citizen's portal dossier and SMS channel. Problem statement status is permanently marked as RESOLVED.</p>
              <p className="pt-2"><strong>5. State Registry TRL-9 Enrollment:</strong> The solution is certified under Technology Readiness Level 9 (TRL-9) on the Jharkhand State Open Innovation Registry, ensuring formal IP and academic recognition for the host HEI and researchers.</p>
              <p className="pt-2"><strong>6. Telemetry & Data Privacy Undertaking:</strong> Field sensor telemetry shall remain actively routed to the State Command Center adhering to the Digital Personal Data Protection (DPDP) Act with zero unauthorized external leakage.</p>
              <p className="pt-2"><strong>7. Post-Deployment Maintenance & Audit:</strong> The deploying line department and mentoring HEI agree to a minimum 12-month operational maintenance SLA and quarterly performance telemetry audits.</p>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <label className={`flex items-start space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
            agreedToTerms ? 'bg-emerald-50/80 border-[#007A61]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
          }`}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 text-[#007A61] rounded mt-0.5 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-extrabold text-slate-900 block">I accept the State Handover Terms & Conditions</span>
              <span className="text-slate-600 text-[11px] leading-relaxed">
                I verify that technical standards are fulfilled and authorize immediate department handover and instant resolution notification to the citizen.
              </span>
            </div>
          </label>
        </div>

        {/* Footer with Deploy Button Active only when Checkbox is checked */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDeploy}
            disabled={!agreedToTerms || isDeploying || deploySuccess}
            className={`px-6 py-2.5 text-xs font-black rounded-xl flex items-center space-x-2 transition-all ${
              agreedToTerms && !isDeploying && !deploySuccess
                ? 'bg-[#007A61] hover:bg-[#00604c] text-white cursor-pointer shadow-md hover:shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>
              {deploySuccess ? 'Deployed Successfully! 🎉' : isDeploying ? 'Deploying & Notifying...' : 'Confirm Final Deployment (TRL-9)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrototypeDeploymentTermsModal;
