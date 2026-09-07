import React from 'react';
import { Briefcase, Users, Calendar } from 'lucide-react';
import { ProjectBudgetCalculator } from './ProjectBudgetCalculator.jsx';

export const ProjectFormFields = ({
  formData,
  setFormData,
  facultyList,
  challengeList,
  hardwareCost,
  setHardwareCost,
  fabCost,
  setFabCost,
  fieldCost,
  setFieldCost,
  overheadCost,
  setOverheadCost,
  totalBudget
}) => {
  return (
    <div className="space-y-4">
      {/* Card 1: Project Identity & Reference */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4.5 space-y-4">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
          <Briefcase className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Project Overview &amp; Challenge Reference
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Smart Aqua IoT Water Quality Network for Rural Reservoirs"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#007A61] shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Referenced Challenge ID *
            </label>
            <select
              value={formData.challengeId}
              onChange={(e) => {
                const cid = e.target.value;
                const match = challengeList.find((c) => (c.id || c.challengeId) === cid);
                setFormData({
                  ...formData,
                  challengeId: cid,
                  domain: match?.domain || formData.domain
                });
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A61] cursor-pointer shadow-2xs font-mono"
            >
              {challengeList.length > 0 ? (
                challengeList.map((c, i) => (
                  <option key={i} value={c.id || c.challengeId}>
                    {c.id || c.challengeId} - {c.title?.slice(0, 45)}...
                  </option>
                ))
              ) : (
                <option value="CHL-1024">CHL-1024 - Water Quality Monitoring</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Thematic Domain *
            </label>
            <select
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A61] cursor-pointer shadow-2xs"
            >
              <option value="Water Resources">Water Resources</option>
              <option value="Agriculture &amp; Agronomy">Agriculture &amp; Agronomy</option>
              <option value="Infrastructure &amp; Civil">Infrastructure &amp; Civil</option>
              <option value="Healthcare &amp; Telemedicine">Healthcare &amp; Telemedicine</option>
              <option value="Renewable Energy">Renewable Energy</option>
              <option value="Environment &amp; Waste">Environment &amp; Waste</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Problem Solution Abstract
            </label>
            <textarea
              rows={3}
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              placeholder="Describe the engineering approach, IoT/AI hardware stack, and community implementation plan..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#007A61] shadow-2xs leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Card 2: Mentorship & Student Team */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4.5 space-y-4">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
          <Users className="w-4 h-4 text-slate-700" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Faculty Mentorship &amp; Student Innovators Team
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Lead Faculty Mentor *
            </label>
            <select
              value={formData.leadMentor}
              onChange={(e) => setFormData({ ...formData, leadMentor: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A61] cursor-pointer shadow-2xs"
            >
              {facultyList.length > 0 ? (
                facultyList.map((f, i) => (
                  <option key={i} value={f.name}>
                    {f.name} - {f.department?.slice(0, 30)}
                  </option>
                ))
              ) : (
                <option value="Dr. Priya Sharma">Dr. Priya Sharma - Water Resources</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Student Team Name *
            </label>
            <input
              type="text"
              required
              value={formData.studentTeam}
              onChange={(e) => setFormData({ ...formData, studentTeam: e.target.value })}
              placeholder="e.g. Aqua Sentinel Innovators"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#007A61] shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Team Members Count
            </label>
            <input
              type="number"
              min={2}
              max={8}
              value={formData.teamMembersCount}
              onChange={(e) => setFormData({ ...formData, teamMembersCount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A61] shadow-2xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Completion Deadline *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                placeholder="e.g. 30 Nov 2026"
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A61] shadow-2xs font-mono"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Line-Item Budget Calculator */}
      <ProjectBudgetCalculator
        hardwareCost={hardwareCost}
        setHardwareCost={setHardwareCost}
        fabCost={fabCost}
        setFabCost={setFabCost}
        fieldCost={fieldCost}
        setFieldCost={setFieldCost}
        overheadCost={overheadCost}
        setOverheadCost={setOverheadCost}
        totalBudget={totalBudget}
      />
    </div>
  );
};

export default ProjectFormFields;
