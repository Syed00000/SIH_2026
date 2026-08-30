import React, { useState } from 'react';
import { CheckCircle2, Upload, MessageSquare, UserPlus, Eye, Edit3, PowerOff, ChevronDown, ChevronUp } from 'lucide-react';

export const ProjectDrawerTabs = ({ project, activeTab, onEdit, onAssignMentor, onEndProject, onMarkCompleted }) => {
  const [showFullProblem, setShowFullProblem] = useState(false);

  const facultyName = project.facultyMentor?.name || project.leadMentor || 'Dr. Priya Sharma';
  const facultyDept = project.facultyMentor?.department || 'Water Resources Engineering';
  const initials = facultyName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const activities = project.recentActivity?.length ? project.recentActivity : [
    { text: "Milestone 'Project Allocation & Baseline Scoping' completed", user: 'State Nodal Officer', time: '15 May 2026', type: 'milestone' },
    { text: `Lead Faculty Mentor assigned (${facultyName})`, user: 'University Admin', time: '20 May 2026', type: 'team' },
    { text: "Sensor Rig Prototyping underway in university laboratory", user: facultyName, time: 'Active Sprint', type: 'comment' }
  ];

  if (activeTab === 'overview') {
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <span className="text-[10.5px] font-bold text-slate-900 uppercase block">Problem Statement</span>
          <p className={`text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 border border-slate-200 ${!showFullProblem ? 'line-clamp-2' : ''}`}>
            {project.problemStatement || 'Unsafe drinking water in rural areas is causing waterborne diseases. There is no regular monitoring mechanism.'}
          </p>
          <button
            onClick={() => setShowFullProblem(!showFullProblem)}
            className="text-[11px] font-bold text-slate-900 hover:underline cursor-pointer flex items-center space-x-0.5"
          >
            <span>{showFullProblem ? 'Show less' : 'Show more'}</span>
            {showFullProblem ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Domain</span>
            <span className="font-bold text-slate-900">{project.domain || 'Water'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Budget</span>
            <span className="font-bold text-slate-900">
              {typeof project.budget === 'object'
                ? `₹ ${(project.budget.total || 75000).toLocaleString('en-IN')}`
                : (project.budget || '₹ 75,000')}
            </span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Lead Faculty Mentor</span>
            {onAssignMentor && (
              <button
                type="button"
                onClick={() => onAssignMentor(project)}
                className="text-[11px] font-bold text-[#007A61] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{project.facultyMentor?.name || project.leadMentor ? 'Change Mentor' : 'Assign Mentor'}</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#007A61] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              {initials}
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xs">{facultyName}</div>
              <div className="text-[10.5px] text-slate-500">{facultyDept}</div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 p-2.5 bg-slate-50 border border-slate-200">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-bold text-slate-700">Overall Progress</span>
            <span className="font-bold font-mono text-slate-900">{project.progressPercentage || 64}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5">
            <div className="bg-slate-900 h-1.5" style={{ width: `${project.progressPercentage || 64}%` }} />
          </div>
          <div className="flex justify-between items-center text-[10.5px] text-slate-500 pt-1">
            <span>Start: {project.startDate || '20 May 2026'}</span>
            <span>Milestones: {project.milestonesCompleted || 3} / {project.milestonesTotal || 7}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-100">
          {project.status !== 'Completed' ? (
            <button
              onClick={() => onMarkCompleted && onMarkCompleted(project)}
              className="py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[10.5px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Completed</span>
            </button>
          ) : (
            <button
              disabled
              className="py-1.5 bg-purple-50 text-purple-900 border border-purple-300 text-[10.5px] font-bold flex items-center justify-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
              <span>Completed</span>
            </button>
          )}

          <button
            onClick={() => onEdit(project)}
            className="py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[10.5px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onEndProject(project)}
            className="py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-[10.5px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
          >
            <PowerOff className="w-3.5 h-3.5 text-slate-500" />
            <span>Archive</span>
          </button>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-900 uppercase">Recent Activity</span>
            <span className="text-[10.5px] font-bold text-slate-900 underline cursor-pointer">View All</span>
          </div>
          <div className="space-y-2">
            {activities.map((act, i) => (
              <div key={i} className="flex items-start space-x-2 text-[11px] bg-white p-2 border border-slate-100">
                <div className="w-5 h-5 rounded-none bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {act.type === 'milestone' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> :
                   act.type === 'document' ? <Upload className="w-3.5 h-3.5 text-slate-800" /> :
                   act.type === 'comment' ? <MessageSquare className="w-3.5 h-3.5 text-amber-600" /> : <UserPlus className="w-3.5 h-3.5 text-purple-600" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{act.text}</div>
                  <div className="text-[10px] text-slate-500 font-medium">By {act.user} • {act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'milestones') {
    const defaultMilestones = [
      { id: 1, title: 'Project & Challenge Allocation', status: 'Completed', dueDate: '15 May 2026' },
      { id: 2, title: project.facultyMentor?.name || project.leadMentor ? `Lead Mentor Onboarded (${facultyName})` : 'Faculty Mentor Assignment', status: project.facultyMentor?.name || project.leadMentor ? 'Completed' : 'In Progress', dueDate: '25 May 2026' },
      { id: 3, title: 'Student Team Formation & Scoping', status: project.facultyMentor?.name ? 'In Progress' : 'Pending', dueDate: '15 Jun 2026' },
      { id: 4, title: 'Sensor Rig Prototyping (TRL-4)', status: 'Pending', dueDate: '20 Jul 2026' },
      { id: 5, title: 'Pilot Testing & Field Calibration', status: 'Pending', dueDate: '15 Aug 2026' },
      { id: 6, title: 'Solution Validation & District Trials', status: 'Pending', dueDate: '10 Oct 2026' },
      { id: 7, title: 'Government Handover & Impact Review', status: 'Pending', dueDate: '30 Nov 2026' }
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
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : isCurrent
                  ? 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-2xs ring-1 ring-amber-300/50'
                  : 'bg-slate-50/80 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-black shrink-0 ${
                    isDone
                      ? 'bg-[#007A61] text-white'
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
                    Due: {m.dueDate || 'Sprint Phase'} {m.completedAt ? `• Completed on ${new Date(m.completedAt).toLocaleDateString('en-GB')}` : ''}
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md border shrink-0 ${
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
    const hasStudentTeam = Array.isArray(project.teamMembers) && project.teamMembers.length > 0;

    return (
      <div className="space-y-3">
        {/* Principal Investigator / Lead Mentor */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Principal Investigator / Lead Mentor</span>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#007A61] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-xs">{facultyName}</div>
                <div className="text-[10.5px] text-slate-500">{facultyDept}</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              Lead Mentor
            </span>
          </div>
        </div>

        {/* Student Team Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-900 uppercase">Student Research Team</span>
            <span className="text-[10px] font-mono text-slate-500">
              {hasStudentTeam ? `${project.teamMembers.length} Members Assigned` : 'Formation Pending'}
            </span>
          </div>

          {hasStudentTeam ? (
            project.teamMembers.map((tm, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{tm.name}</div>
                  <div className="text-[10.5px] text-slate-500">{tm.department}</div>
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  {tm.role}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
              <div className="text-xs font-bold text-slate-700">Student Team Not Assigned Yet</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Student innovators will be shortlisted and onboarded by <strong>{facultyName}</strong> during Milestone 3 (Team Formation & Scoping).
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {(project.documents?.length ? project.documents : [
        { name: 'Survey Report.pdf', size: '2.4 MB', date: '21 May 2026' },
        { name: 'Sensor Calibration Log.pdf', size: '1.1 MB', date: '18 May 2026' }
      ]).map((d, idx) => (
        <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-900 text-xs">{d.name}</div>
            <div className="text-[10.5px] text-slate-500 font-mono">{d.size} • {d.date}</div>
          </div>
          <button className="text-xs font-bold text-slate-900 hover:underline">Download</button>
        </div>
      ))}
    </div>
  );
};

export default ProjectDrawerTabs;
