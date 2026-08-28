import React, { useState } from 'react';
import { CheckCircle2, Upload, MessageSquare, UserPlus, Eye, Edit3, PowerOff, ChevronDown, ChevronUp } from 'lucide-react';

export const ProjectDrawerTabs = ({ project, activeTab, onEdit, onEndProject, onMarkCompleted }) => {
  const [showFullProblem, setShowFullProblem] = useState(false);

  const facultyName = project.facultyMentor?.name || project.leadMentor || 'Dr. Priya Sharma';
  const facultyDept = project.facultyMentor?.department || 'Water Resources Engineering';
  const initials = facultyName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const activities = project.recentActivity?.length ? project.recentActivity : [
    { text: "Milestone 'Data Collection' completed", user: 'Ali Khan', time: '22 May 2026, 11:30 AM', type: 'milestone' },
    { text: "Document 'Survey Report.pdf' uploaded", user: 'Neha Verma', time: '21 May 2026, 04:15 PM', type: 'document' },
    { text: "New comment on 'Analysis Phase'", user: 'Dr. Priya Sharma', time: '20 May 2026, 02:30 PM', type: 'comment' },
    { text: 'Rahul Kumar joined the team', user: 'System', time: '19 May 2026, 09:10 AM', type: 'team' }
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

        <div className="p-2.5 bg-slate-50 border border-slate-200 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Faculty Mentor</span>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              {initials}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs">{facultyName}</div>
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
    return (
      <div className="space-y-2">
        {(project.milestones?.length ? project.milestones : [
          { title: 'Problem Mapping & Field Survey', status: 'Completed', dueDate: '10 Jun 2026' },
          { title: 'Sensor Rig Prototyping (TRL-4)', status: 'Completed', dueDate: '20 Jul 2026' },
          { title: 'NABL Water Calibration Testing', status: 'Completed', dueDate: '15 Aug 2026' }
        ]).map((m, idx) => (
          <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-xs">{m.title}</div>
              <div className="text-[10.5px] text-slate-500 font-mono">Due: {m.dueDate}</div>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-bold border ${m.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-900 border-slate-300'}`}>
              {m.status}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === 'team') {
    return (
      <div className="space-y-2">
        {(project.teamMembers?.length ? project.teamMembers : [
          { name: 'Ali Khan', role: 'Team Lead', department: 'Computer Science' },
          { name: 'Neha Verma', role: 'IoT Hardware', department: 'Electronics' },
          { name: 'Rahul Kumar', role: 'Data Analytics', department: 'Information Technology' }
        ]).map((tm, idx) => (
          <div key={idx} className="p-2 bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-xs">{tm.name}</div>
              <div className="text-[10.5px] text-slate-500">{tm.department}</div>
            </div>
            <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5">
              {tm.role}
            </span>
          </div>
        ))}
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
