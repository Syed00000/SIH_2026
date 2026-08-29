import React from 'react';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const RegisterStepAccount = ({
  formData,
  onChange,
  showPassword,
  onToggleShowPassword,
  passwordStrength,
  onBack,
  onNext
}) => {
  return (
    <div className="space-y-4 select-none">
      {/* Full Name */}
      <Input
        label="Full Name *"
        type="text"
        required
        icon={User}
        value={formData.fullName}
        onChange={(e) => onChange('fullName', e.target.value)}
        placeholder="Enter your full name (as per official ID)"
      />

      {/* Mobile and Email in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Mobile Number *"
          type="tel"
          required
          icon={Phone}
          value={formData.mobileNumber}
          onChange={(e) => onChange('mobileNumber', e.target.value)}
          placeholder="10-digit mobile number"
          maxLength={10}
        />
        <Input
          label="Email Address *"
          type="email"
          required
          icon={Mail}
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="name@example.com"
        />
      </div>

      {/* Password and Confirm Password in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4 stroke-[2]" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full pl-10 pr-11 py-2.5 text-sm font-semibold text-slate-900 bg-white border border-slate-300 hover:border-slate-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#007A61]/15 focus:border-[#007A61] placeholder:text-slate-400 placeholder:font-normal shadow-2xs"
            />
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800 transition-colors focus:outline-none cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Segmented Strength Bar */}
          <div className="mt-2">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-500 font-medium">Security Strength:</span>
              <span className="font-bold text-slate-800">{passwordStrength.label || 'None'}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: passwordStrength.width }}
              />
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm Password *"
          type="password"
          required
          icon={ShieldCheck}
          value={formData.confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
          placeholder="Re-enter your password"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-3">
        <Button 
          variant="secondary" 
          onClick={onBack} 
          className="w-1/3 py-2.5 font-bold flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 hover:border-[#047857] hover:text-[#047857] transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <Button 
          onClick={onNext} 
          className="w-2/3 py-2.5 bg-[#007A61] hover:bg-[#009677] active:bg-[#00604d] text-white font-bold flex items-center justify-center gap-1.5 rounded-xl shadow-md shadow-[#007A61]/20 hover:shadow-lg hover:shadow-[#009677]/30 transition-all duration-200 cursor-pointer group"
        >
          <span>Next: Role Details</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default RegisterStepAccount;
