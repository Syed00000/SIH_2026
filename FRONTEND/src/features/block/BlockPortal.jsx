import React, { useState, useEffect } from 'react';
import { blockService } from '../government/services/blockService.js';
import { citizenService } from '../citizen/services/citizenService.js';
import departmentService from '../government/services/departmentService.js';
import { BlockSidebar } from './components/BlockSidebar.jsx';
import { BlockHeader } from './components/BlockHeader.jsx';
import { BlockOverviewPanel } from './components/BlockOverviewPanel.jsx';
import { BlockChallengesPanel } from './components/BlockChallengesPanel.jsx';
import { BlockDepartmentsPanel } from './components/BlockDepartmentsPanel.jsx';
import { BlockIssueDetailModal } from './components/BlockIssueDetailModal.jsx';
import { BlockAssignToDeptModal } from './components/BlockAssignToDeptModal.jsx';
import { AddBlockDepartmentModal } from './components/AddBlockDepartmentModal.jsx';
import { ViewBlockDepartmentModal } from './components/ViewBlockDepartmentModal.jsx';
import { EditBlockDepartmentModal } from './components/EditBlockDepartmentModal.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';

export const BlockPortal = ({ user, onLogout }) => {
  const [activePanel, setActivePanel] = useState('overview');
  const [block, setBlock] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [assigningProblem, setAssigningProblem] = useState(null);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [viewingDept, setViewingDept] = useState(null);
  const [editingDept, setEditingDept] = useState(null);

  const queryBlockId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('blockId') : null;

  const loadData = async () => {
    try {
      setLoading(true);
      const blocks = await blockService.getBlocks({ district: 'Ranchi' });
      let currentBlock = null;
      const effectiveId = queryBlockId || user?.blockId || user?.profile?.blockId;
      if (effectiveId) {
        currentBlock = blocks.find((b) => b.blockId?.toUpperCase() === effectiveId.toUpperCase() || b.id === effectiveId || b._id === effectiveId);
      }
      if (!currentBlock && blocks.length > 0) currentBlock = blocks[0];
      setBlock(currentBlock);

      const resChallenges = await citizenService.fetchChallenges({ limit: 200, district: 'Ranchi' });
      const allChls = resChallenges?.challenges || [];
      if (currentBlock) {
        const bName = (currentBlock.name || '').toLowerCase();
        const bId = (currentBlock.blockId || '').toUpperCase();
        const blockChls = allChls.filter((c) => {
          const aId = (c.assignedDepartment?.deptId || c.assignedDepartment?.id || '').toUpperCase();
          const aBlock = (c.assignedDepartment?.block || c.location?.block || '').toLowerCase();
          const aName = (c.assignedDepartment?.name || '').toLowerCase();
          return aId === bId || aBlock.includes(bName) || aName.includes(bName);
        });
        setChallenges(blockChls);

        const deptsRes = await departmentService.getDepartments({ block: currentBlock.name, district: currentBlock.district || 'Ranchi' });
        const deptsList = deptsRes?.data?.data || deptsRes?.data || deptsRes || [];
        setDepartments(Array.isArray(deptsList) ? deptsList : []);
      }
    } catch (err) {
      console.warn('Error loading block portal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [queryBlockId]);

  const handleUpdateProblem = (updated) => {
    const targetId = updated.challengeId || updated.id || updated._id;
    setChallenges((prev) => prev.map((c) => ((c.challengeId || c.id || c._id) === targetId ? updated : c)));
  };
  const handleCreatedDept = (newDept) => setDepartments((prev) => [newDept, ...prev]);
  const handleUpdatedDept = (updated) => {
    const id = updated.deptId || updated.id || updated._id;
    setDepartments((prev) => prev.map((d) => ((d.deptId || d.id || d._id) === id ? updated : d)));
  };
  const handleDeletedDept = (deptId) => setDepartments((prev) => prev.filter((d) => (d.deptId || d.id || d._id) !== deptId));

  const activeCount = challenges.filter((c) => c.status !== 'Resolved' && c.status !== 'Deployed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-xs font-semibold text-slate-500">
        Loading Block Administration Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-left select-none">
      {/* Sidebar */}
      <BlockSidebar
        activePanel={activePanel}
        onSelectPanel={setActivePanel}
        block={block}
        challengesCount={challenges.length}
        departmentsCount={departments.length}
        onLogout={onLogout}
        onBackToDistrict={() => { window.location.href = '/nodal'; }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0 overflow-y-auto">
        <div className="space-y-4">
          <BlockHeader
            block={block}
            totalIssues={challenges.length}
            activeIssues={activeCount}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-8 py-2 w-full">
            {activePanel === 'overview' && (
              <BlockOverviewPanel
                block={block}
                challenges={challenges}
                departments={departments}
                onSelectProblem={setSelectedProblem}
                onNavigateTab={setActivePanel}
              />
            )}
            {activePanel === 'challenges' && (
              <BlockChallengesPanel
                challenges={challenges}
                panchayats={block?.panchayats || []}
                onSelectProblem={setSelectedProblem}
                onAssignToDept={setAssigningProblem}
              />
            )}
            {activePanel === 'departments' && (
              <BlockDepartmentsPanel
                departments={departments}
                block={block}
                onAddDept={() => setIsAddDeptOpen(true)}
                onViewDept={setViewingDept}
                onEditDept={setEditingDept}
                onDeletedDept={handleDeletedDept}
              />
            )}
          </main>
        </div>

        <GovernmentFooter />
      </div>

      {/* Modals */}
      <BlockIssueDetailModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
        onUpdateProblem={handleUpdateProblem}
      />
      <BlockAssignToDeptModal
        challenge={assigningProblem}
        departments={departments}
        isOpen={Boolean(assigningProblem)}
        onClose={() => setAssigningProblem(null)}
        onAssigned={handleUpdateProblem}
      />
      <AddBlockDepartmentModal
        block={block}
        isOpen={isAddDeptOpen}
        onClose={() => setIsAddDeptOpen(false)}
        onCreated={handleCreatedDept}
      />
      <ViewBlockDepartmentModal
        department={viewingDept}
        isOpen={Boolean(viewingDept)}
        onClose={() => setViewingDept(null)}
      />
      <EditBlockDepartmentModal
        department={editingDept}
        isOpen={Boolean(editingDept)}
        onClose={() => setEditingDept(null)}
        onUpdated={handleUpdatedDept}
      />
    </div>
  );
};

export default BlockPortal;
