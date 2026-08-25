import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';
import { Eye, EyeOff, AlertCircle, Lock, Mail } from 'lucide-react';

export const LoginForm = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Field-level error validation state
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  
  // Server-level single line error message
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: '' }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: '' }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const validateForm = () => {
    const errors = { email: '', password: '' };
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Please enter your password.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      if (onNavigate) {
        onNavigate('/dashboard');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      const status = error?.response?.status || error?.status;
      const errData = error?.response?.data?.error || error?.response?.data || {};
      const rawMsg = (errData?.message || error?.message || '').toString();

      // 1. User does not exist in DB
      if (
        rawMsg === 'USER_NOT_FOUND' ||
        rawMsg.toLowerCase().includes('user not found') ||
        rawMsg.toLowerCase().includes('not exist')
      ) {
        setErrorMessage('User does not exist with this email. Please create an account.');
      }
      // 2. Invalid password / credentials mismatch
      else if (
        rawMsg === 'INVALID_CREDENTIALS' ||
        rawMsg.toLowerCase().includes('credential') ||
        rawMsg.toLowerCase().includes('password mismatch')
      ) {
        setErrorMessage('Invalid email or password. Please check your credentials.');
      }
      // 3. Email not verified
      else if (rawMsg === 'EMAIL_NOT_VERIFIED' || rawMsg.toLowerCase().includes('verify')) {
        setErrorMessage('Email is not verified yet. Redirecting to verification...');
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('/verify-email', { email: email.trim() });
          } else {
            window.location.href = `/verify-email?email=${encodeURIComponent(email.trim())}`;
          }
        }, 1200);
      }
      // 4. Account restricted / suspended
      else if (rawMsg === 'ACCOUNT_SUSPENDED' || rawMsg === 'ACCOUNT_BLOCKED') {
        setErrorMessage('This account is suspended or blocked. Please contact support.');
      }
      // 5. Account inactive
      else if (rawMsg === 'ACCOUNT_NOT_ACTIVE') {
        setErrorMessage('This account is inactive. Please contact support.');
      }
      // 6. Generic 401 Unauthorized
      else if (status === 401) {
        setErrorMessage('Invalid email or password. Please check your credentials.');
      }
      // 7. Rate limit (429)
      else if (status === 429 || rawMsg.includes('RATE_LIMIT')) {
        setErrorMessage('Too many failed attempts. Please wait a minute before retrying.');
      }
      // 8. Network / Server connection error
      else if (error.name === 'TypeError' || rawMsg.toLowerCase().includes('failed to fetch') || rawMsg.toLowerCase().includes('network')) {
        setErrorMessage('Unable to connect to server. Please check your network.');
      }
      // 9. General fallback
      else {
        setErrorMessage(rawMsg || 'Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="text-center pb-4 pt-6">
          <div className="flex justify-center mb-3">
            <img
              src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
              alt="Government of Jharkhand"
              className="w-14 h-14 object-contain drop-shadow-xs"
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">JoharSetu Portal</CardTitle>
          <CardDescription className="text-slate-500 text-xs mt-1">
            Department of Higher & Technical Education, Government of Jharkhand
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6">
          {/* Single-line sleek error banner */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium transition-all animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@example.com"
                  aria-invalid={!!fieldErrors.email || !!errorMessage}
                  className={`w-full pl-9 pr-3 py-2 text-sm text-slate-900 bg-white border rounded-md transition-all focus:outline-none focus:ring-1 font-medium ${
                    fieldErrors.email || errorMessage
                      ? 'border-red-400 focus:border-red-600 focus:ring-red-600'
                      : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="login-password"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate ? onNavigate('/forgot-password') : (window.location.href = '/forgot-password')
                  }
                  className="text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  aria-invalid={!!fieldErrors.password || !!errorMessage}
                  className={`w-full pl-9 pr-10 py-2 text-sm text-slate-900 bg-white border rounded-md transition-all focus:outline-none focus:ring-1 font-medium ${
                    fieldErrors.password || errorMessage
                      ? 'border-red-400 focus:border-red-600 focus:ring-red-600'
                      : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
                  }`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-xs text-slate-600 font-medium">Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-2.5 rounded-md text-sm font-semibold mt-2"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Footer Register Link */}
          <div className="text-center text-xs text-slate-500 font-medium pt-3 border-t border-slate-100">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('/register') : (window.location.href = '/register'))}
              className="font-bold text-slate-900 hover:underline ml-1"
            >
              Create Account
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
