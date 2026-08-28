import React, { useState, useEffect } from 'react';
import {
  FolderPlus,
  ArrowLeft,
  Briefcase,
  Users,
  Calendar,
  Calculator,
  Award,
  Sparkles,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Info
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const CreateProjectPanel = ({ onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [challengeList, setChallengeList] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    domain: 'Water Resources',
    challengeId: 'CHL-1024',
    leadMentor: 'Dr. Priya Sharma',
    studentTeam: 'Aqua Sentinel Innovators',
    teamMembersCount: 5,
    deadline: '30 Nov 2026',
    problemStatement: '',
    status: 'In Progress'
  });

  const [hardwareCost, setHardwareCost] = useState(35000);
  const [fabCost, setFabCost] = useState(20000);
  const [fieldCost, setFieldCost] = useState(12000);
  const [overheadCost, setOverheadCost] = useState(8000);

  const totalBudget = Number(hardwareCost) + Number(fabCost) + Number(fieldCost) + Number(overheadCost);

  useEffect(() => {
    async function loadMeta() {
      const [facData, chlData] = await Promise.all([
        universityApiService.getFacultyList('RU001'),
        universityApiService.getAssignedChallenges('RU001')
      ]);
      const fList = Array.isArray(facData) ? facData : [];
      const cList = chlData?.challenges || (Array.isArray(chlData) ? chlData : []);
      setFacultyList(fList);
      setChallengeList(cList);
      if (fList.length > 0) {
        setFormData((prev) => ({ ...prev, leadMentor: fList[0].name }));
      }
      if (cList.length > 0) {
        setFormData((prev) => ({
          ...prev,
          challengeId: cList[0].id || cList[0].challengeId,
          domain: cList[0].domain || prev.domain
        }));
      }
    }
    loadMeta();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        projectId: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
        budget: `₹ ${totalBudget.toLocaleString('en-IN')}`,
        budgetBreakdown: [
          { category: 'Hardware & Microcontrollers', amount: `₹ ${Number(hardwareCost).toLocaleString('en-IN')}` },
          { category: 'Lab & Prototype Fabrication', amount: `₹ ${Number(fabCost).toLocaleString('en-IN')}` },
          { category: 'Field Testing & Calibration', amount: `₹ ${Number(fieldCost).toLocaleString('en-IN')}` },
          { category: 'Fellowship & Overhead', amount: `₹ ${Number(overheadCost).toLocaleString('en-IN')}` }
        ],
        progressPercentage: 15,
        milestonesTotal: 6,
        milestonesCompleted: 1,
        daysLeft: '180 days left',
        facultyMentor: {
          name: formData.leadMentor,
          department: formData.domain
        }
      };

      await universityApiService.createProject(payload);
      setSuccessMessage(`Innovation project "${formData.title}" successfully created and initiated into RU001 portfolio!`);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else if (onBack) onBack();
      }, 1200);
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-slate-900" onClick={onBack}>Projects Portfolio</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Initiate New Project</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <FolderPlus className="w-5 h-5 text-slate-900" />
            <span>Initiate & Propose Innovation Project</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Allocate faculty mentorship, student teams, milestone deadlines, and state grant budgets for approved grassroots challenges.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Portfolio</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center space-x-2.5 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Form: 8 Cols */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card 1: Project Identity & Reference */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Project Overview & Challenge Reference
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs"
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 cursor-pointer shadow-2xs font-mono"
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Water Resources">Water Resources</option>
                  <option value="Agriculture & Agronomy">Agriculture & Agronomy</option>
                  <option value="Infrastructure & Civil">Infrastructure & Civil</option>
                  <option value="Healthcare & Telemedicine">Healthcare & Telemedicine</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Environment & Waste">Environment & Waste</option>
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Mentorship & Student Team */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
              <Users className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Faculty Mentorship & Student Innovators Team
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 cursor-pointer shadow-2xs"
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-900 shadow-2xs"
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 shadow-2xs font-mono"
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
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 shadow-2xs font-mono"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Line-Item Budget Calculator */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-slate-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Line-Item Budget Breakdown & Grant Estimator
                </h2>
              </div>
              <div className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Total: ₹ {totalBudget.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                  Hardware & Microcontrollers (₹)
                </label>
                <input
                  type="number"
                  value={hardwareCost}
                  onChange={(e) => setHardwareCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-mono shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                  Lab & Prototype Fabrication (₹)
                </label>
                <input
                  type="number"
                  value={fabCost}
                  onChange={(e) => setFabCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-mono shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                  Field Testing & Calibration (₹)
                </label>
                <input
                  type="number"
                  value={fieldCost}
                  onChange={(e) => setFieldCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-mono shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                  Institutional Overhead & Fellowship (₹)
                </label>
                <input
                  type="number"
                  value={overheadCost}
                  onChange={(e) => setOverheadCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-mono shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2 shadow-xs disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FolderPlus className="w-3.5 h-3.5" />}
              <span>{loading ? 'Initiating...' : 'Initiate Innovation Project'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Preview & Grant Rules (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                Live Project Preview
              </span>
              <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Ready</span>
              </span>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {formData.title ? formData.title.charAt(0).toUpperCase() : 'P'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-xs truncate leading-tight">
                    {formData.title || 'Project Title'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Ref: {formData.challengeId}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px]">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Domain:</span>
                  <span className="font-semibold text-slate-800">{formData.domain}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Lead Mentor:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[160px]">{formData.leadMentor}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Team:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[160px]">{formData.studentTeam} ({formData.teamMembersCount})</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Budget:</span>
                  <span className="font-mono font-bold text-emerald-700">₹ {totalBudget.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Deadline:</span>
                  <span className="font-semibold text-slate-800">{formData.deadline}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>Project Guidelines</span>
            </div>

            <ul className="text-[11px] text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start space-x-1.5">
                <span className="text-slate-400 mt-0.5">&bull;</span>
                <span>Initiated projects automatically submit quarterly milestone proof to the State Dashboard.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-slate-400 mt-0.5">&bull;</span>
                <span>Seed funding grants are disbursed in 3 phases based on verified field progress.</span>
              </li>
            </ul>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center space-x-2 text-[10.5px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Synced live to MongoDB Atlas database.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPanel;
