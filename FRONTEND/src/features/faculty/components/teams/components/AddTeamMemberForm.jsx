import React from 'react';
import { UserPlus } from 'lucide-react';

export const AddTeamMemberForm = ({
  newMember,
  setNewMember,
  onAddMember
}) => {
  return (
    <form onSubmit={onAddMember} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
        <UserPlus className="w-3.5 h-3.5 text-[#007A61]" />
        <span>Recruit New Student Innovator</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Student Full Name *</label>
          <input
            type="text"
            required
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            placeholder="e.g. Ankit Sharma"
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Roll Number / Registration ID</label>
          <input
            type="text"
            value={newMember.rollNo}
            onChange={(e) => setNewMember({ ...newMember, rollNo: e.target.value })}
            placeholder="e.g. 21BTECH042"
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Academic Department</label>
          <select
            value={newMember.department}
            onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
          >
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Water Resources & Hydrology">Water Resources & Hydrology</option>
            <option value="Civil & Environmental Engineering">Civil & Environmental Engineering</option>
            <option value="Electrical & Electronics">Electrical & Electronics</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Applied Chemistry & Materials">Applied Chemistry & Materials</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Technical Project Role</label>
          <input
            type="text"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            placeholder="e.g. IoT Firmware Lead"
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
          />
        </div>

        <div className="sm:col-span-2 flex items-center space-x-2 pt-1">
          <input
            type="checkbox"
            id="isLeadCheck"
            checked={newMember.isLead}
            onChange={(e) => setNewMember({ ...newMember, isLead: e.target.checked })}
            className="rounded text-[#007A61] focus:ring-[#007A61] cursor-pointer"
          />
          <label htmlFor="isLeadCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
            Designate this student as <strong>Student Team Leader</strong>
          </label>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add to Team Roster</span>
        </button>
      </div>
    </form>
  );
};

export default AddTeamMemberForm;
