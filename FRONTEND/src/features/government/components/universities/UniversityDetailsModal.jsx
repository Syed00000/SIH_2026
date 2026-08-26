import React from 'react';
import { X, MapPin, Layers } from 'lucide-react';
import { UniversityCredentialsCard } from './UniversityCredentialsCard.jsx';
import { UniversityCapacityStats } from './UniversityCapacityStats.jsx';
import { UniversityInfoSection } from './UniversityInfoSection.jsx';

export const UniversityDetailsModal = ({ university, isOpen, onClose }) => {
  if (!isOpen || !university) return null;

  const loginEmail =
    university.credentials?.loginEmail ||
    university.nodalOfficer?.email ||
    university.universityEmail ||
    'nodal@university.ac.in';

  const loginPassword =
    university.credentials?.generatedPassword || 'HEI@Jharkhand2026!';

  const firstLetter = university.name ? university.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn select-none">
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-2xs border border-slate-700">
              {firstLetter}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 leading-tight">{university.name}</h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {university.code}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{university.district}, Jharkhand</span>
                <span>&bull;</span>
                <span>{university.universityType}</span>
                <span>&bull;</span>
                <span className={university.accessStatus === 'Enabled' ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {university.accessStatus || 'Enabled'}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
          {/* 1. Official HEI Login Credentials Box */}
          <UniversityCredentialsCard
            universityName={university.name}
            loginEmail={loginEmail}
            loginPassword={loginPassword}
          />

          {/* 2. Capacity & Resource Statistics */}
          <UniversityCapacityStats quickSummary={university.quickSummary} />

          {/* 3. Detailed Data Sections Grid */}
          <UniversityInfoSection university={university} />

          {/* 4. Focus Areas */}
          <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 pb-1.5 border-b border-slate-100">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Research Focus Areas</span>
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {(university.focusAreas || ['Water Management', 'Infrastructure', 'Education', 'Public Health']).map(
                (area, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
                  >
                    {area}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetailsModal;
