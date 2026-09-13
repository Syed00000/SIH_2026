import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Wrench, ShieldAlert, Undo2 } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';
import { DepartmentProblemEvidence } from './DepartmentProblemEvidence.jsx';

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
  const isWard = deptCategory === 'Ward Commissioner' || deptCategory === 'Ward' || deptCategory === 'Ward Office' || deptCategory === 'Ward / Field Office';
  const isBlock = deptCategory === 'Block / Tehsil Office' || deptCategory === 'Gram Panchayat';

  const higherAuthorityLabel = isWard ? 'Move to Block Office' : (isBlock ? 'Move to District Department' : 'Move to State Ministry');
  const currentLevel = isWard ? 'WARD' : (isBlock ? 'BLOCK' : 'DISTRICT');

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
          const blocks = depts.filter(d => d.category === 'Block / Tehsil Office');
          const targetBlock = blocks.find(b => (b.district || '').toLowerCase() === targetDistrict.toLowerCase()) || blocks[0];
          if (targetBlock) {
            payload.assignedBlock = {
              id: targetBlock.deptId || targetBlock.id || targetBlock._id,
              blockId: targetBlock.deptId || targetBlock.id || targetBlock._id,
              name: targetBlock.name,
              level: 'Block / Tehsil Office',
              category: 'Block / Tehsil Office',
              district: targetBlock.district || targetDistrict
            };
          }
        } else if (currentLevel === 'BLOCK') {
          const distDepts = depts.filter(d => d.category === 'District Department');
          const targetDept = distDepts.find(d => (d.district || '').toLowerCase() === targetDistrict.toLowerCase()) || distDepts[0];
          if (targetDept) {
            payload.assignedDepartment = {
              id: targetDept.deptId || targetDept.id || targetDept._id,
              deptId: targetDept.deptId || targetDept.id || targetDept._id,
              name: targetDept.name,
              level: 'District Department',
              category: 'District Department',
              district: targetDept.district || targetDistrict
            };
          }
        } else if (currentLevel === 'DISTRICT') {
          const stateDepts = depts.filter(d => d.category === 'State Ministry');
          const targetState = stateDepts[0];
          if (targetState) {
            payload.assignedDepartment = {
              id: targetState.deptId || targetState.id || targetState._id,
              deptId: targetState.deptId || targetState.id || targetState._id,
              name: targetState.name,
              level: 'State Ministry',
              category: 'State Ministry',
              district: targetState.district || targetDistrict
            };
          }
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
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <button type="button" onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-all cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Problems</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-500">{idKey}</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#007A61]/10 text-[#007A61]">{problem.domain || 'Civic Problem'}</span>
        </div>
      </div>

      <DepartmentProblemEvidence problem={problem} submitter={submitter} fullAddress={fullAddress} techUrls={techUrls} tech={tech} />

      {/* Field Technician Info & Assignment */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Assigned Field Technician</span>
            {tech?.name ? (
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2 mt-0.5">
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10.5px]">{tech.technicianId}</span>
                <span>{tech.name}</span>
                <span className="text-slate-500 font-medium">({tech.specialization || tech.phone || 'Field Tech'})</span>
              </div>
            ) : (<span className="text-xs text-amber-700 font-medium italic">No technician assigned yet</span>)}
          </div>
        </div>
        {onAssignTechnician && (
          <button type="button" onClick={() => onAssignTechnician(problem)} className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#007A61] hover:bg-[#006651] cursor-pointer shadow-2xs transition-all shrink-0 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" />
            <span>{tech?.name ? 'Change Technician' : 'Assign to Technician'}</span>
          </button>
        )}
      </div>

      {/* Authority Actions Bar: 1. Assign Tech, 2. Reject & Back to Nodal, 3. Move to Higher Authority, 4. Approve */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3.5">
        <div className="border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">Authority Remediation Actions</h3>
          <p className="text-[10.5px] text-slate-400 font-medium">Dispatch field technicians, reject back to nodal triage, or escalate to higher hierarchy</p>
        </div>

        {msg.text && (
          <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Option 1: Assign to Technician */}
          <button type="button" onClick={() => onAssignTechnician && onAssignTechnician(problem)} className="py-2.5 px-3 bg-[#007A61] hover:bg-[#006651] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer">
            <Wrench className="w-4 h-4" />
            <span>{tech?.name ? 'Change Technician' : 'Assign to Technician'}</span>
          </button>

          {/* Option 2: Reject & Back to Nodal */}
          <button type="button" onClick={handleRejectToNodal} disabled={submitting || problem.status === 'Resolved'} className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 disabled:opacity-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Undo2 className="w-4 h-4 text-amber-600" />
            <span>Reject & Back to Nodal</span>
          </button>

          {/* Option 3: Move to Higher Authority */}
          <button type="button" onClick={handleEscalate} disabled={submitting || problem.status === 'Resolved'} className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 disabled:opacity-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer" title={`Escalate up hierarchy: ${higherAuthorityLabel}`}>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>{higherAuthorityLabel}</span>
          </button>
        </div>

        {/* Option 4: Approve (Mark as Resolved) when resolution evidence is verified */}
        {tech?.status === 'Completed' && problem.status !== 'Resolved' && (
          <div className="pt-2 border-t border-slate-100">
            <button type="button" onClick={handleApprove} disabled={submitting} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Approve (Mark as Resolved)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentProblemActionPanel;
