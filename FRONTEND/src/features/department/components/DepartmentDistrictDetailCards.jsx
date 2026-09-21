import React from 'react';
import { Building2, IndianRupee } from 'lucide-react';
import { DepartmentDistrictCredentialsCard } from './DepartmentDistrictCredentialsCard.jsx';
import { DepartmentDistrictContactsCard } from './DepartmentDistrictContactsCard.jsx';

export const DepartmentDistrictDetailCards = ({
  dist,
  isBlockDept,
  isDistrictDept,
  jurisdictionValue,
  loginEmail,
  districtSecret,
  isPasswordVisible,
  togglePasswordVisibility,
  targetId,
  handleCopy,
  copiedKey
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Card 1: Department Identity & Scope */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-[#0f4b3a]/10 text-[#0f4b3a] flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Administrative Profile & Scope</h2>
            <p className="text-[10.5px] text-slate-400">Official department records and functional scope</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Official Name</span>
              <p className="font-extrabold text-slate-900">{dist.name}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Department Code / ID</span>
              <p className="font-mono font-bold text-[#0f4b3a]">{dist.code || dist.deptId || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Administrative Level</span>
              <p className="font-bold text-slate-800">
                {dist.category || (isBlockDept ? 'Ward Office' : isDistrictDept ? 'Block / Tehsil Office' : 'District Department')}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Coverage Territory</span>
              <p className="font-bold text-slate-800">{jurisdictionValue}</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Mandate & Responsibilities</span>
            <p className="text-slate-700 leading-relaxed text-[11.5px]">
              {dist.description ||
                `Authorized local administrative wing responsible for executing state directives, maintaining public civic infrastructure, supervising field operations, and addressing citizen grievances across ${jurisdictionValue}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Card 2: Portal Authentication Credentials */}
      <DepartmentDistrictCredentialsCard
        loginEmail={loginEmail}
        districtSecret={districtSecret}
        isPasswordVisible={isPasswordVisible}
        togglePasswordVisibility={togglePasswordVisibility}
        targetId={targetId}
        handleCopy={handleCopy}
        copiedKey={copiedKey}
      />

      {/* Card 3: In-Charge Officer & Direct Contacts */}
      <DepartmentDistrictContactsCard
        dist={dist}
        loginEmail={loginEmail}
        handleCopy={handleCopy}
        copiedKey={copiedKey}
      />

      {/* Card 4: Financial Governance */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Fund Allocation & Governance</h2>
            <p className="text-[10.5px] text-slate-400">Budget pool & financial delegation</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Allocated Fund Pool</span>
              <div className="text-xl font-black text-[#0f4b3a]">
                ₹ {(Number(dist.allocatedFundPool) || 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[10.5px] text-emerald-700 font-medium">State Budget Pool</span>
            </div>
            <span className="px-3 py-1 bg-white text-emerald-800 font-extrabold text-xs rounded-xl border border-emerald-200 shadow-2xs">
              Active Pool
            </span>
          </div>

          <p className="text-slate-500 text-[11px] leading-relaxed">
            Funds are disbursed for quick-response civic problem resolution, procurement of maintenance materials, and emergency technician dispatch within this department's jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDistrictDetailCards;
