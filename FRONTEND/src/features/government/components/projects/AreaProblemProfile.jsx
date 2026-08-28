import React, { useState } from 'react';
import {
  MapPin,
  AlertCircle,
  Users,
  Building2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  TrendingUp,
  Activity,
  HeartHandshake,
  Landmark,
  Compass
} from 'lucide-react';
import { JHARKHAND_24_DISTRICTS } from '../../data/jharkhand24DistrictsData.js';

export const AreaProblemProfile = ({ project }) => {
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'demographics' | 'solution_impact'

  // Look up district data
  const distData = JHARKHAND_24_DISTRICTS.find((d) => d.name === project?.district) || JHARKHAND_24_DISTRICTS[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-slate-700" />
            <span>Ground Area & Local Problem Data ({project?.district || 'Jharkhand'})</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-medium">
            Detailed ground challenges, affected population, and local village data around this project site
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('problems')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'problems' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Ground Problems
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('demographics')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'demographics' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Affected Population & Area
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('solution_impact')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'solution_impact' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            3. How Project Solves It
          </button>
        </div>
      </div>

      {/* TAB 1: GROUND PROBLEMS IN THIS SPECIFIC AREA */}
      {activeTab === 'problems' && (
        <div className="space-y-3">
          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5 text-xs text-rose-950">
            <span className="font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>Primary Ground Problem Statement in {distData.name}</span>
            </span>
            <p className="font-semibold text-rose-900 leading-relaxed">
              {distData.primaryProblem}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Ground Hazard & Cause</span>
              <p className="font-semibold text-slate-900 leading-relaxed">
                Direct environmental & physical risk affecting daily citizen life in {distData.affectedBlocks}.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">2. Public Health & Safety</span>
              <p className="font-semibold text-slate-900 leading-relaxed">
                Drinking water safety, air quality, and seasonal health vulnerability across local panchayats.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">3. Livelihood Impact</span>
              <p className="font-semibold text-slate-900 leading-relaxed">
                Loss of crop yield, worker wage disruption, and transport bottleneck for small producers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEMOGRAPHICS & LOCAL AREA DATA */}
      {activeTab === 'demographics' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total District Area</span>
              <span className="text-sm font-black text-slate-900 block mt-0.5">{distData.areaSqKm}</span>
              <span className="text-[10px] text-slate-500">Geographical Size</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Population</span>
              <span className="text-sm font-black text-slate-900 block mt-0.5">{distData.population}</span>
              <span className="text-[10px] text-slate-500">Residents in District</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Blocks</span>
              <span className="text-sm font-black text-slate-900 block mt-0.5">{distData.blocksCount} Blocks</span>
              <span className="text-[10px] text-slate-500">Administrative Units</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Need Severity</span>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md inline-block mt-1">
                {distData.severity}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <span className="font-bold text-slate-900 block">Specific Affected Blocks & Local Localities:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {distData.affectedBlocks.split(',').map((block, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs">
                  📍 {block.trim()} Block
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOW THIS SPECIFIC PROJECT SOLVES THE AREA PROBLEM */}
      {activeTab === 'solution_impact' && (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-emerald-950">
            <span className="font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Active Solution Roadmap by {project?.hei}</span>
            </span>
            <p className="font-semibold text-emerald-900 leading-relaxed">
              {project?.title ? `Direct field solution deployment for ${project.title} across ${distData.name} district.` : 'Active field solution roadmap deployed.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">1. Immediate Ground Impact</span>
              <p className="text-slate-800 leading-relaxed">
                Direct deployment in priority pilot villages/sites giving immediate relief to families.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">2. District Administration Scale</span>
              <p className="text-slate-800 leading-relaxed">
                Handover of working machine/app to District Collectorate & Block Panchayats.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">3. Permanent State Benefit</span>
              <p className="text-slate-800 leading-relaxed">
                Permanent elimination of the local bottleneck across all affected blocks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaProblemProfile;
