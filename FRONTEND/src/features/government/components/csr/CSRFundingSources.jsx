import React, { useState, useEffect, useMemo } from 'react';
import { Building2, Landmark, Handshake, ChevronRight, Eye, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { SourceDetailsModal } from './SourceDetailsModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

const ICONS = {
  corporate_csr: Building2,
  govt_grants: Landmark,
  joint_funding: Handshake
};

const BASE_SOURCES_CONFIG = [
  {
    id: 'corporate_csr',
    code: 'A',
    title: 'A. Corporate CSR Funds',
    description: 'PSUs & Private entities bound by Sec 135. Fully audited under MCA guidelines.',
    basePoolCr: 68.5,
    baseCommittedCr: 54.2,
    baseDisbursedCr: 22.8,
    activeDonors: '14 Donors',
    activeCount: '14 Donors',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
    poolColor: 'text-blue-700 bg-blue-50/50',
    topDonors: [
      { name: 'Tata Steel CSR Foundation', committed: '₹18.5 Cr', sector: 'Robotics & Advanced Metallurgy', status: 'Active' },
      { name: 'ONGC CSR Directorate', committed: '₹14.0 Cr', sector: 'Geothermal & Energy Innovation', status: 'Active' },
      { name: 'BCCL / Coal India CSR', committed: '₹12.0 Cr', sector: 'Mine Safety & Clean Energy', status: 'Active' },
      { name: 'NTPC CSR Trust', committed: '₹8.0 Cr', sector: 'Solar Microgrids & Rural Power', status: 'Active' },
      { name: 'Adani Foundation', committed: '₹6.0 Cr', sector: 'Agritech & Water Harvesting', status: 'Active' }
    ]
  },
  {
    id: 'govt_grants',
    code: 'B',
    title: 'B. Government Grants',
    description: 'State budget allocations dedicated to higher education & infrastructure upgradation.',
    basePoolCr: 110.0,
    baseCommittedCr: 89.0,
    baseDisbursedCr: 41.5,
    activeDonors: '08 Active Schemes',
    activeCount: '08 Schemes',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    poolColor: 'text-emerald-700 bg-emerald-50/50',
    topDonors: [
      { name: 'Jharkhand State Higher Ed Corpus (RUSA)', committed: '₹45.0 Cr', sector: 'Center of Excellence Labs', status: 'Active' },
      { name: 'Mukhyamantri Takniki Protsahan Yojna', committed: '₹30.0 Cr', sector: 'Tribal Student Incubation', status: 'Active' },
      { name: 'Dept of Higher & Technical Education Grant', committed: '₹20.0 Cr', sector: 'Smart Campus & Supercomputing', status: 'Active' },
      { name: 'State Innovation & Startup Fund (JFS)', committed: '₹15.0 Cr', sector: 'Grassroots Patent Filing', status: 'Active' }
    ]
  },
  {
    id: 'joint_funding',
    code: 'C',
    title: 'C. Joint Co-Funding',
    description: 'Public-Private partnership models matching corporate grants with state subsidies.',
    basePoolCr: 35.0,
    baseCommittedCr: 28.5,
    baseDisbursedCr: 14.2,
    activeDonors: '05 Active Projects',
    activeCount: '05 Projects',
    iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
    poolColor: 'text-purple-700 bg-purple-50/50',
    topDonors: [
      { name: 'CCL + Jharkhand State Joint R&D Hub', committed: '₹15.0 Cr', sector: 'Affordable Clean Water Filtration', status: 'Active' },
      { name: 'BCCL + State Tech Education Fund', committed: '₹10.0 Cr', sector: 'Underground Gas Telemetry', status: 'Active' },
      { name: 'Vedanta + BIT Mesra Tribal Innovation', committed: '₹10.0 Cr', sector: 'NTFP & Lac Bio-Processing', status: 'Active' }
    ]
  }
];

export const CSRFundingSources = ({ onFilterBySource, selectedSourceFilter }) => {
  const [selectedSourceData, setSelectedSourceData] = useState(null);
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());
  const [displayUnit, setDisplayUnit] = useState('dual'); // 'dual' | 'crores' | 'lakhs'
  const [recentlyUpdatedScheme, setRecentlyUpdatedScheme] = useState(null);

  // Listen to live grant payments and project disbursements
  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedProjects) {
        setProjects(data.updatedProjects);
      }
      if (eventType === 'GRANT_DISBURSED') {
        const targetScheme = data?.ledgerEntry?.scheme || 'Corporate CSR';
        setRecentlyUpdatedScheme(targetScheme);
        setTimeout(() => setRecentlyUpdatedScheme(null), 4000);
      }
    });
    return unsubscribe;
  }, []);

  // Compute dynamic pool amounts, committed totals, and disbursed sums for the 3 cards with full precision
  const dynamicFundingSources = useMemo(() => {
    return BASE_SOURCES_CONFIG.map((source) => {
      // Find projects belonging to this scheme
      const matchingProjects = projects.filter((p) => {
        const sch = (p.fundingScheme || p.fundingSource || '').toLowerCase();
        if (source.id === 'corporate_csr') {
          return sch.includes('corporate') || sch.includes('csr') || sch.includes('tata') || sch.includes('ongc') || sch.includes('bccl');
        }
        if (source.id === 'govt_grants') {
          return sch.includes('govt') || sch.includes('state') || sch.includes('rusa') || sch.includes('mukhyamantri');
        }
        if (source.id === 'joint_funding') {
          return sch.includes('joint') || sch.includes('co-funding') || sch.includes('matching');
        }
        return false;
      });

      // Calculate extra disbursed and sanctioned from active projects in exact Lakhs
      const extraDisbursedLakhs = matchingProjects.reduce((acc, p) => {
        const val = parseFloat(String(p.disbursedAmount || '0').replace(/[^\d.]/g, '')) || 0;
        return acc + val;
      }, 0);

      const extraSanctionedLakhs = matchingProjects.reduce((acc, p) => {
        const val = parseFloat(String(p.sanctionedGrant || '0').replace(/[^\d.]/g, '')) || 0;
        return acc + val;
      }, 0);

      // Base amounts converted to Lakhs (1 Cr = 100 Lakhs)
      const basePoolLakhs = source.basePoolCr * 100;
      const baseCommittedLakhs = source.baseCommittedCr * 100;
      const baseDisbursedLakhs = source.baseDisbursedCr * 100;

      const totalPoolLakhs = basePoolLakhs + extraSanctionedLakhs;
      const totalCommittedLakhs = baseCommittedLakhs + extraSanctionedLakhs;
      const totalDisbursedLakhs = baseDisbursedLakhs + extraDisbursedLakhs;

      const totalPoolCr = totalPoolLakhs / 100;
      const totalCommittedCr = totalCommittedLakhs / 100;
      const totalDisbursedCr = totalDisbursedLakhs / 100;

      return {
        ...source,
        extraDisbursedLakhs,
        extraSanctionedLakhs,
        totalPoolLakhs,
        totalCommittedLakhs,
        totalDisbursedLakhs,
        totalPoolCr,
        totalCommittedCr,
        totalDisbursedCr,
        poolAmount: `₹${totalPoolCr.toFixed(3).replace(/\.?0+$/, '')} Cr`,
        committedAmount: `₹${totalCommittedCr.toFixed(3).replace(/\.?0+$/, '')} Cr`,
        disbursedAmount: `₹${totalDisbursedCr.toFixed(3).replace(/\.?0+$/, '')} Cr`,
        poolAmountLakhs: `₹ ${totalPoolLakhs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lakhs`,
        disbursedAmountLakhs: `₹ ${totalDisbursedLakhs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lakhs`,
        activeCount: source.id === 'joint_funding' 
          ? `${5 + matchingProjects.length} Projects` 
          : source.id === 'corporate_csr' 
          ? `${14 + matchingProjects.length} Donors` 
          : `${8 + matchingProjects.length} Schemes`,
        matchingProjects
      };
    });
  }, [projects]);

  return (
    <div className="space-y-3">
      {/* Unit Controls Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>State Innovation Funding Sources & Corpus Pools</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            (Live synchronized with Active Project disbursements)
          </span>
        </div>

        <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setDisplayUnit('dual')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              displayUnit === 'dual' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dual (Cr + Lakhs)
          </button>
          <button
            type="button"
            onClick={() => setDisplayUnit('lakhs')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              displayUnit === 'lakhs' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Lakhs (₹ L)
          </button>
          <button
            type="button"
            onClick={() => setDisplayUnit('crores')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              displayUnit === 'crores' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Crores (₹ Cr)
          </button>
        </div>
      </div>

      {/* 3 Main Funding Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dynamicFundingSources.map((source) => {
          const IconComponent = ICONS[source.id] || Building2;
          const isSelected = selectedSourceFilter === source.id;
          const isRecentlyUpdated = recentlyUpdatedScheme && source.title.toLowerCase().includes(recentlyUpdatedScheme.toLowerCase());

          return (
            <div
              key={source.id}
              onClick={() => {
                setSelectedSourceData(source);
                onFilterBySource?.(source.id);
              }}
              className={`bg-white rounded-2xl p-5 border shadow-2xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group relative ${
                isRecentlyUpdated
                  ? 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-50/20 animate-pulse'
                  : isSelected
                  ? 'border-blue-600 ring-2 ring-blue-600/20'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg border ${source.iconColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {source.title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 flex items-center space-x-0.5">
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-3">
                  {source.description}
                </p>

                {/* Real-Time Disbursed Progress Meter */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600">Disbursed to HEIs:</span>
                    <span className="text-emerald-700 font-black">
                      {displayUnit === 'lakhs'
                        ? source.disbursedAmountLakhs
                        : displayUnit === 'crores'
                        ? source.disbursedAmount
                        : `${source.disbursedAmount} (${(source.totalDisbursedLakhs).toLocaleString('en-IN', { maximumFractionDigits: 1 })} L)`}
                    </span>
                  </div>

                  {source.extraDisbursedLakhs > 0 && (
                    <div className="flex items-center justify-between text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-emerald-600 animate-bounce" />
                        <span>Live Disbursed Added:</span>
                      </span>
                      <span>+ ₹{source.extraDisbursedLakhs.toFixed(2)} Lakhs ({ (source.extraDisbursedLakhs / 100).toFixed(3) } Cr)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {source.activeCount}
                </span>
                <span className={`font-bold px-2.5 py-0.5 rounded-md border text-[11px] ${source.poolColor} border-slate-200/50`}>
                  Pool: {displayUnit === 'lakhs' ? source.poolAmountLakhs : source.poolAmount}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <SourceDetailsModal
        isOpen={Boolean(selectedSourceData)}
        onClose={() => setSelectedSourceData(null)}
        sourceData={selectedSourceData}
        displayUnit={displayUnit}
      />
    </div>
  );
};

export default CSRFundingSources;
