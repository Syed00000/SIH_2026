import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  MapPin,
  Calendar,
  ChevronRight,
  FileText,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { ProblemEvidenceDossierModal } from '../../../nodal/components/ProblemEvidenceDossierModal.jsx';

export const FacultyAssignedChallenges = ({
  challenges = [],
  faculty,
  onDraftProposal
}) => {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [selectedDossier, setSelectedDossier] = useState(null);

  const filtered = challenges.filter((c) => {
    if (domainFilter !== 'All' && c.domain !== domainFilter && c.category !== domainFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (c.title || '').toLowerCase().includes(q) ||
        (c.challengeId || '').toLowerCase().includes(q) ||
        (c.domain || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Faculty Research Node</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Assigned Problem Statements</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-[#007A61]" />
            <span>Official Grassroots Problem Statements</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified ground problems allocated to you by Ranchi University for solution scoping and prototype formulation.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
        <div className="relative sm:col-span-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems by keyword, district, ID..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <div>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
          >
            <option value="All">All Thematic Domains</option>
            <option value="Water">Water & Sanitation</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Environment">Environment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Energy">Energy</option>
            <option value="Agriculture">Agriculture</option>
          </select>
        </div>
      </div>

      {/* Problems Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-400 space-y-2">
          <ClipboardList className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No Assigned Problem Statements Found</h3>
          <p className="text-xs max-w-md mx-auto">
            When the University assigns a problem to your department, it will appear here for research scoping.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((c, idx) => {
            const domain = c.domain || c.category || 'Innovation';
            const loc = c.location?.district || c.district || 'Jharkhand';

            return (
              <div
                key={c.challengeId || idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                        {c.challengeId}
                      </span>
                      <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {domain}
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-[#007A61] border border-emerald-200">
                      Assigned to You
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {c.problemStatement || c.description || 'No detailed problem statement provided.'}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{loc}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDossier(c)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-slate-500" />
                    <span>Evidence Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDraftProposal ? onDraftProposal(c) : null}
                    className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-[11px] font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Draft Proposal & Budget</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dossier Modal */}
      {selectedDossier && (
        <ProblemEvidenceDossierModal
          isOpen={true}
          onClose={() => setSelectedDossier(null)}
          challenge={selectedDossier}
        />
      )}
    </div>
  );
};

export default FacultyAssignedChallenges;
