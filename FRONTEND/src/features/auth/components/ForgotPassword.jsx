import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Input } from '../../../shared/components/ui/input.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';

export const ForgotPassword = ({ onNavigate }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await forgotPassword(email.trim());
      setSuccessMessage('If the email exists, a password reset OTP has been sent.');
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('/reset-password', { email: email.trim() });
        } else {
          window.location.href = `/reset-password?email=${encodeURIComponent(email.trim())}`;
        }
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Failed to request password reset';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Forgot Password?</CardTitle>
          <CardDescription className="text-slate-500 text-sm mt-1">
            Enter your registered email address to receive a password reset OTP.
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
              label="Registered Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="focus:ring-slate-900 focus:border-slate-900"
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-2.5 rounded-md text-sm font-semibold mt-2"
            >
              Send Password Reset OTP
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
            Remembered your password?{' '}
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/login') : (window.location.href = '/login')}
              className="font-bold text-slate-900 hover:underline ml-1"
            >
              Back to Sign In
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
