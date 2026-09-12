import React, { useState, useEffect } from 'react';
import { Landmark, RefreshCw, Layers, Award } from 'lucide-react';
import { departmentService } from '../../../government/services/departmentService.js';
import { citizenService } from '../../../citizen/services/citizenService.js';
import { StateList } from './StateList.jsx';
import { ViewStateModal } from './ViewStateModal.jsx';
import { SharedAllocateIssueModal } from '../common/SharedAllocateIssueModal.jsx';

export const StateDirectory = () => {
  const [ministries, setMinistries] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allocatingMinistry, setAllocatingMinistry] = useState(null);
  const [viewMinistry, setViewMinistry] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resMinistries, resChallenges] = await Promise.all([
        departmentService.getDepartments({ category: 'State Ministry' }),
        citizenService.fetchChallenges({ limit: 200 })
      ]);
      setMinistries(resMinistries || []);
      setChallenges(resChallenges?.challenges || (Array.isArray(resChallenges) ? resChallenges : []) || []);
    } catch (err) {
      console.warn('Error loading state ministries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProblemAllocated = (updatedChallenge) => {
    const tId = updatedChallenge.challengeId || updatedChallenge.id || updatedChallenge._id;
    setChallenges((prev) =>
      prev.map((c) => ((c.challengeId || c.id || c._id) === tId ? updatedChallenge : c))
    );
  };

  const handleDeleteMinistry = async (ministry) => {
    const name = ministry.name || ministry.deptId;
    if (!window.confirm(`Are you sure you want to delete State Ministry "${name}"? This action cannot be undone.`)) return;
    try {
      const targetId = ministry.deptId || ministry.id || ministry._id;
      await departmentService.deleteDepartment(targetId);
      setMinistries((prev) => prev.filter((m) => (m.deptId || m._id) !== targetId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete ministry');
    }
  };

  const activeSecretaries = ministries.filter((m) => Boolean(m.headName)).length;
  const totalAssignedProblems = challenges.filter(
    (c) => Boolean(c.assignedDepartment?.category === 'State Ministry' || c.assignedDepartment?.deptId?.startsWith('DEPT-JH-ST'))
  ).length;

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 leading-none">State Department</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
                Government of Jharkhand
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Apex State Ministries, Directorates, and State Missions. Allocate statewide high-impact challenges.
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
            <span>Sync Departments</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{ministries.length}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">State Department</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{activeSecretaries}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Principal Leads</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{totalAssignedProblems}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Assigned State Issues</p>
          </div>
        </div>
      </div>

      <StateList
        ministries={ministries}
        challenges={challenges}
        onViewMinistry={(m) => setViewMinistry(m)}
        onDeleteMinistry={handleDeleteMinistry}
        onAllocateProblem={(m) => setAllocatingMinistry(m)}
      />

      <SharedAllocateIssueModal
        isOpen={Boolean(allocatingMinistry)}
        target={allocatingMinistry}
        targetType="State Ministry"
        challenges={challenges}
        onClose={() => setAllocatingMinistry(null)}
        onAllocate={(challengeId, ministry, instructions) => departmentService.assignProblemToDepartment(challengeId, ministry, instructions)}
        onProblemAllocated={handleProblemAllocated}
      />
      <ViewStateModal isOpen={Boolean(viewMinistry)} ministry={viewMinistry} onClose={() => setViewMinistry(null)} />
    </div>
  );
};

export default StateDirectory;
