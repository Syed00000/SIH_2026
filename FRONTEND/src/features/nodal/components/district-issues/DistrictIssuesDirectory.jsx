import React, { useState, useEffect, useMemo } from 'react';
import { Building2, RefreshCw, AlertCircle } from 'lucide-react';
import { citizenService } from '../../../citizen/services/citizenService.js';
import { DistrictIssuesSummaryCards } from './DistrictIssuesSummaryCards.jsx';
import { DistrictIssuesFilterBar } from './DistrictIssuesFilterBar.jsx';
import { DistrictIssuesTable } from './DistrictIssuesTable.jsx';
import { DistrictProblemDetailPanel } from './DistrictProblemDetailPanel.jsx';

export const DistrictIssuesDirectory = ({ nodalDistrict = '', user }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');

  const loadIssues = async () => {
    try {
      setLoading(true);
      const queryParams = { limit: 150 };
      if (nodalDistrict && nodalDistrict !== 'All' && nodalDistrict !== 'All Districts') {
        queryParams.district = nodalDistrict;
      }
      const res = await citizenService.fetchChallenges(queryParams);
      let list = res?.challenges || (Array.isArray(res) ? res : []) || (res?.data?.challenges || []);
      if (nodalDistrict && nodalDistrict !== 'All' && nodalDistrict !== 'All Districts') {
        list = list.filter((c) => {
          const d = c.location?.district || c.district;
          return d && d.toLowerCase() === nodalDistrict.toLowerCase();
        });
      }
      setChallenges(list);
    } catch (err) {
      console.warn('Error loading district issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [nodalDistrict]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchTitle = (c.title || '').toLowerCase().includes(q);
        const matchDesc = (c.description || '').toLowerCase().includes(q);
        const matchId = (c.challengeId || c.id || '').toLowerCase().includes(q);
        const matchSub = (c.submitter?.fullName || c.submitter?.name || '').toLowerCase().includes(q);
        const matchPanchayat = (c.location?.panchayat || c.panchayat || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchId && !matchSub && !matchPanchayat) return false;
      }
      if (domainFilter !== 'All Domains' && c.domain !== domainFilter) return false;
      if (priorityFilter !== 'All Priority' && c.priority !== priorityFilter) return false;
      if (statusFilter !== 'All Status') {
        const hasDept = Boolean(c.assignedDepartment?.name);
        if (statusFilter === 'Pending Assignment' && hasDept) return false;
        if (statusFilter === 'Assigned to Dept' && !hasDept) return false;
        if (statusFilter === 'In Progress' && c.status !== 'In Progress') return false;
        if (statusFilter === 'Resolved' && c.status !== 'Resolved' && c.status !== 'Deployed') return false;
      }
      return true;
    });
  }, [challenges, searchTerm, domainFilter, priorityFilter, statusFilter]);

  const handleUpdateProblem = (updated) => {
    const targetId = updated.challengeId || updated.id || updated._id;
    setChallenges((prev) =>
      prev.map((c) => ((c.challengeId || c.id || c._id) === targetId ? updated : c))
    );
    setSelectedProblem(updated);
  };

  if (selectedProblem) {
    return (
      <DistrictProblemDetailPanel
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
        onUpdateProblem={handleUpdateProblem}
      />
    );
  }

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      {/* Top Header Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 leading-none">
                District Civic Issues & Grievances
              </h1>
              {nodalDistrict && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
                  {nodalDistrict}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Audit grassroots problems submitted by citizens and allocate ownership to related Gram Panchayats & Departments.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadIssues}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#007A61]' : ''}`} />
          <span>Sync Submissions</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <DistrictIssuesSummaryCards challenges={challenges} />

      {/* Filter and Search Bar */}
      <DistrictIssuesFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onReset={() => {
          setSearchTerm('');
          setStatusFilter('All Status');
          setDomainFilter('All Domains');
          setPriorityFilter('All Priority');
        }}
      />

      {/* Issues Listing Table */}
      <DistrictIssuesTable
        challenges={filteredChallenges}
        onSelectProblem={(p) => setSelectedProblem(p)}
      />
    </div>
  );
};

export default DistrictIssuesDirectory;
