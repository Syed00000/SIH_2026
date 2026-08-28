import React, { useState } from 'react';
import { X, Loader2, Edit3 } from 'lucide-react';

export const ProjectEditModal = ({ isOpen, onClose, project, onUpdate }) => {
  const [progress, setProgress] = useState(project?.progressPercentage || 64);
  const [status, setStatus] = useState(project?.status || 'In Progress');
  const [leadMentor, setLeadMentor] = useState(project?.leadMentor || 'Dr. Priya Sharma');
  const [budget, setBudget] = useState(project?.budget || '₹ 75,000');
  const [milestonesDone, setMilestonesDone] = useState(project?.milestonesCompleted || 3);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate({
      ...project,
      progressPercentage: Number(progress),
      status,
      leadMentor,
      facultyMentor: { name: leadMentor, department: project.facultyMentor?.department || 'Engineering' },
      budget,
      milestonesCompleted: Number(milestonesDone)
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 select-none backdrop-blur-xs">
      <div className="bg-white border border-slate-200 w-full max-w-md shadow-xl overflow-hidden rounded-none">
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Edit Project & Assign Mentor</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <div className="text-xs font-bold text-slate-900 mb-0.5">{project.title}</div>
            <div className="text-[10px] text-slate-500 font-mono">ID: {project.projectId}</div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Lead Faculty Mentor (Reassign / Remove)
            </label>
            <input
              type="text"
              value={leadMentor}
              onChange={(e) => setLeadMentor(e.target.value)}
              placeholder="e.g. Dr. Amit Singh (or Unassigned)"
              className="w-full p-2 border border-slate-200 text-xs focus:border-slate-900 focus:outline-none rounded-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Overall Progress ({progress}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full cursor-pointer accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Project Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-slate-200 text-xs focus:border-slate-900 focus:outline-none rounded-none cursor-pointer"
              >
                <option value="In Progress">In Progress</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Milestones Completed</label>
              <input
                type="number"
                min="0"
                max={project.milestonesTotal || 7}
                value={milestonesDone}
                onChange={(e) => setMilestonesDone(e.target.value)}
                className="w-full p-2 border border-slate-200 text-xs focus:border-slate-900 focus:outline-none rounded-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Allocated Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-2 border border-slate-200 text-xs focus:border-slate-900 focus:outline-none rounded-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer rounded-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs rounded-none"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEditModal;
