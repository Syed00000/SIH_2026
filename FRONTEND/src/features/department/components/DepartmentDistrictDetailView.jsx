import React from 'react';
import { ArrowLeft, Trash2, Copy, Check } from 'lucide-react';
import { getJurisdictionValue } from './departmentDistricts.helper.js';
import { DepartmentDistrictStatsGrid } from './DepartmentDistrictStatsGrid.jsx';
import { DepartmentDistrictDetailCards } from './DepartmentDistrictDetailCards.jsx';

export const DepartmentDistrictDetailView = ({
  dist,
  setViewingDistrict,
  isBlockDept,
  isDistrictDept,
  visiblePasswords,
  togglePasswordVisibility,
  copiedKey,
  handleCopy,
  deletingId,
  handleDelete,
  getSectionTitle
}) => {
  const targetId = dist.deptId || dist.id || dist._id;
  const loginEmail = dist.headEmail || dist.credentials?.loginEmail || dist.credentials?.loginId || '-';
  const districtSecret = dist.credentials?.password || dist.credentials?.generatedPassword || '-';
  const isPasswordVisible = visiblePasswords[`detail-${targetId}`] || false;
  const isInactive = dist.status === 'Inactive' || dist.status === 'Suspended';
  const jurisdictionValue = getJurisdictionValue(dist, isBlockDept, isDistrictDept);

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      {/* Top Navigation & Action Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewingDistrict(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#0f4b3a] hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
            title="Return to list"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {getSectionTitle()}</span>
          </button>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-black text-slate-900 leading-tight">{dist.name}</h1>
              <span className="text-[10px] font-mono font-bold text-[#0f4b3a] bg-[#0f4b3a]/10 px-2 py-0.5 rounded-lg border border-[#0f4b3a]/20">
                {dist.code || dist.deptId || 'DEPT-ID'}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${
                  !isInactive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${!isInactive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span>{!isInactive ? 'Active' : 'Inactive'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {dist.category || (isBlockDept ? 'Ward Commissioner Office' : isDistrictDept ? 'Block / Tehsil Office' : 'District Level Department')} • {jurisdictionValue}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() =>
              handleCopy(
                `Department: ${dist.name}\nID: ${dist.code || dist.deptId}\nLogin ID: ${loginEmail}\nPassword: ${districtSecret}\nJurisdiction: ${jurisdictionValue}`,
                'all-creds'
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            {copiedKey === 'all-creds' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'all-creds' ? 'Credentials Copied' : 'Copy Credentials'}</span>
          </button>
          <button
            type="button"
            disabled={deletingId === targetId}
            onClick={(e) => handleDelete(e, dist)}
            className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <DepartmentDistrictStatsGrid
        dist={dist}
        jurisdictionValue={jurisdictionValue}
        isInactive={isInactive}
      />

      {/* Detailed Info Cards Grid */}
      <DepartmentDistrictDetailCards
        dist={dist}
        isBlockDept={isBlockDept}
        isDistrictDept={isDistrictDept}
        jurisdictionValue={jurisdictionValue}
        loginEmail={loginEmail}
        districtSecret={districtSecret}
        isPasswordVisible={isPasswordVisible}
        togglePasswordVisibility={togglePasswordVisibility}
        targetId={targetId}
        handleCopy={handleCopy}
        copiedKey={copiedKey}
      />

      {/* Bottom Back Button */}
      <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          type="button"
          onClick={() => setViewingDistrict(null)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-[#0f4b3a] hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {getSectionTitle()} List</span>
        </button>
        <span className="text-[11px] text-slate-400 font-medium">
          Viewing Profile for {dist.name} ({dist.code || dist.deptId})
        </span>
      </div>
    </div>
  );
};

export default DepartmentDistrictDetailView;
