import React from 'react';

export const RegisterStepper = ({ step, totalSteps = 5 }) => {
  const stepsArray = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 select-none">
      {stepsArray.map((s) => (
        <React.Fragment key={s}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              s === step
                ? 'bg-slate-900 text-white shadow-sm ring-4 ring-slate-100'
                : s < step
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}
          >
            {s}
          </div>
          {s < totalSteps && (
            <div className={`h-[2px] w-8 sm:w-12 ${s < step ? 'bg-slate-900' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default RegisterStepper;
