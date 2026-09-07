import React from 'react';
import { ArrowLeft, MapPin, User, Calendar, AlertCircle, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { DistrictDepartmentAssignCard } from './DistrictDepartmentAssignCard.jsx';

export const DistrictProblemDetailPanel = ({ problem, onClose, onUpdateProblem }) => {
  if (!problem) return null;

  const idKey = problem.challengeId || problem.id || problem._id;
  const submitter = problem.submitter || {};
  const location = problem.location || {};
  const mediaList = problem.mediaUrls || (Array.isArray(problem.media) ? problem.media.map(m => m.url || m) : []);
  const dateStr = problem.submittedAt
    ? new Date(problem.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Recent';

  const fullAddress = [
    location.village || problem.village,
    location.panchayat || problem.panchayat,
    location.block || problem.block,
    location.district || problem.district || 'Ranchi',
    'Jharkhand'
  ].filter(Boolean).join(', ');

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Civic Issues</span>
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <span className="font-mono text-xs font-bold text-slate-500">{idKey}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
            {problem.domain || 'Civic Issue'}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
            {location.district || problem.district || 'Ranchi'}
          </span>
        </div>
      </div>

      {/* Problem Statement Card - Full Horizontal */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-black text-slate-900 leading-snug">
            {problem.title}
          </h2>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${
            problem.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
            problem.priority === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {problem.priority || 'Medium'} Priority
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
          {problem.description || 'No detailed description provided by submitter.'}
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Submitted: {dateStr}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Status: {problem.status || 'Under Review'}</span>
          </span>
        </div>
      </div>

      {/* Citizen & Location Card - Full Horizontal */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <User className="w-4 h-4 text-[#007A61]" />
          <span>Submitter & Ground Truth Location</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Citizen Details</span>
            <div className="font-extrabold text-slate-800">{submitter.fullName || submitter.name || 'Anonymous Citizen'}</div>
            {submitter.phone && <div className="text-slate-500 font-mono text-[11px]">{submitter.phone}</div>}
            {submitter.email && <div className="text-slate-500 font-mono text-[11px]">{submitter.email}</div>}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Ground Jurisdiction</span>
            <div className="flex items-start gap-1 text-slate-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{fullAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attached Evidence Media - Full Horizontal */}
      {mediaList.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#007A61]" />
            <span>Citizen Evidence Photos / Media ({mediaList.length})</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {mediaList.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 block"
              >
                <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Assign to Related Department - Directly Below Problem (Full Horizontal) */}
      <DistrictDepartmentAssignCard
        problem={problem}
        onAssignSuccess={(updated) => {
          if (onUpdateProblem) onUpdateProblem(updated);
        }}
      />
    </div>
  );
};

export default DistrictProblemDetailPanel;
