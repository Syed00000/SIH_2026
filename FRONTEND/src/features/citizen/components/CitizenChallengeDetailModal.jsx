import React from 'react';
import {
  X,
  MapPin,
  Calendar,
  Building,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Phone,
  Mail,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import defaultRoadImg from '../assets/road_challenge.jpg';

export const CitizenChallengeDetailModal = ({ challenge, isOpen, onClose }) => {
  if (!isOpen || !challenge) return null;

  const milestones = challenge.milestones || [
    {
      step: 1,
      title: 'Problem Submitted',
      description: 'Problem statement filed with location & citizen verification.',
      status: 'COMPLETED',
      updatedBy: 'Citizen Submission Portal',
      remarks: 'Citizen submission acknowledged.',
      completedAt: challenge.submittedAt || new Date().toISOString()
    },
    {
      step: 2,
      title: 'Under Review',
      description: 'Government nodal team evaluating problem scope and severity.',
      status: challenge.status === 'Submitted' ? 'PENDING' : 'CURRENT',
      updatedBy: 'Jharkhand State Innovation Cell',
      remarks: 'Initial screening underway.',
      completedAt: null
    },
    {
      step: 3,
      title: 'University / HEI Assigned',
      description: 'Assigned to relevant university research lab & mentor.',
      status: ['In Progress', 'Resolved'].includes(challenge.status) ? 'COMPLETED' : 'PENDING',
      updatedBy: 'Department of Higher & Technical Education',
      remarks: '',
      completedAt: null
    },
    {
      step: 4,
      title: 'Solution in Progress',
      description: 'Faculty mentor and student innovation team implementing pilot.',
      status: challenge.status === 'In Progress' ? 'CURRENT' : challenge.status === 'Resolved' ? 'COMPLETED' : 'PENDING',
      updatedBy: 'University Faculty Lead',
      remarks: '',
      completedAt: null
    },
    {
      step: 5,
      title: 'Resolved & Deployed',
      description: 'Action completed and verified on ground with citizen feedback.',
      status: challenge.status === 'Resolved' ? 'COMPLETED' : 'PENDING',
      updatedBy: 'District Administration',
      remarks: '',
      completedAt: challenge.resolvedAt || null
    }
  ];

  const formattedDate = challenge.submittedAt
    ? new Date(challenge.submittedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '14 May 2025';

  const locationText = challenge.location?.fullAddress ||
    `${challenge.location?.landmark ? challenge.location.landmark + ', ' : ''}${
      challenge.location?.block ? challenge.location.block + ', ' : ''
    }${challenge.location?.district || 'Ranchi'}, Jharkhand`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#064e3b] to-[#047857] text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded font-bold tracking-wider">
              {challenge.challengeId || 'CHL-JH-2026-1048'}
            </span>
            <span className="text-xs text-emerald-100 font-semibold">•</span>
            <span className="text-xs text-emerald-100 font-medium">
              {challenge.domain || 'Urban Development'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-left">
          {/* Main Title & Status Badge */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {challenge.title}
              </h3>
              <span
                className={`flex-shrink-0 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                  challenge.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : challenge.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {challenge.status || 'Under Review'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{locationText}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Filed on {formattedDate}</span>
              </span>
            </div>
          </div>

          {/* Photo Preview if any */}
          {(challenge.mediaUrls?.[0]?.url || challenge.image) && (
            <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100">
              <img
                src={challenge.mediaUrls?.[0]?.url || challenge.image || defaultRoadImg}
                alt="Problem snapshot"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultRoadImg;
                }}
              />
            </div>
          )}

          {/* Detailed Problem Statement */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Problem Description
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
              {challenge.description}
            </p>
          </div>

          {/* Milestone Status Tracker */}
          <div className="space-y-2.5">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-emerald-700" />
              Live Milestone & Resolution Progress
            </span>

            <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-3">
              {milestones.map((ms, idx) => {
                const isCompleted = ms.status === 'COMPLETED';
                const isCurrent = ms.status === 'CURRENT';

                return (
                  <div key={idx} className="flex items-start space-x-3 relative">
                    {/* Connecting line */}
                    {idx < milestones.length - 1 && (
                      <div
                        className={`absolute left-[13px] top-[24px] bottom-[-12px] w-[2px] ${
                          isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Step Icon Indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-[11px] font-bold">{ms.step || idx + 1}</span>
                      )}
                    </div>

                    {/* Milestone Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-amber-800'
                              : isCompleted
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {ms.title}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                            Done
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            In Progress
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        {ms.description}
                      </p>

                      {ms.remarks && (
                        <p className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200/60 rounded p-1.5 mt-1 font-medium italic">
                          "{ms.remarks}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submitter & Assigned University Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Submitter
              </span>
              <span className="font-bold text-slate-900 block mt-0.5 truncate">
                {challenge.submitter?.name || 'Tauqueer Wasi'}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {challenge.submitter?.role || 'Citizen'}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Assigned HEI
              </span>
              <span className="font-bold text-slate-900 block mt-0.5 truncate">
                {challenge.assignedUniversity?.name || 'Triage Assessment'}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium block">
                {challenge.assignedUniversity?.department || 'State Innovation Council'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitizenChallengeDetailModal;
