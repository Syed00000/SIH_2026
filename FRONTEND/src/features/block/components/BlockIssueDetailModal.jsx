import React, { useState } from 'react';
import { X, CheckCircle, MapPin, User, Send, Building2, AlertCircle, Wrench, ShieldAlert, Undo2 } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';

export const BlockIssueDetailModal = ({ problem, onClose, onUpdateProblem, onAssignToDept }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!problem) return null;
  const targetId = problem.challengeId || problem.id || problem._id;
  const images = problem.mediaUrls || problem.media?.map((m) => m.url) || [];

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      setError('');
      const res = await apiClient.patch(`citizen/challenges/${targetId}/status`, {
        status: 'Resolved',
        remarks: 'Action verified and problem marked as resolved by Block Administration.'
      });
      const updated = res?.data?.data || res?.data || { ...problem, status: 'Resolved' };
      if (onUpdateProblem) onUpdateProblem(updated);
      setSuccess('Problem marked as Resolved.');
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to resolve problem');
    } finally { setSubmitting(false); }
  };

  const handleRejectToNodal = async () => {
    const reason = window.prompt('Enter reason for returning problem to District Nodal Officer:', 'Problem does not fall under this Block jurisdiction / requires re-triage');
    if (reason === null) return;
    try {
      setSubmitting(true);
      setError('');
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, {
        action: 'REJECT_BACK_TO_NODAL',
        rejectReason: reason.trim() || 'Rejected and returned to Nodal Officer by Block Authority',
        authorityName: problem.assignedBlock?.name || 'Block Administration Office'
      });
      const updated = res?.data?.data || res?.data || { ...problem, status: 'Under Review' };
      if (onUpdateProblem) onUpdateProblem(updated);
      setSuccess('Problem returned back to Nodal Officer.');
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to return to Nodal');
    } finally { setSubmitting(false); }
  };

  const handleEscalateToDistrict = async () => {
    if (!window.confirm('Escalate this problem to Higher Authority (District Department)?')) return;
    try {
      setSubmitting(true);
      setError('');
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, {
        status: 'Escalated',
        action: 'ESCALATE_TO_HIGHER_AUTHORITY',
        currentLevel: 'BLOCK'
      });
      const updated = res?.data?.data || res?.data || { ...problem, status: 'Escalated' };
      if (onUpdateProblem) onUpdateProblem(updated);
      setSuccess('Problem escalated to Higher Authority (District Department).');
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to escalate to District');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#007A61]/10 text-[#007A61]">{problem.challengeId}</span>
            <span className="text-xs font-black text-slate-900 truncate max-w-md">{problem.title}</span>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {error && (<div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>)}
          {success && (<div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /><span>{success}</span></div>)}

          <div>
            <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Grievance Statement</h4>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">{problem.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Gram Panchayat / Area</span>
              <p className="font-extrabold text-slate-900 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /><span>{problem.location?.panchayatOrWard || problem.assignedDepartment?.panchayat || 'Block Area'}</span></p>
              <p className="text-[11px] text-slate-500">{problem.location?.fullAddress || problem.district || 'Ranchi'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Citizen Submitter</span>
              <p className="font-extrabold text-slate-900 flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-500" /><span>{problem.submitter?.name || 'Citizen'}</span></p>
              <p className="text-[11px] text-slate-500">{problem.submitter?.mobileNumber || 'Contact verified'}</p>
            </div>
          </div>

          {images.length > 0 && (
            <div>
              <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Evidence Photos</h4>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <a key={idx} href={img} target="_blank" rel="noreferrer" className="shrink-0"><img src={img} alt="Evidence" className="w-24 h-24 object-cover rounded-xl border border-slate-200 hover:opacity-90" /></a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons: 1. Assign to Dept/Tech, 2. Reject to Nodal, 3. Move to District, 4. Mark as Resolved */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <h4 className="text-xs font-black text-slate-900 uppercase">Block Authority Actions</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Option 1: Assign to Department / Technician */}
              <button type="button" onClick={() => { onClose(); if (onAssignToDept) onAssignToDept(problem); }} className="py-2.5 px-3 bg-[#007A61] hover:bg-[#006651] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                <Building2 className="w-3.5 h-3.5" />
                <span>Assign Dept / Tech</span>
              </button>

              {/* Option 2: Reject & Back to Nodal */}
              <button type="button" onClick={handleRejectToNodal} disabled={submitting} className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
                <Undo2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Reject to Nodal</span>
              </button>

              {/* Option 3: Move to Higher Authority (Block -> District) */}
              <button type="button" onClick={handleEscalateToDistrict} disabled={submitting} className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Move to District</span>
              </button>
            </div>

            {/* Option 4: Mark as Resolved */}
            <button type="button" onClick={handleApprove} disabled={submitting || problem.status === 'Resolved'} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-xs">
              <CheckCircle className="w-4 h-4" />
              <span>{problem.status === 'Resolved' ? 'Already Resolved' : 'Mark as Resolved on Ground'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockIssueDetailModal;
