import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Calendar, ChevronRight, ChevronLeft, ChevronDown, AlertCircle, Loader2, X, Layers, Trash2, MoreVertical } from 'lucide-react';
import { citizenService } from '../services/citizenService.js';
import { CitizenThemedSelect } from './CitizenThemedSelect.jsx';
import { Card, CardTitle, CardDescription } from '../../../shared/components/ui/card.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Input } from '../../../shared/components/ui/input.jsx';
import { Badge } from '../../../shared/components/ui/badge.jsx';

const STATUS_FILTERS = ['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved', 'Withdrawn'];
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const handleDeleteChallenge = async (e, ch) => {
    e.stopPropagation();
    const chlId = ch.challengeId || ch.id || ch._id;
    if (!window.confirm(`Are you sure you want to permanently delete withdrawn problem statement ${chlId}?`)) {
      return;
    }
    try {
      await citizenService.deleteChallenge(chlId);
      loadChallenges();
    } catch (err) {
      alert('Failed to delete challenge: ' + err.message);
    }
  };

  const displayedChallenges = challenges.filter((ch) => {
    if (!domainFilter || domainFilter === 'All') return true;
    return (ch.domain || '').toLowerCase() === domainFilter.toLowerCase();
  });

  const totalPages = Math.ceil(displayedChallenges.length / itemsPerPage);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, domainFilter, searchTerm]);

  const paginatedChallenges = displayedChallenges.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-8">
      {/* 1. Header Card */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3">
          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-slate-900">
              My Submitted Challenges
            </CardTitle>
            <CardDescription className="text-xs mt-1 text-slate-500 font-medium">
              Track live government review, AI triage, and university progress
            </CardDescription>
          </div>
          <Button onClick={onSubmitClick} className="shrink-0 text-sm font-bold gap-1.5 shadow-sm rounded-xl py-2 px-4">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Challenge
          </Button>
        </div>
      </Card>

      {/* 2. Unified Single-Row Filters & Search Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-2xs">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 w-full">
          {/* Left Side: Search + Domain Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Input (Compact) */}
            <div className="relative w-full sm:w-[220px] md:w-[240px]">
              <Input
                leftIcon={Search}
                type="text"
                placeholder="Search problem, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8 py-1.5 bg-slate-50/70 hover:bg-white focus:bg-white border-slate-200 rounded-xl font-medium text-xs shadow-2xs w-full transition-all"
              />
              {searchTerm && (
                <button 
                  type="button"
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 cursor-pointer z-10 p-0.5 rounded-full hover:bg-rose-50 transition-colors"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            
            {/* Domain Dropdown (Compact) */}
            <div className="w-full sm:w-[155px] shrink-0">
              <CitizenThemedSelect
                value={domainFilter === 'All' ? 'All Domains' : domainFilter}
                onChange={(val) => handleDomainChange(val === 'All Domains' ? 'All' : val)}
                options={DOMAIN_OPTIONS.map((dom) => (dom === 'All' ? 'All Domains' : dom))}
              />
            </div>
          </div>

          {/* Right Side: Clean Text Status Tabs (No boxes) */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {STATUS_FILTERS.map((st) => {
              const isActive = (statusFilter || 'All').toLowerCase() === st.toLowerCase();
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`text-[11px] sm:text-xs py-1 font-bold transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'text-[#007A61] border-[#007A61]'
                      : 'text-slate-500 hover:text-slate-800 border-transparent'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Domain Filter Badge */}
      {domainFilter && domainFilter !== 'All' && (
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-800 w-fit">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Filtered by Domain: <strong>{domainFilter}</strong> ({displayedChallenges.length})</span>
          <button onClick={() => handleDomainChange('All')} className="p-0.5 rounded-full hover:bg-rose-100 text-emerald-700 hover:text-rose-700 cursor-pointer ml-1 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Challenges List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="border-slate-200 shadow-sm bg-white min-h-[300px] flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
            <span className="text-sm font-semibold text-slate-500">Loading submitted challenges...</span>
          </Card>
        ) : displayedChallenges.length === 0 ? (
          <Card className="border-slate-200 shadow-sm bg-white min-h-[300px] flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
              <AlertCircle className="w-7 h-7 text-slate-400" />
            </div>
            <CardTitle className="mb-2 text-lg">No challenges found</CardTitle>
            <CardDescription className="mb-6 max-w-sm font-medium">
              {domainFilter !== 'All' ? `No problem statements found under '${domainFilter}'.` : 'No problem statements found for this filter.'}
            </CardDescription>
            <Button onClick={onSubmitClick} className="gap-2 rounded-xl shadow-sm px-5">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Submit a Problem {domainFilter !== 'All' ? `in ${domainFilter}` : ''}
            </Button>
          </Card>
        ) : (
          <>
            <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-white border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-slate-500 w-10">S.No.</th>
                    <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-slate-500 min-w-[220px]">Challenge Name</th>
                    <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-slate-500">District</th>
                    <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-slate-500">Domain Type</th>
                    <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-slate-500 whitespace-nowrap">Submitted On</th>
                    <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-slate-500">Status</th>
                    <th className="py-2.5 px-3 text-center text-[11px] font-semibold text-slate-500 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedChallenges.map((ch, index) => {
                    const formattedDate = ch.submittedAt
                      ? new Date(ch.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'N/A';
                    const isWithdrawn = (ch.status || '').toLowerCase() === 'withdrawn';
                    const district = ch.location?.district || ch.district || 'N/A';
                    const rowNumber = ((currentPage - 1) * itemsPerPage) + index + 1;

                    return (
                      <tr 
                        key={ch.challengeId || ch._id}
                        onClick={() => onSelectChallenge(ch)}
                        className={`transition-colors cursor-pointer hover:bg-slate-50/80 ${isWithdrawn ? 'opacity-70 bg-slate-50/30' : 'bg-white'}`}
                      >
                        {/* 1. Index */}
                        <td className="py-2.5 px-3 text-slate-500 font-bold text-[11px]">{rowNumber}</td>
                        
                        {/* 2. Challenge Details */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-50/80 border border-blue-100 flex items-center justify-center font-bold text-blue-600 text-[10px] shrink-0">
                              {ch.title ? ch.title.substring(0, 2).toUpperCase() : 'CH'}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate max-w-[280px] leading-tight group-hover:text-emerald-700">
                                {ch.title}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1 flex items-center flex-wrap gap-1.5">
                                <span>Code: {ch.challengeId}</span>
                                {ch.priority && (
                                  <span className={`text-[9px] font-extrabold uppercase tracking-wide ${
                                    ch.priority === 'Critical' ? 'text-rose-600' : 
                                    ch.priority === 'High' ? 'text-orange-600' : 
                                    'text-slate-500'
                                  }`}>
                                    {ch.priority}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 3. District */}
                        <td className="py-2.5 px-3 text-[11.5px] text-slate-700 font-medium">
                          {district}
                        </td>

                        {/* 4. Domain */}
                        <td className="py-2.5 px-3 text-[11px] font-bold text-emerald-800 whitespace-nowrap">
                          {ch.domain}
                        </td>

                        {/* 5. Submitted On */}
                        <td className="py-2.5 px-3 text-[11px] text-slate-600 font-medium whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* 6. Status */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {(() => {
                            let textStyle = 'text-amber-600';
                            const stat = (ch.status || '').toLowerCase();
                            if (isWithdrawn) textStyle = 'text-slate-500';
                            else if (stat === 'resolved') textStyle = 'text-emerald-700'; 
                            else if (stat === 'in progress') textStyle = 'text-emerald-600'; 
                            else if (stat === 'under review' || stat === 'submitted') textStyle = 'text-blue-600'; 
                            
                            return (
                              <span className={`text-[11px] font-bold tracking-wide ${textStyle}`}>
                                {ch.status || 'Pending'}
                              </span>
                            );
                          })()}
                        </td>

                        {/* 7. Actions */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={(e) => { e.stopPropagation(); onSelectChallenge(ch); }}
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                              title="Options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {isWithdrawn && (
                              <button 
                                onClick={(e) => handleDeleteChallenge(e, ch)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Delete Permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-4 pb-1 border-t border-slate-100 gap-3">
              <span className="text-xs font-medium text-slate-500">
                Showing <strong className="text-slate-900 font-bold">{((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong className="text-slate-900 font-bold">{Math.min(currentPage * itemsPerPage, displayedChallenges.length)}</strong> of <strong className="text-slate-900 font-bold">{displayedChallenges.length}</strong> challenges
              </span>
              <div className="flex items-center gap-2.5">
                <div className="relative hidden sm:block">
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-slate-200/80 text-slate-600 py-1 pl-2.5 pr-7 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white shadow-sm cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        currentPage === page 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' 
                          : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white shadow-sm cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  );
};

export default CitizenMyChallenges;
