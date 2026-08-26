import React, { useState } from 'react';
import {
  Rocket,
  MapPin,
  Building2,
  Activity,
  CheckCircle2,
  Clock,
  Radio,
  Users,
  ShieldCheck,
  Zap,
  ExternalLink
} from 'lucide-react';

export const DeploymentValidationView = ({ projects = [], onManageProject }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');

  const deployedProjects = projects.filter((p) => {
    const isDeployed =
      p.deploymentStatus === 'Validated ✓' ||
      p.deploymentStatus === 'Active ✓' ||
      p.deploymentStatus === 'In Progress';

    if (!isDeployed) return false;
    if (selectedDistrict === 'All Districts') return true;
    return p.district === selectedDistrict;
  });

  return (
    <div className="space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            Field Deployments & Telemetry Validation
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Operational field pilots, telemetry uptime, and citizen beneficiary tracking in Jharkhand districts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-500">Filter District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="All Districts">All Districts</option>
            <option value="Ranchi">Ranchi</option>
            <option value="Dhanbad">Dhanbad</option>
            <option value="East Singhbhum">East Singhbhum</option>
            <option value="West Singhbhum">West Singhbhum</option>
            <option value="Dumka">Dumka</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deployedProjects.map((prj) => {
          return (
            <div
              key={prj.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                        <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                        <span>Live Pilot</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {prj.trlLevel}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{prj.title}</h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">({prj.id})</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Telemetry</span>
                    <span className="text-xs font-black text-emerald-700">{prj.telemetryUptime || '99.4%'}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Nodes/Sensors</span>
                    <span className="text-xs font-black text-slate-900">{prj.liveSensorsCount || 12} Active</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Beneficiaries</span>
                    <span className="text-xs font-black text-slate-900">{prj.beneficiariesCount || '45k+'}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Location: <strong className="text-slate-800">{prj.deploymentLocation || `${prj.district} Field Sites`}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Operating Institution: <strong className="text-slate-800">{prj.hei}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  Funded: <strong className="text-slate-900">{prj.disbursedAmount}</strong> / {prj.sanctionedGrant}
                </span>
                <button
                  type="button"
                  onClick={() => onManageProject && onManageProject(prj)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Validation Log</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeploymentValidationView;
