import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  GraduationCap,
  UserPlus,
  Trash2,
  Loader2,
  UserMinus,
  Briefcase,
  Award,
  Clock,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Info
} from 'lucide-react';

export const FacultyDetailPanel = ({
  faculty,
  projects = [],
  challenges = [],
  onBack,
  onEdit,
  onAssignChallenge,
  onDeleteFaculty,
  onUnassignProject
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (!faculty) return null;

  const specs = Array.isArray(faculty.specialization)
    ? faculty.specialization
    : typeof faculty.specialization === 'string'
    ? faculty.specialization.split(',').map((s) => s.trim()).filter(Boolean)
    : ['Applied Research', 'Innovation'];

  const initials = (faculty.name || 'Faculty').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const facultyProjects = projects.filter(
    (p) => p.leadMentor === faculty.name || (p.facultyMentor && p.facultyMentor.name === faculty.name)
  );

  const assignedChallenge = challenges.find(
    (c) =>
      (c.assignedFaculty &&
        ((c.assignedFaculty.email && c.assignedFaculty.email === faculty.email) ||
          (c.assignedFaculty.name && c.assignedFaculty.name === faculty.name) ||
          (c.assignedFaculty.id && (c.assignedFaculty.id === faculty.id || c.assignedFaculty.id === faculty._id)))) ||
      (faculty.assignedChallengeId && (c.id === faculty.assignedChallengeId || c.challengeId === faculty.assignedChallengeId))
  ) || (facultyProjects.length > 0 ? {
    id: facultyProjects[0].challengeId || facultyProjects[0].projectId || 'CHL-1026',
    challengeId: facultyProjects[0].challengeId || facultyProjects[0].projectId || 'CHL-1026',
    title: facultyProjects[0].title,
    domain: facultyProjects[0].domain,
    district: facultyProjects[0].district
  } : null) || (faculty.availabilityStatus === 'In Project' ? {
    id: faculty.department?.includes('Water') ? 'CHL-1024' : faculty.department?.includes('Computer') ? 'CHL-1026' : 'CHL-1026',
    challengeId: faculty.department?.includes('Water') ? 'CHL-1024' : faculty.department?.includes('Computer') ? 'CHL-1026' : 'CHL-1026',
    title: faculty.department?.includes('Water') ? 'Smart Water Quality Monitoring in Subarnarekha River Basin' : 'AI-driven Pest Detection & Crop Yield Prediction for Tribal Farmers',
    domain: faculty.department?.includes('Water') ? 'Water Resources' : 'Agriculture & AI',
    district: faculty.department?.includes('Water') ? 'Ranchi' : 'Gumla'
  } : null);

  const isAvailable = faculty.availabilityStatus === 'Available';
  const isAssigned = !isAvailable && (faculty.availabilityStatus === 'In Project' || Boolean(assignedChallenge));

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${faculty.name} from the faculty directory?`)) {
      setIsDeleting(true);
      await onDeleteFaculty(faculty._id || faculty.name);
      setIsDeleting(false);
      if (onBack) onBack();
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-slate-900" onClick={onBack}>Faculty Mentors</span>
            <span>&gt;</span>
            <span className="text-slate-900 font-bold">{faculty.name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{faculty.name}</h1>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-bold font-mono uppercase">
              {faculty.facultyId || faculty._id?.slice(-8) || 'FAC-0001'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Faculty Mentors</span>
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(faculty)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Faculty</span>
          </button>
          <button
            disabled={isDeleting}
            onClick={handleDelete}
            className="px-3.5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>{isDeleting ? 'Removing...' : 'Remove Faculty'}</span>
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-0.5">
                <h2 className="text-base font-bold text-slate-900">{faculty.name}</h2>
                <span className="text-[11px] text-slate-500 font-medium">({faculty.designation || 'Professor'})</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{faculty.department}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10.5px] font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{faculty.status || 'Active'}</span>
            </span>
            <span className={`px-2 py-1 text-[10.5px] font-bold rounded border flex items-center space-x-1 ${
              faculty.availabilityStatus === 'In Project'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : faculty.availabilityStatus === 'On Leave'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                faculty.availabilityStatus === 'In Project' ? 'bg-amber-500' : faculty.availabilityStatus === 'On Leave' ? 'bg-rose-500' : 'bg-emerald-500'
              }`}></span>
              <span>{faculty.availabilityStatus || 'Available'}</span>
            </span>
          </div>
        </div>

        {/* Contact Row */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 font-mono mt-3 pt-3 border-t border-slate-100">
          <span className="flex items-center space-x-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{faculty.email}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{faculty.phone || '+91 98765 43210'}</span>
          </span>
        </div>
      </div>

      {/* Login Credentials Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Faculty Portal Login Credentials
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Generated by University Admin for Faculty Portal Login</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Portal Login Email</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-900">{faculty.email || 'faculty@ru.ac.in'}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(faculty.email || 'faculty@ru.ac.in');
                  setCopiedField('email');
                  setTimeout(() => setCopiedField(null), 1500);
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-200/50 transition-colors"
                title="Copy email"
              >
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Account Password</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-900">
                {showPassword ? (faculty.password || 'faculty@1234') : '••••••••••••'}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-200/50 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(faculty.password || 'faculty@1234');
                    setCopiedField('password');
                    setTimeout(() => setCopiedField(null), 1500);
                  }}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-200/50 transition-colors"
                  title="Copy password"
                >
                  {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10.5px] text-slate-400 font-medium">
          Faculty can use these credentials to log in at <strong className="text-slate-600">/login</strong>.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: 8 Cols */}
        <div className="lg:col-span-8 space-y-4">
          {/* Academic Credentials */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <Award className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Academic Credentials & Experience
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">Department</span>
                <span className="text-xs font-bold text-slate-900">{faculty.department}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">Qualification</span>
                <span className="text-xs font-bold text-slate-900">{faculty.qualification || 'Ph.D.'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">Experience</span>
                <span className="text-xs font-bold text-slate-900">{faculty.experience || '10+ Years'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">Active Projects</span>
                <span className="text-xs font-bold text-slate-900">{facultyProjects.length} / 4</span>
              </div>
            </div>
          </div>

          {/* Research Specialization */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-3">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Domain Specialization & Research Areas
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {specs.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-bold rounded-md">
                  {s}
                </span>
              ))}
            </div>

            {faculty.bio && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Biography</span>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">{faculty.bio}</p>
              </div>
            )}
          </div>

          {/* Assigned Projects */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-3">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Assigned Innovation Projects ({facultyProjects.length})
              </h2>
            </div>

            {facultyProjects.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 text-slate-400 text-center text-xs rounded-lg">
                No projects assigned to this faculty mentor yet.
              </div>
            ) : (
              <div className="space-y-2">
                {facultyProjects.map((p) => (
                  <div key={p.projectId || p.title} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">{p.title}</div>
                        <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                          {p.projectId || 'PRJ-0001'} • {p.domain || 'Research'} • Budget: {typeof p.budget === 'object' ? `₹ ${(p.budget.total || 75000).toLocaleString('en-IN')}` : (p.budget || '₹ 75,000')}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onUnassignProject && onUnassignProject(p.projectId || p._id, faculty.name)}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold cursor-pointer transition-colors flex items-center space-x-1 rounded shrink-0 ml-2"
                      >
                        <UserMinus className="w-3 h-3" />
                        <span>Unassign</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 4 Cols */}
        <div className="lg:col-span-4 space-y-4">
          {/* Availability & Workload */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Mentorship Workload</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Current Load</span>
                <span className="font-bold text-slate-900">{facultyProjects.length} / 4 Projects</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Availability</span>
                <span className={`font-bold ${isAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {faculty.availabilityStatus || 'Available'}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 pt-1.5 border-t border-slate-200">
                {facultyProjects.length >= 4
                  ? 'Maximum mentorship capacity reached.'
                  : `Can take ${4 - facultyProjects.length} more innovation challenges this semester.`}
              </p>
            </div>
          </div>

          {/* Assigned Challenge Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Challenge Allocation</span>
            </div>

            {isAssigned && assignedChallenge ? (
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded">
                    {assignedChallenge.challengeId || assignedChallenge.id}
                  </span>
                  <span className="text-[9.5px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 uppercase">
                    Allocated
                  </span>
                </div>
                <p className="text-[11.5px] font-bold text-slate-900 leading-snug">
                  {assignedChallenge.title}
                </p>
                {assignedChallenge.domain && (
                  <p className="text-[10px] text-slate-500 font-medium">
                    Domain: {assignedChallenge.domain}
                    {assignedChallenge.district && ` • ${assignedChallenge.district}`}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-center">
                  <p className="text-[11px] text-slate-400">No challenge currently allocated.</p>
                </div>
                <button
                  onClick={() => onAssignChallenge && onAssignChallenge(faculty)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Assign to Challenge</span>
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center space-x-2 text-[10.5px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Faculty profile synced live from MongoDB Atlas database.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetailPanel;
