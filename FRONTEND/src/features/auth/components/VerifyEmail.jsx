import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Mail, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export const VerifyEmail = ({ emailQuery, onNavigate }) => {
  const { verifyEmail, resendOtp } = useAuth();
  const [email, setEmail] = useState(emailQuery || '');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mailParam = params.get('email');
      if (mailParam) setEmail(mailParam);
    }
  }, [emailQuery]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const maskEmail = (mailStr) => {
    if (!mailStr || !mailStr.includes('@')) return mailStr;
    const [name, domain] = mailStr.split('@');
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the OTP code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await verifyEmail(email, fullOtp);
      setSuccessMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('/login');
        } else {
          window.location.href = '/login';
        }
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Invalid or expired OTP';
      if (msg === 'INVALID_OTP') {
        setErrorMessage('Invalid 6-digit OTP code. Please check your email.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await resendOtp(email);
      setSuccessMessage('A fresh 6-digit OTP has been sent to your email.');
      setTimer(300);
      setCanResend(false);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Unable to resend OTP';
      setErrorMessage(msg);
    } finally {
      setIsResending(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4 shadow-md shadow-blue-500/20">
          <Mail className="w-7 h-7 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">Verify Your Email</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-2">
          Enter the 6-digit OTP code sent to
        </p>
        <div className="inline-block bg-slate-100 border border-slate-200 rounded-lg px-3 py-1 text-blue-600 font-semibold text-xs mb-6">
          {maskEmail(email)}
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center space-x-2 sm:space-x-3" onPaste={handlePaste}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-50 text-center text-xl font-bold text-slate-900 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {timer > 0 ? (
              <span>OTP expires in <strong className="text-blue-600 font-mono">{formatTimer(timer)}</strong></span>
            ) : (
              <span className="text-amber-600 font-semibold">OTP expired! Click Resend.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || otpDigits.join('').length !== 6}
            className="w-full btn-primary font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 text-sm"
          >
            {isVerifying ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Verifying OTP...</span>
              </span>
            ) : (
              <>
                <span>Verify Email Address</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
          <span className="text-slate-500">Didn't receive code?</span>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={!canResend || isResending}
            className="font-bold text-blue-600 hover:text-blue-700 disabled:opacity-40 flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>{isResending ? 'Sending...' : 'Resend OTP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
