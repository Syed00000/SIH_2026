import React, { useState } from 'react';
import { X, Mail, Phone, UserPlus, Trash2, Loader2, UserMinus } from 'lucide-react';

export const FacultyProfileDrawer = ({
  faculty,
  projects = [],
  challenges = [],
  onClose,
  onAssignChallenge,
  onDeleteFaculty,
  onUnassignProject
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);

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
    id: faculty.department?.includes('Water') ? 'CHL-1024' : faculty.department?.includes('Computer') ? 'CHL-1026' : faculty.department?.includes('Environmental') ? 'CHL-1028' : 'CHL-1026',
    challengeId: faculty.department?.includes('Water') ? 'CHL-1024' : faculty.department?.includes('Computer') ? 'CHL-1026' : faculty.department?.includes('Environmental') ? 'CHL-1028' : 'CHL-1026',
    title: faculty.department?.includes('Water') ? 'Smart Water Quality Monitoring in Subarnarekha River Basin' : faculty.department?.includes('Computer') ? 'AI-driven Pest Detection & Crop Yield Prediction for Tribal Farmers' : faculty.department?.includes('Environmental') ? 'Affordable Solar Food Processing & Cold Chain for Forest Produce' : 'AI Crop Health & Yield Predictor for Tribal Farmers',
    domain: faculty.department?.includes('Water') ? 'Water Resources' : faculty.department?.includes('Computer') ? 'Agriculture & AI' : 'Environmental Science',
    district: faculty.department?.includes('Water') ? 'Ranchi' : faculty.department?.includes('Computer') ? 'Gumla' : 'Simdega'
  } : null);

  const isAvailable = faculty.availabilityStatus === 'Available';
  const isAssigned = !isAvailable && (faculty.availabilityStatus === 'In Project' || Boolean(assignedChallenge));

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${faculty.name} from the faculty directory?`)) {
      setIsDeleting(true);
      await onDeleteFaculty(faculty._id || faculty.name);
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-xl flex flex-col justify-between h-full overflow-hidden select-none">
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-base font-bold text-slate-900 leading-snug">{faculty.name}</h2>
                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                  {faculty.status || 'Active'}
                </span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${
                  faculty.availabilityStatus === 'In Project'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : faculty.availabilityStatus === 'On Leave'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {faculty.availabilityStatus || 'Available'}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-semibold">{faculty.designation || 'Professor'}</div>
              <div className="text-[10.5px] text-slate-500">{faculty.department}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-200/50 rounded-md transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-slate-600 font-mono pt-1 border-t border-slate-200">
          <span className="flex items-center space-x-1"><Mail className="w-3 h-3 text-slate-400" /><span>{faculty.email}</span></span>
          <span className="flex items-center space-x-1"><Phone className="w-3 h-3 text-slate-400" /><span>{faculty.phone || '+91 98765 43210'}</span></span>
        </div>

        <div className="flex border-b border-slate-200 pt-1 text-xs">
          {['overview', 'expertise', 'projects', 'availability'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1.5 px-2 font-bold capitalize transition-colors cursor-pointer border-b-2 ${
                activeTab === tab ? 'border-b-slate-900 text-slate-900' : 'border-b-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'expertise' ? 'Expertise & Skills' : tab === 'projects' ? `Projects (${facultyProjects.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3.5 flex-1 overflow-y-auto space-y-3.5 text-xs text-slate-700">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 border border-slate-200">
              <div><span className="text-slate-500 block font-semibold">Department</span><strong className="text-slate-900">{faculty.department}</strong></div>
              <div><span className="text-slate-500 block font-semibold">Experience</span><strong className="text-slate-900">{faculty.experience || '10+ Years'}</strong></div>
              <div><span className="text-slate-500 block font-semibold">Qualification</span><strong className="text-slate-900">{faculty.qualification || 'Ph.D.'}</strong></div>
              <div><span className="text-slate-500 block font-semibold">Allocated Projects</span><strong className="text-slate-900">{facultyProjects.length} Active</strong></div>
            </div>

            <div>
              <span className="text-[10.5px] font-bold text-slate-900 uppercase block mb-1">Research Areas</span>
              <div className="flex flex-wrap gap-1">
                {specs.map((r, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-semibold">{r}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expertise' && (
          <div className="space-y-2">
            <span className="text-[10.5px] font-bold text-slate-900 uppercase block">Verified Domain Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {specs.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-900 border border-slate-200 font-bold text-xs">{s}</span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-2">
            {facultyProjects.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 text-slate-400 text-center text-xs">
                No projects assigned to this faculty mentor yet.
              </div>
            ) : (
              facultyProjects.map((p) => (
                <div key={p.projectId || p.title} className="p-2.5 bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="text-[10.5px] text-slate-500 font-mono">
                    Progress: {p.progressPercentage || 50}% • Status: {p.status || 'Active'} • Budget:{' '}
                    {typeof p.budget === 'object'
                      ? `₹ ${(p.budget.total || 75000).toLocaleString('en-IN')}`
                      : (p.budget || '₹ 75,000')}
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium">Assigned Lead Mentor</span>
                    <button
                      type="button"
                      onClick={() => onUnassignProject && onUnassignProject(p.projectId || p._id, faculty.name)}
                      className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10.5px] font-bold cursor-pointer transition-colors flex items-center space-x-1"
                    >
                      <UserMinus className="w-3 h-3" />
                      <span>Remove / Unassign Mentor</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="p-3 bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-900 block">Current Load: {facultyProjects.length} / 4 Projects Allocated</span>
            <p className="text-[11px] text-slate-600">
              {facultyProjects.length >= 4 ? 'Maximum mentorship capacity reached.' : `Available to take ${4 - facultyProjects.length} additional grassroots innovation challenges this semester.`}
            </p>
          </div>
        )}
      </div>

      <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center space-x-2">
        {isAssigned ? (
          <div className="flex-1 p-2 bg-slate-100 border border-slate-200 rounded-lg flex flex-col justify-center min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center space-x-1.5 min-w-0">
                <span className="font-mono font-bold text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded shrink-0">
                  {assignedChallenge?.challengeId || assignedChallenge?.id || 'CHL-1024'}
                </span>
                <span className="text-[9.5px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 uppercase shrink-0">
                  Allocated Problem
                </span>
              </div>
              {assignedChallenge?.district && (
                <span className="text-[10px] font-mono text-slate-500 truncate shrink-0">
                  {assignedChallenge.district}
                </span>
              )}
            </div>
            <p
              className="text-[11.5px] font-bold text-slate-900 truncate leading-snug"
              title={assignedChallenge?.title || 'Grassroots Innovation Challenge'}
            >
              {assignedChallenge?.title || 'Grassroots Innovation Challenge'}
            </p>
            {assignedChallenge?.domain && (
              <p className="text-[10px] text-slate-500 truncate font-medium mt-0.5">
                Domain: {assignedChallenge.domain}
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={() => onAssignChallenge && onAssignChallenge(faculty)}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Assign to Challenge</span>
          </button>
        )}
        <button
          disabled={isDeleting}
          onClick={handleDelete}
          className="px-3.5 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1"
        >
          {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
        </button>
      </div>
    </div>
  );
};

export default FacultyProfileDrawer;
