import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Wrench, ShieldAlert, Undo2, User, Phone, HardHat } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';
import { DepartmentProblemEvidence } from './DepartmentProblemEvidence.jsx';

const formatPersonName = (str) => {
  if (!str) return 'Field Technician';
  return str
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

export const DepartmentProblemActionPanel = ({ problem, department, onClose, onUpdateProblem, onAssignTechnician }) => {
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const idKey = problem.challengeId || problem.id || problem._id;
  const submitter = problem.submitter || {};
  const location = problem.location || {};
  const tech = problem.assignedTechnician;

  const citizenUrls = (problem.media || []).map((m) => m.url || m);
  const techUrls = (problem.mediaUrls || []).filter((url) => !citizenUrls.includes(url));
  const fullAddress = [location.village || problem.village, location.panchayat || problem.panchayat, location.block || problem.block, location.district || problem.district || 'Ranchi', 'Jharkhand'].filter(Boolean).join(', ');

  const deptCategory = department?.category || problem.assignedDepartment?.category || '';
  const isWard = deptCategory === 'Ward Commissioner' || deptCategory === 'Ward' || deptCategory === 'Ward Office' || deptCategory === 'Ward / Field Office' || deptCategory === 'Gram Panchayat';
  const isBlock = deptCategory === 'Block / Tehsil Office';
  const isDistrict = deptCategory === 'District Department';
  const isState = deptCategory === 'State Department';
  const isMinistry = deptCategory === 'State Ministry' || deptCategory === 'Apex Government' || deptCategory === 'Ministry';

  const currentLevel = isMinistry ? 'MINISTRY' : isState ? 'STATE' : isDistrict ? 'DISTRICT' : isBlock ? 'BLOCK' : 'WARD';
  const higherAuthorityLabel = isMinistry ? 'Move to Apex Secretariat' : isState ? 'Move to State Ministry' : isDistrict ? 'Move to State Ministry' : isBlock ? 'Move to District Department' : 'Move to Block Office';

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const targetId = problem.challengeId || problem.id || problem._id;
      const payload = { status: 'Resolved', assignedDepartment: { ...(problem.assignedDepartment || {}), status: 'Resolved', actionRemarks: 'Approved by Authority. Problem resolved.', resolvedAt: new Date() } };
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      const updated = res?.data?.data || res?.data || { ...problem, ...payload };
      setMsg({ type: 'success', text: 'Problem approved and marked as resolved.' });
      if (onUpdateProblem) onUpdateProblem(updated);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to approve.' });
    } finally { setSubmitting(false); }
  };

  const handleRejectToNodal = async () => {
    const reason = window.prompt('Enter reason for returning problem to Nodal Officer:', 'Problem does not pertain to this department jurisdiction / requires re-triage');
    if (reason === null) return;
    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const targetId = problem.challengeId || problem.id || problem._id;
      const payload = { action: 'REJECT_BACK_TO_NODAL', rejectReason: reason.trim() || 'Rejected and returned to Nodal Officer by Department Authority', authorityName: department?.name || 'Department Officer' };
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      const updated = res?.data?.data || res?.data || { ...problem, status: 'Under Review' };
      setMsg({ type: 'success', text: 'Problem rejected and returned to Nodal Officer.' });
      if (onUpdateProblem) onUpdateProblem(updated);
      setTimeout(() => { if (onClose) onClose(); }, 1200);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to return to Nodal.' });
    } finally { setSubmitting(false); }
  };

  const handleEscalate = async () => {
    if (!window.confirm(`Escalate this civic problem to higher authority (${higherAuthorityLabel})?`)) return;
    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const targetId = problem.challengeId || problem.id || problem._id;
      
      const payload = { status: 'Escalated', action: 'ESCALATE_TO_HIGHER_AUTHORITY', currentLevel };
      
      try {
        const deptRes = await apiClient.get('government/departments');
        const depts = deptRes?.data?.data || deptRes?.data || [];
        const targetDistrict = problem.location?.district || problem.district || department?.district || 'Ranchi';
        
        if (currentLevel === 'WARD') {
          const targetBlock = depts.find(d => d.category === 'Block / Tehsil Office' && (d.district || '').toLowerCase() === targetDistrict.toLowerCase()) || depts.find(d => d.category === 'Block / Tehsil Office');
          if (targetBlock) payload.assignedBlock = { id: targetBlock.deptId || targetBlock.id || targetBlock._id, blockId: targetBlock.deptId || targetBlock.id || targetBlock._id, name: targetBlock.name, level: 'Block / Tehsil Office', category: 'Block / Tehsil Office', district: targetBlock.district || targetDistrict };
        } else if (currentLevel === 'BLOCK') {
          const targetDept = depts.find(d => d.category === 'District Department' && (d.district || '').toLowerCase() === targetDistrict.toLowerCase()) || depts.find(d => d.category === 'District Department');
          if (targetDept) payload.assignedDepartment = { id: targetDept.deptId || targetDept.id || targetDept._id, deptId: targetDept.deptId || targetDept.id || targetDept._id, name: targetDept.name, level: 'District Department', category: 'District Department', district: targetDept.district || targetDistrict };
        } else if (currentLevel === 'DISTRICT' || currentLevel === 'STATE') {
          const targetState = depts.find(d => d.category === 'State Ministry' || d.category === 'State Department');
          if (targetState) payload.assignedDepartment = { id: targetState.deptId || targetState.id || targetState._id, deptId: targetState.deptId || targetState.id || targetState._id, name: targetState.name, level: targetState.category || 'State Ministry', category: targetState.category || 'State Ministry', district: targetState.district || targetDistrict };
        } else if (currentLevel === 'MINISTRY') {
          payload.assignedDepartment = { id: 'DEPT-JH-APEX', deptId: 'DEPT-JH-APEX', name: 'Apex Government / Cabinet Secretariat', level: 'Apex Government', category: 'Apex Government', district: 'Ranchi' };
        }
      } catch (err) {
        console.error('Failed to fetch dynamic department for escalation', err);
      }

      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      const updated = res?.data?.data || res?.data || { ...problem, status: 'Escalated' };
      setMsg({ type: 'success', text: `Problem escalated to ${higherAuthorityLabel}.` });
      if (onUpdateProblem) onUpdateProblem(updated);
      setTimeout(() => { if (onClose) onClose(); }, 1200);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to escalate.' });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-3.5 select-none text-left animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <button type="button" onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Problems</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{idKey}</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">{problem.domain || 'Civic Problem'}</span>
        </div>
      </div>

      {/* Problem Details & Evidence Comparison */}
      <DepartmentProblemEvidence problem={problem} submitter={submitter} fullAddress={fullAddress} techUrls={techUrls} tech={tech} />

      {/* Field Technician Info & Assignment Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-inner">
            <Wrench className="w-6 h-6 text-blue-50" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Assigned Field Technician</span>
            {tech?.name ? (
              <div className="text-xs font-bold text-slate-900 flex items-center flex-wrap gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[10.5px] font-bold border border-blue-200/60 shadow-sm">
                  {tech.technicianId || 'TECH'}
                </span>
                <span className="text-slate-900 font-extrabold text-[14px]">{formatPersonName(tech.name)}</span>
                <span className="text-slate-500 font-medium text-[11px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">• {tech.specialization || 'Field Remediation Crew'}</span>
                {tech.phone && <span className="text-slate-500 font-medium text-[11px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">📞 {tech.phone}</span>}
              </div>
            ) : (
              <span className="text-xs text-amber-600 font-medium italic mt-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> No field technician assigned yet</span>
            )}
          </div>
        </div>
        {onAssignTechnician && (
          <button 
            type="button" 
            onClick={() => onAssignTechnician(problem)} 
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all shrink-0 flex items-center justify-center gap-2 group"
          >
            <Wrench className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span>{tech?.name ? 'Reassign Technician' : 'Assign Technician'}</span>
          </button>
        )}
      </div>

      {/* Authority Actions Bar: 1. Assign Tech, 2. Reject & Back to Nodal, 3. Move to Higher Authority, 4. Approve */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col gap-1">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            Authority Remediation Actions
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">Dispatch field technicians, reject back to nodal triage, or escalate to higher hierarchy</p>
        </div>

        {msg.text && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 shadow-sm ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Option 1: Assign to Technician */}
          <button type="button" onClick={() => onAssignTechnician && onAssignTechnician(problem)} className="py-3 px-4 bg-gradient-to-b from-[#007A61] to-[#006651] hover:from-[#006651] hover:to-[#005241] text-white rounded-xl text-[13px] font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer border border-[#005241]/50">
            <Wrench className="w-4 h-4 text-white/80" />
            <span>{tech?.name ? 'Reassign Technician' : 'Assign to Technician'}</span>
          </button>

          {/* Option 2: Reject & Back to Nodal */}
          <button type="button" onClick={handleRejectToNodal} disabled={submitting || problem.status === 'Resolved'} className="py-3 px-4 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-800 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow">
            <Undo2 className="w-4 h-4 text-amber-500" />
            <span>Reject &amp; Back to Nodal</span>
          </button>

          {/* Option 3: Move to Higher Authority / State Escalation */}
          <button type="button" onClick={handleEscalate} disabled={submitting || problem.status === 'Resolved'} className="py-3 px-4 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow" title={`Escalate hierarchy: ${higherAuthorityLabel}`}>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>{higherAuthorityLabel}</span>
          </button>
        </div>

        {/* Option 4: Approve (Mark as Resolved) when resolution evidence is verified */}
        {tech?.status === 'Completed' && problem.status !== 'Resolved' && (
          <div className="pt-3 border-t border-slate-100">
            <button type="button" onClick={handleApprove} disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-[14px] font-extrabold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer border border-emerald-700/30">
              <CheckCircle2 className="w-5 h-5" />
              <span>Verify &amp; Approve (Mark as Resolved)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentProblemActionPanel;
