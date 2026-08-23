import React from 'react';
import { cn } from '../../utils/cn.js';

export function Badge({
  children,
  className,
  variant = 'default',
  ...props
}) {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-wide uppercase border';

  const variants = {
    default: 'bg-slate-50 text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    ai: 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
