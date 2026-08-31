import React from 'react';
import { Building, GraduationCap } from 'lucide-react';

export const InstitutionalTargetingCard = ({
  verificationStatus,
  isUniversityTargetMode,
  universities = [],
  selectedUniCode,
  setSelectedUniCode,
  targetDepartment,
  setTargetDepartment,
  acceptanceStatus,
  setAcceptanceStatus
}) => {
  if (verificationStatus !== 'Verified') return null;

  return (
    <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-lg space-y-3">
      <div className="flex items-center space-x-2">
        <GraduationCap className="w-4 h-4 text-[#047857]" />
        <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
          2. Target Higher Education Institute (HEI) Allocation
        </label>
      </div>

      <div>
        <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
          Assign Primary Higher Education Institute
        </label>
        <select
          value={selectedUniCode}
          onChange={(e) => setSelectedUniCode(e.target.value)}
          disabled={isUniversityTargetMode}
          className="w-full border border-slate-200 rounded-md p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 cursor-pointer disabled:bg-slate-100"
        >
          <option value="">— Select University from Directory —</option>
          {universities.map((u) => (
            <option key={u.code || u.aisheCode} value={u.code || u.aisheCode}>
              {u.name} ({u.code || u.aisheCode}) - {u.district || 'Jharkhand'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
            Recommended Department / R&D Cell
          </label>
          <input
            type="text"
            placeholder="e.g., Dept of Water Engineering / AI Lab"
            value={targetDepartment}
            onChange={(e) => setTargetDepartment(e.target.value)}
            className="w-full border border-slate-200 rounded-md p-2 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
            Institutional Acceptance Status
          </label>
          <select
            value={acceptanceStatus}
            onChange={(e) => setAcceptanceStatus(e.target.value)}
            className="w-full border border-slate-200 rounded-md p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="Pending Review">Pending Review</option>
            <option value="Accepted">Accepted by HEI</option>
            <option value="Declined">Declined by HEI</option>
            <option value="Clarification Requested">Clarification Requested</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalTargetingCard;
