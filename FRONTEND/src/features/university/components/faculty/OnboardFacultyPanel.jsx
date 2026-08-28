import React, { useState } from 'react';
import {
  UserPlus,
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
  Info
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const OnboardFacultyPanel = ({ onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    maxProjects: 4,
    availabilityStatus: 'Available',
    password: ''
  });

  const initials = formData.name
    ? formData.name.replace(/^Dr\.\s*|^Prof\.\s*/i, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'FM'
    : 'FM';

  const specsList = formData.specialization
    ? formData.specialization.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

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
        status: 'Active',
        availabilityStatus: formData.availabilityStatus || 'Available',
        activeProjects: 0,
        completedProjects: 0
      };

      await universityApiService.createFaculty(payload);
      setSuccessMessage(`Faculty mentor "${formData.name}" successfully registered and onboarded into Ranchi University node!`);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else if (onBack) onBack();
      }, 1200);
    } catch (err) {
      console.error('Failed to onboard faculty:', err);
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
            <span>/</span>
            <span className="text-slate-900 font-bold">Onboard New Faculty</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-slate-900" />
            <span>Onboard New Faculty Mentor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Register academic faculty researchers and verify domain specialization for SIH 2026 grassroots innovation mentorship.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Faculty Directory</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center space-x-2.5 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form + Live Preview Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Comprehensive Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card 1: Academic & Personal Credentials */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <GraduationCap className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Personal & Academic Credentials
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Full Name with Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Soren"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Academic Designation *
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Professor & Head">Professor & Head</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Senior Scientist / Research Fellow">Senior Scientist / Research Fellow</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Primary Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Water Resources Engineering">Water Resources Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Chemistry & Environmental Science">Chemistry & Environmental Science</option>
                  <option value="Agriculture & Agronomy">Agriculture & Agronomy</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                  <option value="Management Studies">Management Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. Ph.D. in Water Resources (IIT Roorkee)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Total Research & Teaching Experience
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g. 10 Years (5 Years Industry / Lab)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Contact & Official Verification */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official Contact & Institutional Verification
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Official Institutional Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh.soren@ru.ac.in"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs font-mono"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Official Mobile / Extension
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98351 22334"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs font-mono"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Create Login Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Set initial login password for faculty"
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

          {/* Card 3: Domain Specialization & Research Summary */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <Award className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Domain Specialization & Grassroots Experience
              </h2>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Skills & Technical Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. Water Quality, IoT Sensors, GIS Mapping, Arsenic Treatment, Telemetry"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {specsList.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 rounded text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Research Profile & Grassroots Innovation Summary
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief summary of research experience, previous government / industry innovation grants, laboratory setup, and student mentorship track record..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end space-x-3 pt-2">
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
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2 shadow-xs disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              <span>{loading ? 'Onboarding...' : 'Onboard & Register Faculty'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Live ID Preview & Institutional Rules (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Live ID Card Preview */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                Live Directory Preview
              </span>
              <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Live Card</span>
              </span>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-lg bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-xs truncate leading-tight">
                    {formData.name || 'Faculty Member Name'}
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold mt-0.5 truncate">
                    {formData.designation}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">
                    {formData.department}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px]">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <span className="font-mono text-slate-800 font-semibold truncate max-w-[170px]">
                    {formData.email || 'faculty@ru.ac.in'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Experience:</span>
                  <span className="font-bold text-slate-800">{formData.experience || '8 Years'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span className="inline-flex items-center space-x-1.5 font-semibold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Specialization Tags
                </span>
                <div className="flex flex-wrap gap-1">
                  {specsList.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {specsList.length > 3 && (
                    <span className="text-[10px] font-medium text-slate-400 self-center">
                      +{specsList.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Mentorship Compliance Guidelines */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>Mentorship Guidelines</span>
            </div>

            <ul className="text-[11px] text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start space-x-1.5">
                <span className="text-slate-400 mt-0.5">&bull;</span>
                <span>Mentors receive direct challenge notifications triaged by the State AI Engine.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-slate-400 mt-0.5">&bull;</span>
                <span>Maximum concurrent capacity is capped at <strong>4 innovation challenges</strong> per semester.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-slate-400 mt-0.5">&bull;</span>
                <span>All onboarded faculty are indexed for auto-matching in the Government of Jharkhand portal.</span>
              </li>
            </ul>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center space-x-2 text-[10.5px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Data is synced live to MongoDB Atlas database.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OnboardFacultyPanel;
