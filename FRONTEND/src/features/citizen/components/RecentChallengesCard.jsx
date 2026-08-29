import React from 'react';
import { MapPin, Calendar, ChevronRight, PlusCircle } from 'lucide-react';
import defaultRoadImg from '../assets/road_challenge.jpg';

export const RecentChallengesCard = ({ challenge, onClick, onViewAllClick, onSubmitClick }) => {
  if (!challenge) {
    return (
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Recent Challenges
          </h3>
        </div>
        <div
          onClick={onSubmitClick || onViewAllClick}
          className="bg-white border border-dashed border-slate-200 rounded-lg p-5 text-center flex flex-col items-center justify-center space-y-1.5 cursor-pointer hover:border-slate-300 transition-colors"
        >
          <PlusCircle className="w-5 h-5 text-slate-400" />
          <h4 className="text-xs font-bold text-slate-800">No challenges submitted yet</h4>
          <p className="text-xs text-slate-500">Be the first to submit a challenge from your district</p>
        </div>
      </section>
    );
  }

  const formattedDate = challenge.submittedAt
    ? new Date(challenge.submittedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '';

  const locationText = challenge.location
    ? `${challenge.location.district || 'Ranchi'}, Jharkhand`
    : `${challenge.district || 'Ranchi'}, Jharkhand`;

  return (
    <section className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Recent Challenges
        </h3>
        <button
          onClick={onViewAllClick}
          className="flex items-center text-xs font-bold text-emerald-800 hover:text-emerald-900 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* Main Challenge Card */}
      <div
        onClick={() => onClick && onClick(challenge)}
        className="group relative bg-white border border-slate-200/80 hover:border-slate-300 rounded-lg p-3 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex items-center space-x-3.5"
      >
        {/* Image Thumbnail */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden flex-shrink-0 bg-slate-100">
          <img
            src={challenge.mediaUrls?.[0]?.url || challenge.image || defaultRoadImg}
            alt={challenge.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultRoadImg;
            }}
          />
          {/* Status Badge Tag */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5">
            <span className="block text-center text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/95 text-slate-800 backdrop-blur-xs shadow-2xs border border-slate-200">
              {challenge.status || 'Under Review'}
            </span>
          </div>
        </div>

        {/* Challenge Information */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1.5 text-left">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
              {challenge.title}
            </h4>

            {/* Location */}
            <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium mt-1">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">{locationText}</span>
            </div>

            {/* Submission Date */}
            {formattedDate && (
              <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium mt-0.5">
                <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span>Submitted on {formattedDate}</span>
              </div>
            )}
          </div>

          {/* Domain Tag */}
          <div className="pt-0.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {challenge.domain || 'Urban Development'}
            </span>
          </div>
        </div>

        {/* Right Arrow */}
        <div className="flex-shrink-0 text-slate-400 group-hover:text-slate-900 transition-colors pr-1">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
};

export default RecentChallengesCard;
