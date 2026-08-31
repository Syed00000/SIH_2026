import React from 'react';
import { GraduationCap, Sparkles, BookOpen, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';

const DEPARTMENTS = [
  'Water Resources Engineering',
  'Computer Science & Engineering',
  'Civil & Environmental Engineering',
  'Electrical & Electronics Engineering',
  'Biotechnology & Life Sciences',
  'Mechanical & Rural Technology',
  'Renewable Energy & Sustainability'
];

export const FacultyOnboardFormFields = ({
  formData,
  setFormData,
  showPassword,
  setShowPassword
}) => {
  return (
    <div className="space-y-4 text-left">
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
          <GraduationCap className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Personal & Academic Credentials
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name with Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Ramesh Soren"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Academic Designation *</label>
            <select
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs cursor-pointer"
            >
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Head of Department">Head of Department</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Academic Department *</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Official University Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. ramesh.soren@university.ac.in"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Research Specialization</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Research Specialization & Keywords</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Water Quality, IoT Sensors, Data Analysis"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Professional Bio & Research Focus</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Provide a brief summary of faculty achievements and research domain..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs leading-relaxed"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Security & Mentorship Capacity</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Max Active Projects</label>
            <input
              type="number"
              min={1}
              max={10}
              value={formData.maxProjects}
              onChange={(e) => setFormData({ ...formData, maxProjects: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Initial Password (Optional)</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Default: Faculty@123456"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyOnboardFormFields;
