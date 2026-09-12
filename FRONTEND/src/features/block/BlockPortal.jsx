import React, { useState, useEffect } from 'react';
import { blockService } from '../government/services/blockService.js';
import { citizenService } from '../citizen/services/citizenService.js';
import departmentService from '../government/services/departmentService.js';
import { wardService } from '../government/services/wardService.js';
import { BlockSidebar } from './components/BlockSidebar.jsx';
import { BlockHeader } from './components/BlockHeader.jsx';
import { BlockOverviewPanel } from './components/BlockOverviewPanel.jsx';
import { BlockChallengesPanel } from './components/BlockChallengesPanel.jsx';
import { BlockDepartmentsPanel } from './components/BlockDepartmentsPanel.jsx';
import { BlockWardsPanel } from './components/BlockWardsPanel.jsx';
import { BlockIssueDetailModal } from './components/BlockIssueDetailModal.jsx';
import { BlockAssignToDeptModal } from './components/BlockAssignToDeptModal.jsx';
import { AddBlockDepartmentModal } from './components/AddBlockDepartmentModal.jsx';
import { ViewBlockDepartmentModal } from './components/ViewBlockDepartmentModal.jsx';
import { EditBlockDepartmentModal } from './components/EditBlockDepartmentModal.jsx';
import { BlockAddWardModal } from './components/BlockAddWardModal.jsx';
import { WardCredentialsSuccessModal } from './components/WardCredentialsSuccessModal.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';

