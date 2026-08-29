import React from 'react';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { ArrowLeft, CheckCircle2, Shield } from 'lucide-react';

export const RegisterStepTerms = ({
  termsAccepted,
  onChange,
  isSubmitting,
  onBack,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 select-none">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Step 5: Terms of Service & Declaration
        </span>
      </div>

      <div className="bg-slate-50/80 border border-slate-300 rounded-xl p-4 text-xs text-slate-700 max-h-48 overflow-y-auto space-y-2.5 leading-relaxed shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Shield className="w-4 h-4 text-slate-700" />
          <span>JoharSetu Societal Innovation Platform Terms</span>
        </div>
        <p>
          By checking the declaration below, you agree to represent your institution, organization, or personal citizen profile truthfully. You declare that any societal challenges submitted contain verified real-world community details and do not contain false or misleading claims.
        </p>
        <p>
          Your registration is subject to verification by State Nodal Administrators (Department of Higher & Technical Education, Jharkhand). If any details are found to be fraudulent, access may be revoked without prior notice.
        </p>
      </div>

      <label className="flex items-start space-x-3 cursor-pointer pt-1 bg-white p-3 rounded-xl border border-slate-300 hover:border-slate-400 transition-colors shadow-2xs">
        <input
          type="checkbox"
          required
          checked={termsAccepted}
          onChange={(e) => onChange('termsAccepted', e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-[#007A61] focus:ring-[#007A61] w-4 h-4 cursor-pointer"
        />
        <span className="text-xs text-slate-800 font-semibold select-none leading-snug">
          I accept the official Terms of Service and declare that all information submitted is true and accurate.
        </span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button 
          variant="secondary" 
          onClick={onBack} 
          className="w-1/3 py-2.5 font-bold flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 hover:border-[#047857] hover:text-[#047857] transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!termsAccepted}
          className="w-2/3 py-3 bg-[#007A61] hover:bg-[#009677] active:bg-[#00604d] text-white font-bold flex items-center justify-center gap-2 rounded-xl shadow-md shadow-[#007A61]/20 hover:shadow-lg hover:shadow-[#009677]/30 cursor-pointer disabled:opacity-50 transition-all duration-200 group"
        >
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Create Account & Send OTP</span>
        </Button>
      </div>
    </form>
  );
};

export default RegisterStepTerms;
