import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export const UniversityActionModal = ({
  isOpen,
  onClose,
  challenge,
  onAssignFaculty
}) => {
  const [selectedFaculty, setSelectedFaculty] = useState('Dr. Priya Sharma');
  const [department, setDepartment] = useState('Environmental Sciences');
  const [studentLead, setStudentLead] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !challenge) return null;

  const handleSubmitAssign = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onAssignFaculty({
      challengeId: challenge.id,
      facultyName: selectedFaculty,
      department,
      studentLead,
      notes
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-slate-200 rounded-none shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 border border-slate-200">
              {challenge.id}
            </span>
            <h3 className="text-xs font-bold text-slate-900 mt-1">{challenge.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-slate-700">
          <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Domain</span>
              <p className="font-bold text-slate-900">{challenge.domain}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">District</span>
              <p className="font-bold text-slate-900">{challenge.district}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Priority</span>
              <p className="font-bold text-rose-700">{challenge.priority}</p>
            </div>
          </div>

          <form onSubmit={handleSubmitAssign} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Assign Faculty Mentor</label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900"
              >
                <option value="Dr. Priya Sharma">Dr. Priya Sharma (Prof. & Head - Environmental Sciences)</option>
                <option value="Dr. Arvind Kumar">Dr. Arvind Kumar (Assoc. Prof. - Computer Science & AI)</option>
                <option value="Prof. S. Soren">Prof. S. Soren (Civil Engineering)</option>
                <option value="Dr. Neha Verma">Dr. Neha Verma (Renewable Energy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Student Team Cohort (Optional)</label>
              <input
                type="text"
                value={studentLead}
                onChange={(e) => setStudentLead(e.target.value)}
                placeholder="e.g. Smart Aqua Team / Rahul Munda"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Remarks / Workplan Summary</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly state milestones or immediate next steps..."
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-slate-200 rounded-none text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-none text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{submitting ? 'Allocating...' : 'Confirm Allocation'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UniversityActionModal;
