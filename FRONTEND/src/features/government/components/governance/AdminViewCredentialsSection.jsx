import React from 'react';
import { KeyRound, Edit2, Eye, EyeOff, Copy, Check, Loader2 } from 'lucide-react';
import { MASKED_CREDENTIAL } from './adminViewStyles.helper.js';

export const AdminViewCredentialsSection = ({
  currentAdmin,
  isEditingCredentials,
  setIsEditingCredentials,
  editEmail,
  setEditEmail,
  editPassword,
  setEditPassword,
  confirmPassword,
  setConfirmPassword,
  showEditPass,
  setShowEditPass,
  saving,
  handleSaveCredentials,
  setErrorMsg,
  handleCopy,
  copiedField,
  hasPlainPassword,
  loginPassword,
  showPassword,
  setShowPassword
}) => {
  return (
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
                    {showPassword ? loginPassword : MASKED_CREDENTIAL}
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
  );
};

export default AdminViewCredentialsSection;
