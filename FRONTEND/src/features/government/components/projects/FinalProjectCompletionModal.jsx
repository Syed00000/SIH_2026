import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Award,
  ShieldCheck,
  Building2,
  Calendar,
  FileCheck,
  Send,
  UserCheck
} from 'lucide-react';

export const FinalProjectCompletionModal = ({ project, isOpen, onClose, onConfirmCompletion }) => {
  const [officerName, setOfficerName] = useState('Dr. Arvind Kumar, IAS');
  const [designation, setDesignation] = useState('Principal Secretary, Dept of Higher & Technical Education');
  const [remarks, setRemarks] = useState('All milestones, lab testing, and field trials have been inspected and verified. Project is officially certified as completed and approved for state scaling.');
  const [checklist, setChecklist] = useState({
    finalReport: true,
    solutionTested: true,
    handoverDone: true,
    financialAuditPassed: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCompletion(project.id, { officerName, designation, remarks });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Government Final Approval: Mark Project as Completed
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Official state sign-off for {project.id} ({project.hei})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          {/* Project Summary Box */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-900 text-white">
                {project.id}
              </span>
              <span className="font-bold text-slate-900 text-xs">{project.title}</span>
            </div>
            <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3">
              <span>Institution: <strong>{project.hei}</strong></span>
              <span>Project Lead: <strong>{project.teamLead}</strong></span>
              <span>District: <strong>{project.district}</strong></span>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Final Approval Checklist (Government Verification):
            </span>

            <div className="space-y-1.5">
              {[
                { key: 'finalReport', label: '1. Final Project & Technical Report received and verified' },
                { key: 'solutionTested', label: '2. Working prototype successfully tested in field/community' },
                { key: 'handoverDone', label: '3. Handover to district administration or community completed' },
                { key: 'financialAuditPassed', label: '4. Final financial audit & utilization certificates approved' }
              ].map((item) => (
                <label
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  className="flex items-center space-x-2.5 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    onChange={() => {}}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-800 text-xs">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Officer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Signing Officer Name *
              </label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Designation *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Approval Remarks */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Official Approval Remarks & State Scaling Order *
            </label>
            <textarea
              rows={3}
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Confirm & Approve Project as Completed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinalProjectCompletionModal;
