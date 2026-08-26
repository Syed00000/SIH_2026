import React from 'react';
import { Button } from '../../../../shared/components/ui/button.jsx';

export const RegisterStepTerms = ({
  termsAccepted,
  onChange,
  isSubmitting,
  onBack,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 select-none">
      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
        Terms of Service
      </span>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-xs text-slate-600 max-h-48 overflow-y-auto space-y-3 leading-relaxed">
        <p className="font-bold text-slate-900">JoharSetu Societal Innovation Platform Terms</p>
        <p>
          By checking the box below, you agree to represent your institution, organization, or personal profile truthfully. You declare that any societal challenges submitted contain real-world community verification details and do not contain false or misleading claims.
        </p>
        <p>
          Your registration is subject to verification by State Nodal Administrators. If any details are found to be fraudulent, your account may be suspended or blocked without prior warning.
        </p>
      </div>

      <label className="flex items-start space-x-2.5 cursor-pointer pt-2">
        <input
          type="checkbox"
          required
          checked={termsAccepted}
          onChange={(e) => onChange('termsAccepted', e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
        />
        <span className="text-xs text-slate-600 font-semibold select-none leading-tight">
          I accept all Terms of Service and declare the information provided is accurate.
        </span>
      </label>

      <div className="flex space-x-3 pt-2">
        <Button variant="secondary" onClick={onBack} className="w-1/3">
          Back
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!termsAccepted}
          className="w-2/3 py-3"
        >
          Create Account & Send OTP
        </Button>
      </div>
    </form>
  );
};

export default RegisterStepTerms;
