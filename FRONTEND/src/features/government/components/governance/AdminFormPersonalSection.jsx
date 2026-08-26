import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const AdminFormPersonalSection = ({ form, onChange, isEdit = false }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <div className="space-y-2.5 select-none">
      <h4 className="font-bold text-slate-900 text-xs tracking-tight">Personal Information</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter full name"
            value={form.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            required
            className="w-full px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={form.username}
            onChange={(e) => onChange('username', e.target.value)}
            required
            className="w-full px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Email ID <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
            className="w-full px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter phone number"
            value={form.mobileNumber}
            onChange={(e) => onChange('mobileNumber', e.target.value)}
            required
            className="w-full px-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          />
        </div>

        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Password {!isEdit && <span className="text-red-500">*</span>}
          </label>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => onChange('password', e.target.value)}
            className="w-full px-3 py-1.5 pr-8 bg-slate-50/60 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-2.5 top-6 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Confirm Password {!isEdit && <span className="text-red-500">*</span>}
          </label>
          <input
            type={showConfirmPass ? 'text' : 'password'}
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            className="w-full px-3 py-1.5 pr-8 bg-slate-50/60 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-2.5 top-6 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFormPersonalSection;
