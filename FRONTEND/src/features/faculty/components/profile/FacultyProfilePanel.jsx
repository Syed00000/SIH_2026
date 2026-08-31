import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Building2,
  Award,
  BookOpen,
  CheckCircle2,
  Save,
  Loader2
} from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';

export const FacultyProfilePanel = ({ faculty, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: faculty?.name || '',
    designation: faculty?.designation || 'Senior Research Scientist',
    department: faculty?.department || 'Electrical & Electronics',
    email: faculty?.email || '',
    phone: faculty?.phone || '+91 98765 43210',
    qualification: faculty?.qualification || 'Ph.D. in Engineering',
    experience: faculty?.experience || '10 Years',
    specialization: Array.isArray(faculty?.specialization)
      ? faculty.specialization.join(', ')
      : faculty?.specialization || 'IoT, Sensor Systems, Microelectronics',
    bio: faculty?.bio || ''
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await universityApiService.updateFaculty(faculty._id || faculty.email, {
        ...formData,
        specialization: formData.specialization.split(',').map((s) => s.trim()).filter(Boolean)
      });
      setSavedSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Profile update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Faculty Research Node</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Academic Faculty Profile</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <User className="w-5 h-5 text-[#007A61]" />
            <span>Faculty Mentor Credentials & Lab Node</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your academic credentials, research domains, and official contact details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-[#007A61] text-white font-black text-lg flex items-center justify-center shadow-xs">
            {formData.name.slice(0, 2).toUpperCase() || 'FM'}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">{formData.name}</h2>
            <p className="text-xs text-slate-500">{formData.designation} • {formData.department}</p>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold mt-1 inline-block">
              {faculty?.universityCode || 'Ranchi University (RU001)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Highest Qualification</label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Research Specializations</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. IoT, Sensors, Environmental Telemetry"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Profile Updated!' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacultyProfilePanel;
