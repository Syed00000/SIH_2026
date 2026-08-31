import React from 'react';
import { Users } from 'lucide-react';

export const EmptyProjectsState = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-400 space-y-2">
      <Users className="w-10 h-10 mx-auto text-slate-300" />
      <h3 className="font-bold text-slate-700 text-sm">No Assigned Projects Available</h3>
      <p className="text-xs max-w-md mx-auto">
        Once a problem is assigned to you by the University, you can form your student team here.
      </p>
    </div>
  );
};

export default EmptyProjectsState;
