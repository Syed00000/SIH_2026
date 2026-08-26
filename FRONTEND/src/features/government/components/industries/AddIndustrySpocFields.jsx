import React from 'react';

export const AddIndustrySpocFields = ({ formData, onChange, errors = {} }) => {
  return (
    <div className="space-y-3.5 select-none">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1.5">
        2. Nodal Officer (SPOC)
      </h4>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            SPOC Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.spocName}
            onChange={(e) => onChange('spocName', e.target.value)}
            placeholder="e.g., Rajesh Sharma"
            className={`w-full bg-slate-50/60 border ${
              errors.spocName ? 'border-red-500' : 'border-slate-200'
            } rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.spocName && <p className="text-[11px] text-red-500 mt-0.5">{errors.spocName}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => onChange('designation', e.target.value)}
            placeholder="e.g., Head CSR & Partnerships"
            className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Official Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.officialEmail}
            onChange={(e) => onChange('officialEmail', e.target.value)}
            placeholder="spoc@company.com"
            className={`w-full bg-slate-50/60 border ${
              errors.officialEmail ? 'border-red-500' : 'border-slate-200'
            } rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.officialEmail && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.officialEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => onChange('mobileNumber', e.target.value)}
            placeholder="+91 9876543210"
            className={`w-full bg-slate-50/60 border ${
              errors.mobileNumber ? 'border-red-500' : 'border-slate-200'
            } rounded-md px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.mobileNumber && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.mobileNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddIndustrySpocFields;
