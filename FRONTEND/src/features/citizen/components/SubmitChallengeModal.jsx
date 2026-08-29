import React, { useState } from 'react';
import {
  X,
  MapPin,
  User,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
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
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden text-left">
        {/* Header - Pure Title without AI/Sparkles icon */}
        <div className="px-5 py-3.5 bg-[#064e3b] text-white flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-base font-extrabold tracking-tight leading-snug">
              Submit a Problem Statement
            </h3>
            <p className="text-xs text-emerald-100 font-medium">
              Jharkhand Societal Innovation Portal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Success State */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {submittedChallenge ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 border-2 border-emerald-600 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-2xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">
                  Challenge Submitted Successfully!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your problem statement has been filed under Jharkhand Societal Innovation Hub.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-lg p-4 max-w-sm mx-auto text-left space-y-2 shadow-2xs">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-600">Challenge Reference ID:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {submittedChallenge.challengeId}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-600">Current Status:</span>
                  <span className="font-bold text-amber-700">
                    {submittedChallenge.status || 'Under Review'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-600">Assigned Area:</span>
                  <span className="font-bold text-slate-900">
                    {submittedChallenge.domain || formData.domain}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmittedChallenge(null);
                    onClose();
                  }}
                  className="w-full bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold py-2.5 rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  View My Challenges
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Problem Heading & Category (Clean Section Layout without Colored Container Boxes) */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  1. Problem Overview
                </span>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Problem Title / Heading <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Poor Drainage and Waterlogging in Community Roads"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors shadow-2xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Challenge Area <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      className="w-full text-xs font-medium px-3 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
                    >
                      {DOMAINS.map((dom) => (
                        <option key={dom} value={dom}>
                          {dom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Severity / Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full text-xs font-medium px-3 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Detailed Problem Statement (Paragraph) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the issue in detail: what is happening, where exactly is the problem, how long has it persisted, and how it impacts people..."
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors shadow-2xs"
                    required
                  />
                </div>
              </div>

              {/* 2. Address & Location (Clean Section Layout without Colored Container Boxes) */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  2. Location Details (Where is the problem?)
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      District <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full text-xs font-medium px-3 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
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
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Block / Sub-District
                    </label>
                    <input
                      type="text"
                      name="block"
                      value={formData.block}
                      onChange={handleChange}
                      placeholder="e.g., Kanke, Torpa, Chas"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Landmark / Area
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="e.g., Near Morabadi Football Ground"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="e.g., 834008"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Submitter Details (Clean Section Layout without Colored Container Boxes) */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  3. Submitter Information (Who are you?)
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Your Role / Designation <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="submitterRole"
                      value={formData.submitterRole}
                      onChange={handleChange}
                      className="w-full text-xs font-medium px-3 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
                    >
                      {SUBMITTER_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="submitterName"
                      value={formData.submitterName}
                      onChange={handleChange}
                      placeholder="e.g., Tauqueer Wasi"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="submitterPhone"
                      value={formData.submitterPhone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Designation / Organization (Optional)
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g., Village Representative / SHG"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Photo Evidence & Quick Preset */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center">
                  <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  4. Image / Photo Proof (Optional)
                </span>

                <div>
                  <input
                    type="url"
                    name="mediaUrl"
                    value={formData.mediaUrl}
                    onChange={handleChange}
                    placeholder="Paste image URL (or select sample photo below)"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-lg bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                  />
                </div>

                {/* Sample Presets */}
                <div className="flex items-center space-x-2 pt-0.5">
                  <span className="text-xs text-slate-500 font-semibold">Quick Photo Preset:</span>
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetPhoto(
                        'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=60'
                      )
                    }
                    className="text-xs px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-md font-medium text-slate-700 cursor-pointer shadow-2xs"
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
                    className="text-xs px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-md font-medium text-slate-700 cursor-pointer shadow-2xs"
                  >
                    💧 Water Issue
                  </button>
                </div>

                {formData.mediaUrl && (
                  <div className="w-24 h-16 rounded-lg overflow-hidden border border-slate-200 mt-2">
                    <img
                      src={formData.mediaUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Submit CTA Buttons */}
              <div className="pt-3 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 py-2.5 rounded-lg bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 active:scale-95"
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
