import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Calendar, ChevronRight, AlertCircle, Loader2, X, Layers, Trash2 } from 'lucide-react';
import { citizenService } from '../services/citizenService.js';
import { CitizenThemedSelect } from './CitizenThemedSelect.jsx';
import { Card, CardTitle, CardDescription } from '../../../shared/components/ui/card.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Input } from '../../../shared/components/ui/input.jsx';
import { Badge } from '../../../shared/components/ui/badge.jsx';
import { Tabs, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs.jsx';

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
  const itemsPerPage = 5;

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
              My Submitted Challenges
            </CardTitle>
            <CardDescription className="text-sm mt-1 text-slate-500 font-medium">
              Track live government review, AI triage, and university progress
            </CardDescription>
          </div>
          <Button onClick={onSubmitClick} className="shrink-0 font-bold gap-2 shadow-sm rounded-xl py-2.5 px-5">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Challenge
          </Button>
        </div>
      </Card>

      {/* 2. Filters & Search (Toolbar) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by challenge ID, problem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-white border-slate-200 rounded-xl font-medium text-sm shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="w-full sm:w-[200px]">
            <CitizenThemedSelect
              value={domainFilter === 'All' ? 'All Domains' : domainFilter}
              onChange={(val) => handleDomainChange(val === 'All Domains' ? 'All' : val)}
              options={DOMAIN_OPTIONS.map((dom) => (dom === 'All' ? 'All Domains' : dom))}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto pb-1 hide-scrollbar border-b border-slate-200">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
            <TabsList className="bg-transparent p-0 border-none rounded-none h-auto flex flex-nowrap w-full justify-start">
              {STATUS_FILTERS.map((st) => (
                <TabsTrigger 
                  key={st} 
                  value={st} 
                  className="px-5 py-2.5 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-[#007A61] data-[state=active]:text-[#007A61] data-[state=active]:bg-transparent data-[state=active]:shadow-none cursor-pointer whitespace-nowrap text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {st}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Active Domain Filter Badge */}
      {domainFilter && domainFilter !== 'All' && (
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-800 w-fit">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Filtered by Domain: <strong>{domainFilter}</strong> ({displayedChallenges.length})</span>
          <button onClick={() => handleDomainChange('All')} className="p-0.5 rounded-full hover:bg-emerald-200/50 text-emerald-700 cursor-pointer ml-1">
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
            {paginatedChallenges.map((ch) => {
              const formattedDate = ch.submittedAt
                ? new Date(ch.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : null;
            const isWithdrawn = (ch.status || '').toLowerCase() === 'withdrawn';

            return (
              <Card
                key={ch.challengeId || ch._id}
                onClick={() => onSelectChallenge(ch)}
                className={`overflow-hidden transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                  isWithdrawn ? 'bg-slate-50/50 border-slate-200 opacity-90' : 'bg-white border-slate-200 hover:border-[#007A61]/40'
                }`}
              >
                <div className="p-5 flex flex-col gap-4">
                  
                  {/* Top Row: Meta info */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-extrabold text-sm text-slate-900 tracking-tight">{ch.challengeId}</span>
                      {ch.priority && (
                        <span className={`text-[11.5px] font-bold ${
                          ch.priority === 'Critical' ? 'text-rose-600' : 
                          ch.priority === 'High' ? 'text-orange-600' : 
                          'text-slate-600'
                        }`}>
                          Priority: {ch.priority}
                        </span>
                      )}
                    </div>
                    
                    <span 
                      className={`text-[11.5px] font-bold tracking-wide uppercase ${
                        isWithdrawn
                          ? 'text-slate-500'
                          : ch.status === 'Resolved'
                          ? 'text-emerald-700'
                          : 'text-[#007A61]'
                      }`}
                    >
                      {ch.status}
                    </span>
                  </div>

                  {/* Middle Row: Title & Location */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#007A61] leading-snug">
                      {ch.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 font-medium">
                      {(ch.location?.district || ch.district) && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{ch.location?.district || ch.district}, Jharkhand</span>
                        </span>
                      )}
                      {formattedDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{formattedDate}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Actions */}
                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#007A61]">
                      {ch.domain}
                    </span>
                    
                    <div className="flex items-center gap-3">
                      {isWithdrawn && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleDeleteChallenge(e, ch)}
                          className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 h-8 gap-2 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm" className="text-[#007A61] hover:text-[#005a47] hover:bg-[#007A61]/10 h-8 gap-1 font-bold">
                        <span>Track Progress</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-6">
              <span className="text-xs font-medium text-slate-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, displayedChallenges.length)} of {displayedChallenges.length} challenges
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="h-8 px-3 text-xs"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                        currentPage === page 
                          ? 'bg-[#007A61] text-white' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="h-8 px-3 text-xs"
                >
                  Next
                </Button>
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
