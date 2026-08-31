import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  CheckCircle2,
  GraduationCap,
  Save,
  Loader2,
  Crown,
  Building2,
  BookOpen,
  Sparkles,
  Edit3
} from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';

const PRESET_TEAM_NAMES = [
  '⚡ Team Urja Innovators',
  '💧 Smart Aqua Research Lab',
  '🌱 EcoTech GreenWorks',
  '📡 Telemetry & IoT Lab',
  '🛠️ Ranchi MechTech Vanguard',
  '🔬 Jharkhand BioInnovators'
];

export const FacultyTeamsPanel = ({
  projects = [],
  faculty,
  onRefresh,
  initialProjectId = null,
  hideHeader = false
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || projects[0]?.projectId || projects[0]?.challengeId || ''
  );

  const currentProject =
    projects.find((p) => p.projectId === selectedProjectId || p.challengeId === selectedProjectId) ||
    projects[0] ||
    null;

  const [teamName, setTeamName] = useState(
    currentProject?.studentTeam || currentProject?.teamName || 'Smart Aqua Innovators'
  );

  const [teamMembers, setTeamMembers] = useState(
    currentProject?.teamMembers?.length ? currentProject.teamMembers : []
  );

  const [newMember, setNewMember] = useState({
    name: '',
    rollNo: '',
    department: 'Computer Science & Engineering',
    role: 'Student Team Leader',
    email: '',
    year: '3rd Year B.Tech',
    isLead: false
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when project selection changes
  useEffect(() => {
    if (currentProject) {
      setTeamName(currentProject.studentTeam || currentProject.teamName || 'Smart Aqua Innovators');
      setTeamMembers(Array.isArray(currentProject.teamMembers) ? currentProject.teamMembers : []);
    }
  }, [currentProject?.projectId]);

  const handleProjectSelect = (id) => {
    setSelectedProjectId(id);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    setTeamMembers([
      ...teamMembers,
      {
        id: `STU-${Date.now().toString().slice(-4)}`,
        name: newMember.name.trim(),
        rollNo: newMember.rollNo.trim() || `RU23BTECH${Math.floor(100 + Math.random() * 900)}`,
        department: newMember.department,
        role: newMember.role,
        email: newMember.email.trim() || `${newMember.name.toLowerCase().replace(/\s+/g, '.')}@student.ru.ac.in`,
        year: newMember.year,
        isLead: newMember.isLead || teamMembers.length === 0
      }
    ]);

    setNewMember({
      name: '',
      rollNo: '',
      department: 'Computer Science & Engineering',
      role: 'Hardware & Sensor Engineer',
      email: '',
      year: '3rd Year B.Tech',
      isLead: false
    });
  };

  const handleToggleLead = (idx) => {
    setTeamMembers(
      teamMembers.map((m, i) => ({
        ...m,
        isLead: i === idx
      }))
    );
  };

  const handleRemoveMember = (idx) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== idx));
  };

  const handleSaveTeam = async () => {
    if (!currentProject) return;
    setSaving(true);
    try {
      const leadMember = teamMembers.find((m) => m.isLead) || teamMembers[0];
      const finalTeamName = teamName.trim() || `${faculty?.name?.split(' ')[0] || 'Research'} Innovation Team`;

      await universityApiService.updateProject(currentProject.projectId || currentProject._id, {
        ...currentProject,
        teamMembers,
        teamMembersCount: teamMembers.length,
        studentLead: leadMember?.name || 'Unassigned',
        studentTeam: finalTeamName,
        teamName: finalTeamName
      });
      setSavedSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save team:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`space-y-4 max-w-7xl mx-auto select-none ${hideHeader ? '' : 'pb-12'}`}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
              <span>Faculty Research Node</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Student Research Team Management</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#007A61]" />
              <span>Form & Name Student Research Teams</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Assign custom team names, recruit student researchers from Ranchi University departments, and designate Team Leads.
            </p>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-slate-400 space-y-2">
          <Users className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No Assigned Projects Available</h3>
          <p className="text-xs max-w-md mx-auto">
            Once a problem is assigned to you by the University, you can form your student team here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left 2 Cols: Team Name, Roster & Add Form */}
          <div className={hideHeader ? "space-y-4" : "lg:col-span-2 space-y-4"}>
            {/* Project Selector */}
            {!hideHeader && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600">
                  Active Project Selection *
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleProjectSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs cursor-pointer"
                >
                  {projects.map((p, i) => (
                    <option key={p.projectId || i} value={p.projectId || p.challengeId}>
                      {p.projectId} — {p.title} ({p.domain})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Team Name Configuration Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200">
                    <Edit3 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">Student Team Name / Innovation Lab Title</h3>
                    <span className="text-[10px] text-slate-500">Official team identity for University & Government records</span>
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Smart Aqua Innovators, Team Urja 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
                />
              </div>

              {/* Preset Team Name Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quick Preset Ideas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TEAM_NAMES.map((name, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTeamName(name)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Team Roster */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">
                    Student Researcher Roster ({teamMembers.length} Members)
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Team: <strong>{teamName || 'Research Team'}</strong> • Lead: {faculty?.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveTeam}
                  disabled={saving}
                  className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? 'Team Saved to University!' : 'Save Team Roster'}</span>
                </button>
              </div>

              {teamMembers.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-1">
                  <GraduationCap className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">No student researchers added yet.</p>
                  <p className="text-[11px]">Use the form below to recruit student innovators into this R&D team.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {teamMembers.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between shadow-2xs transition-all ${
                        m.isLead
                          ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300/60'
                          : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border ${
                            m.isLead
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}
                        >
                          {m.isLead ? <Crown className="w-4 h-4 text-amber-700" /> : m.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-slate-900 text-xs truncate">{m.name}</span>
                            {m.isLead && (
                              <span className="text-[9.5px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                                Team Lead
                              </span>
                            )}
                            <span className="text-[9.5px] font-mono bg-white border border-slate-200 px-1 rounded text-slate-500">
                              {m.rollNo}
                            </span>
                          </div>
                          <div className="text-[10.5px] text-slate-500 truncate">
                            {m.role} • {m.department} ({m.year})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleLead(idx)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            m.isLead
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-800'
                          }`}
                        >
                          {m.isLead ? 'Lead' : 'Set Lead'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Student Member Form */}
            <form onSubmit={handleAddMember} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <UserPlus className="w-3.5 h-3.5 text-[#007A61]" />
                <span>Recruit New Student Innovator</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="e.g. Ankit Sharma"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Roll Number / Registration ID</label>
                  <input
                    type="text"
                    value={newMember.rollNo}
                    onChange={(e) => setNewMember({ ...newMember, rollNo: e.target.value })}
                    placeholder="e.g. 21BTECH042"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Academic Department</label>
                  <select
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Water Resources & Hydrology">Water Resources & Hydrology</option>
                    <option value="Civil & Environmental Engineering">Civil & Environmental Engineering</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Applied Chemistry & Materials">Applied Chemistry & Materials</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Technical Project Role</label>
                  <input
                    type="text"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    placeholder="e.g. IoT Firmware Lead"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="isLeadCheck"
                    checked={newMember.isLead}
                    onChange={(e) => setNewMember({ ...newMember, isLead: e.target.checked })}
                    className="rounded text-[#007A61] focus:ring-[#007A61] cursor-pointer"
                  />
                  <label htmlFor="isLeadCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Designate this student as <strong>Student Team Leader</strong>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add to Team Roster</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right 1 Col: Guidelines & Fellowship Info */}
          {!hideHeader && (
            <div className="space-y-3.5">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Team Guidelines
              </h3>
              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  • Set a distinctive <strong>Team Name</strong> representing your innovation lab or project focus.
                </p>
                <p>
                  • Teams typically consist of <strong>3 to 5 student researchers</strong> under 1 Lead Faculty Mentor.
                </p>
                <p>
                  • Designate 1 <strong>Student Team Leader</strong> who coordinates lab fabrication and field telemetry.
                </p>
                <p>
                  • Interdisciplinary teams receive priority consideration during Government grant sanction.
                </p>
              </div>
            </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyTeamsPanel;
