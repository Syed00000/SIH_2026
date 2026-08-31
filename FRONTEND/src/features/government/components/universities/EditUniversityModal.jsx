import React, { useState, useEffect } from 'react';
import { X, Building2, KeyRound, Save, AlertCircle } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';
import { EditUniversityBasicSection } from './EditUniversityBasicSection.jsx';
import { EditUniversityNodalSection } from './EditUniversityNodalSection.jsx';
export { DeleteUniversityModal } from './DeleteUniversityModal.jsx';

export const EditUniversityModal = ({ university, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (university) {
      setFormData({
        name: university.name || '',
        shortName: university.shortName || '',
        code: university.code || '',
        universityType: university.universityType || 'State University',
        institutionCategory: university.institutionCategory || 'University',
        status: university.status || 'Approved',
        district: university.district || 'Ranchi',
        website: university.website || '',
        establishmentYear: university.establishmentYear || 2000,
        universityEmail: university.universityEmail || '',
        universityPhone: university.universityPhone || '',
        nodalOfficerName: university.nodalOfficer?.name || '',
        nodalOfficerDesignation: university.nodalOfficer?.designation || 'Registrar',
        nodalOfficerEmail: university.nodalOfficer?.email || '',
        nodalOfficerPhone: university.nodalOfficer?.phone || '',
        loginPassword: university.credentials?.generatedPassword || ''
      });
    }
  }, [university]);

  if (!isOpen || !formData) return null;

  const DISTRICT_OPTIONS = JHARKHAND_DISTRICTS_LIST;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        shortName: formData.shortName.trim(),
        code: formData.code.trim().toUpperCase(),
        universityType: formData.universityType,
        institutionCategory: formData.institutionCategory,
        status: formData.status,
        district: formData.district,
        website: formData.website.trim(),
        establishmentYear: Number(formData.establishmentYear),
        universityEmail: formData.universityEmail.trim().toLowerCase(),
        universityPhone: formData.universityPhone.trim(),
        nodalOfficer: {
          name: formData.nodalOfficerName.trim(),
          designation: formData.nodalOfficerDesignation.trim(),
          email: formData.nodalOfficerEmail.trim().toLowerCase(),
          phone: formData.nodalOfficerPhone.trim()
        },
        credentials: {
          loginEmail: formData.nodalOfficerEmail.trim().toLowerCase() || formData.universityEmail.trim().toLowerCase(),
          generatedPassword: formData.loginPassword
        }
      };

      await onSave(university._id || university.id, payload);
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to update university details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn select-none">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <h2 className="text-xs font-bold text-slate-900 leading-tight">Edit University Details</h2>
              <p className="text-[10px] text-slate-400 font-medium">Update institutional record and nodal officer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <EditUniversityBasicSection
            formData={formData}
            onInputChange={handleInputChange}
            districtOptions={DISTRICT_OPTIONS}
          />

          <EditUniversityNodalSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Credentials */}
          <div className="bg-white p-4 rounded-lg border border-slate-200/90 shadow-2xs space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Override Portal Password</span>
            </h3>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Account Password</label>
              <input
                type="text"
                placeholder="Leave blank or enter new password"
                value={formData.loginPassword}
                onChange={(e) => handleInputChange('loginPassword', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-mono text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-md transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUniversityModal;
