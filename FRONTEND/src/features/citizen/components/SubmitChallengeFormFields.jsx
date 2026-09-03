import React from 'react';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { ProblemOverviewSection } from './sections/ProblemOverviewSection.jsx';
import { LocationDetailsSection } from './sections/LocationDetailsSection.jsx';
import { SubmitterInfoSection } from './sections/SubmitterInfoSection.jsx';
import { EvidenceUploader } from './evidence/EvidenceUploader.jsx';

export const SubmitChallengeFormFields = ({
  formData,
  setFormData,
  handleChange,
  customDomain,
  setCustomDomain,
  isCustomMode,
  setIsCustomMode,
  loading,
  onClose,
  error
}) => {
  return (
    <>
      <ProblemOverviewSection
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        customDomain={customDomain}
        setCustomDomain={setCustomDomain}
        isCustomMode={isCustomMode}
        setIsCustomMode={setIsCustomMode}
      />

      <LocationDetailsSection
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
      />

      <SubmitterInfoSection
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
      />

      {/* 4. Ground Reality Evidence & Documentation */}
      <div className="space-y-3 pb-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">
            4. Ground Reality Evidence & Documentation
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            Live Photos, Videos & PDFs
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Capture live photos, record video walkthrough (max 50 MB), or upload PDF documentation (max 1 MB). Evidence is saved securely in encrypted storage.
        </p>

        <EvidenceUploader
          mediaList={formData.media || []}
          setMediaList={(updater) =>
            setFormData((prev) => ({
              ...prev,
              media: typeof updater === 'function' ? updater(prev.media || []) : updater
            }))
          }
          citizenId={formData.citizenId}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Verifying & Submitting...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Submit Problem Statement</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default SubmitChallengeFormFields;
