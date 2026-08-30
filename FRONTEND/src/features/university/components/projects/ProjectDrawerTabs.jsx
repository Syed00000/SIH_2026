import React, { useState } from 'react';
import {
  CheckCircle2,
  Upload,
  MessageSquare,
  UserPlus,
  Edit3,
  PowerOff,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
  Users,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';

export const ProjectDrawerTabs = ({
  project,
  activeTab,
  onEdit,
  onAssignMentor,
  onEndProject,
  onMarkCompleted
}) => {
  const [showFullProblem, setShowFullProblem] = useState(false);

  const hasMentor = Boolean(
    project.facultyMentor?.name || (project.leadMentor && project.leadMentor !== 'Unassigned')
  );
  const facultyName = hasMentor ? (project.facultyMentor?.name || project.leadMentor) : 'Unassigned';
  const facultyDept = hasMentor
    ? (project.facultyMentor?.department || 'Department of Engineering')
    : 'No Department Assigned';
  const initials = hasMentor
    ? facultyName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'NA';

  const activities = Array.isArray(project.recentActivity) ? project.recentActivity : [];
  const documents = Array.isArray(project.documents) ? project.documents : [];
  const hasStudentTeam = Array.isArray(project.teamMembers) && project.teamMembers.length > 0;

  const displayBudget = project.budget
    ? typeof project.budget === 'object'
      ? project.budget.total
        ? `₹ ${project.budget.total.toLocaleString('en-IN')}`
        : 'N/A'
      : project.budget
    : 'N/A';

  const displayTimeline = project.timeline || project.deadline || 'N/A';

  if (activeTab === 'overview') {
    return (
      <div className="space-y-3.5">
        {/* Problem Statement Card */}
        <div className="p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-xl space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Problem Statement
            </span>
            <span className="text-[10.5px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              {project.domain || 'Innovation'}
            </span>
          </div>
          <p
            className={`text-xs text-slate-700 leading-relaxed ${
              !showFullProblem ? 'line-clamp-2' : ''
            }`}
          >
            {project.problemStatement || project.description || 'No detailed problem statement provided.'}
          </p>
          {project.problemStatement && project.problemStatement.length > 120 && (
            <button
              type="button"
              onClick={() => setShowFullProblem(!showFullProblem)}
              className="text-[11px] font-bold text-[#007A61] hover:underline cursor-pointer flex items-center space-x-0.5 pt-0.5"
            >
              <span>{showFullProblem ? 'Show less' : 'Show full details'}</span>
              {showFullProblem ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Project Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Domain Sector</span>
            <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
              {project.domain || 'General'}
            </span>
          </div>
          <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Budget (Sanctioned)</span>
            <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
              {displayBudget}
            </span>
          </div>
          <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Timeline / Target</span>
            <span className="font-extrabold text-slate-900 text-xs mt-0.5 block truncate">
              {displayTimeline}
            </span>
          </div>
        </div>

        {/* Lead Faculty Mentor Card */}
        <div className="p-3.5 bg-white border border-emerald-200/80 rounded-xl space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Lead Faculty Mentor
            </span>
            {onAssignMentor && (
              <button
                type="button"
                onClick={() => onAssignMentor(project)}
                className="text-[11px] font-bold text-[#007A61] hover:text-[#00604c] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{hasMentor ? 'Change Mentor' : 'Assign Mentor'}</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                hasMentor
                  ? 'bg-[#007A61] text-white shadow-xs'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-slate-900 text-xs truncate">
                {facultyName}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {facultyDept}
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2 p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-bold text-slate-700">R&D Lifecycle Progress</span>
            <span className="font-extrabold font-mono text-[#007A61]">
              {project.progressPercentage || (hasMentor ? 25 : 10)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#007A61] h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progressPercentage || (hasMentor ? 25 : 10)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10.5px] text-slate-500 pt-0.5">
            <span>Status: <strong className="text-slate-800">{project.status || 'In Progress'}</strong></span>
            <span>
              Milestones: {project.milestonesCompleted || (hasMentor ? 2 : 1)} / {project.milestonesTotal || 7}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
          {project.status !== 'Completed' ? (
            <button
              type="button"
              onClick={() => onMarkCompleted && onMarkCompleted(project)}
              className="py-2 bg-[#007A61] hover:bg-[#006650] text-white text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Completed</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="py-2 bg-purple-50 text-purple-900 border border-purple-300 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
              <span>Completed</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(project)}
            className="py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onEndProject(project)}
            className="py-2 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          >
            <PowerOff className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>
        </div>

        {/* Recent Real Activity Feed */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold text-slate-900 uppercase">
              Recent Activity
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {activities.length} Events
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl text-center space-y-1">
              <Activity className="w-5 h-5 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">No activity logs yet</div>
              <p className="text-[11px] text-slate-500">
                Activity logs will be recorded as milestone updates and mentor actions occur.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((act, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-2.5 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-[#007A61] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                    {act.type === 'milestone' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : act.type === 'document' ? (
                      <Upload className="w-3.5 h-3.5 text-slate-800" />
                    ) : act.type === 'comment' ? (
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5 text-[#007A61]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 leading-tight">{act.text}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      By {act.user || 'System'} {act.time ? `• ${act.time}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'milestones') {
    const defaultMilestones = [
      { id: 1, title: 'Project & Challenge Allocation', status: 'Completed', dueDate: 'N/A' },
      {
        id: 2,
        title: hasMentor ? `Lead Mentor Onboarded (${facultyName})` : 'Faculty Mentor Assignment',
        status: hasMentor ? 'Completed' : 'In Progress',
        dueDate: 'N/A'
      },
      {
        id: 3,
        title: 'Student Team Formation & Scoping',
        status: hasMentor ? 'In Progress' : 'Pending',
        dueDate: 'N/A'
      },
      { id: 4, title: 'Sensor Rig / Solution Prototyping (TRL-4)', status: 'Pending', dueDate: 'N/A' },
      { id: 5, title: 'Pilot Testing & Field Calibration', status: 'Pending', dueDate: 'N/A' },
      { id: 6, title: 'Solution Validation & District Trials', status: 'Pending', dueDate: 'N/A' },
      { id: 7, title: 'Government Handover & Impact Review', status: 'Pending', dueDate: 'N/A' }
    ];

    const milestonesList = project.milestones?.length ? project.milestones : defaultMilestones;

    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
          <span className="font-bold text-slate-700">R&D Lifecycle Milestones</span>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            {milestonesList.filter((m) => m.status === 'Completed').length} of {milestonesList.length} Steps Completed
          </span>
        </div>

        {milestonesList.map((m, idx) => {
          const isDone = m.status === 'Completed';
          const isCurrent = m.status === 'In Progress' || m.status === 'CURRENT';

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                isDone
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 shadow-2xs'
                  : isCurrent
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-2xs ring-1 ring-amber-300/60'
                  : 'bg-slate-50/80 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-black shrink-0 ${
                    isDone
                      ? 'bg-[#007A61] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-xs leading-tight truncate">
                    {m.title}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {m.completedAt
                      ? `Completed on ${new Date(m.completedAt).toLocaleDateString('en-GB')}`
                      : m.dueDate && m.dueDate !== 'N/A'
                      ? `Target: ${m.dueDate}`
                      : 'Status: ' + (isDone ? 'Completed' : isCurrent ? 'Active Milestone' : 'Pending')}
                  </div>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border shrink-0 ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : isCurrent
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (activeTab === 'team') {
    return (
      <div className="space-y-3">
        {/* Principal Investigator / Lead Mentor */}
        <div className="p-3.5 bg-white border border-emerald-200/90 rounded-xl space-y-1.5 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">
            Principal Investigator / Lead Mentor
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  hasMentor ? 'bg-[#007A61] text-white shadow-2xs' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {initials}
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-xs">{facultyName}</div>
                <div className="text-[10.5px] text-slate-500">{facultyDept}</div>
              </div>
            </div>
            {hasMentor ? (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                Lead Mentor
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onAssignMentor && onAssignMentor(project)}
                className="text-[10.5px] font-bold text-[#007A61] hover:underline cursor-pointer bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              >
                + Assign Mentor
              </button>
            )}
          </div>
        </div>

        {/* Student Team Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-900 uppercase">
              Student Research Team
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {hasStudentTeam ? `${project.teamMembers.length} Members Assigned` : 'Formation Pending'}
            </span>
          </div>

          {hasStudentTeam ? (
            project.teamMembers.map((tm, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">{tm.name}</div>
                  <div className="text-[10.5px] text-slate-500">{tm.department}</div>
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  {tm.role}
                </span>
              </div>
            ))
          ) : (
            <div className="p-5 bg-slate-50/70 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
              <Users className="w-6 h-6 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Student Team Not Assigned</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                Student researchers will be onboarded by{' '}
                <strong className="text-slate-800">{facultyName}</strong> once the project methodology is formulated.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Documents Tab
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
        <span className="font-bold text-slate-700">Project Documents & Repository</span>
        <span className="text-[10.5px] font-mono text-slate-400">
          {documents.length} Files
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="p-6 bg-slate-50/70 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
          <FileText className="w-6 h-6 text-slate-300 mx-auto" />
          <div className="text-xs font-bold text-slate-700">No documents attached yet</div>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
            Project proposals, test logs, and calibration documents uploaded by faculty mentors will appear here.
          </p>
        </div>
      ) : (
        documents.map((d, idx) => (
          <div
            key={idx}
            className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs"
          >
            <div>
              <div className="font-bold text-slate-900 text-xs">{d.name}</div>
              <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                {d.size} {d.date ? `• ${d.date}` : ''}
              </div>
            </div>
            <button
              type="button"
              className="text-xs font-bold text-[#007A61] hover:underline cursor-pointer"
            >
              Download
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectDrawerTabs;
