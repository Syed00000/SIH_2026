import React from 'react';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Eye, EyeOff, AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';
import { useLoginForm } from './useLoginForm.js';

export const LoginFormCard = ({ onNavigate }) => {
  const {
    email,
    password,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    isSubmitting,
    fieldErrors,
    errorMessage,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit
  } = useLoginForm(onNavigate);

  return (
    <Card className="w-full max-w-md bg-white border border-slate-200 shadow-md rounded-none overflow-hidden">
      <CardHeader className="text-center pb-2.5 pt-4 px-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-center mb-1">
          <img
            src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
            alt="Government of Jharkhand"
            className="w-9 h-9 object-contain drop-shadow-xs"
          />
        </div>
        <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          JoharSetu Portal
        </CardTitle>
        <CardDescription className="text-slate-500 text-[11px] mt-0.5 font-medium">
          Department of Higher & Technical Education, Government of Jharkhand
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-5 pt-4 pb-5">
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-3 rounded-none bg-red-50 border border-red-200 text-red-800 text-xs font-medium transition-all animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-xs uppercase tracking-wider text-red-900">Login Failed</p>
              <p className="text-xs text-red-700 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="login-email"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              Email ID / Username / Mobile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4 stroke-[2]" />
              </div>
              <input
                id="login-email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@example.com or username"
                aria-invalid={!!fieldErrors.email || !!errorMessage}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-white border rounded-none transition-all focus:outline-none placeholder:text-slate-400 placeholder:font-normal shadow-2xs ${
                  fieldErrors.email || errorMessage
                    ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-300 hover:border-slate-400 focus:border-[#007A61] focus:ring-2 focus:ring-[#007A61]/15'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="login-password"
                className="text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  onNavigate ? onNavigate('/forgot-password') : (window.location.href = '/forgot-password')
                }
                className="text-xs font-bold text-[#007A61] hover:text-[#005a47] hover:underline transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4 stroke-[2]" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                aria-invalid={!!fieldErrors.password || !!errorMessage}
                className={`w-full pl-10 pr-11 py-2.5 text-sm font-semibold text-slate-900 bg-white border rounded-none transition-all focus:outline-none placeholder:text-slate-400 placeholder:font-normal shadow-2xs ${
                  fieldErrors.password || errorMessage
                    ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-300 hover:border-slate-400 focus:border-[#007A61] focus:ring-2 focus:ring-[#007A61]/15'
                }`}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800 transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-none border-slate-300 text-[#007A61] focus:ring-[#007A61] cursor-pointer"
              />
              <span className="text-xs text-slate-700 font-semibold">Stay signed in for 30 days</span>
            </label>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full py-2.5 bg-[#007A61] hover:bg-[#009677] active:bg-[#00604d] text-white text-sm font-bold flex items-center justify-center gap-2 rounded-none shadow-md shadow-[#007A61]/20 hover:shadow-lg hover:shadow-[#009677]/30 mt-2 cursor-pointer transition-all duration-200 group"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 font-medium pt-3 border-t border-slate-100 space-y-2">
          <div>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('/register') : (window.location.href = '/register'))}
              className="font-bold text-[#007A61] hover:text-[#005a47] hover:underline ml-1 cursor-pointer"
            >
              Create Account
            </button>
          </div>
          <div className="pt-1.5 border-t border-slate-100 text-[11.5px]">
            <span className="text-slate-500">Industry / Partner Organization? </span>
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('/register/industry') : (window.location.href = '/register/industry'))}
              className="font-bold text-[#007A61] hover:text-[#005a47] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Apply for Industry Onboarding</span>
              <span className="text-[9.5px] text-slate-400 font-semibold italic tracking-wide">• Govt. Review Required</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginFormCard;
