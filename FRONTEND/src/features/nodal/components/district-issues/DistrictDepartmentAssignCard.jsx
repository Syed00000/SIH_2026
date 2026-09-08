import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle, AlertCircle, Send } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';
import { departmentService } from '../../../government/services/departmentService.js';

export const DistrictDepartmentAssignCard = ({ problem, onAssignSuccess }) => {
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [selectedDeptId, setSelectedDeptId] = useState(problem?.assignedDepartment?.deptId || problem?.assignedDepartment?.id || '');
  const [instructions, setInstructions] = useState(problem?.assignedDepartment?.instructions || '');
  const [priority, setPriority] = useState(problem?.priority || 'High');
  const [targetDate, setTargetDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        setLoadingDepts(true);
        const res = await departmentService.getDepartments({ limit: 100 });
        setDepartments(res?.data || (Array.isArray(res) ? res : []) || []);
      } catch (err) {
        console.warn('Failed to load departments:', err);
      } finally {
        setLoadingDepts(false);
      }
    };
    fetchDepts();
  }, []);

  const selectedDept = departments.find((d) => (d.deptId || d.id || d._id) === selectedDeptId);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedDeptId) {
      setFeedbackMsg({ type: 'error', text: 'Please select a government department.' });
      return;
    }

    try {
      setSubmitting(true);
      setFeedbackMsg({ type: '', text: '' });
      const targetId = problem.challengeId || problem.id || problem._id;
      const deptPayload = {
        id: selectedDept?.deptId || selectedDeptId,
        deptId: selectedDept?.deptId || selectedDeptId,
        name: selectedDept?.name || 'Assigned Department',
        category: selectedDept?.category || 'District Department',
        headName: selectedDept?.headName || '',
        headEmail: selectedDept?.headEmail || '',
        headRole: selectedDept?.headRole || '',
        district: selectedDept?.district || problem?.location?.district || '',
        instructions: instructions.trim(),
        targetDate: targetDate || null
      };

      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, {
        assignedDepartment: deptPayload,
        status: 'In Progress',
        priority
      });
      const updated = res?.data?.data || res?.data || { ...problem, assignedDepartment: deptPayload, priority };
      setFeedbackMsg({ type: 'success', text: `Assigned to ${deptPayload.name}! Opening Department Dashboard...` });
      if (onAssignSuccess) onAssignSuccess(updated);
      setTimeout(() => {
        window.location.href = `/department?deptId=${encodeURIComponent(deptPayload.id)}`;
      }, 900);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to assign department';
      setFeedbackMsg({ type: 'error', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3.5 text-left select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">Assign to Related Department</h3>
            <p className="text-[10px] text-slate-400 font-medium">Delegate ground civic action & resolution</p>
          </div>
        </div>
        {problem?.assignedDepartment?.name && (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
            Currently Assigned
          </span>
        )}
      </div>

      {feedbackMsg.text && (
        <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
          feedbackMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleAssign} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Select Government Department / Gram Panchayat <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              disabled={loadingDepts || submitting}
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#007A61]"
            >
              <option value="">-- Choose Department / Local Body --</option>
              {departments.map((d) => {
                const dId = d.deptId || d.id || d._id;
                return (
                  <option key={dId} value={dId}>
                    {d.name} ({d.category || 'District'} • {d.district || 'All Districts'})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-2 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {selectedDept && (
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-slate-400 font-bold uppercase text-[9.5px]">Responsible Head / Mukhiya:</span>
              <span className="font-extrabold text-slate-800">{selectedDept.headName || 'Officer in Charge'}</span>
            </div>
            {selectedDept.headEmail && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="text-slate-400 font-bold uppercase text-[9.5px]">Official Email:</span>
                <span className="font-mono text-slate-700">{selectedDept.headEmail}</span>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Directive Instructions & Action Notes</label>
          <textarea
            rows={2}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="E.g. Field inspection, water pipeline replacement, pothole patch work within deadline..."
            className="w-full p-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007A61]"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={submitting || !selectedDeptId}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#007A61] hover:bg-[#006651] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Assigning...' : problem?.assignedDepartment?.name ? 'Re-assign Department' : 'Confirm Department Assignment'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DistrictDepartmentAssignCard;
