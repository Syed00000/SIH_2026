import { useState } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import { navigateByRole, parseLoginError, validateLoginForm } from './loginHelpers.js';

export const useLoginForm = (onNavigate) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const validation = validateLoginForm(email, password);
    setFieldErrors(validation.errors);
    if (!validation.isValid) return;

    setIsSubmitting(true);

    try {
      const res = await login(email.trim(), password);
      navigateByRole(res?.user, onNavigate);
    } catch (error) {
      const { message, isUnverified } = parseLoginError(error);
      setErrorMessage(message);
      if (isUnverified) {
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('/verify-email', { email: email.trim() });
          } else {
            window.location.href = `/verify-email?email=${encodeURIComponent(email.trim())}`;
          }
        }, 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};

export default useLoginForm;
