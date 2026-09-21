import React, { useState } from 'react';
import { X, Loader2, UserPlus, Lock, Eye, EyeOff, Check } from 'lucide-react';

const generateRandomFacultyPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const parts = [['F', 'a', 'c', '@'].join('')];
  for (let i = 0; i < 8; i++) parts.push(chars.charAt(Math.floor(Math.random() * chars.length)));
  return parts.join('');
};

export const FacultyAddModal = ({
  isOpen,
  onClose,
  onAddFaculty
}) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: 'Associate Professor',
    department: 'Water Resources Engineering',
    email: '',
    phone: '',
    qualification: 'Ph.D. in Engineering',
    experience: '8 Years',
    specialization: 'Water Quality, IoT Sensors, Data Analysis',
    bio: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      password: formData.password || generateRandomFacultyPassword(),
      specialization: formData.specialization.split(',').map((s) => s.trim()).filter(Boolean),
      status: 'Active',
      availabilityStatus: 'Available'
    };
    await onAddFaculty(payload);
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200 shadow-2xs">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Onboard New Faculty Mentor</h3>
              <span className="text-[10px] text-slate-400">Add credentials and login access</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs text-slate-700 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. A. K. Sharma"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">Designation</label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
              >
                <option value="Professor & Head">Professor & Head</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
              >
                <option value="Water Resources Engineering">Water Resources Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Chemistry & Environmental Sciences">Chemistry & Environmental Sciences</option>
                <option value="Agriculture & Rural Tech">Agriculture & Rural Tech</option>
                <option value="Management Studies">Management Studies</option>
              </select>
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 10 Years"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@university.ac.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-1.5">
            <label className="block text-[10.5px] font-bold text-emerald-950 uppercase tracking-wider flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Login Password (For Faculty Portal Access) *</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Set password (default: Faculty@123456)"
                className="w-full pl-3 pr-9 py-2 bg-white border border-emerald-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-emerald-800">
              This password will be securely hashed and stored so the faculty mentor can immediately log in with their email.
            </p>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">Domain Specializations (Comma Separated)</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Water Quality, IoT Sensors, Geospatial Hydrology"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Onboard & Grant Access</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyAddModal;
