import React, { useState } from 'react';
import { FileText, Download, FileDown, Building2, Briefcase, Landmark, ShieldCheck, Printer, RefreshCw } from 'lucide-react';
import { exportAdminDirectoryPdf, exportIndustryDirectoryPdf, exportUniversityDirectoryPdf, exportGenericReportPdf } from '../../services/exportPdfService.js';
import { universityService } from '../../services/universityService.js';
import { industryService } from '../../services/industryService.js';
import { adminService } from '../../services/adminService.js';

export const GovernmentReportsPanel = ({ selectedDistrict = 'All' }) => {
  const [exporting, setExporting] = useState('');

  const handleExport = async (type) => {
    setExporting(type);
    try {
      if (type === 'universities') {
        const data = await universityService.getUniversities({ limit: 200, district: selectedDistrict !== 'All' ? selectedDistrict : undefined });
        exportUniversityDirectoryPdf(data?.records || [], { district: selectedDistrict });
      } else if (type === 'industries') {
        const data = await industryService.getIndustries({ limit: 200 });
        exportIndustryDirectoryPdf(data?.records || [], { district: selectedDistrict });
      } else if (type === 'admins') {
        const data = await adminService.getAdmins({ limit: 200 });
        exportAdminDirectoryPdf(data?.records || [], { district: selectedDistrict });
      } else {
        exportGenericReportPdf('Jharkhand State Executive Dossier', { district: selectedDistrict });
      }
    } catch (err) {
      console.error('Export failed:', err);
      exportGenericReportPdf('State Governance Overview Report', { district: selectedDistrict });
    } finally {
      setTimeout(() => setExporting(''), 1000);
    }
  };

  const reportList = [
    { id: 'exec', title: 'State Innovation & Executive Governance Dossier', type: 'executive', category: 'Executive', icon: Landmark, desc: 'Complete executive summary of statewide innovations, R&D metrics, and district progress.' },
    { id: 'universities', title: 'Higher Education Institutions (HEI) Directory', type: 'universities', category: 'Academic', icon: Building2, desc: 'Verified academic centers, AISHE codes, faculty leads, and active prototype deployments.' },
    { id: 'industries', title: 'Corporate & Industry Partner CSR Allocation Register', type: 'industries', category: 'CSR & Funding', icon: Briefcase, desc: 'Corporate partnerships, grant pool allocations, and project co-sponsorship details.' },
    { id: 'admins', title: 'Government Nodal & Department Officers Roster', type: 'admins', category: 'Governance', icon: ShieldCheck, desc: 'Designated department heads, block coordinators, and administrative access registry.' }
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#007A61]/10 text-[#007A61] rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">Executive Reports & Audits</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Official printable dossiers, department directories, and compliance audit exports for Government of Jharkhand.</p>
        </div>
        <button
          onClick={() => handleExport('executive')}
          disabled={!!exporting}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#007A61] hover:bg-[#006651] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
        >
          {exporting === 'executive' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
          <span>Print Executive Dossier</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Executive Dossiers', val: 'State Wide', sub: 'Updated real-time', icon: Landmark },
          { label: 'HEI Records', val: '24 Districts', sub: 'Verified institutions', icon: Building2 },
          { label: 'CSR Partners', val: 'Active Pools', sub: 'CSR compliance ledger', icon: Briefcase },
          { label: 'Audit Trail', val: '100% Traceable', sub: 'Immutable system logs', icon: ShieldCheck }
        ].map((k, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">{k.label}</span>
              <k.icon className="w-4 h-4 text-[#007A61]" />
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">{k.val}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Reports Catalog */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Official State Reports Directory</h2>
          <span className="text-[11px] font-semibold text-[#007A61] bg-[#007A61]/10 px-2.5 py-0.5 rounded-full">District: {selectedDistrict}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {reportList.map((r) => (
            <div key={r.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 transition">
              <div className="flex items-start space-x-3 min-w-0">
                <span className="p-2 bg-slate-100 text-[#007A61] rounded-lg shrink-0 mt-0.5">
                  <r.icon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{r.title}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">{r.category}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{r.desc}</p>
                </div>
              </div>
              <button
                onClick={() => handleExport(r.type)}
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
    </div>
  );
};

export default GovernmentReportsPanel;
