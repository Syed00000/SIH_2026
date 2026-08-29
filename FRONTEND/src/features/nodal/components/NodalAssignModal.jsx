import React from 'react';
import { X } from 'lucide-react';

export const NodalAssignModal = ({
  isOpen,
  onClose,
  challenge,
  assignedDept,
  setAssignedDept,
  facultyLead,
  setFacultyLead,
  onConfirm
}) => {
  if (!isOpen || !challenge) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-sm">Assign Faculty Lead & Department</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-800">{challenge.title}</p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Academic Department</label>
            <select
              value={assignedDept}
              onChange={(e) => setAssignedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Environmental Engg.">Environmental Engg.</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Agriculture Tech">Agriculture Tech</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Lead Principal Investigator (Faculty)</label>
            <input
              type="text"
              value={facultyLead}
              onChange={(e) => setFacultyLead(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Confirm Allocation
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodalAssignModal;
