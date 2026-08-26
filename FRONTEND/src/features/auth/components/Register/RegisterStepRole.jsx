import React from 'react';
import { Button } from '../../../../shared/components/ui/button.jsx';

export const RegisterStepRole = ({ role, onRoleSelect, onNext, onNavigate }) => {
  return (
    <div className="space-y-4 select-none">
      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        Choose Registration Role
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* CITIZEN Card */}
        <div
          onClick={() => onRoleSelect('CITIZEN')}
          className={`p-5 rounded-lg cursor-pointer border transition-all ${
            role === 'CITIZEN'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
          }`}
        >
          <h4 className="font-bold text-sm mb-1">CITIZEN</h4>
          <p className={`text-xs ${role === 'CITIZEN' ? 'text-slate-300' : 'text-slate-500'}`}>
            Submit local community and societal challenges across Jharkhand.
          </p>
        </div>

        {/* UNIVERSITY Card */}
        <div
          onClick={() => onRoleSelect('UNIVERSITY')}
          className={`p-5 rounded-lg cursor-pointer border transition-all ${
            role === 'UNIVERSITY'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
          }`}
        >
          <h4 className="font-bold text-sm mb-1">UNIVERSITY</h4>
          <p className={`text-xs ${role === 'UNIVERSITY' ? 'text-slate-300' : 'text-slate-500'}`}>
            Submit educational, institutional, or research-domain societal challenges.
          </p>
        </div>

        {/* INDUSTRY Card */}
        <div
          onClick={() => onRoleSelect('INDUSTRY')}
          className={`p-5 rounded-lg cursor-pointer border transition-all ${
            role === 'INDUSTRY'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
          }`}
        >
          <h4 className="font-bold text-sm mb-1">INDUSTRY</h4>
          <p className={`text-xs ${role === 'INDUSTRY' ? 'text-slate-300' : 'text-slate-500'}`}>
            Submit industrial, corporate-level, or CSR-domain societal challenges.
          </p>
        </div>
      </div>

      {role === 'INDUSTRY' && (
        <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div>
            <p className="font-bold text-blue-900">Official Industry & Partner Onboarding</p>
            <p className="text-blue-700 text-[11.5px] mt-0.5">
              Partner with state universities & student researchers. Government of Jharkhand provisions verified credentials upon application review.
            </p>
          </div>
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate('/register/industry') : (window.location.href = '/register/industry'))}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shrink-0 shadow-2xs cursor-pointer text-center"
          >
            Open Industry Application
          </button>
        </div>
      )}

      <div className="pt-4">
        <Button onClick={onNext} className="w-full py-2.5">
          Continue to Account Details
        </Button>
      </div>
    </div>
  );
};

export default RegisterStepRole;
