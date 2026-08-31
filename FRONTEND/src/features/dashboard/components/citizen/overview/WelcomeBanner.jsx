import React from 'react';
import { Plus } from 'lucide-react';

export const WelcomeBanner = ({ user, role, onOpenSubmitChallenge }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
      <div>
        <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, {user?.fullName || 'Tauqueer wasi'} 👋
        </h2>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">
          Role: <span className="font-bold text-slate-800">{role || 'CITIZEN'}</span> | Societal Innovation Hub
        </p>
      </div>

      <button
        onClick={onOpenSubmitChallenge}
        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-md shadow-xs flex items-center transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Submit a Challenge
      </button>
    </div>
  );
};

export default WelcomeBanner;
