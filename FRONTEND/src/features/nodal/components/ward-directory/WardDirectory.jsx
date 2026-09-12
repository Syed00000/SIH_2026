import React, { useState, useEffect } from 'react';
import { Landmark, RefreshCw, Layers, MapPin } from 'lucide-react';
import { wardService } from '../../../government/services/wardService.js';
import { citizenService } from '../../../citizen/services/citizenService.js';
import { WardList } from './WardList.jsx';
import { ViewWardModal } from './ViewWardModal.jsx';
import { AllocateProblemToSpecificWardModal } from './AllocateProblemToSpecificWardModal.jsx';

export const WardDirectory = ({ nodalDistrict = 'Ranchi' }) => {
  const [wards, setWards] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allocatingWard, setAllocatingWard] = useState(null);
  const [viewWard, setViewWard] = useState(null);

  const districtName = nodalDistrict && nodalDistrict !== 'All' ? nodalDistrict : 'Ranchi';

  const loadData = async () => {
    try {
      setLoading(true);
      const [resWards, resChallenges] = await Promise.all([
        wardService.getWards({ district: districtName }),
        citizenService.fetchChallenges({ limit: 200 })
      ]);
      setWards(resWards || []);
      setChallenges(resChallenges?.challenges || (Array.isArray(resChallenges) ? resChallenges : []) || []);
    } catch (err) {
      console.warn('Error loading district wards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [districtName]);

  const handleWardUpdated = (upd) => {
    setWards((prev) => prev.map((w) => ((w.wardId || w._id) === (upd.wardId || upd._id) ? upd : w)));
  };

  const handleProblemAllocated = (updatedChallenge) => {
    const tId = updatedChallenge.challengeId || updatedChallenge.id || updatedChallenge._id;
    setChallenges((prev) =>
      prev.map((c) => ((c.challengeId || c.id || c._id) === tId ? updatedChallenge : c))
    );
  };

  const handleDeleteWard = async (ward) => {
    const name = ward.name || ward.wardId;
    if (!window.confirm(`Are you sure you want to delete Ward "${name}"? This action cannot be undone.`)) return;
    try {
      const targetId = ward.wardId || ward.id || ward._id;
      await wardService.deleteWard(targetId);
      setWards((prev) => prev.filter((w) => (w.wardId || w._id) !== targetId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete ward');
    }
  };

  const totalLocalities = wards.reduce((acc, w) => acc + (w.localities?.length || 0), 0);
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
            <p className="text-xs text-slate-500 mt-1">
              Directory of administrative wards created by Local Bodies. Allocate civic problems directly to wards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{wards.length}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Total Wards</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{totalLocalities}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Total Localities</p>
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

      <WardList
        wards={wards}
        challenges={challenges}
        onViewWard={(w) => setViewWard(w)}
        onDeleteWard={handleDeleteWard}
        onAllocateProblem={(w) => setAllocatingWard(w)}
      />

      <AllocateProblemToSpecificWardModal
        isOpen={Boolean(allocatingWard)}
        ward={allocatingWard}
        challenges={challenges}
        onClose={() => setAllocatingWard(null)}
        onProblemAllocated={handleProblemAllocated}
      />
      <ViewWardModal isOpen={Boolean(viewWard)} ward={viewWard} onClose={() => setViewWard(null)} />
    </div>
  );
};

export default WardDirectory;
