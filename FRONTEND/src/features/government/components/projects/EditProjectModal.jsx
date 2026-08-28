import React, { useState, useEffect } from 'react';
import {
  X,
  Edit,
  Building2,
  MapPin,
  IndianRupee,
  Save,
  CheckCircle2
} from 'lucide-react';
import { SECTOR_OPTIONS, DISTRICT_OPTIONS } from '../../data/projectConstants.js';

export const EditProjectModal = ({ project, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    hei: '',
    teamLead: '',
    leadEmail: '',
    sector: 'Water & Sanitation',
    district: 'Ranchi',
    sanctionedGrant: '₹ 15.00 Lakhs',
    trlLevel: 'TRL-6',
    prototypeType: 'Hardware',
    labsAndFacilities: '',
    deploymentLocation: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        hei: project.hei || '',
        teamLead: project.teamLead || '',
        leadEmail: project.leadEmail || '',
        sector: project.sector || 'Water & Sanitation',
        district: project.district || 'Ranchi',
        sanctionedGrant: project.sanctionedGrant || '₹ 15.00 Lakhs',
        trlLevel: project.trlLevel || 'TRL-6',
        prototypeType: project.prototypeType || 'Hardware',
        labsAndFacilities: project.labsAndFacilities || '',
        deploymentLocation: project.deploymentLocation || ''
      });
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(project.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Edit className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Edit Project Details
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Update parameters for {project.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Executing Institution (HEI) *
              </label>
              <input
                type="text"
                required
                value={formData.hei}
                onChange={(e) => setFormData({ ...formData, hei: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Project Team Lead / PI *
              </label>
              <input
                type="text"
                required
                value={formData.teamLead}
                onChange={(e) => setFormData({ ...formData, teamLead: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Sector *
              </label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
              >
                {SECTOR_OPTIONS.filter((s) => s !== 'All Sectors').map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                District *
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
              >
                {DISTRICT_OPTIONS.filter((d) => d !== 'All Districts').map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Total Sanctioned Grant *
              </label>
              <input
                type="text"
                required
                value={formData.sanctionedGrant}
                onChange={(e) => setFormData({ ...formData, sanctionedGrant: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Testing Lab Facility
              </label>
              <input
                type="text"
                value={formData.labsAndFacilities}
                onChange={(e) => setFormData({ ...formData, labsAndFacilities: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Field Deployment Location
              </label>
              <input
                type="text"
                value={formData.deploymentLocation}
                onChange={(e) => setFormData({ ...formData, deploymentLocation: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Project Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
