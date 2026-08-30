import React from 'react';
import { MapPin, User, Image as ImageIcon, Loader2, ShieldCheck } from 'lucide-react';
import { CitizenThemedSelect } from './CitizenThemedSelect.jsx';

const JHARKHAND_DISTRICTS = [
  'Ranchi', 'Dhanbad', 'Bokaro', 'East Singhbhum', 'West Singhbhum', 'Palamu',
  'Hazaribagh', 'Deoghar', 'Dumka', 'Giridih', 'Ramgarh', 'Khunti', 'Gumla',
  'Simdega', 'Lohardaga', 'Latehar', 'Garhwa', 'Chatra', 'Koderma', 'Jamtara',
  'Godda', 'Pakur', 'Sahibganj', 'Seraikela Kharsawan'
];

const DOMAINS = [
  'Education', 'Healthcare', 'Agriculture', 'Water Resources', 'Environment',
  'Energy', 'Urban Development', 'Accessibility', 'Public Administration',
  'Rural Livelihoods', 'Other'
];

const SUBMITTER_ROLES = [
  'Citizen', 'Student / Youth', 'Farmer', 'Social Worker', 'NGO Representative',
  'Local Resident', 'Other'
];

export const SubmitChallengeFormFields = ({
  formData,
  setFormData,
  handleChange,
  handlePresetPhoto,
  customDomain,
  setCustomDomain,
  isCustomMode,
  setIsCustomMode,
  loading,
  onClose
}) => {
  return (
    <>
      {/* 1. Problem Overview */}
      <div className="space-y-4 pb-5 border-b border-slate-100">
        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">1. Problem Overview</span>
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Problem Title / Heading <span className="text-rose-500">*</span></label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Poor Drainage and Waterlogging in Community Roads"
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800">Challenge Area / Domain <span className="text-rose-500">*</span></label>
              <button
                type="button"
                onClick={() => {
                  const next = !isCustomMode;
                  setIsCustomMode(next);
                  setFormData((prev) => ({ ...prev, domain: next ? 'Other' : 'Urban Development' }));
                }}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                {isCustomMode ? '← Choose Standard' : '+ Add Custom Domain'}
              </button>
            </div>
            {isCustomMode ? (
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="Type custom domain (e.g., Solar Energy...)"
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-emerald-500 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-2xs"
                required
                autoFocus
              />
            ) : (
              <CitizenThemedSelect
                value={formData.domain}
                onChange={(val) => {
                  if (val === 'Other') {
                    setIsCustomMode(true);
                    setFormData((prev) => ({ ...prev, domain: 'Other' }));
                  } else {
                    setFormData((prev) => ({ ...prev, domain: val }));
                  }
                }}
                options={DOMAINS.map((dom) => (dom === 'Other' ? { value: 'Other', label: '+ Other / Custom Domain' } : dom))}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Severity / Priority</label>
            <CitizenThemedSelect
              value={formData.priority}
              onChange={(val) => setFormData((prev) => ({ ...prev, priority: val }))}
              options={['Low', 'Medium', 'High', 'Critical']}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Detailed Problem Statement (Paragraph) <span className="text-rose-500">*</span></label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail: what is happening, where exactly is the problem, how long has it persisted, and how it impacts people..."
            className="w-full text-xs font-normal p-3 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            required
          />
        </div>
      </div>

      {/* 2. Location Details */}
      <div className="space-y-4 pb-5 border-b border-slate-100">
        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
          2. Location Details (Where is the problem?)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">District <span className="text-rose-500">*</span></label>
            <CitizenThemedSelect
              value={formData.district}
              onChange={(val) => setFormData((prev) => ({ ...prev, district: val }))}
              options={JHARKHAND_DISTRICTS}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Block / Sub-District</label>
            <input
              type="text"
              name="block"
              value={formData.block}
              onChange={handleChange}
              placeholder="e.g., Kanke, Torpa, Chas"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Landmark / Area</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="e.g., Near Morabadi Ground"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="e.g., 834008"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 3. Submitter Information */}
      <div className="space-y-4 pb-5 border-b border-slate-100">
        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block flex items-center">
          <User className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
          3. Submitter Information (Who are you?)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Your Role / Designation <span className="text-rose-500">*</span></label>
            <CitizenThemedSelect
              value={formData.submitterRole}
              onChange={(val) => setFormData((prev) => ({ ...prev, submitterRole: val }))}
              options={SUBMITTER_ROLES}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Full Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              name="submitterName"
              value={formData.submitterName}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Mobile Number</label>
            <input
              type="tel"
              name="submitterPhone"
              value={formData.submitterPhone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Email Address</label>
            <input
              type="email"
              name="submitterEmail"
              value={formData.submitterEmail}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 4. Photo Proof */}
      <div className="space-y-3">
        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block flex items-center">
          <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
          4. Image / Photo Proof (Optional)
        </span>
        <input
          type="url"
          name="mediaUrl"
          value={formData.mediaUrl}
          onChange={handleChange}
          placeholder="Paste image URL (or select sample photo below)"
          className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
        />
        <div className="flex items-center space-x-2 pt-0.5">
          <span className="text-xs text-slate-500 font-semibold">Quick Photo:</span>
          <button
            type="button"
            onClick={() => handlePresetPhoto('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=60')}
            className="text-xs px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg font-medium text-slate-700 cursor-pointer shadow-2xs"
          >
            🛣️ Damaged Road
          </button>
          <button
            type="button"
            onClick={() => handlePresetPhoto('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=60')}
            className="text-xs px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg font-medium text-slate-700 cursor-pointer shadow-2xs"
          >
            💧 Water Issue
          </button>
        </div>
        {formData.mediaUrl && (
          <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200 mt-2">
            <img src={formData.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="pt-4 flex items-center justify-end space-x-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="py-2.5 px-6 rounded-xl bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 active:scale-95"
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
    </>
  );
};

export default SubmitChallengeFormFields;
