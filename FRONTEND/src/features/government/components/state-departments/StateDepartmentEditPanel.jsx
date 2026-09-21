import React from 'react';
import { Building2, ArrowLeft, CheckCircle2, Save, AlertCircle } from 'lucide-react';
import { useDepartmentForm } from './edit-sections/useDepartmentForm.js';
import { DepartmentIdentitySection } from './edit-sections/DepartmentIdentitySection.jsx';
import { DepartmentHierarchySection } from './edit-sections/DepartmentHierarchySection.jsx';
import { DepartmentMandateSection } from './edit-sections/DepartmentMandateSection.jsx';
import { DepartmentLeadershipSection } from './edit-sections/DepartmentLeadershipSection.jsx';
import { DepartmentCredentialsSection } from './edit-sections/DepartmentCredentialsSection.jsx';

export const StateDepartmentEditPanel = ({ department, onBack, onSave }) => {
  const {
    isEditing,
    formData,
    errors,
    isSubmitting,
    toastMessage,
    handleChange,
    handleDistrictCoverageToggle,
    handleHierarchyToggle,
    handleKeyFunctionChange,
    addKeyFunction,
    removeKeyFunction,
    handleGeneratePassword,
    handleSubmit
  } = useDepartmentForm(department, onSave);

  return (
    <div className="space-y-4 select-none max-w-[1400px] mx-auto pb-12 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-0.5">
              <span>State Governance</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">{isEditing ? 'Edit State Department' : 'Register State Department'}</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-700" />
              <span>{isEditing ? `Edit: ${department?.name}` : `Register New State Department`}</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Create and configure a new state-level government department.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="department-edit-form"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-slate-300" />
            <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create State Department')}</span>
          </button>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please complete all required fields marked with *</span>
        </div>
      )}

      {/* Main Form */}
      <div className="flex justify-center items-start">
        <form id="department-edit-form" onSubmit={handleSubmit} className="w-full max-w-4xl space-y-5 text-xs">
          <DepartmentIdentitySection
            formData={formData}
            handleChange={handleChange}
          />

          <DepartmentHierarchySection
            formData={formData}
            handleChange={handleChange}
            handleDistrictCoverageToggle={handleDistrictCoverageToggle}
            handleHierarchyToggle={handleHierarchyToggle}
          />

          <DepartmentMandateSection
            formData={formData}
            handleChange={handleChange}
            handleKeyFunctionChange={handleKeyFunctionChange}
            addKeyFunction={addKeyFunction}
            removeKeyFunction={removeKeyFunction}
          />

          <DepartmentLeadershipSection
            formData={formData}
            handleChange={handleChange}
          />

          <DepartmentCredentialsSection
            formData={formData}
            handleChange={handleChange}
            handleGeneratePassword={handleGeneratePassword}
          />

          <div className="bg-slate-50/80 border-t border-slate-100 p-4 flex items-center justify-end gap-2.5 rounded-2xl">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
              <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update State Department' : 'Create State Department')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
