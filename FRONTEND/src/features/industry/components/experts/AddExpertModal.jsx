import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { industryExpertService } from '../../services/industryExpertService.js';

export const AddExpertModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    specialization: '',
    email: '',
    phone: '',
    experienceYears: 6,
    bio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.designation.trim() || !formData.specialization.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill all mandatory fields marked with an asterisk (*).');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        industryName: user?.organizationName || user?.legalName || 'Ariba Research Labs',
        experienceYears: Number(formData.experienceYears) || 5
      };
      await industryExpertService.createExpert(payload);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to register expert.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-black text-[10px] tracking-wider text-slate-300">R&D TALENT ONBOARDING</span>
              <h2 className="text-sm font-black text-white">Register Industrial Expert / Engineer</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 bg-[#fafafa] overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-xs font-bold text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-700">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Dr. Alok Verma"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-700">Designation / Role *</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                placeholder="e.g. Principal Automation Specialist"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-700">Technical Specialization / Domain *</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => handleChange('specialization', e.target.value)}
              placeholder="e.g. IoT Telemetry, Embedded Systems & Sensor Calibration"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-700">Corporate Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="alok.verma@ariba.tech"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-700">Contact Number *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98350 11223"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-700">Experience (Years)</label>
            <input
              type="number"
              min={1}
              max={40}
              value={formData.experienceYears}
              onChange={(e) => handleChange('experienceYears', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-700">Short Bio / Credentials</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Brief overview of research background, patents, or past university mentorships..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
          </div>
        </form>

        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-end space-x-2.5 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Registering...' : 'Register Expert'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpertModal;
