import React, { useState, useEffect } from 'react';
import {
  Building,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  ChevronRight,
  Plus,
  Send,
  User,
  MapPin,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight,
  RotateCcw,
  X
} from 'lucide-react';
import { universityService } from '../../government/services/universityService.js';
import { citizenService } from '../../citizen/services/citizenService.js';
import { NodalAssignModal } from './NodalAssignModal.jsx';
import { UniversityProblemsDetailView } from './UniversityProblemsDetailView.jsx';

const ALLOCATION_STATUS_TABS = ['All', 'Assigned', 'Unassigned'];

export const NodalUniversitiesPanel = ({ onNavigateChallenges }) => {
  const [universities, setUniversities] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAllocationStatus, setFilterAllocationStatus] = useState('All');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [selectedUniForDetails, setSelectedUniForDetails] = useState(null);

  // Modal states
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedUniForAllocation, setSelectedUniForAllocation] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [uniRes, challengeRes] = await Promise.all([
        universityService.getUniversities({ limit: 100 }),
        citizenService.fetchChallenges({ limit: 200 })
      ]);

      const fetchedUnis = uniRes?.records || [];
      setUniversities(fetchedUnis);

      const chlList = challengeRes?.challenges || (Array.isArray(challengeRes) ? challengeRes : []) || [];
      setChallenges(chlList);
    } catch (err) {
      console.warn('Error loading universities in Nodal panel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Map each university to its assigned challenges
  const getAssignedChallengesForUni = (uni) => {
    if (!uni) return [];
    const uniCode = (uni.code || '').toUpperCase();
    const uniName = (uni.name || uni.legalName || '').toLowerCase();

    return challenges.filter((c) => {
      const assignedId = (c.assignedUniversity?.id || '').toUpperCase();
      const assignedName = (c.assignedUniversity?.name || '').toLowerCase();
      if (assignedId && (assignedId === uniCode || uniCode.includes(assignedId))) return true;
      if (assignedName && (assignedName.includes(uniName) || uniName.includes(assignedName))) return true;
      return false;
    });
  };

  const handleAllocateNewToUni = (e, uni) => {
    e.stopPropagation();
    setSelectedUniForAllocation(uni);
    setSelectedChallenge(null);
    setIsAssignModalOpen(true);
  };

  const handleTriageSuccess = (updatedData) => {
    if (updatedData?.deleted) {
      setToastMsg(`Problem statement deleted from database.`);
    } else {
      setToastMsg(`Problem successfully allocated to ${updatedData.assignedUniversity?.name || selectedUniForAllocation?.name || 'University'} in MongoDB!`);
    }
    loadData();
    setTimeout(() => setToastMsg(''), 5000);
  };

  // If a specific university is selected, render the dedicated UniversityProblemsDetailView component!
  if (selectedUniForDetails) {
    return (
      <UniversityProblemsDetailView
        university={selectedUniForDetails}
        assignedChallenges={getAssignedChallengesForUni(selectedUniForDetails)}
        allChallenges={challenges}
        onBack={() => setSelectedUniForDetails(null)}
        onReload={loadData}
      />
    );
  }

  // Compute metrics
  const totalUnis = universities.length;
  const assignedUnisCount = universities.filter((u) => getAssignedChallengesForUni(u).length > 0).length;
  const idleUnisCount = totalUnis - assignedUnisCount;

  // Filtered universities
  const filteredUniversities = universities.filter((u) => {
    const assigned = getAssignedChallengesForUni(u);
    const hasAssigned = assigned.length > 0;

    if (filterAllocationStatus === 'Assigned' && !hasAssigned) return false;
    if (filterAllocationStatus === 'Unassigned' && hasAssigned) return false;
    if (filterDistrict !== 'All' && u.district !== filterDistrict) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        (u.name || '').toLowerCase().includes(q) ||
        (u.legalName || '').toLowerCase().includes(q) ||
        (u.code || '').toLowerCase().includes(q) ||
        (u.district || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-5 select-none text-left animate-in fade-in duration-150">
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#064e3b] text-xs font-bold rounded-lg flex items-center space-x-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner matching Citizen Portal style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Universities & HEI Allocation Directory
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor state universities solving citizen problem statements ({assignedUnisCount} active &bull; {idleUnisCount} available)
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-700' : 'text-slate-500'}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Controls Bar: Search Input & Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search university name, AISHE code, district..."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200/90 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clean Filter Tabs Bar */}
        <div className="flex items-center space-x-1 bg-white p-1 border border-slate-200/90 rounded-lg shadow-2xs overflow-x-auto">
          {ALLOCATION_STATUS_TABS.map((tab) => {
            const isActive = filterAllocationStatus === tab;
            const label = tab === 'All' ? `All (${totalUnis})` : tab === 'Assigned' ? `Working (${assignedUnisCount})` : `Not Assigned (${idleUnisCount})`;
            return (
              <button
                key={tab}
                onClick={() => setFilterAllocationStatus(tab)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#064e3b] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Universities List in Citizen Style */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2.5 bg-white border border-slate-200/90 rounded-lg shadow-2xs">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-700" />
          <span className="text-xs font-semibold text-slate-600">Loading state university network from MongoDB...</span>
        </div>
      ) : filteredUniversities.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-lg p-10 text-center space-y-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">No Universities Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No institutions matched your active filter or search query.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUniversities.map((uni) => {
            const assignedList = getAssignedChallengesForUni(uni);
            const isAssigned = assignedList.length > 0;
            const acceptedCount = assignedList.filter(
              (c) => c.assignedUniversity?.acceptanceStatus === 'Accepted' || c.acceptanceStatus === 'Accepted'
            ).length;

            return (
              <div
                key={uni.code}
                onClick={() => setSelectedUniForDetails(uni)}
                className="group bg-white border border-slate-200/90 hover:border-emerald-400 rounded-lg p-4.5 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer space-y-3 text-left"
              >
                {/* Header Row: Pure text Code on Left, Pure Status Text on Right */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {uni.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      AISHE: {uni.aisheCode || 'U-0000'}
                    </span>
                  </div>

                  {/* Pure Status Text - NO Background Color Box! */}
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-extrabold flex items-center space-x-1 ${
                        isAssigned ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      <span>
                        {isAssigned
                          ? `Working on ${assignedList.length} ${assignedList.length === 1 ? 'Problem' : 'Problems'} (${acceptedCount} Accepted)`
                          : 'No Problems Assigned (Available)'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Body Row: Title & Details */}
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {uni.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{uni.district || 'Jharkhand'}, Jharkhand</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{uni.universityType || uni.institutionCategory || 'Higher Education Institution'}</span>
                    </span>
                    {uni.accreditation?.naacGrade && (
                      <span className="text-slate-600 font-bold">
                        NAAC: {uni.accreditation.naacGrade}
                      </span>
                    )}
                    {uni.accreditation?.nirfRanking && (
                      <span className="text-slate-500 font-medium">
                        NIRF: #{uni.accreditation.nirfRanking}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action Row */}
                <div
                  className="pt-2 border-t border-slate-100 flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-700">
                      {uni.universityType || uni.type || 'State University'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Allocate Problem Button */}
                    <button
                      onClick={(e) => handleAllocateNewToUni(e, uni)}
                      className="text-xs font-bold text-slate-700 hover:text-emerald-800 px-3 py-1 rounded-md border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Allocate Problem</span>
                    </button>

                    {/* View Problems Button */}
                    <button
                      onClick={() => setSelectedUniForDetails(uni)}
                      className="text-xs text-emerald-800 hover:text-white bg-white hover:bg-[#064e3b] border border-slate-200 hover:border-[#064e3b] font-bold px-3 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 group-hover:translate-x-0.5"
                    >
                      <span>View Problems ({assignedList.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Allocation / Triage Modal */}
      <NodalAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedUniForAllocation(null);
          setSelectedChallenge(null);
        }}
        targetUniversity={selectedUniForAllocation}
        challenge={selectedChallenge}
        onSuccess={handleTriageSuccess}
      />
    </div>
  );
};

export default NodalUniversitiesPanel;
