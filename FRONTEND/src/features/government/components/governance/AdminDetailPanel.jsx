import React, { useState } from 'react';
import { ArrowLeft, User, ShieldCheck, Mail, Phone, MapPin, KeyRound, Eye, EyeOff, Copy, Check, Edit2, Trash2, Power } from 'lucide-react';

export const AdminDetailPanel = ({ admin, onBack, onEdit, onToggleStatus, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!admin) return null;

  const isActive = admin.status === 'Active';
  const role = admin.role || 'Nodal Officer';
  const primaryRole = admin.primaryRole || 'District Nodal Lead';
  const targetId = admin.id || admin._id;

  const handleCopyPassword = () => {
    if (admin.password) {
      navigator.clipboard.writeText(admin.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 select-none max-w-[1600px] mx-auto pb-10">
      {/* Top Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
            title="Back to Admin Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{admin.fullName}</h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                  {role}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {admin.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {primaryRole} &bull; {admin.assignedDepartment || 'State Administration'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onToggleStatus && onToggleStatus(targetId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isActive ? 'Suspend Access' : 'Activate Access'}</span>
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(admin)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(targetId)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Detail Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile and Roles (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Personnel & Identification</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name & Username</span>
                <p className="text-sm font-black text-slate-900">{admin.fullName}</p>
                <p className="text-xs font-mono text-slate-500">@{admin.username || admin.email?.split('@')[0]}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Contact</span>
                <div className="text-xs text-slate-700 font-medium space-y-1 mt-1">
                  <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" />{admin.email}</div>
                  <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" />{admin.mobileNumber || 'Not provided'}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jurisdiction District</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs font-bold text-slate-900">{admin.district || 'All Districts'}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Employee ID / Joined</span>
                <p className="text-xs font-mono font-bold text-slate-900 mt-1">{admin.employeeId || 'GOV-ADM-REG'}</p>
                <p className="text-[11px] text-slate-500">Joined: {admin.dateOfJoining || '2026'}</p>
              </div>
            </div>

            {admin.address && (
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Official Address</span>
                <p className="text-slate-700 font-medium">{admin.address}</p>
              </div>
            )}
          </div>

          {/* Scope and Permissions Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Jurisdiction & Scope</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Access Level</span>
                <span className="font-extrabold text-slate-900">{admin.accessLevel || 'State Wide Access'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Department</span>
                <span className="font-extrabold text-slate-900">{admin.assignedDepartment || 'General Governance'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials and Security Card (1 col) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              <span>Portal Access Credentials</span>
            </h2>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Login Identity</span>
              <p className="font-mono font-bold text-slate-900 text-xs break-all">{admin.email}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Administrative Key</span>
                {admin.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Reveal'}</span>
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono font-bold text-slate-900 text-xs">
                  {admin.password ? (showPassword ? admin.password : '••••••••••••') : 'Encrypted on server'}
                </p>
                {admin.password && (
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
                    title="Copy Password"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-medium">
              Administrative credentials are managed under Jharkhand State Data Security policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailPanel;
