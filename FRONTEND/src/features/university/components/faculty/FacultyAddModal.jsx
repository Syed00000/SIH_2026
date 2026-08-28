import React, { useState } from 'react';
import { X, Loader2, UserPlus, Check } from 'lucide-react';

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
    bio: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      specialization: formData.specialization.split(',').map((s) => s.trim()).filter(Boolean),
      status: 'Active',
      availabilityStatus: 'Available'
    };
    await onAddFaculty(payload);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-slate-200 rounded-none shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-slate-900" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Onboard New Faculty Mentor</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Ramesh Soren"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Designation</label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900"
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
              <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900"
              >
                <option value="Water Resources Engineering">Water Resources Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Management Studies">Management Studies</option>
              </select>
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 10 Years"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. ramesh.soren@ru.ac.in"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98351 22334"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Skills & Specializations (Comma Separated)</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Water Quality, IoT, GIS Mapping, Treatment"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Research Profile Summary</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Summary of research expertise and previous innovation projects..."
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 rounded-none text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-none text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{loading ? 'Saving to Database...' : 'Register Faculty'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyAddModal;
