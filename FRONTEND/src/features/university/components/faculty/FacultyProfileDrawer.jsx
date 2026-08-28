import React, { useState } from 'react';
import { X, Mail, Phone, UserPlus, Trash2, Loader2, UserMinus } from 'lucide-react';

export const FacultyProfileDrawer = ({
  faculty,
  projects = [],
  onClose,
  onAssignChallenge,
  onDeleteFaculty,
  onUnassignProject
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!faculty) return null;

  const initials = faculty.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const facultyProjects = projects.filter(
    (p) => p.leadMentor === faculty.name || (p.facultyMentor && p.facultyMentor.name === faculty.name)
  );

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${faculty.name} from the faculty directory?`)) {
      setIsDeleting(true);
      await onDeleteFaculty(faculty._id || faculty.name);
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-none flex flex-col justify-between h-full overflow-hidden select-none shadow-2xs">
      <div className="p-3.5 border-b border-slate-200 bg-slate-50 space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 leading-snug">{faculty.name}</h2>
                <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                  {faculty.status || 'Active'}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-semibold">{faculty.designation || 'Professor'}</div>
              <div className="text-[10.5px] text-slate-500">{faculty.department}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer">
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
                {(faculty.specialization || ['Applied Research', 'Innovation']).map((r, i) => (
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
              {(faculty.specialization || ['Domain Engineering', 'Field Prototyping']).map((s, i) => (
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

      <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center space-x-2">
        <button
          onClick={() => onAssignChallenge && onAssignChallenge(faculty)}
          className="flex-1 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Assign to Challenge</span>
        </button>
        <button
          disabled={isDeleting}
          onClick={handleDelete}
          className="px-3 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1"
        >
          {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
        </button>
      </div>
    </div>
  );
};

export default FacultyProfileDrawer;
