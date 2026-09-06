import React, { useState } from 'react';
import { Briefcase, Building2, Search, ArrowRight, Eye, Rocket, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { IndustryProjectDetailPanel } from './IndustryProjectDetailPanel.jsx';

export const IndustryActiveProjectsView = ({ projects = {}, onNavigateToFunding }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing' | 'completed'

  const ongoingList = (projects?.ongoing || []).filter(
    (p) => !p.labChargesQuoted || p.quoteStatus === 'Accepted'
  );
  const completedList = (projects?.completed || []).filter(
    (p) => !p.labChargesQuoted || p.quoteStatus === 'Accepted'
  );
  const currentList = activeTab === 'ongoing' ? ongoingList : completedList;

  const filteredProjects = currentList.filter((proj) => {
    const term = searchTerm.toLowerCase();
    return (
      (proj.title || '').toLowerCase().includes(term) ||
      (proj.university || '').toLowerCase().includes(term) ||
      (proj.leadMentor || '').toLowerCase().includes(term)
    );
  });

  const uniqueUniversities = new Set(ongoingList.map((p) => p.university)).size;

  if (selectedProject) {
    return (
      <IndustryProjectDetailPanel
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onNavigateToFunding={() => {
          setSelectedProject(null);
          if (onNavigateToFunding) onNavigateToFunding();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#007A61]">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Active Projects</p>
            <p className="text-lg font-black text-slate-900">{ongoingList.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Universities Engaged</p>
            <p className="text-lg font-black text-slate-900">{uniqueUniversities}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Approved Requests</p>
            <p className="text-lg font-black text-slate-900">{ongoingList.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Financial Support</p>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Corporate Grant Pools</p>
          </div>
          <button
            onClick={onNavigateToFunding}
            className="px-3 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white text-[11px] font-bold rounded-xl flex items-center space-x-1 shadow-2xs cursor-pointer transition-colors"
          >
            <span>Funding Hub</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-slate-200/90 shadow-2xs">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center text-slate-800">
            <Briefcase className="w-4 h-4 mr-2 text-[#007A61]" /> Active University Research Projects
          </CardTitle>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search projects, universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#007A61]"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex space-x-4 border-b border-slate-200 px-4 pt-3">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`text-[11px] font-bold pb-2 cursor-pointer transition-colors ${
                activeTab === 'ongoing' ? 'text-[#007A61] border-b-2 border-[#007A61]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Ongoing Projects ({ongoingList.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`text-[11px] font-bold pb-2 cursor-pointer transition-colors ${
                activeTab === 'completed' ? 'text-[#007A61] border-b-2 border-[#007A61]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Completed ({completedList.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100 uppercase tracking-wider text-[9px]">
                <tr>
                  <th className="px-4 py-2.5">#</th>
                  <th className="px-4 py-2.5">Project Title</th>
                  <th className="px-4 py-2.5">University</th>
                  <th className="px-4 py-2.5">Stage</th>
                  <th className="px-4 py-2.5">Budget / Disbursed</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((proj, i) => (
                    <tr key={proj.id || i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 line-clamp-1">{proj.title}</div>
                        {proj.leadMentor && (
                          <div className="text-[10px] text-slate-500 mt-0.5">Mentor: {proj.leadMentor}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{proj.university}</td>
                      <td className="px-4 py-3">
                        {(proj.status === 'Deployed' || proj.isDeployed || proj.isLocked) ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-300">
                            🔒 Deployed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {proj.stage || 'In Progress'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 text-xs">{proj.labChargesQuoted || proj.budget || 'In Progress'}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Disbursed: {proj.disbursed || '₹ 0'}</div>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedProject(proj)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold inline-flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={onNavigateToFunding}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold inline-flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Rocket className="w-3.5 h-3.5" />
                          <span>Fund / Support</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400 text-xs">
                      No active projects found. Approve collaboration requests to start research initiatives.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryActiveProjectsView;
