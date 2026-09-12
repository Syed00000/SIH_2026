import React, { useState, useEffect } from 'react';
import { HandCoins, Search, TrendingUp, IndianRupee, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';
import projectCsrSyncService from '../../government/services/projectCsrSyncService.js';

export const DepartmentCsrGrantPanel = ({ department }) => {
  const [financials, setFinancials] = useState(() => projectCsrSyncService.getFinancials());
  const [proposals, setProposals] = useState(() => projectCsrSyncService.getCsrProposals());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const syncData = () => {
    setFinancials(projectCsrSyncService.getFinancials());
    setProposals(projectCsrSyncService.getCsrProposals());
  };

  useEffect(() => {
    syncData();
    const unsubscribe = projectCsrSyncService.subscribe(() => syncData());
    return () => unsubscribe();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await projectCsrSyncService.initializeFromBackend();
    syncData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredProposals = proposals.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = (p.title || '').toLowerCase().includes(q) || (p.id || '').toLowerCase().includes(q) || (p.sector || '').toLowerCase().includes(q) || (p.hei || '').toLowerCase().includes(q);
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'FUNDED') return matchesSearch && (p.isFunded || Number(p.rawDisbursed || 0) > 0);
    if (statusFilter === 'PENDING') return matchesSearch && !p.isFunded;
    return matchesSearch;
  });

  const kpis = [
    { label: 'Total Grant Corpus', value: `₹ ${Number(financials?.totalCorpus || 0).toLocaleString('en-IN')}`, sub: 'CSR & State pool allocated', icon: IndianRupee, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Disbursed Grants', value: `₹ ${Number(financials?.totalDisbursed || 0).toLocaleString('en-IN')}`, sub: 'Directly released to projects', icon: TrendingUp, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Active Civic Grants', value: financials?.activeFundedProjects || 0, sub: 'Field projects under execution', icon: Layers, color: 'text-purple-700', bg: 'bg-purple-50' },
    { label: 'Corpus Utilization', value: `${financials?.utilizationRate || 0}%`, sub: 'Deployment efficiency', icon: HandCoins, color: 'text-amber-700', bg: 'bg-amber-50' }
  ];

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center shrink-0">
            <HandCoins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-slate-900 leading-tight">
                CSR & State Innovation Grants
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Fund Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ward civic problem resolution grants, CSR sponsorships & project disbursements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all"
            title="Sync with Treasury Ledger"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Sync Fund Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider truncate">{k.label}</span>
                <div className={`text-base sm:text-lg font-black ${k.color} mt-0.5 truncate`}>{k.value}</div>
                <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">{k.sub}</span>
              </div>
              <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search grants by title, sector, HEI..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'FUNDED', 'PENDING'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${statusFilter === st ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {st === 'ALL' ? 'All Grants' : st === 'FUNDED' ? 'Funded / Active' : 'Pending Evaluation'}
            </button>
          ))}
        </div>
      </div>

      {/* Grants Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredProposals.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 font-medium">No CSR grant allocations found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Grant Proposal & ID</th>
                  <th className="py-3 px-4">Domain / Sector</th>
                  <th className="py-3 px-4">Partner Institution / HEI</th>
                  <th className="py-3 px-4">Sanctioned Grant</th>
                  <th className="py-3 px-4">Disbursed Amount</th>
                  <th className="py-3 px-4">Grant Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProposals.map((p) => {
                  const isFunded = p.isFunded || Number(p.rawDisbursed || 0) > 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 max-w-xs truncate">{p.title}</div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded inline-block mt-0.5">{p.id}</span>
                      </td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{p.sector || 'Civic Infrastructure'}</span></td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{p.hei || 'State Technical Institute'}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.budget || '₹ 80,000'}</td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700">{p.disbursedAmount || '₹ 0'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${isFunded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {isFunded && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {p.budgetStatus || (isFunded ? 'Grant Disbursed' : 'In Review')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentCsrGrantPanel;
