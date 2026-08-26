import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Phone, MapPin, Calendar, Clock, User, KeyRound, Eye, EyeOff, Copy, Check } from 'lucide-react';

export const AdminViewModal = ({ isOpen, onClose, admin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !admin) return null;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const loginPassword = admin.password || 'Admin@Jharkhand2026!';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Administrator Profile</h3>
              <p className="text-[11px] text-slate-500 font-medium">Access details and credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Main User Banner */}
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-base font-bold shadow-xs">
              {admin.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                {admin.fullName}
              </h4>
              <p className="text-xs text-slate-500 font-mono truncate mt-0.5">{admin.email}</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-100/70 text-blue-700 text-[10px] font-bold rounded-md">
                {admin.role}
              </span>
            </div>
          </div>

          {/* Credentials Box */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-2.5 text-xs">
            <span className="font-bold text-slate-900 text-[11px] flex items-center space-x-1.5 border-b border-blue-200/60 pb-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Login Credentials</span>
            </span>

            {/* Email */}
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Login Email / Username</span>
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-blue-200">
                <span className="font-mono font-bold text-slate-800 text-[11px] truncate mr-2">{admin.email}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(admin.email, 'email')}
                  className="text-slate-400 hover:text-blue-600 p-0.5 cursor-pointer shrink-0"
                  title="Copy Email"
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Password</span>
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-blue-200">
                <span className="font-mono font-bold text-slate-800 text-[11px] tracking-wider">
                  {showPassword ? loginPassword : '••••••••••••'}
                </span>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(loginPassword, 'password')}
                    className="text-slate-400 hover:text-blue-600 p-0.5 cursor-pointer"
                  >
                    {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Number</span>
              </span>
              <span className="font-bold text-slate-900">{admin.mobileNumber}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Assigned District</span>
              </span>
              <span className="font-bold text-slate-900">{admin.district}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Last Login Session</span>
              </span>
              <span className="font-medium text-slate-700">{admin.lastLogin}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Status</span>
              </span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                  admin.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : admin.status === 'Suspended'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {admin.status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewModal;
