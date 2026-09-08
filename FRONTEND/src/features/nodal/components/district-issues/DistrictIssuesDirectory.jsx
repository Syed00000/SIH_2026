import React, { useState, useEffect } from 'react';
import { Building2, Plus, RefreshCw, Layers, MapPin } from 'lucide-react';
import { blockService } from '../../../government/services/blockService.js';
import { citizenService } from '../../../citizen/services/citizenService.js';
import { DistrictBlocksList } from './DistrictBlocksList.jsx';
import { AddBlockModal } from './AddBlockModal.jsx';
import { ViewBlockModal } from './ViewBlockModal.jsx';
import { EditBlockModal } from './EditBlockModal.jsx';

export const DistrictIssuesDirectory = ({ nodalDistrict = 'Ranchi' }) => {
  const [blocks, setBlocks] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewBlock, setViewBlock] = useState(null);
  const [editBlock, setEditBlock] = useState(null);

  const districtName = nodalDistrict && nodalDistrict !== 'All' ? nodalDistrict : 'Ranchi';

  const loadData = async () => {
    try {
      setLoading(true);
      const [resBlocks, resChallenges] = await Promise.all([
        blockService.getBlocks({ district: districtName }),
        citizenService.fetchChallenges({ limit: 150, district: districtName })
      ]);
      setBlocks(resBlocks || []);
      setChallenges(resChallenges?.challenges || (Array.isArray(resChallenges) ? resChallenges : []) || []);
    } catch (err) {
      console.warn('Error loading district blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [districtName]);

  const handleBlockCreated = (newBlock) => setBlocks((prev) => [...prev, newBlock]);
  const handleBlockUpdated = (upd) => {
    setBlocks((prev) => prev.map((b) => ((b.blockId || b._id) === (upd.blockId || upd._id) ? upd : b)));
  };

  const handleDeleteBlock = async (block) => {
    const name = block.name || block.blockId;
    if (!window.confirm(`Are you sure you want to delete block "${name}"? This action cannot be undone.`)) return;
    try {
      const targetId = block.blockId || block.id || block._id;
      await blockService.deleteBlock(targetId);
      setBlocks((prev) => prev.filter((b) => (b.blockId || b._id) !== targetId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete block');
    }
  };

  const totalPanchayats = blocks.reduce((acc, b) => acc + (b.panchayats?.length || 0), 0);
  const totalAssignedProblems = challenges.filter((c) => Boolean(c.assignedDepartment?.name)).length;

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      {/* Top Header Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 leading-none">District Block Directory</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
                {districtName} District
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Manage blocks in list format with full CRUD operations and credentials.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#007A61]' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#007A61] hover:bg-[#006651] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* District KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{blocks.length}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Total Blocks</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{totalPanchayats}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Total Gram Panchayats</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{totalAssignedProblems}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Assigned Civic Issues</p>
          </div>
        </div>
      </div>

      {/* Blocks List in Table/List format */}
      <DistrictBlocksList
        blocks={blocks}
        challenges={challenges}
        onViewBlock={(b) => setViewBlock(b)}
        onEditBlock={(b) => setEditBlock(b)}
        onDeleteBlock={handleDeleteBlock}
      />

      {/* CRUD Modals */}
      <AddBlockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBlockCreated={handleBlockCreated}
        defaultDistrict={districtName}
      />
      <ViewBlockModal isOpen={Boolean(viewBlock)} block={viewBlock} onClose={() => setViewBlock(null)} />
      <EditBlockModal isOpen={Boolean(editBlock)} block={editBlock} onClose={() => setEditBlock(null)} onBlockUpdated={handleBlockUpdated} />
    </div>
  );
};

export default DistrictIssuesDirectory;
