import React from 'react';
import { Check } from 'lucide-react';

export const AddUniversityStepperBar = ({
  steps = [],
  currentStep = 1,
  onStepClick
}) => {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200/90 shadow-2xs overflow-x-auto select-none">
      <div className="flex items-center justify-between min-w-[620px] px-2">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isPassed = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => {
                  if (step.id < currentStep && onStepClick) onStepClick(step.id);
                }}
                className={`flex flex-col items-center group ${
                  step.id < currentStep ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-xs'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <StepIcon className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`text-[10.5px] mt-1 font-semibold whitespace-nowrap ${
                    isCurrent ? 'text-slate-900 font-bold' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {step.id}. {step.label}
                </span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AddUniversityStepperBar;
