import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Phone,
  MapPin,
  Clock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Building2
} from 'lucide-react';

const getRoleTextStyle = (role) => {
  const map = {
    'Super Admin': 'text-purple-700 font-bold',
    'Nodal Officer': 'text-blue-700 font-bold',
    'District Admin': 'text-sky-700 font-bold',
    'HEI Admin': 'text-cyan-700 font-bold'
  };
  return map[role] || 'text-slate-700 font-semibold';
};

const getStatusStyle = (status) => {
  if (status === 'Active') {
    return { text: 'text-emerald-600', dot: 'bg-emerald-500' };
  }
  if (status === 'Suspended') {
    return { text: 'text-amber-600', dot: 'bg-amber-500' };
  }
  return { text: 'text-red-600', dot: 'bg-red-500' };
};

export const AdminViewModal = ({ isOpen, onClose, admin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !admin) return null;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const loginPassword = admin.password || 'Admin@123456';
  const statusStyle = getStatusStyle(admin.status);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3">
      {/* Compact Dialog Container */}
      <div className="bg-white rounded-md max-w-[400px] w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        
        {/* Header - Bare Icon with no background box */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 leading-tight">Administrator Profile</h3>
              <p className="text-[10px] text-slate-400 font-medium">Account overview and credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Body - Compact, Unboxed & Sharp */}
        <div className="p-4 space-y-3.5 text-xs">
          
          {/* Identity Row - Clean text role, no bulky box container */}
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {admin.fullName
                .trim()
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1.5">
                <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                  {admin.fullName}
                </h4>
                {/* Clean Role Text with NO background pill */}
                <span className={`text-[11px] shrink-0 ${getRoleTextStyle(admin.role)}`}>
                  {admin.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">{admin.email}</p>
            </div>
          </div>

          {/* Login Credentials Section - Bare Icon, No outer box */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-[11px] font-bold text-slate-800">Login Credentials</span>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
                Login Email / ID
              </label>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
                <span className="font-mono text-[11px] font-semibold text-slate-800 truncate mr-2 select-all">
                  {admin.email}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(admin.email, 'email')}
                  className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 cursor-pointer shrink-0"
                  title="Copy Email"
                >
                  {copiedField === 'email' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
                Password
              </label>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
                <span className="font-mono text-[11px] font-semibold text-slate-800 tracking-wider truncate mr-2 select-all">
                  {showPassword ? loginPassword : '••••••••••••'}
                </span>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
                    title={showPassword ? 'Hide' : 'Show'}
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(loginPassword, 'password')}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 cursor-pointer"
                    title="Copy Password"
                  >
                    {copiedField === 'password' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details List - Bare icons, clean borders, no outer card */}
          <div className="divide-y divide-slate-100 pt-1 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Contact Number</span>
              </span>
              <span className="font-semibold text-slate-800 font-mono text-[11px]">{admin.mobileNumber || '—'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Assigned District</span>
              </span>
              <span className="font-semibold text-slate-800 text-[11px]">{admin.district || 'All Districts'}</span>
            </div>

            {admin.assignedDepartment && (
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Department</span>
                </span>
                <span className="font-semibold text-slate-800 text-[11px]">{admin.assignedDepartment}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Last Login</span>
              </span>
              <span className="font-medium text-slate-600 text-[11px]">{admin.lastLogin || 'Never logged in'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
                <ShieldCheck className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Account Status</span>
              </span>
              {/* Clean Status with NO background pill box */}
              <span className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${statusStyle.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                <span>{admin.status}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer - Compact, no big curves */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">
            ID: {(admin.id || admin._id || '').slice(0, 12)}...
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewModal;
