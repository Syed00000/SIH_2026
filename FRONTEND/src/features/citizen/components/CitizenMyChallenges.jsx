import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  ChevronRight,
  AlertCircle,
  Loader2,
  X,
  Layers
} from 'lucide-react';
import { citizenService } from '../services/citizenService.js';
import { CitizenThemedSelect } from './CitizenThemedSelect.jsx';

const STATUS_FILTERS = ['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved'];
const DOMAIN_OPTIONS = [
  'All', 'Education', 'Healthcare', 'Agriculture', 'Water Resources',
  'Environment', 'Energy', 'Urban Development', 'Accessibility',
  'Public Administration', 'Rural Livelihoods'
];

export const CitizenMyChallenges = ({
  onSelectChallenge,
  onSubmitClick,
  activeStatusFilter = 'All',
  activeDomainFilter = 'All',
  setActiveDomainFilter
}) => {
  const [statusFilter, setStatusFilter] = useState(activeStatusFilter);
  const [domainFilter, setDomainFilter] = useState(activeDomainFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setStatusFilter(activeStatusFilter); }, [activeStatusFilter]);
  useEffect(() => { setDomainFilter(activeDomainFilter || 'All'); }, [activeDomainFilter]);

  const handleDomainChange = (dom) => {
    setDomainFilter(dom);
    if (setActiveDomainFilter) setActiveDomainFilter(dom);
  };

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const res = await citizenService.fetchMyChallenges({ status: statusFilter, search: searchTerm });
      setChallenges(res.challenges || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadChallenges(); }, [statusFilter, searchTerm]);

  const displayedChallenges = challenges.filter((ch) => {
    if (!domainFilter || domainFilter === 'All') return true;
    return (ch.domain || '').toLowerCase() === domainFilter.toLowerCase();
  });

  return (
    <div className="space-y-5 text-left pb-6 animate-fadeIn">
      {/* Header & Submit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">My Submitted Challenges</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Track live government review, AI triage, and university progress</p>
        </div>
        <button
          onClick={onSubmitClick}
          className="flex items-center space-x-2 bg-white hover:bg-[#064e3b] text-slate-900 hover:text-white border border-slate-200/90 hover:border-[#064e3b] text-xs font-bold px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Challenge</span>
        </button>
      </div>

      {/* Controls: Search, Domain Dropdown & Status Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by challenge ID, problem..."
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="w-40 sm:w-44 shrink-0">
            <CitizenThemedSelect
              value={domainFilter === 'All' ? 'All Domains' : domainFilter}
              onChange={(val) => handleDomainChange(val === 'All Domains' ? 'All' : val)}
              options={DOMAIN_OPTIONS.map((dom) => (dom === 'All' ? 'All Domains' : dom))}
            />
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-white p-1 border border-slate-200/90 rounded-xl shadow-2xs overflow-x-auto">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st ? 'bg-[#064e3b] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Active Domain Filter Badge */}
      {domainFilter && domainFilter !== 'All' && (
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 w-fit">
          <Layers className="w-3.5 h-3.5 text-emerald-700" />
          <span>Filtered by Domain: <strong>{domainFilter}</strong> ({displayedChallenges.length})</span>
          <button onClick={() => handleDomainChange('All')} className="p-0.5 rounded-full hover:bg-emerald-200/60 text-emerald-800 cursor-pointer ml-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Challenges List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
          <span className="text-xs font-semibold text-slate-600">Loading submitted challenges...</span>
        </div>
      ) : displayedChallenges.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-xl p-10 text-center space-y-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">No challenges found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {domainFilter !== 'All' ? `No problem statements found under '${domainFilter}'.` : 'No problem statements found for this filter.'}
            </p>
          </div>
          <button
            onClick={onSubmitClick}
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-[#064e3b] text-slate-900 hover:text-white border border-slate-200 hover:border-[#064e3b] text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Submit a Problem {domainFilter !== 'All' ? `in ${domainFilter}` : ''}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedChallenges.map((ch) => {
            const formattedDate = ch.submittedAt
              ? new Date(ch.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : '29 Aug 2026';

            return (
              <div
                key={ch.challengeId || ch._id}
                onClick={() => onSelectChallenge(ch)}
                className="group bg-white border border-slate-200/90 hover:border-emerald-400 rounded-xl p-4.5 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer space-y-3 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-xs text-slate-800 tracking-tight">{ch.challengeId}</span>
                    {ch.priority && <span className="text-xs font-semibold text-rose-700">Priority: {ch.priority}</span>}
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700">{ch.status || 'Under Review'}</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">{ch.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ch.location?.district || ch.district || 'Ranchi'}, Jharkhand</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formattedDate}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{ch.domain || 'Energy'}</span>
                  <button className="text-xs text-emerald-800 font-bold flex items-center space-x-1 cursor-pointer">
                    <span>Track Progress</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
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
