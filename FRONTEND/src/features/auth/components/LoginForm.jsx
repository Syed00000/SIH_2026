import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Input } from '../../../shared/components/ui/input.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';
import { ShieldCheck, User } from 'lucide-react';

export const LoginForm = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fillAdminCredentials = () => {
    setEmail('admin@dtejharkhand.gov.in');
    setPassword('Admin@123456');
    setErrorMessage('');
  };

  const fillCitizenCredentials = () => {
    setEmail('citizen@joharsetu.gov.in');
    setPassword('Citizen@123456');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login(email.trim(), password);
      if (onNavigate) {
        onNavigate('/dashboard');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      const msg = error?.response?.data?.error?.message || error?.message || 'Login failed';
      if (msg === 'EMAIL_NOT_VERIFIED' || msg.includes('verify')) {
        if (onNavigate) {
          onNavigate('/verify-email', { email });
        } else {
          window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
        }
      } else if (msg === 'INVALID_CREDENTIALS') {
        setErrorMessage('Invalid email or password. Please check your credentials.');
      } else if (msg === 'ACCOUNT_SUSPENDED' || msg === 'ACCOUNT_BLOCKED') {
        setErrorMessage('Your account is currently suspended or blocked. Contact support.');
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
          <div className="flex justify-center mb-2">
            <img
              src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
              alt="Government of Jharkhand"
              className="w-12 h-12 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">JoharSetu Portal</CardTitle>
          <CardDescription className="text-slate-500 text-sm mt-1">
            Sign in to your societal innovation portal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Demo Access Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Quick Demo Access:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="inline-flex items-center font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded text-[11px] hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                Admin
              </button>
              <button
                type="button"
                onClick={fillCitizenCredentials}
                className="inline-flex items-center font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-[11px] hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <User className="w-3 h-3 mr-1" />
                Citizen
              </button>
            </div>
          </div>

          {errorMessage && (
            <Alert variant="error" title="Login Failed">
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900 font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate ? onNavigate('/forgot-password') : (window.location.href = '/forgot-password')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900 pr-12 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-xs text-slate-600 font-medium">Remember me for 30 days</span>
              </label>
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-2.5 rounded-md text-sm font-semibold mt-2"
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/register') : (window.location.href = '/register')}
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
