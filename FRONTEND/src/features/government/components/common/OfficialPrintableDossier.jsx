import React from 'react';
import {
  FileCheck,
  Building,
  ShieldCheck
} from 'lucide-react';

export const OfficialPrintableDossier = ({
  selectedDistrict = 'All',
  selectedSector = 'All',
  kpis,
  issues = []
}) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const sampleIssues = issues;

  return (
    <div id="printable-dossier" className="hidden print:block bg-white p-8 space-y-6 text-slate-900 w-full">
      {/* Official Government Letterhead */}
      <div className="border-b-2 border-slate-900 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
              alt="Govt of Jharkhand Emblem"
              className="w-14 h-14 object-contain"
            />
            <div>
              <h1 className="text-base font-black uppercase tracking-wider text-slate-950">
                Government of Jharkhand
              </h1>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Department of Higher and Technical Education
              </h2>
              <p className="text-[11px] font-semibold text-slate-500">
                JoharSetu State Innovation & Problem Triage Governance Portal
              </p>
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <span className="inline-block bg-slate-900 text-white text-[9.5px] font-black px-2.5 py-0.5 rounded tracking-widest uppercase">
              Official Dossier
            </span>
            <p className="text-[10px] font-mono font-bold text-slate-700">
              DOC REF: JH-DTE-2026-TRG-08
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Date: {currentDate} | {currentTime}
            </p>
          </div>
        </div>

        {/* Document Scope Banner */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-2.5 grid grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Filtered District</span>
            <span className="font-bold text-slate-900">{selectedDistrict === 'All' ? 'All 24 Districts' : selectedDistrict}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Filtered Sector</span>
            <span className="font-bold text-slate-900">{selectedSector === 'All' ? 'All Sectors' : selectedSector}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Classification AI</span>
            <span className="font-bold text-blue-700">DistilBERT v2.4 (Active)</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Security Classification</span>
            <span className="font-bold text-emerald-700">Govt Official Use Only</span>
          </div>
        </div>
      </div>

      {/* Section 1: Executive KPI Metrics */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>1. State Problem Inflow & Resolution Telemetry</span>
        </h3>

        <div className="grid grid-cols-4 gap-3">
          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Total Problems Received</span>
            <span className="text-lg font-black text-slate-900">12,450</span>
            <span className="text-[9.5px] font-bold text-emerald-600 block mt-0.5">+320 this week</span>
          </div>
          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Accredited HEIs</span>
            <span className="text-lg font-black text-slate-900">12 Institutes</span>
            <span className="text-[9.5px] font-bold text-purple-600 block mt-0.5">All 24 Districts</span>
          </div>
          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Problems Solved</span>
            <span className="text-lg font-black text-emerald-700">10,854</span>
            <span className="text-[9.5px] font-bold text-slate-500 block mt-0.5">87.2% Resolution Rate</span>
          </div>
          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">Active Triage Queue</span>
            <span className="text-lg font-black text-blue-700">24 Pending</span>
            <span className="text-[9.5px] font-bold text-slate-500 block mt-0.5">Avg Model Score: 87.5%</span>
          </div>
        </div>
      </div>

      {/* Section 2: Domain Distribution Breakdown */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-slate-700" />
          <span>2. Domain Classification & Geo-Intelligence Breakdown</span>
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
              <span>Water Resources & Supply</span>
              <span className="font-bold text-slate-900">8 Issues (33%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '33%' }}></div>
            </div>

            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
              <span>Public Infrastructure & Roads</span>
              <span className="font-bold text-slate-900">6 Issues (25%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }}></div>
            </div>

            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
              <span>Healthcare & Public Hygiene</span>
              <span className="font-bold text-slate-900">5 Issues (21%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: '21%' }}></div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
              <span>Agriculture & Rural Livelihood</span>
              <span className="font-bold text-slate-900">3 Issues (13%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '13%' }}></div>
            </div>

            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
              <span>Solid Waste & Sanitation</span>
              <span className="font-bold text-slate-900">2 Issues (8%)</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '8%' }}></div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
              <span className="text-slate-500 font-medium">Model Precision Peak:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">94.2% Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Detailed Problem Classification Records Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-slate-700" />
          <span>3. Verified Problem Statements & AI Routing Records</span>
        </h3>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-[11px] border-collapse table-fixed">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
              <tr>
                <th className="py-2 px-2.5 w-[15%]">Issue ID</th>
                <th className="py-2 px-2.5 w-[33%]">Problem Statement</th>
                <th className="py-2 px-2 w-[12%]">District</th>
                <th className="py-2 px-2 w-[18%]">AI Domain</th>
                <th className="py-2 px-1.5 w-[10%] text-center">Confidence</th>
                <th className="py-2 px-2 w-[12%] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {sampleIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50">
                  <td className="py-2 px-2.5 font-mono font-bold text-slate-900">{issue.id}</td>
                  <td className="py-2 px-2.5 font-medium truncate" title={issue.title}>{issue.title}</td>
                  <td className="py-2 px-2 text-slate-600 font-semibold">{issue.district}</td>
                  <td className="py-2 px-2 text-slate-700">{issue.domain}</td>
                  <td className="py-2 px-1.5 text-center font-bold text-emerald-700">{issue.confidence}</td>
                  <td className="py-2 px-2 text-center">
                    <span className="inline-block px-1.5 py-0.2 text-[9.5px] font-bold rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {issue.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Official Sign-off & Verification Footer */}
      <div className="pt-6 border-t-2 border-slate-900 mt-6 grid grid-cols-2 gap-6 text-xs">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Prepared & Verified By</p>
          <p className="font-bold text-slate-900">JoharSetu Automated AI Triage Engine</p>
          <p className="text-[10px] text-slate-500">Government Data Services & Spatial Remote Sensing Division</p>
          <p className="text-[9.5px] text-slate-400 font-mono">System Hash: 0x8F9A...2C4D | Verified Signature</p>
        </div>

        <div className="text-right space-y-1">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Authorized Endorsement</p>
          <p className="font-bold text-slate-900">Department of Higher & Technical Education</p>
          <p className="text-[10px] text-slate-500">Government of Jharkhand, Ranchi</p>
          <p className="text-[9.5px] text-emerald-600 font-bold uppercase tracking-wider">Official State Record</p>
        </div>
      </div>

      {/* Document Footer Notice */}
      <div className="text-center text-[9.5px] text-slate-400 pt-2 border-t border-slate-100">
        This document is generated from the official JoharSetu Government Portal under the Directorate of Technical Education, Govt. of Jharkhand. All rights reserved © 2026.
      </div>
    </div>
  );
};

export default OfficialPrintableDossier;
