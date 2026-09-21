import React, { useState, useEffect } from 'react';
import { Landmark, RefreshCw, Plus, Search, Filter, Building2 } from 'lucide-react';
import { wardService } from '../../../government/services/wardService.js';
import { departmentService } from '../../../government/services/departmentService.js';
import { blockService } from '../../../government/services/blockService.js';
import { citizenService } from '../../../citizen/services/citizenService.js';
import { WardList } from './WardList.jsx';
import { WardDirectoryModals } from './WardDirectoryModals.jsx';
import { WardDirectoryStats } from './WardDirectoryStats.jsx';

export const WardDirectory = ({ nodalDistrict = 'Ranchi' }) => {
  const [wards, setWards] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('All');

  // Modals state
  const [isAddWardOpen, setIsAddWardOpen] = useState(false);
  const [editingWard, setEditingWard] = useState(null);
  const [allocatingWard, setAllocatingWard] = useState(null);
  const [viewWard, setViewWard] = useState(null);

  const districtName = nodalDistrict && nodalDistrict !== 'All' ? nodalDistrict : 'Ranchi';

  const loadData = async () => {
    try {
      setLoading(true);
      const [resDepts, resWards, resChallenges, resBlocks] = await Promise.all([
        departmentService.getDepartments({ limit: 100 }),
        wardService.getWards(),
        citizenService.fetchChallenges({ limit: 200 }),
        blockService.getBlocks(districtName && districtName !== 'All' ? { district: districtName } : {})
      ]);

      const depts = resDepts?.data || (Array.isArray(resDepts) ? resDepts : []) || [];
      const wardDepts = depts
        .filter((d) => {
          const cat = (d.category || '').toLowerCase();
          return cat.includes('ward') || cat.includes('commissioner') || (d.deptId && d.deptId.includes('6542'));
        })
        .map((d) => ({
          ...d,
          wardId: d.deptId || d.code || `WRD-${d.district}`,
          wardNumber: d.district && !isNaN(d.district) ? Number(d.district) : 133,
          councillorName: d.headName || 'mukesh',
          councillorEmail: d.headEmail || d.credentials?.loginEmail || 'ward133@gmail.com',
          councillorPhone: d.headPhone || '8888888',
          credentials: d.credentials || null
        }));

      const rawWards = Array.isArray(resWards) ? resWards : (resWards?.data || []);

      const map = new Map();
      [...wardDepts, ...rawWards].forEach((w) => {
        const key = (w.deptId || w.wardId || w.code || w.id || w._id || '').toUpperCase();
        if (key && !map.has(key)) map.set(key, w);
      });

      setWards(Array.from(map.values()));
      setChallenges(resChallenges?.challenges || (Array.isArray(resChallenges) ? resChallenges : []) || []);
      setBlocks(Array.isArray(resBlocks) ? resBlocks : (resBlocks?.data || []));
    } catch (err) {
      console.warn('Error loading district wards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [districtName]);


  const handleWardUpdated = (upd) => {
    setWards((prev) => prev.map((w) => ((w.wardId || w._id) === (upd.wardId || upd._id) ? upd : w)));
  };

  const handleProblemAllocated = (updChl) => {
    const tId = updChl.challengeId || updChl.id || updChl._id;
    setChallenges((prev) => prev.map((c) => ((c.challengeId || c.id || c._id) === tId ? updChl : c)));
  };

  const handleDeleteWard = async (ward) => {
    const name = ward.name || ward.wardId;
    if (!window.confirm(`Delete Ward "${name}"?`)) return;
    try {
      const targetId = ward.deptId || ward.wardId || ward.id || ward._id;
      await departmentService.deleteDepartment(targetId).catch(() => null);
      await wardService.deleteWard(targetId).catch(() => null);
      setWards((prev) => prev.filter((w) => (w.deptId || w.wardId || w._id) !== targetId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete ward');
    }
  };

  const filteredWards = wards.filter((w) => {
    if (selectedBlock !== 'All' && w.blockId !== selectedBlock && w.blockName !== selectedBlock) return false;
    if (!search.trim()) return true;
    const t = search.toLowerCase();
    return (w.name || '').toLowerCase().includes(t) || (w.wardId || '').toLowerCase().includes(t) || (w.councillorName || '').toLowerCase().includes(t);
  });

  const totalLocalities = filteredWards.reduce((acc, w) => acc + (w.localities?.length || 0), 0);
  const totalAssignedProblems = challenges.filter((c) => Boolean(c.assignedWard?.wardId || c.assignedWard?.id)).length;

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 leading-none">Ward Department</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
                {districtName} District
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Directory of administrative wards created by Local Bodies & Block Offices.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAddWardOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#007A61] hover:bg-[#006651] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Ward</span>
          </button>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#007A61]' : ''}`} />
            <span>Sync Wards</span>
          </button>
        </div>
      </div>

      <WardDirectoryStats totalWards={filteredWards.length} totalLocalities={totalLocalities} totalAssigned={totalAssignedProblems} />

      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wards by name, ID, or councillor..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#007A61]"
          />
        </div>
        {blocks.length > 0 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:border-[#007A61]"
            >
              <option value="All">All Blocks ({blocks.length})</option>
              {blocks.map((b) => (
                <option key={b.blockId || b._id} value={b.blockId || b.name}>{b.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <WardList
        wards={filteredWards} challenges={challenges}
        onViewWard={(w) => setViewWard(w)} onEditWard={(w) => setEditingWard(w)}
        onDeleteWard={handleDeleteWard} onAllocateProblem={(w) => setAllocatingWard(w)}
        onAddWard={() => setIsAddWardOpen(true)}
      />

      <WardDirectoryModals
        isAddWardOpen={isAddWardOpen} setIsAddWardOpen={setIsAddWardOpen}
        onWardCreated={(newWard) => { setWards((prev) => [newWard, ...prev]); setIsAddWardOpen(false); }}
        districtName={districtName} editingWard={editingWard} setEditingWard={setEditingWard}
        onWardUpdated={handleWardUpdated} viewWard={viewWard} setViewWard={setViewWard}
        allocatingWard={allocatingWard} setAllocatingWard={setAllocatingWard}
        challenges={challenges} onProblemAllocated={handleProblemAllocated}
      />
    </div>
  );
};

export default WardDirectory;
