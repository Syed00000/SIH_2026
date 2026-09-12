import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Send, MapPin, User, Wrench } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';

export const DepartmentProblemActionPanel = ({ problem, onClose, onUpdateProblem, onAssignTechnician }) => {
  const [status, setStatus] = useState(problem.status || 'In Progress');
  const [remarks, setRemarks] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const idKey = problem.challengeId || problem.id || problem._id;
  const submitter = problem.submitter || {};
  const location = problem.location || {};
  const tech = problem.assignedTechnician;
  const directive = problem.assignedDepartment?.instructions || 'Ground field inspection and immediate civic remedial work.';

  const fullAddress = [
    location.village || problem.village, location.panchayat || problem.panchayat,
    location.block || problem.block, location.district || problem.district || 'Ranchi', 'Jharkhand'
  ].filter(Boolean).join(', ');

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) return setMsg({ type: 'error', text: 'Please enter action taken remarks.' });
    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const targetId = problem.challengeId || problem.id || problem._id;
      const payload = {
        status, remarks: remarks.trim(),
        assignedDepartment: {
          ...(problem.assignedDepartment || {}),
          status, actionRemarks: remarks.trim(),
          actionOfficer: officerName.trim() || 'Department Engineering Squad',
          resolvedAt: status === 'Resolved' ? new Date() : null
        }
      };
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      const updated = res?.data?.data || res?.data || { ...problem, status, ...payload };
      setMsg({ type: 'success', text: `Action report submitted! Status: ${status}.` });
      if (onUpdateProblem) onUpdateProblem(updated);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to submit.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3.5 select-none text-left animate-in fade-in duration-150">
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Problems</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-500">{idKey}</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#007A61]/10 text-[#007A61]">
            {problem.domain || 'Civic Problem'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-2.5">
        <h2 className="text-base font-black text-slate-900">{problem.title}</h2>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
          {problem.description || 'No detailed problem description.'}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Citizen: <strong>{submitter.fullName || submitter.name || 'Citizen'}</strong></span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>{fullAddress}</span>
          </span>
        </div>
      </div>

      {/* Ground Evidence */}
      {(problem.mediaUrls?.length > 0 || problem.media?.length > 0) && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-2.5">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
            Ground Evidence & Media
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
            {(problem.mediaUrls || problem.media?.map(m => m.url)).filter(Boolean).map((url, i) => (
              <a 
                key={i} 
                href={url} 
                target="_blank" 
                rel="noreferrer"
                className="aspect-square rounded-lg border border-slate-200 overflow-hidden hover:border-[#007A61] transition-colors block bg-slate-50"
              >
                <img src={url} alt="Evidence" className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Field Technician Info & Assignment */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Assigned Field Technician
            </span>
            {tech?.name ? (
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2 mt-0.5">
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10.5px]">
                  {tech.technicianId}
                </span>
                <span>{tech.name}</span>
                <span className="text-slate-500 font-medium">({tech.specialization || tech.phone || 'Field Tech'})</span>
              </div>
            ) : (
              <span className="text-xs text-amber-700 font-medium italic">No technician assigned yet</span>
            )}
          </div>
        </div>
        {onAssignTechnician && (
          <button
            type="button"
            onClick={() => onAssignTechnician(problem)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#007A61] hover:bg-[#006651] cursor-pointer shadow-2xs transition-all shrink-0"
          >
            {tech?.name ? 'Change Technician' : 'Assign to Technician'}
          </button>
        )}
      </div>

      {/* Directive Instructions */}
      <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-3.5 space-y-1">
        <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wide">
          State Nodal Directive & Instructions
        </span>
        <p className="text-xs text-amber-900 font-medium">{directive}</p>
      </div>

      {/* Resolution Submission Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3.5">
        <div className="border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
            Department Ground Action & Resolution Report
          </h3>
          <p className="text-[10.5px] text-slate-400 font-medium">Record field work execution and update public progress status</p>
        </div>

        {msg.text && (
          <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmitAction} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Resolution Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#007A61]"
              >
                <option value="In Progress">In Progress (Field Work Active)</option>
                <option value="Resolved">Resolved (Work Completed on Ground)</option>
              </select>
            </div>
            <div>
              <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Executing Officer / Mukhiya</label>
              <input
                type="text" value={officerName} onChange={(e) => setOfficerName(e.target.value)}
                placeholder="E.g. Er. Ramesh Sharma, Assistant Engineer"
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#007A61]"
              />
            </div>
          </div>
          <div>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Field Action Taken Remarks <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)}
              placeholder="Describe work completed, site inspection report, contractor deployment..."
              className="w-full p-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007A61]"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#007A61] hover:bg-[#006651] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Action Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentProblemActionPanel;
