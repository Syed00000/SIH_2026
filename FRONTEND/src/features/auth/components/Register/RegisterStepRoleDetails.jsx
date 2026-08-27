import React from 'react';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { RegisterCitizenFields } from './RegisterCitizenFields.jsx';
import { RegisterUniversityFields } from './RegisterUniversityFields.jsx';
import { RegisterIndustryFields } from './RegisterIndustryFields.jsx';

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

      <div className="flex space-x-3 pt-4">
        <Button variant="secondary" onClick={onBack} className="w-1/3">
          Back
        </Button>
        <Button onClick={onNext} className="w-2/3">
          Next: Review
        </Button>
      </div>
    </div>
  );
};

export default RegisterStepRoleDetails;
