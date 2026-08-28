import React, { useState } from 'react';
import { X, Plus, Building2, MapPin, Layers, Award, IndianRupee } from 'lucide-react';
import { SECTOR_OPTIONS, DISTRICT_OPTIONS } from '../../data/projectConstants.js';

export const AddProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    sector: 'Agriculture & Food',
    district: 'Ranchi',
    hei: 'Ranchi University',
    teamLead: '',
    leadEmail: '',
    sanctionedGrant: '₹ 20.0 Lakhs',
    disbursedAmount: '₹ 5.0 Lakhs',
    milestonePhase: 'Phase 1: Design & Arch',
    prototypeType: 'Hardware',
    trlLevel: 'TRL-4',
    deploymentStatus: 'In Progress',
    hardwareSpecs: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const newProject = {
      ...formData,
      id: newId,
      milestoneProgress: 25,
      trlDescription: 'Technology validated in laboratory environment',
      milestones: [
        { id: 'M1', title: 'System Architecture & Requirements', status: 'Completed', progress: 100, remarks: 'Verified by technical committee.' },
        { id: 'M2', title: 'Prototype Development & Bench Testing', status: 'In Progress', progress: 50, remarks: 'Fabrication under way.' },
        { id: 'M3', title: 'Field Pilot & State Deployment', status: 'Pending', progress: 0, remarks: 'Pending milestone 2 completion.' }
      ]
    };
    onSubmit(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Grant Sanction</span>
            <h2 className="text-base font-bold text-slate-900">Sanction New Innovation Project</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. IoT Dam Water Contamination Early Alert System"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Domain / Sector</label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
              >
                {SECTOR_OPTIONS.filter((s) => s !== 'All Sectors').map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">District Location</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
              >
                {DISTRICT_OPTIONS.filter((d) => d !== 'All Districts').map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Operating HEI / University</label>
              <input
                type="text"
                required
                value={formData.hei}
                onChange={(e) => setFormData({ ...formData, hei: e.target.value })}
                placeholder="e.g. BIT Sindri"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Team Lead / PI Name</label>
              <input
                type="text"
                required
                value={formData.teamLead}
                onChange={(e) => setFormData({ ...formData, teamLead: e.target.value })}
                placeholder="e.g. Dr. Rajeshwar Prasad"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Sanctioned Grant</label>
              <input
                type="text"
                value={formData.sanctionedGrant}
                onChange={(e) => setFormData({ ...formData, sanctionedGrant: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Initial Disbursal</label>
              <input
                type="text"
                value={formData.disbursedAmount}
                onChange={(e) => setFormData({ ...formData, disbursedAmount: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Initial TRL Level</label>
              <select
                value={formData.trlLevel}
                onChange={(e) => setFormData({ ...formData, trlLevel: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
              >
                {['TRL-2', 'TRL-3', 'TRL-4', 'TRL-5', 'TRL-6', 'TRL-7'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Hardware / Solution Specs</label>
            <textarea
              rows={2}
              value={formData.hardwareSpecs}
              onChange={(e) => setFormData({ ...formData, hardwareSpecs: e.target.value })}
              placeholder="Brief description of microcontrollers, sensors, communication nodes..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              Confirm & Sanction Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
