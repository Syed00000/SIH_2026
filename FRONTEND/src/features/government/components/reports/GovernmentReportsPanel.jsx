import React, { useState, useEffect } from 'react';
import { FileText, Printer, RefreshCw, Landmark, Building2, Briefcase, ShieldCheck } from 'lucide-react';
import { exportAdminDirectoryPdf, exportIndustryDirectoryPdf, exportUniversityDirectoryPdf, exportGenericReportPdf } from '../../services/exportPdfService.js';
import { universityService } from '../../services/universityService.js';
import { industryService } from '../../services/industryService.js';
import { adminService } from '../../services/adminService.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import apiClient from '../../../../infrastructure/api/client.js';

import { CSRGrantsAnalyticsChart } from './CSRGrantsAnalyticsChart.jsx';
import { HEIDistrictAnalyticsChart } from './HEIDistrictAnalyticsChart.jsx';
import { ProjectTRLAnalyticsChart } from './ProjectTRLAnalyticsChart.jsx';
import { CivicGovernanceAnalyticsChart } from './CivicGovernanceAnalyticsChart.jsx';
import { ReportCatalogTable } from './ReportCatalogTable.jsx';

const TOPIC_FILTERS = ['All Topics', 'CSR & Grants', 'Academic & HEIs', 'Projects & TRL', 'Civic Governance', 'PDF Dossiers'];

export const GovernmentReportsPanel = ({ selectedDistrict = 'All' }) => {
  const [activeTopic, setActiveTopic] = useState('All Topics');
  const [exporting, setExporting] = useState('');
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [grantsData, setGrantsData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [challenges, setChallenges] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [oRes, gRes, dRes, cRes] = await Promise.all([
        apiClient.get('government/overview/stats').catch(() => null),
        apiClient.get('government/grants').catch(() => null),
        apiClient.get('government/departments').catch(() => null),
        apiClient.get('citizen/challenges?limit=200').catch(() => null)
      ]);
      const oData = oRes?.data || oRes;
      const gData = gRes?.data || gRes;
      const dData = Array.isArray(dRes?.data) ? dRes.data : (Array.isArray(dRes) ? dRes : []);
      const cList = cRes?.data?.challenges || cRes?.challenges || [];

      if (oData?.heis) setStatsData(oData);
      if (gData && (gData.fundEntries || typeof gData.stateGrantsTotal === 'number')) setGrantsData(gData);
      if (Array.isArray(dData) && dData.length > 0) setDepartments(dData);
      setChallenges(cList);

      try {
        await projectCsrSyncService.initializeFromBackend();
      } catch {}
      setProjects(projectCsrSyncService.getActiveProjects() || []);
    } catch (err) {
      console.warn('Reports data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDistrict]);

  const handleExport = async (type) => {
    setExporting(type);
    try {
      if (type === 'universities') {
        const d = await universityService.getUniversities({ limit: 200, district: selectedDistrict !== 'All' ? selectedDistrict : undefined });
        exportUniversityDirectoryPdf(d?.records || [], { district: selectedDistrict });
      } else if (type === 'industries') {
        const d = await industryService.getIndustries({ limit: 200 });
        exportIndustryDirectoryPdf(d?.records || [], { district: selectedDistrict });
      } else if (type === 'admins') {
        const d = await adminService.getAdmins({ limit: 200 });
        exportAdminDirectoryPdf(d?.records || [], { district: selectedDistrict });
      } else {
        exportGenericReportPdf('Jharkhand State Executive Dossier', { district: selectedDistrict });
      }
    } catch {
      exportGenericReportPdf('State Governance Overview Report', { district: selectedDistrict });
    } finally {
      setTimeout(() => setExporting(''), 1000);
    }
  };

  const fin = statsData?.financials || {};
  const totalCorpus = fin.totalInnovationCorpusCr > 0
    ? `₹ ${fin.totalInnovationCorpusCr} Cr`
    : `₹ ${(Number(grantsData?.totalJointCorpus) || Number(fin.stateGrantsTotal) || 0).toLocaleString('en-IN')}`;

  const heiTotal = Number(statsData?.heis?.total) || 0;
  const problemTotal = challenges.length > 0 ? challenges.length : (Number(statsData?.problems?.total) || 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#007A61]/10 text-[#007A61] rounded-lg"><FileText className="w-5 h-5" /></span>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">Executive Reports & Visual Analytics</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Official analytics telemetry, graphical sector performance, and printable audit dossiers.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={loadData} disabled={loading} className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#007A61]' : ''}`} />
          </button>
          <button onClick={() => handleExport('executive')} disabled={!!exporting} className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#007A61] hover:bg-[#006651] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50">
            {exporting === 'executive' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            <span>Print Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Innovation Fund', val: totalCorpus, sub: 'State & Corporate CSR', icon: Landmark },
          { label: 'Registered Universities', val: `${heiTotal} HEI${heiTotal !== 1 ? 's' : ''}`, sub: 'Higher Education Centers', icon: Building2 },
          { label: 'Innovations & Projects', val: `${projects.length} Active`, sub: 'R&D Solutions', icon: Briefcase },
          { label: 'Citizen Problems', val: `${problemTotal} Reported`, sub: 'Civic Issues Filed', icon: ShieldCheck }
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

      {/* Topic Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {TOPIC_FILTERS.map((topic) => (
          <button
            key={topic}
            onClick={() => setActiveTopic(topic)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 border ${
              activeTopic === topic ? 'bg-[#007A61] text-white border-[#007A61] shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Visual Analytics Grid */}
      <div className="space-y-4">
        {(activeTopic === 'All Topics' || activeTopic === 'CSR & Grants') && (
          <CSRGrantsAnalyticsChart grantsData={grantsData} financials={fin} />
        )}
        {(activeTopic === 'All Topics' || activeTopic === 'Projects & TRL') && (
          <ProjectTRLAnalyticsChart projects={projects} sectors={statsData?.sectors} />
        )}
        {(activeTopic === 'All Topics' || activeTopic === 'Academic & HEIs') && (
          <HEIDistrictAnalyticsChart heisByDistrict={statsData?.heisByDistrict} topHeis={statsData?.topHeis} totalHeis={statsData?.heis?.total} />
        )}
        {(activeTopic === 'All Topics' || activeTopic === 'Civic Governance') && (
          <CivicGovernanceAnalyticsChart challenges={challenges.length > 0 ? challenges : (statsData?.recentChallenges || [])} totalProblems={problemTotal} departments={departments} />
        )}
      </div>

      {/* Reports Catalog */}
      {(activeTopic === 'All Topics' || activeTopic === 'PDF Dossiers') && (
        <ReportCatalogTable selectedDistrict={selectedDistrict} exporting={exporting} onExport={handleExport} />
      )}
    </div>
  );
};

export default GovernmentReportsPanel;
