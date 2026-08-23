import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Lock, Eye, EyeOff, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ResetPassword = ({ emailQuery, onNavigate }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(emailQuery || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!email && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mailParam = params.get('email');
      if (mailParam) setEmail(mailParam);
    }
  }, [emailQuery]);

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'None', width: '0%', color: 'bg-slate-200' };
    if (pass.length < 6) return { label: 'Weak', width: '33%', color: 'bg-red-500' };
    if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
      return { label: 'Medium', width: '66%', color: 'bg-amber-500' };
    }
    return { label: 'Strong', width: '100%', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim() || !newPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await resetPassword(email.trim(), otp.trim(), newPassword);
      setSuccessMessage('Password reset successfully! You can now log in.');
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('/login');
        } else {
          window.location.href = '/login';
        }
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Password reset failed';
      if (msg === 'INVALID_OTP') {
        setErrorMessage('Invalid 6-digit OTP code.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 mb-3 shadow-md shadow-emerald-500/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Reset Your Password</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Enter the 6-digit OTP sent to your email along with your new password.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-600 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">6-Digit Reset OTP *</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-600 text-sm text-center font-mono font-bold tracking-widest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">New Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 pr-10 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-600 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength bar */}
            <div className="mt-2">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 font-medium">Strength:</span>
                <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: passwordStrength.width }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-600 text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 mt-4 text-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Resetting Password...</span>
              </span>
            ) : (
              <>
                <span>Reset Password & Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
