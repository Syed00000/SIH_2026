import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  leftIcon: LeftIcon,
  className,
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const EffectiveIcon = Icon || LeftIcon;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {EffectiveIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <EffectiveIcon className="w-4 h-4 stroke-[2]" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'w-full py-2.5 text-sm font-semibold text-slate-900 bg-white border rounded-lg transition-all focus:outline-none placeholder:text-slate-400 placeholder:font-normal shadow-2xs',
            EffectiveIcon ? 'pl-10 pr-3.5' : 'px-3.5',
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
              : 'border-slate-300 hover:border-slate-400 focus:border-[#007A61] focus:ring-2 focus:ring-[#007A61]/15',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span
          id={`${inputId}-error`}
          role="alert"
          className="text-xs text-red-600 font-semibold"
        >
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
