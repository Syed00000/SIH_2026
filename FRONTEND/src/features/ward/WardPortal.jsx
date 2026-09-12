import React, { useState, useEffect } from 'react';
import { wardService } from '../government/services/wardService.js';
import { citizenService } from '../citizen/services/citizenService.js';
import technicianService from '../government/services/technicianService.js';
import { WardHeader } from './components/WardHeader.jsx';
import { WardSidebar } from './components/WardSidebar.jsx';
import { WardOverviewPanel } from './components/WardOverviewPanel.jsx';
import { WardProblemsPanel } from './components/WardProblemsPanel.jsx';
import { WardProblemDetailModal } from './components/WardProblemDetailModal.jsx';
import { DepartmentTechniciansPanel } from '../department/components/DepartmentTechniciansPanel.jsx';
import { DepartmentCsrGrantPanel } from '../department/components/DepartmentCsrGrantPanel.jsx';
import { AddTechnicianModal } from '../department/components/AddTechnicianModal.jsx';
import { ViewTechnicianModal } from '../department/components/ViewTechnicianModal.jsx';
import { EditTechnicianModal } from '../department/components/EditTechnicianModal.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';

export const WardPortal = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [ward, setWard] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Field Worker Modals
  const [isAddTechOpen, setIsAddTechOpen] = useState(false);
  const [viewingTech, setViewingTech] = useState(null);
  const [editingTech, setEditingTech] = useState(null);

  const getTargetWardId = () => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('wardId');
      if (q) return q;
    }
    return user?.wardId || user?.profile?.wardId || '';
  };

  const loadWardData = async () => {
    try {
      setLoading(true);
      const targetId = getTargetWardId();
      let currentWard = targetId ? await wardService.getWardById(targetId) : null;
      if (!currentWard) {
        const allWards = await wardService.getWards();
        currentWard = allWards && allWards.length > 0 ? allWards[0] : null;
      }
      setWard(currentWard);

      const targetWardCode = currentWard?.wardId || targetId;
      const resChallenges = await citizenService.fetchChallenges({ limit: 150 });
      const allChls = resChallenges?.challenges || (Array.isArray(resChallenges) ? resChallenges : []) || [];
      const wardChls = targetWardCode ? allChls.filter((c) => c.assignedWard?.wardId?.toUpperCase() === targetWardCode.toUpperCase() || c.assignedWard?.id === targetWardCode || c.assignedWard?.id === currentWard?._id) : allChls;
      setChallenges(wardChls);

      const techRes = await technicianService.getTechnicians({ departmentName: currentWard?.name, block: currentWard?.block, district: currentWard?.district });
      setTechnicians(techRes?.data?.data || techRes?.data || []);
    } catch (err) {
      console.warn('Error loading WardPortal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWardData(); }, []);

  const handleCreatedTech = (tech) => setTechnicians((prev) => [tech, ...prev]);
  const handleUpdatedTech = (up) => setTechnicians((prev) => prev.map((t) => ((t.technicianId || t.id || t._id) === (up.technicianId || up.id || up._id) ? up : t)));
  const handleDeletedTech = (id) => setTechnicians((prev) => prev.filter((t) => (t.technicianId || t.id || t._id) !== id));

  const renderContent = () => {
    switch (activeTab) {
      case 'problems':
        return <WardProblemsPanel challenges={challenges} loading={loading} onSelectChallenge={setSelectedChallenge} />;
      case 'field-workers':
        return <DepartmentTechniciansPanel technicians={technicians} department={ward} onAddTech={() => setIsAddTechOpen(true)} onViewTech={setViewingTech} onEditTech={setEditingTech} onDeletedTech={handleDeletedTech} />;
      case 'csr-grant':
        return <DepartmentCsrGrantPanel department={ward} />;
      case 'overview':
      default:
        return <WardOverviewPanel ward={ward} challenges={challenges} onNavigateTab={setActiveTab} onSelectChallenge={setSelectedChallenge} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden h-screen text-slate-800 antialiased select-none">
      <WardHeader ward={ward} onLogout={onLogout} />

      <div className="flex-1 flex flex-row min-w-0 min-h-0 overflow-hidden bg-slate-50">
        <WardSidebar activeTab={activeTab} setActiveTab={setActiveTab} assignedCount={challenges.length} isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50">
          <main className="flex-1 p-3 sm:p-4 overflow-y-auto min-h-0 custom-scrollbar">
            <div className="max-w-6xl mx-auto w-full">{renderContent()}</div>
          </main>
          <GovernmentFooter />
        </div>
      </div>

      <WardProblemDetailModal isOpen={Boolean(selectedChallenge)} challenge={selectedChallenge} onClose={() => setSelectedChallenge(null)} onUpdated={(up) => setChallenges((prev) => prev.map((c) => ((c.challengeId || c._id) === (up.challengeId || up._id) ? up : c)))} />
      <AddTechnicianModal department={ward} isOpen={isAddTechOpen} onClose={() => setIsAddTechOpen(false)} onCreated={handleCreatedTech} />
      <ViewTechnicianModal technician={viewingTech} isOpen={Boolean(viewingTech)} onClose={() => setViewingTech(null)} />
      <EditTechnicianModal technician={editingTech} isOpen={Boolean(editingTech)} onClose={() => setEditingTech(null)} onUpdated={handleUpdatedTech} />
    </div>
  );
};

export default WardPortal;
