import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { citizenService } from '../services/citizenService.js';
import defaultRoadImg from '../assets/road_challenge.jpg';

const STATUS_FILTERS = ['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved'];

export const CitizenMyChallenges = ({ onSelectChallenge, onSubmitClick, activeStatusFilter = 'All' }) => {
  const [statusFilter, setStatusFilter] = useState(activeStatusFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStatusFilter(activeStatusFilter);
  }, [activeStatusFilter]);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const res = await citizenService.fetchMyChallenges({
        status: statusFilter,
        search: searchTerm
      });
      setChallenges(res.challenges || []);
    } catch (err) {
      console.error('Error fetching challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [statusFilter, searchTerm]);

  return (
    <div className="space-y-4 text-left pb-20">
      {/* Header & Submit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            My Submitted Challenges
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Track live government review & university solution status
          </p>
        </div>

        <button
          onClick={onSubmitClick}
          className="flex items-center space-x-1.5 bg-[#047857] hover:bg-[#064e3b] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Challenge</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by challenge ID, problem, district..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      {/* Status Filter Horizontal Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer border ${
              statusFilter === st
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Challenges List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs font-semibold">Loading challenges...</span>
        </div>
      ) : challenges.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">No challenges found</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
              {statusFilter !== 'All'
                ? `No problem statements under '${statusFilter}'.`
                : 'You have not submitted any problem statements yet.'}
            </p>
          </div>
          <button
            onClick={onSubmitClick}
            className="inline-flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Your First Problem</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {challenges.map((ch) => {
            const formattedDate = ch.submittedAt
              ? new Date(ch.submittedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              : '14 May 2025';

            return (
              <div
                key={ch.challengeId || ch._id}
                onClick={() => onSelectChallenge(ch)}
                className="group bg-white border border-slate-100 hover:border-emerald-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer space-y-3"
              >
                {/* Top Row: Ref ID + Status */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {ch.challengeId}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      ch.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ch.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ch.status || 'Under Review'}
                  </span>
                </div>

                {/* Middle: Title & Meta */}
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                    {ch.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{ch.location?.district || ch.district || 'Ranchi'}, Jharkhand</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formattedDate}</span>
                    </span>
                  </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className="pt-1 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {ch.domain || 'Urban Development'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Priority: <strong className="text-slate-700">{ch.priority || 'Medium'}</strong>
                    </span>
                  </div>

                  <span className="text-xs text-emerald-700 font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                    <span>Track</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CitizenMyChallenges;
