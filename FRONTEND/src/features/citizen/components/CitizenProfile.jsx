import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Camera,
  FileText,
  HelpCircle,
  ChevronRight,
  Bell,
  Edit2,
  Save,
  X,
  Upload,
  Check
} from 'lucide-react';

export const CitizenProfile = ({ user, onChangeTab }) => {
  const [profilePhoto, setProfilePhoto] = useState(
    user?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  );
  const [tempSelectedPhoto, setTempSelectedPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Tauqueer Wasi',
    mobileNumber: user?.mobileNumber || '7061838495',
    email: user?.email || 'tauqueerwasi@gmail.com',
    district: user?.district || 'Ranchi',
    block: user?.block || 'Kanke Block'
  });

  // Handle local file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempSelectedPhoto(imageUrl);
    }
  };

  // Confirm & Persist Selected Photo
  const handleSavePhoto = () => {
    if (tempSelectedPhoto) {
      setProfilePhoto(tempSelectedPhoto);
      setTempSelectedPhoto(null);
    }
    setShowPhotoModal(false);
  };

  return (
    <div className="space-y-5 text-left pb-6 animate-fadeIn">
      {/* Citizen ID Card Header */}
      <div className="relative bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Profile Avatar with Camera Trigger */}
            <div
              className="relative group cursor-pointer"
              onClick={() => {
                setTempSelectedPhoto(null);
                setShowPhotoModal(true);
              }}
              title="Click to change profile picture"
            >
              <img
                src={profilePhoto}
                alt={formData.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-2xs group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Name & Jurisdiction Meta */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">{formData.fullName}</h2>
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Citizen</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{formData.district}, Jharkhand</span>
              </p>
            </div>
          </div>

          {/* Edit Profile Action */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            {isEditing ? (
              <>
                <Save className="w-3.5 h-3.5 text-emerald-700" />
                <span>Done Editing</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Real Activity Stats Row */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
            <span className="block text-xs font-semibold text-slate-500">Submissions</span>
            <span className="text-base font-extrabold text-slate-900 mt-0.5 block">1 Challenge</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
            <span className="block text-xs font-semibold text-slate-500">Under Review</span>
            <span className="text-base font-extrabold text-amber-700 mt-0.5 block">1 Active</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
            <span className="block text-xs font-semibold text-slate-500">Resolved</span>
            <span className="text-base font-extrabold text-emerald-800 mt-0.5 block">0 Completed</span>
          </div>
        </div>
      </div>

      {/* Registered Citizen Information */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Registered Citizen Information
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
            <span className="text-slate-500 font-medium flex items-center">
              <User className="w-3.5 h-3.5 mr-2 text-slate-400" />
              Full Name
            </span>
            {isEditing ? (
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="font-bold text-slate-900 px-2 py-1 border border-slate-200 rounded-md text-xs bg-slate-50"
              />
            ) : (
              <span className="font-bold text-slate-900">{formData.fullName}</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
            <span className="text-slate-500 font-medium flex items-center">
              <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
              Mobile Number
            </span>
            {isEditing ? (
              <input
                type="text"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="font-bold text-slate-900 px-2 py-1 border border-slate-200 rounded-md text-xs bg-slate-50"
              />
            ) : (
              <span className="font-bold text-slate-900">{formData.mobileNumber}</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
            <span className="text-slate-500 font-medium flex items-center">
              <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
              Email Address
            </span>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="font-bold text-slate-900 px-2 py-1 border border-slate-200 rounded-md text-xs bg-slate-50"
              />
            ) : (
              <span className="font-bold text-slate-900">{formData.email}</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
            <span className="text-slate-500 font-medium flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400" />
              District & Jurisdiction
            </span>
            <span className="font-bold text-slate-900">
              Government of Jharkhand, Department of Higher and Technical Education ({formData.district})
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-2 shadow-2xs divide-y divide-slate-100">
        <button
          onClick={() => onChangeTab && onChangeTab('challenges')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <FileText className="w-4 h-4 text-emerald-800" />
            <span>My Submitted Problems</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => alert('SMS & Email notifications active for live resolution updates.')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <Bell className="w-4 h-4 text-slate-600" />
            <span>Notification & SMS Preferences</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onChangeTab && onChangeTab('guidelines')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <HelpCircle className="w-4 h-4 text-slate-600" />
            <span>Help Center & Guidelines</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Photo Upload Modal (Choose File + Save Action) */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-lg p-5 shadow-2xl border border-slate-200 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Upload Profile Photo</h4>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Choose File Area */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Select Photo from Device
              </label>

              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50/50">
                <input
                  type="file"
                  id="profile-file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="profile-file-input" className="cursor-pointer flex flex-col items-center space-y-1.5">
                  <Upload className="w-6 h-6 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-800">Choose Image File</span>
                  <span className="text-[11px] text-slate-500">JPG, PNG or WEBP (Max 5MB)</span>
                </label>
              </div>

              {/* Preview Selected Photo */}
              {tempSelectedPhoto && (
                <div className="flex items-center space-x-3 pt-2">
                  <img
                    src={tempSelectedPhoto}
                    alt="Selected preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600 shadow-2xs"
                  />
                  <div className="text-xs text-emerald-800 font-semibold flex items-center space-x-1">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Photo Ready to Save</span>
                  </div>
                </div>
              )}
            </div>

            {/* Save CTA */}
            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhoto}
                disabled={!tempSelectedPhoto}
                className="flex-1 py-2 rounded-lg bg-[#064e3b] hover:bg-[#047857] disabled:opacity-50 text-white text-xs font-bold cursor-pointer shadow-2xs transition-all flex items-center justify-center space-x-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenProfile;
