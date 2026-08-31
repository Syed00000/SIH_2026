import React, { useState, useEffect } from 'react';
import { X, Loader2, Edit3, UserCheck } from 'lucide-react';

export const ProjectEditModal = ({ isOpen, onClose, project, onUpdate }) => {
  const [status, setStatus] = useState('Proposal Stage');
  const [leadMentor, setLeadMentor] = useState('');
  const [budget, setBudget] = useState('N/A');
  const [milestonesDone, setMilestonesDone] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setStatus(project.status || 'Proposal Stage');
      setLeadMentor(project.facultyMentor?.name || project.leadMentor || '');
      setBudget(
        typeof project.budget === 'object'
          ? project.budget.total
            ? `₹ ${project.budget.total.toLocaleString('en-IN')}`
            : 'N/A'
          : (project.budget || 'N/A')
      );
      setMilestonesDone(project.milestonesCompleted || 1);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const totalMilestones = project.milestonesTotal || 7;
  const calculatedProgress = Math.round((Number(milestonesDone) / totalMilestones) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate({
      ...project,
      status,
      leadMentor: leadMentor.trim() || 'Unassigned',
      facultyMentor: leadMentor.trim()
        ? { name: leadMentor.trim(), department: project.facultyMentor?.department || 'Engineering' }
        : null,
      budget,
      milestonesCompleted: Number(milestonesDone),
      progressPercentage: calculatedProgress
    });
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200 shadow-2xs">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Edit Project Configuration</h2>
              <span className="text-[10px] text-slate-400 font-mono">ID: {project.projectId}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <div className="font-extrabold text-slate-900 text-xs truncate">{project.title}</div>
            <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">Domain: {project.domain}</div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Lead Faculty Mentor
            </label>
            <input
              type="text"
              value={leadMentor}
              onChange={(e) => setLeadMentor(e.target.value)}
              placeholder="e.g. Dr. Binod Kumar (or leave blank if unassigned)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Project Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
              >
                <option value="Proposal Stage">Proposal Stage</option>
                <option value="In Progress">In Progress (Active R&D)</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Milestones Done ({totalMilestones})</label>
              <input
                type="number"
                min="0"
                max={totalMilestones}
                value={milestonesDone}
                onChange={(e) => setMilestonesDone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Sanctioned Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. N/A or ₹ 75,000 (after Govt approval)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <span className="text-slate-600 font-semibold">Calculated Progress:</span>
            <span className="font-extrabold font-mono text-[#007A61] text-xs">
              {calculatedProgress}% ({milestonesDone} / {totalMilestones} Milestones)
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEditModal;
