import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../utils/cn.js';

const TabsContext = createContext({
  value: '',
  onValueChange: () => {},
});

export const Tabs = ({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}) => {
  const [tabValue, setTabValue] = useState(defaultValue || '');
  const currentValue = value !== undefined ? value : tabValue;

  const handleValueChange = (val) => {
    if (value === undefined) {
      setTabValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, ...props }) => (
  <div
    className={cn(
      'inline-flex items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500',
      className
    )}
    {...props}
  />
);

export const TabsTrigger = ({ value, className, children, ...props }) => {
  const context = useContext(TabsContext);
  const isActive = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => context.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        isActive
          ? 'bg-white text-slate-950 shadow-2xs font-bold'
          : 'text-slate-600 hover:text-slate-900',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, className, children, ...props }) => {
  const context = useContext(TabsContext);
  if (context.value !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn('mt-2 ring-offset-white focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
};
