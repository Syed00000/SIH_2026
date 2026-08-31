import React from 'react';
import { UserPlus, FileText, Loader2, Check } from 'lucide-react';

export const ActionAssignMentorForm = ({
  challenge,
  facultyList,
  selectedFaculty,
  setSelectedFaculty,
  department,
  setDepartment,
  currentMentor,
  loadingFaculty,
  submitting,
  onViewDossier,
  onSubmit,
  onClose
}) => {
  return (
    <div className="space-y-3 pt-1">
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[#007A61] font-extrabold text-xs block">Challenge Accepted by University</span>
          <span className="text-emerald-800 text-[11px]">
            {currentMentor ? `Lead Faculty Mentor: ${currentMentor}` : 'Ready for Faculty Mentor Assignment'}
          </span>
        </div>
        <Check className="w-5 h-5 text-[#007A61]" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3 pt-1">
        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-1.5">
            Assign Registered Faculty Mentor to Lead Solution:
          </label>
          {loadingFaculty ? (
            <div className="p-2.5 text-xs text-slate-500 bg-slate-50 rounded-xl">Loading registered faculty members...</div>
          ) : (
            <select
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                const matched = facultyList.find((f) => f.name === e.target.value);
                if (matched && matched.department) {
                  setDepartment(matched.department);
                }
              }}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#007A61] shadow-2xs"
            >
              {facultyList.map((f, idx) => (
                <option key={idx} value={f.name}>
                  {f.name} &bull; {f.department || 'Applied Engineering'} ({f.designation || 'Faculty Lead'})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {onViewDossier && (
            <button
              type="button"
              onClick={() => { onClose(); onViewDossier(challenge); }}
              className="text-xs font-bold text-[#007A61] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Full Investigation Dossier & PDF</span>
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ml-auto shadow-2xs"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <UserPlus className="w-3.5 h-3.5" />
            <span>Assign Mentor</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActionAssignMentorForm;
