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
    : '29 Aug 2026';

  const locationText = challenge.location?.fullAddress ||
    `${challenge.location?.landmark ? challenge.location.landmark + ', ' : ''}${
      challenge.location?.block ? challenge.location.block + ', ' : ''
    }${challenge.location?.district || 'Ranchi'}, Jharkhand`;

  const statusStr = challenge.status || 'Under Review';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden text-left">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#064e3b] text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs font-bold tracking-wider text-emerald-100">
              {challenge.challengeId || 'CHL-JH-2026-1048'}
            </span>
            <span className="text-xs text-emerald-300">•</span>
            <span className="text-xs font-bold text-emerald-100">
              {challenge.domain || 'Energy'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Main Title & Pure Text Status (NO Background Color Box!) */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                {challenge.title}
              </h3>
              <span className="flex-shrink-0 text-xs font-bold text-emerald-800">
                {statusStr}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{locationText}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Filed on {formattedDate}</span>
              </span>
            </div>
          </div>

          {/* Photo Preview if any */}
          {(challenge.mediaUrls?.[0]?.url || challenge.image) && (
            <div className="rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-100">
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
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Problem Description
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-line">
              {challenge.description}
            </p>
          </div>

          {/* Milestone Status Tracker */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-800" />
              Live Milestone & Resolution Progress
            </span>

            <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 space-y-3.5">
              {milestones.map((ms, idx) => {
                const isCompleted = ms.status === 'COMPLETED';
                const isCurrent = ms.status === 'CURRENT';

                return (
                  <div key={idx} className="flex items-start space-x-3 relative">
                    {/* Connecting line */}
                    {idx < milestones.length - 1 && (
                      <div
                        className={`absolute left-[13px] top-[24px] bottom-[-14px] w-[2px] ${
                          isCompleted ? 'bg-emerald-600' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Step Icon Indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        isCompleted
                          ? 'bg-[#064e3b] text-white'
                          : isCurrent
                          ? 'bg-amber-600 text-white animate-pulse ring-4 ring-amber-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{ms.step || idx + 1}</span>
                      )}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1 min-w-0 text-left pt-0.5">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-500'
                          }`}
                        >
                          {ms.title}
                        </h4>
                        {isCompleted && (
                          <span className="text-[10px] text-emerald-700 font-semibold">Done</span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] text-amber-700 font-semibold">In Progress</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        {ms.description}
                      </p>
                      {ms.updatedBy && (
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                          Updated by: {ms.updatedBy}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitizenChallengeDetailModal;
