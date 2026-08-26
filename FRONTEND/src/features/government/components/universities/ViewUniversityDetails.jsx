import React, { useState, useEffect } from 'react';
import {
  Layers,
  MapPin,
  Clock,
  Pencil,
  ArrowLeft,
  ChevronRight,
  Check,
  XCircle
} from 'lucide-react';
import { universityService } from '../../services/universityService.js';
import { UniversityCredentialsCard } from './UniversityCredentialsCard.jsx';
import { UniversityCapacityStats } from './UniversityCapacityStats.jsx';
import { UniversityInfoSection } from './UniversityInfoSection.jsx';

export const ViewUniversityDetails = ({ university, onBack, onEdit, onUpdateStatus }) => {
  const [currentUni, setCurrentUni] = useState(university);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (university) {
      setCurrentUni(university);
    }
  }, [university]);

  if (!currentUni) return null;

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    const id = currentUni._id || currentUni.id;

    setCurrentUni((prev) => ({
      ...prev,
      status: newStatus,
      accessStatus: newStatus === 'Approved' ? 'Enabled' : (newStatus === 'Rejected' ? 'Disabled' : prev?.accessStatus || 'Enabled')
    }));

    try {
      const updated = await universityService.updateStatus(id, newStatus);
      if (updated) {
        setCurrentUni(updated);
      }
      if (onUpdateStatus) {
        await onUpdateStatus(id, newStatus);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const loginEmail =
    currentUni.credentials?.loginEmail ||
    currentUni.nodalOfficer?.email ||
    currentUni.universityEmail ||
    'nodal@university.ac.in';

  const loginPassword =
    currentUni.credentials?.generatedPassword || 'HEI@Jharkhand2026!';

  const firstLetter = currentUni.name ? currentUni.name.charAt(0).toUpperCase() : 'U';

  const regDate = currentUni.createdAt
    ? new Date(currentUni.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '20 May 2025';

  return (
    <div className="space-y-4 select-none w-full max-w-[1600px] mx-auto pb-10">
      {/* Top Breadcrumb & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 mb-0.5">
            <button onClick={onBack} className="hover:text-slate-900 transition-colors cursor-pointer">
              User Governance
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <button onClick={onBack} className="hover:text-slate-900 transition-colors cursor-pointer">
              Universities
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-bold">{currentUni.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">{currentUni.name}</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {currentUni.code}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Back to Universities</span>
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black shadow-xs rounded-md transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit University</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Header */}
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
          {/* Review Status */}
          <div className="px-3 py-1.5 rounded-md bg-slate-50/70 border border-slate-200/80 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Review Status</span>
            <span
              className={`inline-flex items-center space-x-1.5 text-xs font-bold mt-0.5 ${
                currentUni.status === 'Approved' || currentUni.status === 'Active'
                  ? 'text-emerald-600'
                  : currentUni.status === 'Pending'
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  currentUni.status === 'Approved' || currentUni.status === 'Active'
                    ? 'bg-emerald-500'
                    : currentUni.status === 'Pending'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-red-500'
                }`}
              />
              <span>{currentUni.status || 'Approved'}</span>
            </span>
          </div>

          {/* Portal Access */}
          <div className="px-3 py-1.5 rounded-md bg-slate-50/70 border border-slate-200/80 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Portal Access</span>
            <span
              className={`inline-flex items-center space-x-1.5 text-xs font-bold mt-0.5 ${
                currentUni.accessStatus === 'Enabled' ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  currentUni.accessStatus === 'Enabled' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              <span>{currentUni.accessStatus || 'Enabled'}</span>
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-1.5">
            {currentUni.status !== 'Approved' && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange('Approved')}
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
                onClick={() => handleStatusChange('Rejected')}
                className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50 shadow-2xs"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. Official HEI Login Credentials Box */}
      <UniversityCredentialsCard
        universityName={currentUni.name}
        loginEmail={loginEmail}
        loginPassword={loginPassword}
      />

      {/* 2. Capacity & Resource Strength */}
      <UniversityCapacityStats quickSummary={currentUni.quickSummary} />

      {/* 3. Detailed Data Sections Grid */}
      <UniversityInfoSection university={currentUni} />

      {/* 4. Focus Areas */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-slate-100">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Academic & Societal Research Focus Areas</span>
        </h3>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {(currentUni.focusAreas || ['Water Management', 'Infrastructure', 'Education', 'Public Health']).map(
            (area, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
              >
                {area}
              </span>
            )
          )}
        </div>
      </div>

      {/* 5. Audit Trail */}
      <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Registered into Government Portal on <strong className="text-slate-600">{regDate}</strong></span>
        </div>
        <div>
          <span>Last active session: <strong className="text-slate-600">Active today</strong></span>
        </div>
      </div>
    </div>
  );
};

export default ViewUniversityDetails;