export const BlockPortal = ({ user, onLogout }) => {
  const [activePanel, setActivePanel] = useState('overview');
  const [block, setBlock] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [assigningProblem, setAssigningProblem] = useState(null);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [viewingDept, setViewingDept] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [isAddWardOpen, setIsAddWardOpen] = useState(false);
  const [createdWardCreds, setCreatedWardCreds] = useState(null);

  const queryBlockId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('blockId') : null;

  const loadData = async () => {
    try {
      setLoading(true);
      const blocks = await blockService.getBlocks({ district: 'Ranchi' });
      const effId = queryBlockId || user?.blockId || user?.profile?.blockId;
      let currentBlock = effId ? blocks.find((b) => b.blockId?.toUpperCase() === effId.toUpperCase() || b.id === effId || b._id === effId) : null;
      if (!currentBlock && blocks.length > 0) currentBlock = blocks[0];
      setBlock(currentBlock);

      const [resChls, deptsRes, wardsRes] = await Promise.all([
        citizenService.fetchChallenges({ limit: 200, district: currentBlock?.district || 'Ranchi' }),
        currentBlock ? departmentService.getDepartments({ block: currentBlock.name, district: currentBlock.district || 'Ranchi' }) : null,
        currentBlock ? wardService.getWards({ district: currentBlock.district || 'Ranchi', blockId: currentBlock.blockId }) : []
      ]);

      const allChls = resChls?.challenges || [];
      if (currentBlock) {
        const bName = (currentBlock.name || '').toLowerCase();
        const bId = (currentBlock.blockId || '').toUpperCase();
        setChallenges(allChls.filter((c) => {
          const aId = (c.assignedDepartment?.deptId || c.assignedDepartment?.id || '').toUpperCase();
          const aBlock = (c.assignedDepartment?.block || c.location?.block || '').toLowerCase();
          const aName = (c.assignedDepartment?.name || '').toLowerCase();
          
          const assignedBlockName = (c.assignedBlock?.name || '').toLowerCase();
          const locationBlock = (c.location?.block || '').toLowerCase();
          
          return aId === bId || aBlock.includes(bName) || aName.includes(bName) || assignedBlockName.includes(bName) || locationBlock.includes(bName);
        }));
        const deptsList = deptsRes?.data?.data || deptsRes?.data || deptsRes || [];
        setDepartments(Array.isArray(deptsList) ? deptsList : []);
        setWards(wardsRes || []);
      }
    } catch (err) {
      console.warn('Error loading block portal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [queryBlockId]);

  const handleUpdateProblem = (upd) => {
    const tId = upd.challengeId || upd.id || upd._id;
    setChallenges((prev) => prev.map((c) => ((c.challengeId || c.id || c._id) === tId ? upd : c)));
  };
  const handleCreatedDept = (newDept) => setDepartments((p) => [newDept, ...p]);
  const handleUpdatedDept = (upd) => {
    const id = upd.deptId || upd.id || upd._id;
    setDepartments((p) => p.map((d) => ((d.deptId || d.id || d._id) === id ? upd : d)));
  };
  const handleDeletedDept = (deptId) => setDepartments((p) => p.filter((d) => (d.deptId || d.id || d._id) !== deptId));
  const handleWardCreated = (newWard) => {
    setWards((p) => [newWard, ...p]);
    setCreatedWardCreds(newWard);
    setIsAddWardOpen(false);
  };
  const handleDeleteWard = async (ward) => {
    const targetId = ward.wardId || ward.id || ward._id;
    if (!window.confirm(`Delete Ward ${ward.name}?`)) return;
    try {
      await wardService.deleteWard(targetId);
      setWards((p) => p.filter((w) => (w.wardId || w._id) !== targetId));
    } catch (e) {
      alert(e.message || 'Failed to delete ward');
    }
  };

  const activeCount = challenges.filter((c) => c.status !== 'Resolved' && c.status !== 'Deployed').length;

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-xs font-semibold text-slate-500">Loading Block Administration Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-left select-none">
      <BlockSidebar
        activePanel={activePanel}
        onSelectPanel={setActivePanel}
        block={block}
        challengesCount={challenges.length}
        departmentsCount={departments.length}
        wardsCount={wards.length}
        onLogout={onLogout}
        onBackToDistrict={() => { window.location.href = '/nodal'; }}
      />
      <div className="flex-1 flex flex-col justify-between min-w-0 overflow-y-auto">
        <div className="space-y-4">
          <BlockHeader block={block} totalIssues={challenges.length} activeIssues={activeCount} />
          <main className="max-w-7xl mx-auto px-4 sm:px-8 py-2 w-full">
            {activePanel === 'overview' && (
              <BlockOverviewPanel block={block} challenges={challenges} departments={departments} onSelectProblem={setSelectedProblem} onNavigateTab={setActivePanel} />
            )}
            {activePanel === 'challenges' && (
              <BlockChallengesPanel challenges={challenges} panchayats={block?.panchayats || []} onSelectProblem={setSelectedProblem} onAssignToDept={setAssigningProblem} />
            )}
            {activePanel === 'departments' && (
              <BlockDepartmentsPanel departments={departments} block={block} onAddDept={() => setIsAddDeptOpen(true)} onViewDept={setViewingDept} onEditDept={setEditingDept} onDeletedDept={handleDeletedDept} />
            )}
            {activePanel === 'wards' && (
              <BlockWardsPanel wards={wards} challenges={challenges} block={block} onAddWard={() => setIsAddWardOpen(true)} onDeleteWard={handleDeleteWard} />
            )}
          </main>
        </div>
        <GovernmentFooter />
      </div>

      <BlockIssueDetailModal problem={selectedProblem} onClose={() => setSelectedProblem(null)} onUpdateProblem={handleUpdateProblem} />
      <BlockAssignToDeptModal challenge={assigningProblem} departments={departments} isOpen={Boolean(assigningProblem)} onClose={() => setAssigningProblem(null)} onAssigned={handleUpdateProblem} />
      <AddBlockDepartmentModal block={block} isOpen={isAddDeptOpen} onClose={() => setIsAddDeptOpen(false)} onCreated={handleCreatedDept} />
      <ViewBlockDepartmentModal department={viewingDept} isOpen={Boolean(viewingDept)} onClose={() => setViewingDept(null)} />
      <EditBlockDepartmentModal department={editingDept} isOpen={Boolean(editingDept)} onClose={() => setEditingDept(null)} onUpdated={handleUpdatedDept} />
      <BlockAddWardModal isOpen={isAddWardOpen} onClose={() => setIsAddWardOpen(false)} onCreated={handleWardCreated} block={block} />
      <WardCredentialsSuccessModal isOpen={Boolean(createdWardCreds)} onClose={() => setCreatedWardCreds(null)} wardData={createdWardCreds} />
    </div>
  );
};

export default BlockPortal;
