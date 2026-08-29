import React from 'react';
import { Check } from 'lucide-react';

export const RegisterStepper = ({ step, totalSteps = 5 }) => {
  const stepsArray = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const stepLabels = [
    'Role',
    'Account',
    'Profile',
    'Review',
    'Verify'
  ];

  return (
    <div className="flex flex-col items-center mb-6 select-none">
      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
        {stepsArray.map((s) => {
          const isCompleted = s < step;
          const isCurrent = s === step;

          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-[#007A61] text-white shadow-2xs'
                      : isCurrent
                      ? 'bg-[#007A61] text-white ring-4 ring-[#007A61]/20 shadow-sm shadow-[#007A61]/25 scale-105'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s}
                </div>
                <span
                  className={`text-[10.5px] mt-1.5 transition-colors ${
                    isCurrent
                      ? 'text-[#007A61] font-bold'
                      : isCompleted
                      ? 'text-slate-700 font-semibold'
                      : 'text-slate-400 font-medium'
                  }`}
                >
                  {stepLabels[s - 1]}
                </span>
              </div>

              {s < totalSteps && (
                <div
                  className={`h-[1.5px] w-6 sm:w-10 transition-colors duration-200 -mt-4 ${
                    s < step ? 'bg-[#007A61]' : 'bg-slate-200'
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

export default RegisterStepper;
