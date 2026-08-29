import React, { useState } from 'react';
import {
  X,
  Plus,
  MapPin,
  FileText,
  User,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Building,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { citizenService } from '../services/citizenService.js';

const JHARKHAND_DISTRICTS = [
  'Ranchi',
  'Dhanbad',
  'Bokaro',
  'East Singhbhum',
  'West Singhbhum',
  'Palamu',
  'Hazaribagh',
  'Deoghar',
  'Dumka',
  'Giridih',
  'Ramgarh',
  'Khunti',
  'Gumla',
  'Simdega',
  'Lohardaga',
  'Latehar',
  'Garhwa',
  'Chatra',
  'Koderma',
  'Jamtara',
  'Godda',
  'Pakur',
  'Sahibganj',
  'Seraikela Kharsawan'
];

const DOMAINS = [
  'Education',
  'Healthcare',
  'Agriculture',
  'Water Resources',
  'Environment',
  'Energy',
  'Urban Development',
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods',
  'Other'
];

const SUBMITTER_ROLES = [
  'Citizen',
  'Student / Youth',
  'Farmer',
  'Social Worker',
  'NGO Representative',
  'Local Resident',
  'Other'
];

export const SubmitChallengeModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Urban Development',
    description: '',
    district: 'Ranchi',
    block: '',
    panchayatOrWard: '',
    landmark: '',
    pincode: '',
    fullAddress: '',
    submitterName: user?.fullName || '',
    submitterPhone: user?.mobileNumber || '',
    submitterEmail: user?.email || '',
    submitterRole: 'Citizen',
    designation: '',
    organization: '',
    priority: 'Medium',
    affectedPopulation: '',
    mediaUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedChallenge, setSubmittedChallenge] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePresetPhoto = (url) => {
    setFormData((prev) => ({ ...prev, mediaUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a challenge heading / title');
      return;
    }
    if (!formData.description.trim() || formData.description.length < 15) {
      setError('Please provide a detailed problem statement of at least 15 characters');
      return;
    }
    if (!formData.district) {
      setError('Please select a district in Jharkhand');
      return;
    }
    if (!formData.submitterName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        domain: formData.domain,
        description: formData.description,
        district: formData.district,
        block: formData.block,
        panchayatOrWard: formData.panchayatOrWard,
        landmark: formData.landmark,
        pincode: formData.pincode,
        fullAddress:
          formData.fullAddress ||
          `${formData.landmark ? formData.landmark + ', ' : ''}${
            formData.block ? formData.block + ', ' : ''
          }${formData.district}, Jharkhand`,
        submitterName: formData.submitterName,
        submitterPhone: formData.submitterPhone || '9876543210',
        submitterEmail: formData.submitterEmail,
        submitterRole: formData.submitterRole,
        designation: formData.designation,
        organization: formData.organization,
        priority: formData.priority,
        affectedPopulation: formData.affectedPopulation || '~ 1,000+ residents',
        mediaUrls: formData.mediaUrl
          ? [{ url: formData.mediaUrl, caption: 'Submitted issue photo' }]
          : []
      };

      const result = await citizenService.submitChallenge(payload);
      setSubmittedChallenge(result);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError(err.message || 'Failed to submit problem statement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#064e3b] to-[#047857] text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight leading-tight">
                Submit a Problem Statement
              </h3>
              <p className="text-[11px] text-emerald-100/90 leading-tight">
                Jharkhand Societal Innovation Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Success State */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {submittedChallenge ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  Challenge Submitted Successfully!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your problem statement has been filed under Jharkhand Societal Innovation Hub.
                </p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 max-w-sm mx-auto text-left space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-emerald-800">Challenge Reference ID:</span>
                  <span className="font-mono font-black text-emerald-950">
                    {submittedChallenge.challengeId}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-emerald-800">Current Status:</span>
                  <span className="font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded text-[10px]">
                    {submittedChallenge.status || 'Under Review'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-emerald-800">Assigned Area:</span>
                  <span className="font-bold text-emerald-900">
                    {submittedChallenge.domain || formData.domain}
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    setSubmittedChallenge(null);
                    onClose();
                  }}
                  className="w-full bg-[#047857] hover:bg-[#064e3b] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  View My Challenges
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Problem Heading & Category */}
              <div className="space-y-3 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  1. Problem Overview
                </span>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Problem Title / Heading <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Poor Drainage and Waterlogging in Community Roads"
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Challenge Area <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                    >
                      {DOMAINS.map((dom) => (
                        <option key={dom} value={dom}>
                          {dom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Severity / Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detailed Problem Statement (Paragraph) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the issue in detail: what is happening, where exactly is the problem, how long has it persisted, and how it impacts people..."
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              {/* 2. Address & Location */}
              <div className="space-y-3 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  2. Location Details (Where is the problem?)
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      District <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                      required
                    >
                      {JHARKHAND_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Block / Sub-District
                    </label>
                    <input
                      type="text"
                      name="block"
                      value={formData.block}
                      onChange={handleChange}
                      placeholder="e.g., Kanke, Torpa, Chas"
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Landmark / Area
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="e.g., Near Morabadi Football Ground"
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="e.g., 834008"
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Submitter Details (Who are you?) */}
              <div className="space-y-3 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center">
                  <User className="w-3.5 h-3.5 mr-1" />
                  3. Submitter Information (Who are you?)
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Role / Designation <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="submitterRole"
                      value={formData.submitterRole}
                      onChange={handleChange}
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                    >
                      {SUBMITTER_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="submitterName"
                      value={formData.submitterName}
                      onChange={handleChange}
                      placeholder="e.g., Tauqueer Wasi"
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="submitterPhone"
                      value={formData.submitterPhone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Designation / Organization (Optional)
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g., Village Representative / SHG"
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Photo Evidence & Quick Preset */}
              <div className="space-y-2.5 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center">
                  <ImageIcon className="w-3.5 h-3.5 mr-1" />
                  4. Image / Photo Proof (Optional)
                </span>

                <div>
                  <input
                    type="url"
                    name="mediaUrl"
                    value={formData.mediaUrl}
                    onChange={handleChange}
                    placeholder="Paste image URL (or select sample photo below)"
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                {/* Sample Presets */}
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-[10px] text-slate-500 font-semibold">Quick Photo Preset:</span>
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetPhoto(
                        'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=60'
                      )
                    }
                    className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 hover:border-emerald-400 rounded-md font-medium text-slate-700 cursor-pointer"
                  >
                    🛣️ Damaged Road
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetPhoto(
                        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=60'
                      )
                    }
                    className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 hover:border-emerald-400 rounded-md font-medium text-slate-700 cursor-pointer"
                  >
                    💧 Water Issue
                  </button>
                </div>

                {formData.mediaUrl && (
                  <div className="w-24 h-16 rounded-lg overflow-hidden border border-emerald-200 mt-2">
                    <img
                      src={formData.mediaUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-[#064e3b] to-[#047857] hover:from-[#047857] hover:to-[#059669] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting to Portal...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Problem Statement</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitChallengeModal;
