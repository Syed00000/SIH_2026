import React, { useState, useEffect } from 'react';
import { Layers, Home, Wrench, HandCoins } from 'lucide-react';
import { departmentService } from '../../../government/services/departmentService.js';
import { wardService } from '../../../government/services/wardService.js';
import { citizenService } from '../../../citizen/services/citizenService.js';
import technicianService from '../../../government/services/technicianService.js';
import { filterDepartmentChallenges } from '../../../department/components/departmentChallengeFilter.helper.js';

import { DepartmentOverview } from '../../../department/components/DepartmentOverview.jsx';
import { DepartmentProblemsPanel } from '../../../department/components/DepartmentProblemsPanel.jsx';
import { DepartmentProblemActionPanel } from '../../../department/components/DepartmentProblemActionPanel.jsx';
import { DepartmentTechniciansPanel } from '../../../department/components/DepartmentTechniciansPanel.jsx';
import { DepartmentCsrGrantPanel } from '../../../department/components/DepartmentCsrGrantPanel.jsx';
import { WardCommissionerHeader } from './WardCommissionerHeader.jsx';
import { WardCommissionerModals } from './WardCommissionerModals.jsx';

export const WardCommissionerDashboard = ({ onOpenDirectory }) => {
  const [activeTab, setActiveTab] = useState('problems');
  const [wardDept, setWardDept] = useState(null);
  const [problems, setProblems] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const [isAddTechOpen, setIsAddTechOpen] = useState(false);
  const [viewingTech, setViewingTech] = useState(null);
  const [editingTech, setEditingTech] = useState(null);
  const [assigningProblemTech, setAssigningProblemTech] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resDepts, resChallenges, resWards] = await Promise.all([
        departmentService.getDepartments({ limit: 100 }),
        citizenService.fetchChallenges({ limit: 200 }),
        wardService.getWards()
      ]);
      const depts = resDepts?.data || (Array.isArray(resDepts) ? resDepts : []) || [];
      const wList = Array.isArray(resWards) ? resWards : (resWards?.data || []);

      let matched = depts.find((d) => d.deptId === 'DEPT-JH-6542' || d.category === 'Ward Commissioner') || null;
      if (!matched && wList.length > 0) {
        matched = {
          ...wList[0],
          deptId: wList[0].wardId || 'DEPT-JH-6542',
          category: 'Ward Commissioner',
          headName: wList[0].councillorName || 'mukesh',
          headRole: 'Department Officer'
        };
      }
      setWardDept(matched);

      const allChls = resChallenges?.challenges || (Array.isArray(resChallenges) ? resChallenges : []) || [];
      const wardChls = filterDepartmentChallenges(allChls, matched);
      setProblems(wardChls);

      if (matched) {
        const techRes = await technicianService.getTechnicians({
          departmentId: matched.deptId || matched.id,
          departmentName: matched.name,
          district: matched.district
        });
        setTechnicians(techRes?.data?.data || techRes?.data || []);
      }
    } catch (err) {
      console.warn('Error loading WardCommissionerDashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateProblem = (updated) => {
    const targetId = updated.challengeId || updated.id || updated._id;
    setProblems((prev) => prev.map((p) => ((p.challengeId || p.id || p._id) === targetId ? updated : p)));
    setSelectedProblem(updated);
  };

  const TABS = [
    { id: 'problems', label: 'Assigned Civic Problems', icon: Layers, count: problems.length },
    { id: 'overview', label: 'Department Overview', icon: Home },
    { id: 'technicians', label: 'Technicians', icon: Wrench, count: technicians.length },
    { id: 'csr-grant', label: 'CSR Grant', icon: HandCoins }
  ];

  const renderPanel = () => {
    if (selectedProblem) {
      return (
        <DepartmentProblemActionPanel
          problem={selectedProblem}
          department={wardDept}
          onClose={() => setSelectedProblem(null)}
          onUpdateProblem={handleUpdateProblem}
          onAssignTechnician={setAssigningProblemTech}
        />
      );
    }
    switch (activeTab) {
      case 'overview':
        return <DepartmentOverview department={wardDept} problems={problems} onSelectProblem={(p) => setSelectedProblem(p)} onNavigateProblems={() => setActiveTab('problems')} />;
      case 'technicians':
        return (
          <DepartmentTechniciansPanel
            technicians={technicians}
            department={wardDept}
            onAddTech={() => setIsAddTechOpen(true)}
            onViewTech={setViewingTech}
            onEditTech={setEditingTech}
            onDeletedTech={(id) => setTechnicians((prev) => prev.filter((t) => (t.technicianId || t.id || t._id) !== id))}
          />
        );
      case 'csr-grant':
        return <DepartmentCsrGrantPanel department={wardDept} problems={problems} onAddTechnician={() => setIsAddTechOpen(true)} />;
      case 'problems':
      default:
        return <DepartmentProblemsPanel problems={problems} onSelectProblem={(p) => setSelectedProblem(p)} onAssignToTech={setAssigningProblemTech} />;
    }
  };

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      <WardCommissionerHeader
        wardDept={wardDept}
        loading={loading}
        onReload={loadData}
        onOpenDirectory={onOpenDirectory}
      />

      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto custom-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = !selectedProblem && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setSelectedProblem(null); setActiveTab(tab.id); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#007A61] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-emerald-50/60 hover:text-[#007A61] border border-slate-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div>{loading ? <div className="py-16 text-center text-slate-400 font-bold text-xs">Loading Ward Commissioner Dashboard...</div> : renderPanel()}</div>

      <WardCommissionerModals
        wardDept={wardDept}
        isAddTechOpen={isAddTechOpen}
        setIsAddTechOpen={setIsAddTechOpen}
        onCreatedTech={(t) => setTechnicians((prev) => [t, ...prev])}
        viewingTech={viewingTech}
        setViewingTech={setViewingTech}
        editingTech={editingTech}
        setEditingTech={setEditingTech}
        onUpdatedTech={(u) => setTechnicians((prev) => prev.map((t) => ((t.technicianId || t.id || t._id) === (u.technicianId || u.id || u._id) ? u : t)))}
        assigningProblemTech={assigningProblemTech}
        setAssigningProblemTech={setAssigningProblemTech}
        technicians={technicians}
        onAssignedProblem={handleUpdateProblem}
      />
    </div>
  );
};

export default WardCommissionerDashboard;
