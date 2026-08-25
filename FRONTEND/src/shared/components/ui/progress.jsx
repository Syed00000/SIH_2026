import React from 'react';
import { cn } from '../../utils/cn.js';

export const Progress = React.forwardRef(
  ({ className, value = 0, indicatorColor = 'bg-blue-600', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}
      {...props}
    >
      <div
        className={cn('h-full w-full flex-1 transition-all duration-300', indicatorColor)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
);
Progress.displayName = 'Progress';

export default Progress;
