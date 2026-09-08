import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';
import { Eye, EyeOff, AlertCircle, Lock, Mail, ArrowRight, Lightbulb, CheckCircle2, FileText, Users } from 'lucide-react';
import { LandingLayout } from '../../landing/components/layout/LandingLayout';
import bannerImage from '../../landing/assets/report-banner.png';

export const LoginForm = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
    if (errorMessage) setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
    if (errorMessage) setErrorMessage('');
  };

  const validateForm = () => {
    const errors = { email: '', password: '' };
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Please enter your email, username, or mobile number.';
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

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await login(email.trim(), password);
      const loggedUser = res?.user;
      if (loggedUser?.role === 'DEPARTMENT' || loggedUser?.deptId) {
        const targetId = loggedUser.deptId || loggedUser.id;
        const dest = `/department?deptId=${encodeURIComponent(targetId)}`;
        if (onNavigate) {
          onNavigate(dest);
        } else {
          window.location.href = dest;
        }
        return;
      }
      if (loggedUser?.role === 'BLOCK' || loggedUser?.blockId) {
        const targetId = loggedUser.blockId || loggedUser.id;
        const dest = `/block?blockId=${encodeURIComponent(targetId)}`;
        if (onNavigate) {
          onNavigate(dest);
        } else {
          window.location.href = dest;
        }
        return;
      }
      if (loggedUser?.role === 'TECHNICIAN' || loggedUser?.technicianId || loggedUser?.role?.includes('TECH')) {
        const targetId = loggedUser.technicianId || loggedUser.id || '';
        const dest = `/technician?techId=${encodeURIComponent(targetId)}`;
        if (onNavigate) {
          onNavigate(dest);
        } else {
          window.location.href = dest;
        }
        return;
      }
      if (onNavigate) {
        onNavigate('/dashboard');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      const status = error?.response?.status || error?.status;
      const errData = error?.response?.data?.error || error?.response?.data || {};
      const rawMsg = (errData?.message || error?.message || '').toString();

      if (
        rawMsg === 'USER_NOT_FOUND' ||
        rawMsg.toLowerCase().includes('user not found') ||
        rawMsg.toLowerCase().includes('not exist') ||
        rawMsg === 'INVALID_CREDENTIALS' ||
        rawMsg.toLowerCase().includes('credential') ||
        rawMsg.toLowerCase().includes('password mismatch') ||
        status === 401
      ) {
        setErrorMessage('Invalid email or password. Please verify your credentials or create a new account.');
      } else if (rawMsg === 'EMAIL_NOT_VERIFIED' || rawMsg.toLowerCase().includes('verify')) {
        setErrorMessage('Your email address is not verified yet. Redirecting to email verification...');
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('/verify-email', { email: email.trim() });
          } else {
            window.location.href = `/verify-email?email=${encodeURIComponent(email.trim())}`;
          }
        }, 1500);
      } else if (rawMsg === 'ACCOUNT_SUSPENDED' || rawMsg === 'ACCOUNT_BLOCKED') {
        setErrorMessage('This account is suspended or blocked. Please contact the administrator.');
      } else if (rawMsg === 'ACCOUNT_NOT_ACTIVE') {
        setErrorMessage('This account is inactive. Please contact support.');
      } else if (status === 429 || rawMsg.includes('RATE_LIMIT')) {
        setErrorMessage('Too many failed attempts. Please wait a minute before retrying.');
      } else if (
        error.name === 'TypeError' ||
        rawMsg.toLowerCase().includes('failed to fetch') ||
        rawMsg.toLowerCase().includes('network') ||
        error?.code === 'ERR_NETWORK' ||
        rawMsg.includes('ERR_CONNECTION_REFUSED')
      ) {
        setErrorMessage('Unable to connect to backend server. Please make sure the server is active on port 3000.');
      } else {
        setErrorMessage(rawMsg || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/login">
      {/* Hero Section Banner */}
      <section className="w-full relative h-[320px] sm:h-[380px] md:h-[430px] lg:h-[450px] bg-[#0c382b] overflow-hidden border-b border-gray-200">
        <img 
          src={bannerImage} 
          alt="Report a Problem Banner" 
          className="w-full h-full object-cover object-center" 
        />
        {/* Subtle dark overlay for text contrast if desired */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex items-center z-10 px-8 md:px-16 lg:px-24">
          <div className="max-w-xl text-white space-y-2">
            <div className="text-xs md:text-sm font-black text-emerald-300 tracking-widest uppercase">
              PEOPLE | IDEAS | INNOVATION
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
              JoharSetu Portal
            </h1>
            <p className="text-xs md:text-sm text-gray-100 font-medium leading-relaxed drop-shadow-sm">
              Connecting Community Challenges with Expert Solvers & Real Impact
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 bg-slate-50/30">
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          
          {/* Left Column (Login Form) */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
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
          </div>

          {/* Right Column (Sidebars) */}
          <div className="w-full lg:w-1/2 max-w-md flex flex-col gap-5 justify-center lg:justify-start">
            {/* Why Report a Problem? */}
            <Card className="bg-white rounded-none shadow-sm border border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-gray-700" />
                  <h3 className="text-[15px] font-black text-gray-900 tracking-tight">Why Report a Problem?</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-[12.5px] text-gray-700 font-medium leading-snug">Help solve real issues in your community</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-[12.5px] text-gray-700 font-medium leading-snug">Connect with expert institutions and innovators</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-[12.5px] text-gray-700 font-medium leading-snug">Contribute to a better and more inclusive Jharkhand</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-[12.5px] text-gray-700 font-medium leading-snug">Track the progress of your submitted problem</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Tips for a Better Submission */}
            <Card className="bg-blue-50/50 rounded-none shadow-sm border border-blue-100">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-[15px] font-black text-slate-800 tracking-tight">Tips for a Better Submission</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-[12.5px] text-slate-700 font-medium leading-snug">Be clear and specific about the problem</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-[12.5px] text-slate-700 font-medium leading-snug">Mention the exact location</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-[12.5px] text-slate-700 font-medium leading-snug">Add photos or documents if available</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-[12.5px] text-slate-700 font-medium leading-snug">Describe how many people are affected</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-[12.5px] text-slate-700 font-medium leading-snug">You don't need to suggest a technical solution (leave that to the experts!)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

 
          </div>

        </div>
      </div>
    </LandingLayout>
  );
};

export default LoginForm;
