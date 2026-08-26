import React from 'react';
import { Button } from '../../../../shared/components/ui/button.jsx';

export const RegisterStepReview = ({ formData, onBack, onNext }) => {
  return (
    <div className="space-y-4 select-none">
      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
        Review Your Details
      </span>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4 text-xs">
        {/* Role & Name */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
          <div>
            <span className="font-semibold text-slate-500 uppercase block mb-0.5">Role Type</span>
            <span className="font-bold text-slate-900">{formData.role}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 uppercase block mb-0.5">Full Name</span>
            <span className="font-bold text-slate-900">{formData.fullName}</span>
          </div>
        </div>

        {/* Email & Mobile */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
          <div>
            <span className="font-semibold text-slate-500 uppercase block mb-0.5">Email</span>
            <span className="font-bold text-slate-900">{formData.email}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 uppercase block mb-0.5">Mobile</span>
            <span className="font-bold text-slate-900">{formData.mobileNumber}</span>
          </div>
        </div>

        {/* Citizen Specific Info */}
        {formData.role === 'CITIZEN' && (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="font-semibold text-slate-500 uppercase block mb-0.5">District</span>
              <span className="font-bold text-slate-900">{formData.district}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 uppercase block mb-0.5">Block</span>
              <span className="font-bold text-slate-900">{formData.blockOrULB}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 uppercase block mb-0.5">Panchayat</span>
              <span className="font-bold text-slate-900">{formData.panchayatOrWard || 'N/A'}</span>
            </div>
          </div>
        )}

        {/* University Specific Info */}
        {formData.role === 'UNIVERSITY' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-slate-500 uppercase block mb-0.5">Institution</span>
              <span className="font-bold text-slate-900">{formData.institutionName}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 uppercase block mb-0.5">AISHE Code</span>
              <span className="font-bold text-slate-900">{formData.aisheCode}</span>
            </div>
          </div>
        )}

        {/* Industry Specific Info */}
        {formData.role === 'INDUSTRY' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-slate-500 uppercase block mb-0.5">Organization</span>
              <span className="font-bold text-slate-900">{formData.organizationName}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500 uppercase block mb-0.5">Entity Type</span>
              <span className="font-bold text-slate-900">{formData.entityType}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <Button variant="secondary" onClick={onBack} className="w-1/3">
          Back
        </Button>
        <Button onClick={onNext} className="w-2/3">
          Proceed to Terms
        </Button>
      </div>
    </div>
  );
};

export default RegisterStepReview;
