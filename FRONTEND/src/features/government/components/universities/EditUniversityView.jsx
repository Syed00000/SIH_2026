import React, { useState } from 'react';
import { Save, ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';
import { EditUniversityBasicSection } from './EditUniversityBasicSection.jsx';
import { EditUniversityNodalSection } from './EditUniversityNodalSection.jsx';
import { EditUniversityAccreditationFocus } from './EditUniversityAccreditationFocus.jsx';
import { EditUniversityCapacitySection } from './EditUniversityCapacitySection.jsx';
import { buildInitialFormData, FOCUS_AREA_OPTIONS, buildUpdatePayload } from './universityEdit.helper.js';

export const EditUniversityView = ({ university, onCancel, onSuccess, onUpdateUniversity }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState(() => buildInitialFormData(university));

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleToggleFocusArea = (area) => {
    setFormData((prev) => {
      const exists = prev.focusAreas.includes(area);
      return {
        ...prev,
        focusAreas: exists ? prev.focusAreas.filter((a) => a !== area) : [...prev.focusAreas, area]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.name.trim()) return setFormError('University name is required.');
    if (!formData.code.trim()) return setFormError('University unique code is required.');
    if (!formData.nodalOfficerName.trim() || !formData.nodalOfficerEmail.trim()) {
      return setFormError('Nodal officer name and official email are required.');
    }

    try {
      setIsSubmitting(true);
      const payload = buildUpdatePayload(formData);
      const id = university?._id || university?.id;
      if (onUpdateUniversity) {
        await onUpdateUniversity(id, payload);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setFormError(err?.message || 'Failed to save changes. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 select-none w-full max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 mb-0.5">
            <button onClick={onCancel} className="hover:text-slate-900 cursor-pointer">User Governance</button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <button onClick={onCancel} className="hover:text-slate-900 cursor-pointer">Universities</button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-bold">Edit</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Edit University: {university?.name}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#007A61] hover:bg-[#00624e] rounded-md shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-md flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{formError}</span>
        </div>
      )}

      <EditUniversityBasicSection formData={formData} onInputChange={handleInputChange} districtOptions={JHARKHAND_DISTRICTS_LIST} />
      <EditUniversityNodalSection formData={formData} onInputChange={handleInputChange} />
      <EditUniversityAccreditationFocus formData={formData} onInputChange={handleInputChange} onToggleFocusArea={handleToggleFocusArea} focusAreaOptions={FOCUS_AREA_OPTIONS} />
      <EditUniversityCapacitySection formData={formData} onInputChange={handleInputChange} />

      <div className="flex items-center justify-between bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-2xs">
        <button type="button" onClick={onCancel} className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer shadow-2xs">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-[#007A61] hover:bg-[#00624e] rounded-md shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>
    </div>
  );
};

export default EditUniversityView;
