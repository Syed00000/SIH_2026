import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Input } from '../../../shared/components/ui/input.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';

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
  }, [emailQuery, email]);

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'None', width: '0%', color: 'bg-slate-200' };
    if (pass.length < 6) return { label: 'Weak', width: '33%', color: 'bg-slate-900' };
    if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
      return { label: 'Medium', width: '66%', color: 'bg-slate-900' };
    }
    return { label: 'Strong', width: '100%', color: 'bg-slate-900' };
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
      <Card className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Reset Your Password</CardTitle>
          <CardDescription className="text-slate-500 text-sm mt-1">
            Enter the 6-digit OTP sent to your email along with your new password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {errorMessage && (
            <Alert variant="error" title="Error">
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert variant="success" title="Success">
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="focus:ring-slate-900 focus:border-slate-900"
            />

            <Input
              label="6-Digit Reset OTP *"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="text-center font-mono font-bold tracking-widest focus:ring-slate-900 focus:border-slate-900"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900 pr-12 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>

              {/* Password strength meter */}
              <div className="mt-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-500 font-medium">Strength:</span>
                  <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
              </div>
            </div>

            <Input
              label="Confirm New Password *"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="focus:ring-slate-900 focus:border-slate-900"
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-2.5 rounded-md text-sm font-semibold mt-2"
            >
              Reset Password & Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
