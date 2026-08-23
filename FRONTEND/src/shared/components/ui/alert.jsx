import React from 'react';
import { cn } from '../../utils/cn.js';

export function Alert({
  children,
  className,
  title,
  variant = 'info',
  ...props
}) {
  const baseStyles = 'p-4 rounded-md border flex flex-col gap-1 text-sm';

  const variants = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <div
      role="alert"
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {title && <span className="font-semibold">{title}</span>}
      <div className="text-xs opacity-90">{children}</div>
    </div>
  );
}
