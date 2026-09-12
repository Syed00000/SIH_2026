import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';

export const VerifyEmail = ({ emailQuery, onNavigate }) => {
  const { verifyEmail, resendOtp } = useAuth();
  const [email, setEmail] = useState(emailQuery || '');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    let resolved = emailQuery || '';
    if (!resolved && typeof window !== 'undefined') {
      resolved = new URLSearchParams(window.location.search).get('email') || '';
    }
    if (resolved) {
      setEmail(resolved);
    }
  }, [emailQuery]);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtpDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) return setErrorMessage('Please enter all 6 digits of the OTP code.');
    setIsVerifying(true);
    setErrorMessage('');
    try {
      await verifyEmail(email, fullOtp);
      if (onNavigate) onNavigate('/dashboard');
      else window.location.href = '/dashboard';
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Invalid or expired OTP';
      setErrorMessage(msg === 'INVALID_OTP' ? 'Invalid 6-digit OTP code.' : msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setErrorMessage('');
    try {
      await resendOtp(email);
      setSuccessMessage('A fresh 6-digit OTP code has been sent to your email address.');
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setErrorMessage(err?.response?.data?.error?.message || err?.message || 'Unable to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Verify Your Email</CardTitle>
          <CardDescription className="text-slate-500 text-sm mt-1">Enter the 6-digit OTP code sent to</CardDescription>
          <div className="mt-2.5">
            <span className="inline-block bg-slate-100 border border-slate-200 rounded px-2.5 py-1 text-slate-900 font-bold text-xs">{email}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && <Alert variant="error" title="Verification Error">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success" title="Success">{successMessage}</Alert>}

          <form onSubmit={handleVerify} className="space-y-4">
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
                  className="w-10 h-12 sm:w-12 sm:h-12 bg-white text-center text-lg font-bold text-slate-900 rounded-md border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-mono"
                />
              ))}
            </div>

            <div className="text-center text-xs text-slate-500 font-medium">
              {timer > 0 ? (
                <span>Resend available in <strong className="text-slate-950 font-mono">{timer}s</strong></span>
              ) : (
                <span className="text-emerald-700 font-semibold">You can now resend OTP code</span>
              )}
            </div>

            <Button type="submit" isLoading={isVerifying} disabled={otpDigits.join('').length !== 6} className="w-full py-2.5 rounded-md text-sm font-semibold">
              Verify Email Address
            </Button>
          </form>

          <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Didn't receive code?</span>
            <button type="button" onClick={handleResendOtp} disabled={!canResend || isResending} className="font-bold text-slate-900 hover:underline disabled:opacity-40 cursor-pointer">
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
