import React from 'react';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { RegisterCitizenFields } from './RegisterCitizenFields.jsx';
import { RegisterUniversityFields } from './RegisterUniversityFields.jsx';
import { RegisterIndustryFields } from './RegisterIndustryFields.jsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const RegisterStepRoleDetails = ({
  formData,
  onChange,
  onCheckboxListChange,
  onBack,
  onNext
}) => {
  return (
    <div className="space-y-4 select-none">
      {formData.role === 'CITIZEN' && (
        <RegisterCitizenFields formData={formData} onChange={onChange} />
      )}

      {formData.role === 'UNIVERSITY' && (
        <RegisterUniversityFields
          formData={formData}
          onChange={onChange}
          onCheckboxListChange={onCheckboxListChange}
        />
      )}

      {formData.role === 'INDUSTRY' && (
        <RegisterIndustryFields
          formData={formData}
          onChange={onChange}
          onCheckboxListChange={onCheckboxListChange}
        />
      )}

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
          <span>Next: Review</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default RegisterStepRoleDetails;
