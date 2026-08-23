import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';

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
  }, [emailQuery, email]);

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
      <Card className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Verify Your Email</CardTitle>
          <CardDescription className="text-slate-500 text-sm mt-1">
            Enter the 6-digit OTP code sent to
          </CardDescription>
          <div className="mt-2.5">
            <span className="inline-block bg-slate-100 border border-slate-200 rounded px-2.5 py-1 text-slate-900 font-bold text-xs">
              {maskEmail(email)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {errorMessage && (
            <Alert variant="error" title="Verification Error">
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert variant="success" title="Success">
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
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
                  className="w-10 h-12 sm:w-12 sm:h-12 bg-white text-center text-lg font-bold text-slate-900 rounded-md border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
              ))}
            </div>

            <div className="text-center text-xs text-slate-500 font-medium">
              {timer > 0 ? (
                <span>OTP expires in <strong className="text-slate-950 font-mono">{formatTimer(timer)}</strong></span>
              ) : (
                <span className="text-slate-950 font-semibold">OTP expired. Click Resend.</span>
              )}
            </div>

            <Button
              type="submit"
              isLoading={isVerifying}
              disabled={otpDigits.join('').length !== 6}
              className="w-full py-2.5 rounded-md text-sm font-semibold"
            >
              Verify Email Address
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Didn't receive code?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isResending}
              className="font-bold text-slate-900 hover:underline disabled:opacity-40"
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
