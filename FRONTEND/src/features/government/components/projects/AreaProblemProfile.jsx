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
  Compass,
  Cpu,
  Layers
} from 'lucide-react';
import { JHARKHAND_24_DISTRICTS } from '../../data/jharkhand24DistrictsData.js';

export const AreaProblemProfile = ({ project }) => {
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'demographics' | 'solution_impact'

  // Look up district data
  const distData = JHARKHAND_24_DISTRICTS.find((d) => d.name === project?.district) || JHARKHAND_24_DISTRICTS[0];

  const problemTitle = project?.problemOrigin || distData?.primaryProblem || project?.title || 'Civic Problem Statement';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-[#007A61]" />
            <span>Ground Area & Citizen Problem Dossier ({project?.district || 'Jharkhand'})</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Ground challenges, affected jurisdiction, and technical methodology for this project
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('problems')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'problems' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Problem Statement
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('demographics')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'demographics' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Area & Demographics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('solution_impact')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'solution_impact' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Proposed Solution
          </button>
        </div>
      </div>

      {/* TAB 1: GROUND PROBLEMS */}
      {activeTab === 'problems' && (
        <div className="space-y-3">
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5 text-xs text-rose-950">
            <span className="font-extrabold text-rose-800 uppercase tracking-wider flex items-center space-x-1.5 text-[10.5px]">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Citizen Problem Origin & Challenge Statement</span>
            </span>
            <p className="font-bold text-slate-900 leading-relaxed text-xs">
              {problemTitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">
                1. Affected District & Blocks
              </span>
              <p className="font-semibold text-slate-900 leading-relaxed">
                {distData?.name || 'Ranchi'} District ({distData?.affectedBlocks || 'Primary Municipal Zones'})
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">
                2. Domain / Sector
              </span>
              <p className="font-semibold text-slate-900 leading-relaxed">
                {project?.sector || project?.domain || 'Smart Infrastructure & Telemetry'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">
                3. Lead Institution
              </span>
              <p className="font-semibold text-slate-900 leading-relaxed">
                {project?.hei || 'Ranchi University (RU001)'}
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
              {(distData.affectedBlocks || 'Ranchi Urban, Kanke, Namkum').split(',').map((block, idx) => (
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
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-950">
            <span className="font-extrabold text-[#007A61] uppercase tracking-wider flex items-center space-x-1.5 text-[10.5px]">
              <CheckCircle2 className="w-4 h-4 text-[#007A61]" />
              <span>Technical Solution & Methodology by {project?.hei || 'University Team'}</span>
            </span>
            <p className="font-semibold text-slate-900 leading-relaxed text-xs">
              {project?.methodology || `Field deployment of ${project?.title || 'solution'} engineered to resolve ground problems in ${distData.name} district.`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-extrabold text-[#007A61] uppercase block tracking-wider">
                1. Prototype Phase & TRL
              </span>
              <p className="text-slate-900 font-bold leading-relaxed">
                {project?.trlLevel || 'TRL-3'} — {project?.stage || 'Lab Prototyping'}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-extrabold text-[#007A61] uppercase block tracking-wider">
                2. Hardware & Tech Specs
              </span>
              <p className="text-slate-900 font-semibold leading-relaxed">
                {project?.hardwareSpecs || 'Microcontroller telemetry probes & field sensors'}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-extrabold text-[#007A61] uppercase block tracking-wider">
                3. Lead Faculty & Team
              </span>
              <p className="text-slate-900 font-semibold leading-relaxed">
                {project?.teamLead || project?.leadMentor || 'Faculty Mentor'} {project?.studentTeam ? `(${project.studentTeam})` : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaProblemProfile;
