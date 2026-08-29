import React from 'react';
import { Clock } from 'lucide-react';

export const NodalOverview = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-16 px-4 max-w-lg mx-auto text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
        <Clock className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Overview Panel — Coming Soon
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          This institutional analytics and summary dashboard is currently under active development.
        </p>
      </div>
    </div>
  );
};

export default NodalOverview;
