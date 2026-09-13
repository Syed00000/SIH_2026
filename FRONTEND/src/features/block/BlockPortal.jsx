import React, { useState, useEffect } from 'react';
import { blockService } from '../government/services/blockService.js';
import { citizenService } from '../citizen/services/citizenService.js';
import departmentService from '../government/services/departmentService.js';
import { wardService } from '../government/services/wardService.js';
import technicianService from '../government/services/technicianService.js';
import { BlockSidebar } from './components/BlockSidebar.jsx';
import { BlockHeader } from './components/BlockHeader.jsx';
import { BlockOverviewPanel } from './components/BlockOverviewPanel.jsx';
import { BlockChallengesPanel } from './components/BlockChallengesPanel.jsx';
import { BlockDepartmentsPanel } from './components/BlockDepartmentsPanel.jsx';
import { BlockWardsPanel } from './components/BlockWardsPanel.jsx';
import { DepartmentTechniciansPanel } from '../department/components/DepartmentTechniciansPanel.jsx';
import { DepartmentCsrGrantPanel } from '../department/components/DepartmentCsrGrantPanel.jsx';
import { BlockModals } from './components/BlockModals.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';

export const BlockPortal = ({ user, onLogout }) => {
  const [activePanel, setActivePanel] = useState('overview');
  const [block, setBlock] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [wards, setWards] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [assigningProblem, setAssigningProblem] = useState(null);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [viewingDept, setViewingDept] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [isAddWardOpen, setIsAddWardOpen] = useState(false);
  const [createdWardCreds, setCreatedWardCreds] = useState(null);
  const [isAddTechOpen, setIsAddTechOpen] = useState(false);
  const [viewingTech, setViewingTech] = useState(null);
  const [editingTech, setEditingTech] = useState(null);

  const queryBlockId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('blockId') : null;

  const loadData = async () => {
    try {
      setLoading(true);
      const blocks = await blockService.getBlocks({ district: 'Ranchi' });
      const effId = queryBlockId || user?.blockId || user?.profile?.blockId;
      let currentBlock = effId ? blocks.find((b) => b.blockId?.toUpperCase() === effId.toUpperCase() || b.id === effId || b._id === effId) : null;
      if (!currentBlock && blocks.length > 0) currentBlock = blocks[0];
      setBlock(currentBlock);

      if (currentBlock) {
        const [resChls, deptsRes, wardsRes, techRes] = await Promise.all([
          citizenService.fetchChallenges({ limit: 200, district: currentBlock.district || 'Ranchi' }),
          departmentService.getDepartments({ block: currentBlock.name, district: currentBlock.district || 'Ranchi' }),
          wardService.getWards({ district: currentBlock.district || 'Ranchi', blockId: currentBlock.blockId }),
          technicianService.getTechnicians({ block: currentBlock.name, district: currentBlock.district || 'Ranchi' })
        ]);

        const allChls = resChls?.challenges || [];
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

        const rawTechs = techRes?.data?.data || techRes?.data || [];
        const scopedTechs = rawTechs.filter((t) => {
          const isStateOrDist = t.departmentId?.includes('STATE') || t.departmentId?.includes('DIST') || (t.departmentName || '').toLowerCase().includes('state') || (t.departmentName || '').toLowerCase().includes('district');
          return !isStateOrDist && (!t.block || t.block.toLowerCase().includes(bName));
        });
        setTechnicians(scopedTechs);
      }
    } catch (err) {
      console.warn('Error loading block portal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [queryBlockId]);

  const handleUpdateProblem = (upd) => setChallenges((prev) => prev.map((c) => (((c.challengeId || c.id || c._id) === (upd.challengeId || upd.id || upd._id)) ? upd : c)));
  const handleCreatedDept = (newDept) => setDepartments((p) => [newDept, ...p]);
  const handleUpdatedDept = (upd) => setDepartments((p) => p.map((d) => (((d.deptId || d.id || d._id) === (upd.deptId || upd.id || upd._id)) ? upd : d)));
  const handleDeletedDept = (deptId) => setDepartments((p) => p.filter((d) => (d.deptId || d.id || d._id) !== deptId));
  const handleWardCreated = (newWard) => { setWards((p) => [newWard, ...p]); setCreatedWardCreds(newWard); setIsAddWardOpen(false); };
  const handleDeleteWard = async (ward) => {
    const targetId = ward.wardId || ward.id || ward._id;
    if (!window.confirm(`Delete Ward ${ward.name}?`)) return;
    try {
      await wardService.deleteWard(targetId);
      setWards((p) => p.filter((w) => (w.wardId || w._id) !== targetId));
    } catch (e) { alert(e.message || 'Failed to delete ward'); }
  };
  const handleCreatedTech = (tech) => setTechnicians((prev) => [tech, ...prev]);
  const handleUpdatedTech = (up) => setTechnicians((prev) => prev.map((t) => (((t.technicianId || t.id || t._id) === (up.technicianId || up.id || up._id)) ? up : t)));
  const handleDeletedTech = (id) => setTechnicians((prev) => prev.filter((t) => (t.technicianId || t.id || t._id) !== id));

  const activeCount = challenges.filter((c) => c.status !== 'Resolved' && c.status !== 'Deployed').length;

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-xs font-semibold text-slate-500">Loading Block Administration Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-left select-none">
      <BlockSidebar activePanel={activePanel} onSelectPanel={setActivePanel} block={block} challengesCount={challenges.length} departmentsCount={departments.length} wardsCount={wards.length} techniciansCount={technicians.length} onLogout={onLogout} onBackToDistrict={() => { window.location.href = '/nodal'; }} />
      <div className="flex-1 flex flex-col justify-between min-w-0 overflow-y-auto">
        <div className="space-y-4">
          <BlockHeader block={block} totalIssues={challenges.length} activeIssues={activeCount} />
          <main className="max-w-7xl mx-auto px-4 sm:px-8 py-2 w-full">
            {activePanel === 'overview' && <BlockOverviewPanel block={block} challenges={challenges} departments={departments} onSelectProblem={setSelectedProblem} onNavigateTab={setActivePanel} />}
            {activePanel === 'challenges' && <BlockChallengesPanel challenges={challenges} panchayats={block?.panchayats || []} onSelectProblem={setSelectedProblem} onAssignToDept={setAssigningProblem} />}
            {activePanel === 'departments' && <BlockDepartmentsPanel departments={departments} block={block} onAddDept={() => setIsAddDeptOpen(true)} onViewDept={setViewingDept} onEditDept={setEditingDept} onDeletedDept={handleDeletedDept} />}
            {activePanel === 'wards' && <BlockWardsPanel wards={wards} challenges={challenges} block={block} onAddWard={() => setIsAddWardOpen(true)} onDeleteWard={handleDeleteWard} />}
            {activePanel === 'technicians' && <DepartmentTechniciansPanel technicians={technicians} department={{ ...block, deptId: block?.blockId, name: block?.name }} onAddTech={() => setIsAddTechOpen(true)} onViewTech={setViewingTech} onEditTech={setEditingTech} onDeletedTech={handleDeletedTech} />}
            {activePanel === 'csr-grant' && <DepartmentCsrGrantPanel department={{ ...block, category: 'Block / Tehsil Office', deptId: block?.blockId || block?.id, name: block?.name }} />}
          </main>
        </div>
        <GovernmentFooter />
      </div>

      <BlockModals block={block} departments={departments} selectedProblem={selectedProblem} setSelectedProblem={setSelectedProblem} handleUpdateProblem={handleUpdateProblem} assigningProblem={assigningProblem} setAssigningProblem={setAssigningProblem} isAddDeptOpen={isAddDeptOpen} setIsAddDeptOpen={setIsAddDeptOpen} handleCreatedDept={handleCreatedDept} viewingDept={viewingDept} setViewingDept={setViewingDept} editingDept={editingDept} setEditingDept={setEditingDept} handleUpdatedDept={handleUpdatedDept} isAddWardOpen={isAddWardOpen} setIsAddWardOpen={setIsAddWardOpen} handleWardCreated={handleWardCreated} createdWardCreds={createdWardCreds} setCreatedWardCreds={setCreatedWardCreds} isAddTechOpen={isAddTechOpen} setIsAddTechOpen={setIsAddTechOpen} handleCreatedTech={handleCreatedTech} viewingTech={viewingTech} setViewingTech={setViewingTech} editingTech={editingTech} setEditingTech={setEditingTech} handleUpdatedTech={handleUpdatedTech} />
    </div>
  );
};

export default BlockPortal;
