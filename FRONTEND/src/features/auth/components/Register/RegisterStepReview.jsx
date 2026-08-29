import React from 'react';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  MapPin, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';

export const RegisterStepReview = ({ formData, onBack, onNext }) => {
  return (
    <div className="space-y-4 select-none">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Step 4: Application Review & Verification
          </span>
          <span className="text-[11px] text-slate-500">Please review all submitted information before proceeding.</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#007A61] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          <span>{formData.role}</span>
        </div>
      </div>

      {/* Main Review Card */}
      <div className="bg-slate-50/90 border border-slate-300 rounded-xl p-4.5 space-y-4 text-xs shadow-2xs">
        {/* Section 1: Personal / Account Details */}
        <div>
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
            1. Account & Identity
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10.5px] font-bold uppercase text-slate-500 block">Full Name</span>
                <span className="font-bold text-slate-900 text-sm">{formData.fullName || '—'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10.5px] font-bold uppercase text-slate-500 block">Mobile Number</span>
                <span className="font-bold text-slate-900 text-sm">+91 {formData.mobileNumber || '—'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:col-span-2 pt-2 border-t border-slate-100">
              <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10.5px] font-bold uppercase text-slate-500 block">Email Address</span>
                <span className="font-bold text-slate-900 text-sm">{formData.email || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Role Profile Information */}
        <div>
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
            2. Role Profile ({formData.role})
          </span>

          {/* Citizen */}
          {formData.role === 'CITIZEN' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10.5px] font-bold uppercase text-slate-500 block">District</span>
                  <span className="font-bold text-slate-900 text-sm">{formData.district || '—'}</span>
                </div>
              </div>
              <div>
                <span className="text-[10.5px] font-bold uppercase text-slate-500 block">Block / ULB</span>
                <span className="font-bold text-slate-900 text-sm">{formData.blockOrULB || '—'}</span>
              </div>
              <div>
                <span className="text-[10.5px] font-bold uppercase text-slate-500 block">Panchayat / Ward</span>
                <span className="font-bold text-slate-900 text-sm">{formData.panchayatOrWard || 'N/A'}</span>
              </div>
            </div>
          )}

          {/* University */}
          {formData.role === 'UNIVERSITY' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10.5px] font-bold uppercase text-slate-500 block">Institution</span>
                  <span className="font-bold text-slate-900 text-sm">{formData.institutionName || '—'}</span>
                </div>
              </div>
              <div>
                <span className="text-[10.5px] font-bold uppercase text-slate-500 block">AISHE Code</span>
                <span className="font-bold text-slate-900 text-sm">{formData.aisheCode || '—'}</span>
              </div>
              {formData.institutionType && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-[10.5px] font-bold uppercase text-slate-500 block">Institution Type</span>
                  <span className="font-bold text-slate-900">{formData.institutionType}</span>
                </div>
              )}
            </div>
          )}

          {/* Industry */}
          {formData.role === 'INDUSTRY' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10.5px] font-bold uppercase text-slate-500 block">Organization</span>
                  <span className="font-bold text-slate-900 text-sm">{formData.organizationName || '—'}</span>
                </div>
              </div>
              <div>
                <span className="text-[10.5px] font-bold uppercase text-slate-500 block">Entity Type</span>
                <span className="font-bold text-slate-900 text-sm">{formData.entityType || '—'}</span>
              </div>
              {formData.cin && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-[10.5px] font-bold uppercase text-slate-500 block">CIN / Registration</span>
                  <span className="font-bold text-slate-900">{formData.cin}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
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
          onClick={onNext} 
          className="w-2/3 py-2.5 bg-[#007A61] hover:bg-[#009677] active:bg-[#00604d] text-white font-bold flex items-center justify-center gap-1.5 rounded-xl shadow-md shadow-[#007A61]/20 hover:shadow-lg hover:shadow-[#009677]/30 transition-all duration-200 cursor-pointer group"
        >
          <span>Proceed to Terms</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default RegisterStepReview;
