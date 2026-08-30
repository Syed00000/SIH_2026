import React, { useState, useEffect } from 'react';
import {
  Edit3,
  ArrowLeft,
  GraduationCap,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Award,
  Sparkles,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  BookOpen,
  Info,
  Save,
  Clock,
  UserCheck
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const EditFacultyPanel = ({ faculty, onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const initialSpecs = Array.isArray(faculty?.specialization)
    ? faculty.specialization.join(', ')
    : typeof faculty?.specialization === 'string'
    ? faculty.specialization
    : 'Water Quality, IoT Sensors, Data Analysis';

  const [formData, setFormData] = useState({
    name: faculty?.name || '',
    designation: faculty?.designation || 'Associate Professor',
    department: faculty?.department || 'Water Resources Engineering',
    email: faculty?.email || '',
    phone: faculty?.phone || '',
    qualification: faculty?.qualification || 'Ph.D. in Engineering',
    experience: faculty?.experience || '8 Years',
    specialization: initialSpecs,
    bio: faculty?.bio || '',
    maxProjects: faculty?.maxProjects || 4,
    availabilityStatus: faculty?.availabilityStatus || 'Available',
    status: faculty?.status || 'Active',
    password: faculty?.password || ''
  });

  useEffect(() => {
    if (faculty) {
      const specs = Array.isArray(faculty.specialization)
        ? faculty.specialization.join(', ')
        : typeof faculty.specialization === 'string'
        ? faculty.specialization
        : '';
      setFormData({
        name: faculty.name || '',
        designation: faculty.designation || 'Associate Professor',
        department: faculty.department || 'Water Resources Engineering',
        email: faculty.email || '',
        phone: faculty.phone || '',
        qualification: faculty.qualification || 'Ph.D. in Engineering',
        experience: faculty.experience || '8 Years',
        specialization: specs,
        bio: faculty.bio || '',
        maxProjects: faculty.maxProjects || 4,
        availabilityStatus: faculty.availabilityStatus || 'Available',
        status: faculty.status || 'Active',
        password: faculty.password || ''
      });
    }
  }, [faculty]);

  if (!faculty) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No faculty selected for editing.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
        >
          Back to Faculty Mentors
        </button>
      </div>
    );
  }

  const initials = formData.name
    ? formData.name.replace(/^Dr\.\s*|^Prof\.\s*/i, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'FM'
    : 'FM';

  const specsList = formData.specialization
    ? formData.specialization.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleQuickAddSkill = (skill) => {
    if (!specsList.includes(skill)) {
      const updated = specsList.length > 0 ? `${formData.specialization}, ${skill}` : skill;
      setFormData({ ...formData, specialization: updated });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = specsList.filter((s) => s !== skillToRemove).join(', ');
    setFormData({ ...formData, specialization: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        designation: formData.designation,
        department: formData.department,
        email: formData.email,
        phone: formData.phone || '+91 98351 22334',
        qualification: formData.qualification,
        experience: formData.experience,
        specialization: specsList.length > 0 ? specsList : ['Applied Research', 'Innovation'],
        bio: formData.bio || `${formData.name} is specialized in ${formData.department} with active contributions to grassroots research.`,
        status: formData.status || 'Active',
        availabilityStatus: formData.availabilityStatus || 'Available',
        maxProjects: Number(formData.maxProjects) || 4,
        ...(formData.password ? { password: formData.password } : {})
      };

      const facultyId = faculty._id || faculty.id || faculty.facultyId || faculty.name;
      const updated = await universityApiService.updateFaculty(facultyId, payload);
      setSuccessMessage(`Faculty profile for "${formData.name}" updated successfully!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(updated);
        else if (onBack) onBack();
      }, 1000);
    } catch (err) {
      console.error('Failed to update faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-slate-900" onClick={onBack}>Faculty Mentors</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:text-slate-900" onClick={onBack}>{faculty.name}</span>
            <span>&gt;</span>
            <span className="text-slate-900 font-bold">Edit Profile</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-slate-900" />
            <span>Edit Faculty Mentor Profile</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update faculty mentor information, academic credentials, research domain, and institutional login credentials.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </button>
          <button
            form="edit-faculty-form"
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2.5 text-xs font-bold shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Form Left (8 cols), Preview & Summary Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Edit Form */}
        <form
          id="edit-faculty-form"
          onSubmit={handleSubmit}
          className="lg:col-span-8 space-y-4"
        >
          {/* Card 1: Personal & Institutional Information */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-3.5">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <GraduationCap className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Personal & Institutional Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Full Name with Honorific *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Kumar"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Designation *
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Head of Department">Head of Department</option>
                  <option value="Dean of Research">Dean of Research</option>
                  <option value="Senior Research Scientist">Senior Research Scientist</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Department / School *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="Water Resources Engineering">Water Resources Engineering</option>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                  <option value="Civil & Environmental Engineering">Civil & Environmental Engineering</option>
                  <option value="Biotechnology & Bioinformatics">Biotechnology & Bioinformatics</option>
                  <option value="Renewable Energy Systems">Renewable Energy Systems</option>
                  <option value="Agriculture & Food Technology">Agriculture & Food Technology</option>
                  <option value="Mining & Geological Sciences">Mining & Geological Sciences</option>
                  <option value="Tribal Studies & Rural Management">Tribal Studies & Rural Management</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Highest Qualification *
                </label>
                <input
                  type="text"
                  required
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. Ph.D. in Computer Science"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Experience *
                </label>
                <input
                  type="text"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g. 10+ Years"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Official Contact & Institutional Credentials */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-3.5">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <Mail className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official Contact & Institutional Verification
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Official Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="faculty@ru.ac.in"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs font-mono"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Mobile / Contact Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 94311 00000"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs font-mono"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Update Login Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter new password or leave existing"
                    className="w-full pl-8 pr-9 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Domain Specialization & Research Areas */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-3.5">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <Award className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Domain Specialization & Research Tags
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Verified Specializations (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. Water Quality, IoT Sensors, Data Analysis, Solar Energy"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium"
                />
              </div>

              {/* Tag Pills Preview & Remove */}
              {specsList.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Skill Tags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {specsList.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-900 rounded-md text-[11px] font-bold flex items-center space-x-1.5"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(tag)}
                          className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                          title="Remove tag"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Tag Suggestions */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Quick Add Suggested Domain Skills:</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    'AI & Machine Learning',
                    'IoT & Remote Telemetry',
                    'Water Treatment & Quality',
                    'Renewable Solar Systems',
                    'Tribal Agri-Economics',
                    'Embedded Firmware',
                    'GIS & Spatial Mapping',
                    'Drone & LiDAR Surveys',
                    'Hydrology & Catchment'
                  ].map((skill, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickAddSkill(skill)}
                      className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Research Profile Summary & Biography
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Provide a concise summary of past field research, industrial patents, and district-level technology deployments..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Mentorship Status & Project Load */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-3.5">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <Clock className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Availability & Mentorship Capacity
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Availability Status *
                </label>
                <select
                  value={formData.availabilityStatus}
                  onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="Available">Available (Accepting Projects)</option>
                  <option value="In Project">In Project (Assigned)</option>
                  <option value="On Leave">On Leave (Sabbatical/Outstation)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Account Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Max Mentorship Capacity *
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={formData.maxProjects}
                  onChange={(e) => setFormData({ ...formData, maxProjects: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 shadow-2xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Bottom */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{loading ? 'Updating Faculty...' : 'Update Faculty Profile'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Profile Summary & Verification Preview */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Preview Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4 space-y-3.5">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Profile Preview</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-slate-900 truncate">{formData.name || 'Dr. Faculty Mentor'}</h3>
                <p className="text-[11px] text-slate-500 truncate">{formData.designation}</p>
                <p className="text-[10.5px] text-slate-400 truncate">{formData.department}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Faculty ID:</span>
                <span className="font-mono font-bold text-slate-900">
                  {faculty.facultyId || faculty.id || faculty._id?.slice(-6) || 'FAC-01'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Status:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  formData.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {formData.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Availability:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                  formData.availabilityStatus === 'In Project'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : formData.availabilityStatus === 'On Leave'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {formData.availabilityStatus}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Experience:</span>
                <span className="font-bold text-slate-900">{formData.experience || '10+ Years'}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-semibold">Qualification:</span>
                <span className="font-bold text-slate-900">{formData.qualification || 'Ph.D.'}</span>
              </div>
            </div>

            {/* Live Tags Preview */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Specialization Tags:</span>
              <div className="flex flex-wrap gap-1">
                {specsList.length === 0 ? (
                  <span className="text-[10px] text-slate-400 italic">No specializations specified</span>
                ) : (
                  specsList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 rounded text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Institutional Compliance Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4 space-y-2.5">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Institutional Node</span>
            </div>
            <p className="text-xs font-bold text-slate-800">Ranchi University (RU001)</p>
            <p className="text-[11px] text-slate-500">
              Department of Higher & Technical Education, Government of Jharkhand.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5 text-[10.5px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Updates sync immediately to State Higher Education Records.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFacultyPanel;
