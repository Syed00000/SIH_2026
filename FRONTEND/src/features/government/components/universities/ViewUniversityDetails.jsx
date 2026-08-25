import React, { useState, useEffect } from 'react';
import {
  Building2,
  User,
  Award,
  Layers,
  GraduationCap,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Pencil,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  FlaskConical,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X
} from 'lucide-react';

export const ViewUniversityDetails = ({ university, onBack, onEdit, onUpdateStatus }) => {
  const [currentUni, setCurrentUni] = useState(university);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (university) {
      setCurrentUni(university);
    }
  }, [university]);

  if (!currentUni) return null;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    // Optimistic UI state update
    setCurrentUni((prev) => ({
      ...prev,
      status: newStatus,
      accessStatus: newStatus === 'Approved' ? 'Enabled' : (newStatus === 'Rejected' ? 'Disabled' : prev?.accessStatus || 'Enabled')
    }));

    try {
      if (onUpdateStatus) {
        await onUpdateStatus(currentUni._id || currentUni.id, newStatus);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const loginEmail =
    currentUni.credentials?.loginEmail ||
    currentUni.nodalOfficer?.email ||
    currentUni.universityEmail ||
    'nodal@university.ac.in';

  const loginPassword =
    currentUni.credentials?.generatedPassword || 'HEI@Jharkhand2026!';

  const firstLetter = currentUni.name ? currentUni.name.charAt(0).toUpperCase() : 'U';

  const regDate = currentUni.createdAt
    ? new Date(currentUni.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '20 May 2025';

  return (
    <div className="space-y-6 animate-fadeIn select-none max-w-5xl mx-auto pb-10">
      {/* Top Breadcrumb & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <button
              onClick={onBack}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              User Governance
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              onClick={onBack}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Universities
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold">{currentUni.name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{currentUni.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {currentUni.code}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Universities</span>
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit University</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-sm border border-slate-700 flex-shrink-0">
            {firstLetter}
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-base font-bold text-slate-900">{currentUni.name}</h2>
              <span className="text-xs text-slate-500">({currentUni.shortName || currentUni.code})</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUni.district}, Jharkhand</span>
              </span>
              <span>•</span>
              <span>{currentUni.universityType}</span>
              <span>•</span>
              <span>Est. {currentUni.establishmentYear || '2012'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Review Status Control */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Review Status</span>
            <span
              className={`text-xs font-bold ${
                currentUni.status === 'Approved' || currentUni.status === 'Active'
                  ? 'text-emerald-700'
                  : currentUni.status === 'Pending'
                  ? 'text-amber-700'
                  : 'text-red-600'
              }`}
            >
              {currentUni.status || 'Approved'}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Portal Access</span>
            <span className={`text-xs font-bold ${currentUni.accessStatus === 'Enabled' ? 'text-emerald-700' : 'text-red-600'}`}>
              {currentUni.accessStatus || 'Enabled'}
            </span>
          </div>

          {/* Quick Approve / Reject Actions */}
          <div className="flex items-center space-x-2">
            {currentUni.status !== 'Approved' && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange('Approved')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{currentUni.status === 'Rejected' ? 'Re-Approve HEI' : 'Approve HEI'}</span>
              </button>
            )}
            {currentUni.status !== 'Rejected' && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange('Rejected')}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject HEI</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. Official HEI Login Credentials Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Official HEI Login Credentials</h3>
              <p className="text-[11px] text-slate-400">Generated by Government Admin for University Portal Login</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const creds = `University: ${currentUni.name}\nLogin ID: ${loginEmail}\nPassword: ${loginPassword}\nPortal Link: ${window.location.origin}/login`;
              handleCopy(creds, 'all');
            }}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
          >
            {copiedField === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>All Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Credentials Card</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Login Email */}
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Portal Login Email</span>
              <span className="text-xs font-bold text-white select-all">{loginEmail}</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(loginEmail, 'email')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Copy Email"
            >
              {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Generated Password */}
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Account Password</span>
              <span className="text-xs font-mono font-bold text-white select-all">
                {showPassword ? loginPassword : '••••••••••••'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title={showPassword ? 'Hide' : 'Show'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => handleCopy(loginPassword, 'password')}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Copy Password"
              >
                {copiedField === 'password' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-1">
          Representative university staff can use these credentials to log in at <strong>/login</strong> and submit problem proposals and research deliverables.
        </div>
      </div>

      {/* 2. Quick Summary / Capacity Metrics */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <GraduationCap className="w-4 h-4 text-slate-700" />
            <span>Capacity & Resource Strength</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Capacity: {currentUni.quickSummary?.capacityStatus || 'Available'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <BookOpen className="w-4 h-4 text-slate-700 mx-auto mb-1" />
            <div className="text-base font-black text-slate-900">{currentUni.quickSummary?.departments || 16}</div>
            <div className="text-[10px] text-slate-500 font-medium">Departments</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <User className="w-4 h-4 text-slate-700 mx-auto mb-1" />
            <div className="text-base font-black text-slate-900">{currentUni.quickSummary?.totalFaculty || 120}</div>
            <div className="text-[10px] text-slate-500 font-medium">Total Faculty</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <GraduationCap className="w-4 h-4 text-slate-700 mx-auto mb-1" />
            <div className="text-base font-black text-slate-900">{currentUni.quickSummary?.availableFaculty || 58}</div>
            <div className="text-[10px] text-slate-500 font-medium">Available R&D Faculty</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <FlaskConical className="w-4 h-4 text-slate-700 mx-auto mb-1" />
            <div className="text-base font-black text-slate-900">{currentUni.quickSummary?.labsAndFacilities || 28}</div>
            <div className="text-[10px] text-slate-500 font-medium">Labs & Facilities</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <Layers className="w-4 h-4 text-slate-700 mx-auto mb-1" />
            <div className="text-base font-black text-slate-900">{currentUni.quickSummary?.activeProjects || 14}</div>
            <div className="text-[10px] text-slate-500 font-medium">Active Projects</div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Data Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nodal Officer & Contact Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
            <User className="w-4 h-4 text-slate-700" />
            <span>Nodal Officer & Contacts</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Nodal Officer Name:</span>
              <span className="font-bold text-slate-900">{currentUni.nodalOfficer?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Designation:</span>
              <span className="font-medium text-slate-800">{currentUni.nodalOfficer?.designation || 'Registrar'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Nodal Email:</span>
              <span className="font-medium text-slate-800 select-all">{currentUni.nodalOfficer?.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Nodal Mobile:</span>
              <span className="font-medium text-slate-800">{currentUni.nodalOfficer?.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">General Email:</span>
              <span className="font-medium text-slate-800 select-all">{currentUni.universityEmail}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Landline / Phone:</span>
              <span className="font-medium text-slate-800">{currentUni.universityPhone || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Accreditation & Institutional Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-slate-700" />
            <span>Accreditation & Institutional Info</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">NAAC Grade:</span>
              <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200">
                {currentUni.accreditation?.naacGrade || 'A'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Accreditation Validity:</span>
              <span className="font-medium text-slate-800">{currentUni.accreditation?.validity || '2028-12-31'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">NIRF Ranking:</span>
              <span className="font-bold text-slate-900">
                {currentUni.accreditation?.nirfRanking ? `#${currentUni.accreditation.nirfRanking}` : 'State Tier / Unranked'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Institution Category:</span>
              <span className="font-medium text-slate-800">{currentUni.institutionCategory || 'University'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Official Website:</span>
              {currentUni.website ? (
                <a
                  href={currentUni.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <span>{currentUni.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Focus Areas / Expertise Domains */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-slate-700" />
          <span>Academic & Societal Research Focus Areas</span>
        </h3>

        <div className="flex flex-wrap gap-2 pt-1">
          {(currentUni.focusAreas || ['Water Management', 'Infrastructure', 'Education', 'Public Health']).map(
            (area, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
              >
                {area}
              </span>
            )
          )}
        </div>
      </div>

      {/* 5. Audit Trail & Registration Information */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Registered into Government Portal on <strong>{regDate}</strong></span>
        </div>
        <div>
          <span>Last active session: <strong>Active today</strong></span>
        </div>
      </div>
    </div>
  );
};

export default ViewUniversityDetails;
