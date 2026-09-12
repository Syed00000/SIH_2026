import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Send, MapPin, User, Wrench, ShieldAlert } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';

export const DepartmentProblemActionPanel = ({ problem, onClose, onUpdateProblem, onAssignTechnician }) => {
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const idKey = problem.challengeId || problem.id || problem._id;
  const submitter = problem.submitter || {};
  const location = problem.location || {};
  const tech = problem.assignedTechnician;
  const directive = problem.assignedDepartment?.instructions || 'Ground field inspection and immediate civic remedial work.';

  const citizenUrls = (problem.media || []).map(m => m.url || m);
  const techUrls = (problem.mediaUrls || []).filter(url => !citizenUrls.includes(url));

  const fullAddress = [
    location.village || problem.village, location.panchayat || problem.panchayat,
    location.block || problem.block, location.district || problem.district || 'Ranchi', 'Jharkhand'
  ].filter(Boolean).join(', ');

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const targetId = problem.challengeId || problem.id || problem._id;
      const payload = {
        status: 'Resolved',
        assignedDepartment: {
          ...(problem.assignedDepartment || {}),
          status: 'Resolved',
          actionRemarks: 'Approved by Ward Commissioner. Problem resolved.',
          resolvedAt: new Date()
        }
      };
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      const updated = res?.data?.data || res?.data || { ...problem, ...payload };
      setMsg({ type: 'success', text: `Problem approved and marked as resolved.` });
      if (onUpdateProblem) onUpdateProblem(updated);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to approve.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEscalate = async () => {
    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const targetId = problem.challengeId || problem.id || problem._id;
      const payload = {
        status: 'Escalated'
      };
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      const updated = res?.data?.data || res?.data || { ...problem, ...payload };
      setMsg({ type: 'success', text: `Problem escalated to higher authority.` });
      if (onUpdateProblem) onUpdateProblem(updated);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to escalate.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReassign = async () => {
    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const targetId = problem.challengeId || problem.id || problem._id;
      const payload = {
        status: 'In Progress',
        assignedTechnician: {
          ...(problem.assignedTechnician || {}),
          status: 'Assigned',
          rejectReason: 'Work rejected and reassigned by Ward Commissioner'
        }
      };
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      const updated = res?.data?.data || res?.data || { ...problem, ...payload };
      setMsg({ type: 'success', text: `Work rejected and reassigned to technician.` });
      if (onUpdateProblem) onUpdateProblem(updated);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to reassign.' });
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
        
        {problem.status === 'Escalated' && (
          <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl flex gap-3 text-xs text-rose-800">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5 text-rose-900 font-extrabold uppercase tracking-wide text-[10px]">Escalated Civic Issue</strong>
              This problem was escalated to this higher authority by the <strong>{problem.assignedWard?.name || problem.assignedBlock?.assignedBy || 'subordinate department'}</strong>. Field actions or prior investigations are detailed below.
            </div>
          </div>
        )}

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

      {/* Split-View Ground Evidence */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
          Evidence Comparison
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Left: Citizen Evidence */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded">Reported Problem (Citizen)</h4>
            <div className="grid grid-cols-2 gap-2">
              {problem.media?.length > 0 ? problem.media.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noreferrer" className="aspect-video md:aspect-square rounded-lg border border-slate-200 overflow-hidden hover:border-[#007A61] transition-colors block bg-slate-50">
                  <img src={m.url} alt="Citizen Evidence" className="w-full h-full object-cover" />
                </a>
              )) : (
                <div className="col-span-2 p-4 text-center text-[10px] text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  No images uploaded by citizen.
                </div>
              )}
            </div>
          </div>

          {/* Right: Technician Proof */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#007A61] bg-[#007A61]/10 px-2 py-1 rounded">Field Resolution Proof (Technician)</h4>
            <div className="grid grid-cols-2 gap-2">
              {techUrls.length > 0 ? techUrls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="aspect-video md:aspect-square rounded-lg border border-slate-200 overflow-hidden hover:border-[#007A61] transition-colors block bg-slate-50">
                  <img src={url} alt="Technician Proof" className="w-full h-full object-cover" />
                </a>
              )) : (
                <div className="col-span-2 p-4 text-center text-[10px] text-amber-600 border border-dashed border-amber-200 rounded-xl bg-amber-50">
                  Pending resolution proof from field worker.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technician Remarks */}
        {tech?.completionRemarks && (
          <div className="mt-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide block mb-1">Technician Work Summary</span>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">{tech.completionRemarks}</p>
          </div>
        )}

        {/* Previous Rejected Attempts */}
        {tech?.workHistory?.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-1">Previous Rejected Attempts</h4>
            {tech.workHistory.map((hw, idx) => (
              <div key={idx} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex gap-3">
                {hw.mediaUrl && (
                  <a href={hw.mediaUrl} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-rose-200 hover:border-rose-300 block bg-white">
                    <img src={hw.mediaUrl} alt="Old Proof" className="w-full h-full object-cover" />
                  </a>
                )}
                <div>
                  <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wide block mb-0.5">Attempt {idx + 1}</span>
                  <p className="text-xs text-rose-950 leading-relaxed font-medium mb-1">{hw.completionRemarks || 'No remarks provided.'}</p>
                  <p className="text-[10px] text-rose-600 font-medium">Rejected: {hw.rejectReason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3.5">
        <div className="border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
            Authority Approval
          </h3>
          <p className="text-[10.5px] text-slate-400 font-medium">Review field evidence and finalize resolution</p>
        </div>

        {msg.text && (
          <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleApprove}
            disabled={submitting || problem.status === 'Resolved' || tech?.status !== 'Completed'}
            className="flex-1 py-2.5 bg-[#007A61] hover:bg-[#006651] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{problem.status === 'Resolved' ? 'Already Approved' : 'Approve (Mark as Resolved)'}</span>
          </button>
          
          <button
            type="button"
            onClick={handleReassign}
            disabled={submitting || problem.status === 'Resolved' || tech?.status !== 'Completed'}
            className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 disabled:opacity-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Wrench className="w-4 h-4" />
            <span>Reject & Reassign to Tech</span>
          </button>

          <button
            type="button"
            onClick={handleEscalate}
            disabled={submitting}
            className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 disabled:opacity-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Move to Higher Authority</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentProblemActionPanel;
