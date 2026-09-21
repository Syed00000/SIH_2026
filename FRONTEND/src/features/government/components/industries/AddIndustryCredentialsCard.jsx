import React, { useState } from 'react';
import { Key, Eye, EyeOff, RefreshCw, Link2 } from 'lucide-react';

export const AddIndustryCredentialsCard = ({
  formData,
  onChange,
  onAutoGenerateEmail,
  errors = {}
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const generateRandomPassword = (length = 12) => {
    const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
    const numberChars = '23456789';
    const specialChars = '!@#$%';
    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

    const getRandomChar = (charset) => {
      if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        return charset.charAt(arr[0] % charset.length);
      }
      return charset.charAt(Math.floor(Math.random() * charset.length));
    };

    const characters = [
      getRandomChar(uppercaseChars),
      getRandomChar(lowercaseChars),
      getRandomChar(numberChars),
      getRandomChar(specialChars)
    ];

    for (let i = 4; i < length; i++) {
      characters.push(getRandomChar(allChars));
    }

    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    onChange('initialPassword', characters.join(''));
  };

  return (
    <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-3.5 space-y-3 select-none">
      <div className="flex items-center space-x-2 pb-1.5 border-b border-slate-200/60">
        <Key className="w-3.5 h-3.5 text-blue-600" />
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
          4. Portal Login Credentials
        </h4>
      </div>

      {/* Login Email */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-slate-700">
            Login Email <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={onAutoGenerateEmail}
            className="text-[10px] font-bold text-slate-900 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <Link2 className="w-3 h-3" />
            <span>Auto-fill from SPOC</span>
          </button>
        </div>
        <input
          type="email"
          value={formData.loginEmail}
          onChange={(e) => onChange('loginEmail', e.target.value)}
          placeholder="login@partner.joharsetu.gov.in"
          className={`w-full bg-white border ${
            errors.loginEmail ? 'border-red-500' : 'border-slate-200'
          } rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs`}
        />
        {errors.loginEmail && (
          <p className="text-[11px] text-red-500 mt-0.5">{errors.loginEmail}</p>
        )}
      </div>

      {/* Initial Password */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-slate-700">Initial Password</label>
          <button
            type="button"
            onClick={generateRandomPassword}
            className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Generate Random</span>
          </button>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.initialPassword}
            onChange={(e) => onChange('initialPassword', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 pr-9 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddIndustryCredentialsCard;
