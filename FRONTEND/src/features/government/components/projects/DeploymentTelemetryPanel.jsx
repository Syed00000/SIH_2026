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
  ExternalLink,
  Search,
  RotateCcw,
  IndianRupee,
  FileCheck
} from 'lucide-react';

import { ProjectManageModal } from './ProjectManageModal.jsx';
import { INITIAL_ACTIVE_PROJECTS, DISTRICT_OPTIONS } from '../../data/projectsSolutionsData.js';

export const DeploymentTelemetryPanel = () => {
  const [projects, setProjects] = useState(INITIAL_ACTIVE_PROJECTS);
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const deployedProjects = projects.filter((p) => {
    const isDeployed =
      p.deploymentStatus?.includes('Validated') ||
      p.deploymentStatus?.includes('Active') ||
      p.deploymentStatus === 'In Progress';

    if (!isDeployed) return false;

    const matchesDistrict =
      selectedDistrict === 'All Districts' || p.district === selectedDistrict;

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hei.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDistrict && matchesSearch;
  });

  const handleValidateCertificate = (projectId) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, deploymentStatus: 'Validated ✓' } : p))
    );
    showToast(`Official State Deployment Certificate issued for ${projectId}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <Rocket className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects & Solutions</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Operational Field Validations</span>
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            FIELD DEPLOYMENTS & LIVE TELEMETRY
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Live IoT sensor network uptime, beneficiary tracking, and district site validation in Jharkhand
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
          {deployedProjects.length} Active Field Deployments
        </span>
      </div>

      {/* Real-time Telemetry Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Overall Telemetry Health
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">99.4%</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 mt-1 inline-block">
            High Reliability
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Live Field Sensor Nodes
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">140+</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 mt-1 inline-block">
            Active Broadcast
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Direct Beneficiaries
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">45,000+</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 mt-1 inline-block">
            Tribal & Rural Citizens
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            State Validations Issued
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">11</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 mt-1 inline-block">
            Certified Pilots
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search field location, telemetry node, project ID..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-hidden"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            {DISTRICT_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Deployment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deployedProjects.map((prj) => (
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
                      <span>Live Telemetry</span>
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Uptime</span>
                  <span className="text-xs font-black text-emerald-700">{prj.telemetryUptime || '99.4%'}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Sensors</span>
                  <span className="text-xs font-black text-slate-900">{prj.liveSensorsCount || 12} Nodes</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Beneficiaries</span>
                  <span className="text-xs font-black text-slate-900">{prj.beneficiariesCount || '45k+'}</span>
                </div>
              </div>

              <div className="mt-3 text-xs space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>Site: <strong className="text-slate-800">{prj.deploymentLocation || `${prj.district} District Sites`}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>Lead HEI: <strong className="text-slate-800">{prj.hei}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">
                Grant: <strong className="text-slate-900">{prj.disbursedAmount}</strong> / {prj.sanctionedGrant}
              </span>
              <button
                type="button"
                onClick={() => handleValidateCertificate(prj.id)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Issue Validation Certificate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Manage Modal */}
      <ProjectManageModal
        project={selectedProject}
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedProject(null);
        }}
        onUpdateMilestoneStatus={() => {}}
      />
    </div>
  );
};

export default DeploymentTelemetryPanel;
