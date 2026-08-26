import React, { useState, useEffect } from 'react';
import { X, Building2, User, KeyRound, Save, AlertCircle } from 'lucide-react';
import { JHARKHAND_DISTRICTS_DATA } from '../../data/jharkhandGisData.js';

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

  const DISTRICT_OPTIONS = Object.values(JHARKHAND_DISTRICTS_DATA).map((d) => d.name).sort();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn select-none">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Edit University Details</h2>
              <p className="text-xs text-slate-300">Update institutional record and administrative nodal officer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">University Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">University Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              >
                {DISTRICT_OPTIONS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nodal Officer Name</label>
              <input
                type="text"
                value={formData.nodalOfficerName}
                onChange={(e) => handleInputChange('nodalOfficerName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nodal Officer Email</label>
              <input
                type="email"
                value={formData.nodalOfficerEmail}
                onChange={(e) => handleInputChange('nodalOfficerEmail', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nodal Officer Phone</label>
              <input
                type="text"
                value={formData.nodalOfficerPhone}
                onChange={(e) => handleInputChange('nodalOfficerPhone', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">HEI Password (Update if needed)</label>
              <input
                type="text"
                value={formData.loginPassword}
                onChange={(e) => handleInputChange('loginPassword', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
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

export const DeleteUniversityModal = ({ university, isOpen, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !university) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(university._id || university.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Delete University?</h3>
          <p className="text-xs text-slate-600 mt-1">
            Are you sure you want to remove <strong>{university.name}</strong> ({university.code})? This will also deactivate their HEI portal access.
          </p>
        </div>
        <div className="flex justify-center space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
