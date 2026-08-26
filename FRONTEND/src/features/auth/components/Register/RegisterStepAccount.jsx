import React from 'react';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { Eye, EyeOff } from 'lucide-react';

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
      <Input
        label="Full Name *"
        type="text"
        required
        value={formData.fullName}
        onChange={(e) => onChange('fullName', e.target.value)}
        placeholder="Enter your full name"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Mobile Number *"
          type="text"
          required
          value={formData.mobileNumber}
          onChange={(e) => onChange('mobileNumber', e.target.value)}
          placeholder="Indian 10-digit number"
        />
        <Input
          label="Email Address *"
          type="email"
          required
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="name@example.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900 pr-12 font-medium"
            />
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
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
          {/* Strength Bar */}
          <div className="mt-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-500 font-medium">Strength:</span>
              <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: passwordStrength.width }}
              />
            </div>
          </div>
        </div>

        <Input
          label="Confirm Password *"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
          placeholder="Re-enter password"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button variant="secondary" onClick={onBack} className="w-1/3">
          Back
        </Button>
        <Button onClick={onNext} className="w-2/3">
          Next: Role Details
        </Button>
      </div>
    </div>
  );
};

export default RegisterStepAccount;
