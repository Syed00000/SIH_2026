import React from 'react';
import { MapPin, Check, XCircle } from 'lucide-react';

export const UniversityDetailsHero = ({ currentUni, isUpdating, onStatusChange }) => {
  const firstLetter = currentUni.name ? currentUni.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-3.5">
        <div className="w-11 h-11 rounded-md bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-2xs border border-slate-700 flex-shrink-0">
          {firstLetter}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">{currentUni.name}</h2>
            <span className="text-xs text-slate-400">({currentUni.shortName || currentUni.code})</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUni.district}, Jharkhand</span>
            </span>
            <span>&bull;</span>
            <span>{currentUni.universityType}</span>
            <span>&bull;</span>
            <span>Est. {currentUni.establishmentYear || '2012'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="px-3 py-1.5 rounded-md bg-slate-50/70 border border-slate-200/80 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Review Status</span>
          <span className={`inline-flex items-center space-x-1.5 text-xs font-bold mt-0.5 ${
            currentUni.status === 'Approved' || currentUni.status === 'Active' ? 'text-emerald-600' : currentUni.status === 'Pending' ? 'text-amber-600' : 'text-red-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              currentUni.status === 'Approved' || currentUni.status === 'Active' ? 'bg-emerald-500' : currentUni.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span>{currentUni.status || 'Approved'}</span>
          </span>
        </div>

        <div className="px-3 py-1.5 rounded-md bg-slate-50/70 border border-slate-200/80 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Portal Access</span>
          <span className={`inline-flex items-center space-x-1.5 text-xs font-bold mt-0.5 ${
            currentUni.accessStatus === 'Enabled' ? 'text-emerald-600' : 'text-red-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentUni.accessStatus === 'Enabled' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span>{currentUni.accessStatus || 'Enabled'}</span>
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {currentUni.status !== 'Approved' && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onStatusChange('Approved')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{currentUni.status === 'Rejected' ? 'Re-Approve' : 'Approve'}</span>
            </button>
          )}
          {currentUni.status !== 'Rejected' && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onStatusChange('Rejected')}
              className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50 shadow-2xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
