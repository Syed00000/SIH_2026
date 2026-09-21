import React from 'react';
import { Building2 } from 'lucide-react';

export const DepartmentIdentitySection = ({ formData, handleChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">1. Department Identity</h3>
        </div>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Department / Ministry Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Department of Rural Development"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Department Code / Unique ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            placeholder="e.g. RDD-JH-001"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 uppercase font-mono font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Parent Administrative Authority
          </label>
          <input
            type="text"
            disabled
            value={formData.parentAuthority}
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs font-medium cursor-not-allowed"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Official Department Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="headEmail"
            placeholder="dept@jharkhand.gov.in"
            value={formData.headEmail}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Office Secretariat Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="officeAddress"
            rows={2}
            placeholder="e.g. Project Bhawan, Dhurwa, Ranchi"
            value={formData.officeAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
          />
        </div>
      </div>
    </div>
  );
};
