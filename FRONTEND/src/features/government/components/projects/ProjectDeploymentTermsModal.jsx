import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, X, Rocket, ExternalLink, Lock } from 'lucide-react';

export const ProjectDeploymentTermsModal = ({ project, isOpen, onClose, onAcceptAndDeploy, deploying = false }) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#007A61] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                State Innovation Governance
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-0.5">State Deployment Protocols & Legal Terms</h3>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Target Strip */}
        <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200 text-xs flex items-center justify-between">
          <span className="font-bold text-slate-800 truncate max-w-md">{project.title}</span>
          <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">{project.id}</span>
        </div>

        {/* Scrollable Terms & Conditions */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-600 leading-relaxed font-sans bg-[#fafafa]">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-2xs">
            <div>
              <h5 className="font-black text-slate-900 text-xs flex items-center space-x-1.5 mb-1">
                <span className="text-[#007A61]">1.</span><span>Public Safety, Calibration & NABL Standards</span>
              </h5>
              <p className="text-[11.5px] text-slate-600">
                The prototype has completed all 3 stages of specialized laboratory testing, material stress validation, and spectrometer baseline calibration. The university and partner laboratory affirm that all field components satisfy industrial tolerance standards for public safety.
              </p>
            </div>

            <div>
              <h5 className="font-black text-slate-900 text-xs flex items-center space-x-1.5 mb-1">
                <span className="text-[#007A61]">2.</span><span>Intellectual Property & State Innovation Corpus</span>
              </h5>
              <p className="text-[11.5px] text-slate-600">
                Under Jharkhand State Innovation Guidelines 2026, the technology rights remain co-credited to the student researchers and faculty mentors, while perpetual, non-exclusive deployment rights are granted to the Government of Jharkhand for citizen welfare and public administration.
              </p>
            </div>

            <div>
              <h5 className="font-black text-slate-900 text-xs flex items-center space-x-1.5 mb-1">
                <span className="text-[#007A61]">3.</span><span>Continuous Operational Telemetry & Sensor SLA</span>
              </h5>
              <p className="text-[11.5px] text-slate-600">
                The deployed system must maintain minimum 99.0% RF/cellular telemetry heartbeat into JoharSetu Gateway for real-time anomaly detection, citizen complaint resolution, and state monitoring.
              </p>
            </div>

            <div>
              <h5 className="font-black text-slate-900 text-xs flex items-center space-x-1.5 mb-1">
                <span className="text-[#007A61]">4.</span><span>Citizen Notification & Public Transparency Mandate</span>
              </h5>
              <p className="text-[11.5px] text-slate-600">
                Upon deployment, the citizen challenge registry will automatically broadcast the resolution dossier and certified technical report to affected citizens, district collectors, and public stakeholders.
              </p>
            </div>
          </div>

          {/* Verification Warning Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-[11px] font-medium leading-normal">
              Final deployment will publish the prototype report to the public registry and notify citizens that this ground challenge has been successfully resolved.
            </span>
          </div>

          {/* Acceptance Checkbox */}
          <label className="flex items-start space-x-3 p-3.5 bg-white border-2 border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#007A61] focus:ring-[#007A61] accent-[#007A61]"
            />
            <span className="text-xs font-bold text-slate-800 leading-snug">
              I confirm that all milestone deliverables, lab dossiers, and certified test reports have been verified, and I authorize official deployment to the Jharkhand Citizen Registry.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
            Cancel
          </button>
          <button
            type="button"
            disabled={!accepted || deploying}
            onClick={() => onAcceptAndDeploy(project)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition-all shadow-md ${
              accepted && !deploying
                ? 'bg-[#007A61] hover:bg-[#00604c] text-white cursor-pointer animate-pulse'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {deploying ? (
              <span>Deploying to Public Registry...</span>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Confirm &amp; Deploy Project</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDeploymentTermsModal;
