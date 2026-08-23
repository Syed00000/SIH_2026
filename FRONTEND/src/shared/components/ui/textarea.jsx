import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export const Textarea = forwardRef(({
  label,
  error,
  className,
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        className={cn(
          'w-full px-3 py-2 text-sm bg-white border rounded-md transition-all focus:outline-none focus:ring-1 resize-y',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900',
          className
        )}
        {...props}
      />
      {error && (
        <span
          id={`${textareaId}-error`}
          role="alert"
          className="text-xs text-red-500 font-medium"
        >
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
