import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, MapPin, User, Wrench, ShieldAlert, Undo2 } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';

export const WardProblemDetailModal = ({ isOpen, challenge, onClose, onUpdated, onAssignTechnician }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen || !challenge) return null;

  const targetId = challenge.challengeId || challenge.id || challenge._id;
  const tech = challenge.assignedTechnician;

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      setError('');
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, {
        status: 'Resolved',
        remarks: 'Approved by Ward Councillor. Problem resolved.'
      });
      const updated = res?.data?.data || res?.data;
      if (onUpdated) onUpdated(updated);
      setSuccess('Problem approved and marked as resolved.');
      setTimeout(() => { onClose(); }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to approve');
    } finally { setSubmitting(false); }
  };

  const handleRejectToNodal = async () => {
    const reason = window.prompt('Enter reason for returning problem to Nodal Officer:', 'Problem does not fall under this Ward jurisdiction / requires re-triage');
    if (reason === null) return;
    try {
      setSubmitting(true);
      setError('');
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, {
        action: 'REJECT_BACK_TO_NODAL',
        rejectReason: reason.trim() || 'Rejected and returned to Nodal Officer by Ward Commissioner',
        authorityName: challenge.assignedWard?.name || 'Ward Commissioner'
      });
      const updated = res?.data?.data || res?.data || { ...challenge, status: 'Under Review' };
      if (onUpdated) onUpdated(updated);
      setSuccess('Problem rejected and returned to Nodal Officer.');
      setTimeout(() => { onClose(); }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to return to Nodal');
    } finally { setSubmitting(false); }
  };

  const handleEscalateToBlock = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      const deptRes = await apiClient.get('government/departments').catch(() => null);
      const depts = deptRes?.data?.data || deptRes?.data || [];
      const blocks = depts.filter(d => d.category === 'Block / Tehsil Office');
      
      if (blocks.length === 0) {
        alert('No registered Block Offices found to escalate to.');
        setSubmitting(false);
        return;
      }
      
      const targetBlock = blocks.find(b => (b.district || '').toLowerCase() === (challenge.location?.district || '').toLowerCase()) || blocks[0];
      
      if (!window.confirm(`Escalate this problem to ${targetBlock.name}?`)) {
        setSubmitting(false);
        return;
      }

      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, {
        status: 'Escalated',
        triageRemarks: `Escalated from Ward to Block (${targetBlock.name}).`,
        assignedBlock: {
          id: targetBlock.deptId || targetBlock.id || targetBlock._id,
          blockId: targetBlock.deptId || targetBlock.id || targetBlock._id,
          name: targetBlock.name,
          level: 'Block / Tehsil Office',
          category: 'Block / Tehsil Office',
          district: targetBlock.district || challenge.district || 'Ranchi'
        }
      });
      const updated = res?.data?.data || res?.data || { ...challenge, status: 'Escalated' };
      if (onUpdated) onUpdated(updated);
      setSuccess(`Problem escalated to ${targetBlock.name}.`);
      setTimeout(() => { onClose(); }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to escalate to Block');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">[{challenge.challengeId}]</span>
              <h2 className="text-sm font-black text-slate-900 leading-none">{challenge.title}</h2>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{challenge.domain} • Priority: {challenge.priority || 'Medium'}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
          {error && (<div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>)}
          {success && (<div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>{success}</span></div>)}

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Problem Statement</span>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">{challenge.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
              <p className="font-bold text-slate-800 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{challenge.location?.address || challenge.location?.district || 'Ward Area'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Citizen Submitter</span>
              <p className="font-bold text-slate-800 flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" />{challenge.submitter?.name || 'Local Citizen'}</p>
            </div>
          </div>

          {/* Assigned Technician Status */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Field Technician</span>
                {tech?.name ? (
                  <span className="font-bold text-slate-800">{tech.name} ({tech.specialization || 'Field Tech'})</span>
                ) : (<span className="text-amber-700 italic font-medium">No technician assigned yet</span>)}
              </div>
            </div>
            {onAssignTechnician && (
              <button type="button" onClick={() => onAssignTechnician(challenge)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] cursor-pointer">
                {tech?.name ? 'Change Tech' : 'Assign Tech'}
              </button>
            )}
          </div>

          {/* Remediation Action Options */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Ward Authority Actions</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Option 1: Assign to Technician */}
              <button type="button" onClick={() => onAssignTechnician && onAssignTechnician(challenge)} className="py-2.5 px-3 bg-[#007A61] hover:bg-[#006651] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                <Wrench className="w-3.5 h-3.5" />
                <span>{tech?.name ? 'Change Tech' : 'Assign Tech'}</span>
              </button>

              {/* Option 2: Reject & Back to Nodal */}
              <button type="button" onClick={handleRejectToNodal} disabled={submitting} className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
                <Undo2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Reject to Nodal</span>
              </button>

              {/* Option 3: Move to Higher Authority (Ward -> Block) */}
              <button type="button" onClick={handleEscalateToBlock} disabled={submitting} className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Move to Block</span>
              </button>
            </div>

            {/* Option 4: Approve (Mark as Resolved) */}
            <button type="button" onClick={handleApprove} disabled={submitting || challenge.status === 'Resolved'} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>{challenge.status === 'Resolved' ? 'Already Resolved' : 'Approve (Mark as Resolved)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardProblemDetailModal;
