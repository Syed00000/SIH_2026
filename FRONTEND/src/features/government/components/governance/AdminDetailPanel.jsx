import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  Power,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const MASKED_CREDENTIAL = '••••••••••••';

export const AdminDetailPanel = ({ admin, onBack, onEdit, onToggleStatus, onDelete }) => {
  const [activeSubTab, setActiveSubTab] = useState('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [notification, setNotification] = useState(null);

  if (!admin) return null;

  const isActive = admin.status === 'Active';
  const role = admin.role || 'Nodal Officer';
  const primaryRole = admin.primaryRole || 'District Nodal Lead';
  const targetId = admin.id || admin._id;
  const adminSecret = admin.password;

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCopy = (text, field, label) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      showToast(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Directory</span>
        </button>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (onToggleStatus) onToggleStatus(targetId);
              showToast(`Administrator status toggled.`);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs cursor-pointer transition-colors"
          >
            <Power className="w-3.5 h-3.5 text-slate-500" />
            <span>{isActive ? 'Suspend Access' : 'Activate Access'}</span>
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(admin)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-300" />
            <span>Edit Profile</span>
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(targetId)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Title & Officer Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black bg-slate-900 text-white">
            {admin.employeeId || 'GOV-ADM-REG'}
          </span>
          <span className="text-slate-500">{role}</span>
          <span>•</span>
          <span className="text-slate-700">{admin.district || 'Statewide Jurisdiction'}</span>
          <span>•</span>
          <span className={`px-2 py-0.5 rounded font-bold border ${
            isActive
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-red-700 bg-red-50 border border-red-200'
          }`}>
            Account Status: {admin.status || 'Active'}
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {admin.fullName}
        </h1>

        {/* 3-Column Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Administrative Assignment
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {admin.assignedDepartment || 'State Administration'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {primaryRole}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Jurisdiction & Access Level
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {admin.district || 'State Wide'} District
            </span>
            <span className="text-[11px] text-[#007A61] font-bold">
              {admin.accessLevel || 'Full Administrative Access'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Official Identity
            </span>
            <span className="font-mono font-bold text-slate-900 text-xs block truncate">
              {admin.email}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {admin.mobileNumber || 'No mobile linked'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('credentials')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'credentials'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>1. Portal Access Credentials</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'profile'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>2. Personnel & Scope Details</span>
        </button>
      </div>

      {/* TAB 1: CREDENTIALS */}
      {activeSubTab === 'credentials' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Official Administrator Credentials
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Credentials for Government Portal login &amp; policy access
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1 self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active Credentials ✓</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Login Email */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Login Identity / Email
                </span>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="font-mono font-bold text-slate-900 text-xs break-all">{admin.email}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(admin.email, 'email', 'Login Email')}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-2xs cursor-pointer shrink-0 transition-colors"
                    title="Copy Email"
                  >
                    {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Username: @{admin.username || admin.email?.split('@')[0]}</div>
              </div>

              {/* Password */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Administrative Key / Password
                  </span>
                  {adminSecret && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3 text-slate-500" /> : <Eye className="w-3 h-3 text-slate-500" />}
                      <span>{showPassword ? 'Hide' : 'Reveal'}</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="font-mono font-bold text-slate-900 text-xs tracking-wider">
                    {adminSecret ? (showPassword ? adminSecret : MASKED_CREDENTIAL) : 'Stored securely in database'}
                  </span>
                  {adminSecret && (
                    <button
                      type="button"
                      onClick={() => handleCopy(adminSecret, 'pass', 'Password')}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-2xs cursor-pointer shrink-0 transition-colors"
                      title="Copy Password"
                    >
                      {copiedField === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Default access key</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-[11px] text-amber-900 font-medium flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950">Security Notice:</strong> Administrative credentials are encrypted and governed under the Jharkhand State IT Security Protocol.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONNEL DETAILS */}
      {activeSubTab === 'profile' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Personnel &amp; Identification Details
              </h3>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                UID: {admin.employeeId || 'GOV-ADM'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Contact</span>
                <div className="text-xs text-slate-700 font-medium space-y-1 mt-1">
                  <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /><span>{admin.email}</span></div>
                  <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /><span>{admin.mobileNumber || 'Not provided'}</span></div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jurisdiction District</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs font-bold text-slate-900">{admin.district || 'All Districts'}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Joined: {admin.dateOfJoining || '2026'}</p>
              </div>
            </div>

            {admin.address && (
              <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Official Address</span>
                <p className="text-slate-700 font-medium">{admin.address}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDetailPanel;
