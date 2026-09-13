import React from 'react';
import { RefreshCw, FileDown, Landmark, Building2, Briefcase, ShieldCheck } from 'lucide-react';

const REPORT_LIST = [
  { id: 'exec', title: 'State Innovation & Executive Governance Dossier', type: 'executive', category: 'Executive', icon: Landmark, desc: 'Complete executive summary of statewide innovations, R&D metrics, and district progress.' },
  { id: 'universities', title: 'Higher Education Institutions (HEI) Directory', type: 'universities', category: 'Academic', icon: Building2, desc: 'Verified academic centers, AISHE codes, faculty leads, and active prototype deployments.' },
  { id: 'industries', title: 'Corporate & Industry Partner CSR Allocation Register', type: 'industries', category: 'CSR & Funding', icon: Briefcase, desc: 'Corporate partnerships, grant pool allocations, and project co-sponsorship details.' },
  { id: 'admins', title: 'Government Nodal & Department Officers Roster', type: 'admins', category: 'Governance', icon: ShieldCheck, desc: 'Designated department heads, block coordinators, and administrative access registry.' }
];

export const ReportCatalogTable = ({ selectedDistrict = 'All', exporting = '', onExport }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Official State Reports Directory</h2>
        <span className="text-[11px] font-semibold text-[#007A61] bg-[#007A61]/10 px-2.5 py-0.5 rounded-full">District: {selectedDistrict}</span>
      </div>
      <div className="divide-y divide-slate-100">
        {REPORT_LIST.map((r) => (
          <div key={r.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 transition">
            <div className="flex items-start space-x-3 min-w-0">
              <span className="p-2 bg-slate-100 text-[#007A61] rounded-lg shrink-0 mt-0.5"><r.icon className="w-4 h-4" /></span>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-slate-900 truncate">{r.title}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">{r.category}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{r.desc}</p>
              </div>
            </div>
            <button
              onClick={() => onExport(r.type)}
              disabled={!!exporting}
              className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 border border-slate-200 hover:border-[#007A61] hover:bg-[#007A61]/5 text-slate-700 hover:text-[#007A61] rounded-lg text-xs font-bold transition shrink-0 cursor-pointer disabled:opacity-50"
            >
              {exporting === r.type ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#007A61]" /> : <FileDown className="w-3.5 h-3.5" />}
              <span>Export PDF</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportCatalogTable;
