import React, { useState, useEffect } from 'react';
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
  Building2,
  Edit2,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { adminService } from '../../services/adminService.js';

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

export const AdminViewModal = ({ isOpen, onClose, admin, onAdminUpdated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);

  const [currentAdmin, setCurrentAdmin] = useState(admin);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showEditPass, setShowEditPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (admin) {
      setCurrentAdmin(admin);
      setEditEmail(admin.email || '');
      setEditPassword('');
      setConfirmPassword('');
      setIsEditingCredentials(false);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [admin, isOpen]);

  if (!isOpen || !currentAdmin) return null;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const hasPlainPassword = Boolean(currentAdmin.password);
  const loginPassword = currentAdmin.password || '';
  const adminId = currentAdmin.id || currentAdmin._id;
  const statusStyle = getStatusStyle(currentAdmin.status);

  const handleSaveCredentials = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!editEmail.trim() || !editEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    if (editPassword.trim()) {
      if (editPassword.length < 6) {
        setErrorMsg('Password must be at least 6 characters');
        return;
      }
      if (editPassword !== confirmPassword) {
        setErrorMsg('New password and confirm password do not match');
        return;
      }
    }

    try {
      setSaving(true);
      const payload = {
        email: editEmail.trim().toLowerCase()
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const updated = await adminService.updateAdmin(adminId, payload);
      const merged = { ...currentAdmin, ...payload, ...(updated || {}) };
      if (payload.password) {
        merged.password = payload.password;
      }
      setCurrentAdmin(merged);
      setSuccessMsg('Credentials updated successfully!');
      setIsEditingCredentials(false);
      setEditPassword('');
      setConfirmPassword('');
      if (onAdminUpdated) {
        onAdminUpdated(merged);
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to update credentials';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3">
      {/* Compact Dialog Container */}
      <div className="bg-white rounded-md max-w-[420px] w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        
        {/* Header */}
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

        {/* Content Body */}
        <div className="p-4 space-y-3.5 text-xs overflow-y-auto max-h-[80vh]">
          
          {/* Identity Row */}
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {currentAdmin.fullName
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
                  {currentAdmin.fullName}
                </h4>
                <span className={`text-[11px] shrink-0 ${getRoleTextStyle(currentAdmin.role)}`}>
                  {currentAdmin.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">{currentAdmin.email}</p>
            </div>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-[11px] font-semibold flex items-center space-x-1.5 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[11px] font-semibold flex items-center space-x-1.5 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Credentials Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-800">Login Credentials</span>
              </div>
              {!isEditingCredentials ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingCredentials(true);
                    setEditEmail(currentAdmin.email || '');
                    setEditPassword('');
                    setConfirmPassword('');
                    setErrorMsg('');
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change Email / Password</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingCredentials(false);
                    setErrorMsg('');
                  }}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditingCredentials ? (
              /* Inline Edit Form */
              <form onSubmit={handleSaveCredentials} className="bg-slate-50 border border-blue-200 rounded p-3 space-y-2.5">
                <div>
                  <label className="text-[10px] text-slate-600 font-bold block mb-1">
                    Login Email / ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    placeholder="e.g., admin@gov.in"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-600 font-bold block mb-1">
                    New Password <span className="text-slate-400 font-normal">(Leave blank to keep unchanged)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPass ? 'text' : 'password'}
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 pr-8 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPass(!showEditPass)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showEditPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {editPassword.trim().length > 0 && (
                  <div>
                    <label className="text-[10px] text-slate-600 font-bold block mb-1">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showEditPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                )}

                <div className="pt-1 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setIsEditingCredentials(false);
                      setErrorMsg('');
                    }}
                    className="px-2.5 py-1 rounded text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-3 py-1 rounded text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Save Credentials</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* View Credentials */
              <>
                {/* Email Field */}
                <div>
                  <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
                    Login Email / ID
                  </label>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
                    <span className="font-mono text-[11px] font-semibold text-slate-800 truncate mr-2 select-all">
                      {currentAdmin.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentAdmin.email, 'email')}
                      className="text-slate-400 hover:text-slate-900 transition-colors p-0.5 cursor-pointer shrink-0"
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
                    {hasPlainPassword ? (
                      <>
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
                            className="text-slate-400 hover:text-slate-900 transition-colors p-0.5 cursor-pointer"
                            title="Copy Password"
                          >
                            {copiedField === 'password' ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 italic">
                        Encrypted (Click Edit below to reset)
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Details List */}
          <div className="divide-y divide-slate-100 pt-1 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Contact Number</span>
              </span>
              <span className="font-semibold text-slate-800 font-mono text-[11px]">{currentAdmin.mobileNumber || '—'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Assigned District</span>
              </span>
              <span className="font-semibold text-slate-800 text-[11px]">{currentAdmin.district || 'All Districts'}</span>
            </div>

            {currentAdmin.assignedDepartment && (
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Department</span>
                </span>
                <span className="font-semibold text-slate-800 text-[11px]">{currentAdmin.assignedDepartment}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Last Login</span>
              </span>
              <span className="font-medium text-slate-600 text-[11px]">{currentAdmin.lastLogin || 'Never logged in'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center space-x-1.5 font-medium text-[11px]">
                <ShieldCheck className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Account Status</span>
              </span>
              <span className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${statusStyle.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                <span>{currentAdmin.status}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">
            ID: {(adminId || '').slice(0, 12)}...
          </span>
          <div className="flex items-center space-x-2">
            {!isEditingCredentials && (
              <button
                type="button"
                onClick={() => {
                  setIsEditingCredentials(true);
                  setEditEmail(currentAdmin.email || '');
                  setEditPassword('');
                  setConfirmPassword('');
                  setErrorMsg('');
                }}
                className="px-2.5 py-1 rounded text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Change Email / Password
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewModal;
