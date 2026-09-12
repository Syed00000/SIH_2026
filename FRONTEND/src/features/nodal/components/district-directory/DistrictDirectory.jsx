import React, { useState, useEffect } from 'react';
import { Briefcase, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { departmentService } from '../../../government/services/departmentService.js';
import { citizenService } from '../../../citizen/services/citizenService.js';
import { DistrictList } from './DistrictList.jsx';
import { ViewDistrictModal } from './ViewDistrictModal.jsx';
import { SharedAllocateIssueModal } from '../common/SharedAllocateIssueModal.jsx';

export const DistrictDirectory = ({ nodalDistrict = 'Ranchi' }) => {
  const [departments, setDepartments] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allocatingDept, setAllocatingDept] = useState(null);
  const [viewDept, setViewDept] = useState(null);

  const districtName = nodalDistrict && nodalDistrict !== 'All' ? nodalDistrict : 'Ranchi';

  const loadData = async () => {
    try {
      setLoading(true);
      const [resDepts, resChallenges] = await Promise.all([
        departmentService.getDepartments({ category: 'District Department' }),
        citizenService.fetchChallenges({ limit: 200 })
      ]);
      setDepartments(resDepts || []);
      setChallenges(resChallenges?.challenges || (Array.isArray(resChallenges) ? resChallenges : []) || []);
    } catch (err) {
      console.warn('Error loading district departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [districtName]);

  const handleProblemAllocated = (updatedChallenge) => {
    const tId = updatedChallenge.challengeId || updatedChallenge.id || updatedChallenge._id;
    setChallenges((prev) =>
      prev.map((c) => ((c.challengeId || c.id || c._id) === tId ? updatedChallenge : c))
    );
  };

  const handleDeleteDepartment = async (dept) => {
    const name = dept.name || dept.deptId;
    if (!window.confirm(`Are you sure you want to delete District Department "${name}"? This action cannot be undone.`)) return;
    try {
      const targetId = dept.deptId || dept.id || dept._id;
      await departmentService.deleteDepartment(targetId);
      setDepartments((prev) => prev.filter((d) => (d.deptId || d._id) !== targetId));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete department');
    }
  };

  const activeLeads = departments.filter((d) => Boolean(d.headName)).length;
  const totalAssignedProblems = challenges.filter(
    (c) => Boolean(c.assignedDepartment?.category === 'District Department' || c.assignedDepartment?.deptId?.startsWith('DEPT-JH-RN'))
  ).length;

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 leading-none">District Department</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
                Jharkhand Districts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              District administrative departments and executive agencies. Allocate civic challenges directly to district authorities.
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
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{departments.length}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">District Authorities</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{activeLeads}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Department Leads</p>
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

      <DistrictList
        departments={departments}
        challenges={challenges}
        onViewDepartment={(d) => setViewDept(d)}
        onDeleteDepartment={handleDeleteDepartment}
        onAllocateProblem={(d) => setAllocatingDept(d)}
      />

      <SharedAllocateIssueModal
        isOpen={Boolean(allocatingDept)}
        target={allocatingDept}
        targetType="District Department"
        challenges={challenges}
        onClose={() => setAllocatingDept(null)}
        onAllocate={(challengeId, dept, instructions) => departmentService.assignProblemToDepartment(challengeId, dept, instructions)}
        onProblemAllocated={handleProblemAllocated}
      />
      <ViewDistrictModal isOpen={Boolean(viewDept)} department={viewDept} onClose={() => setViewDept(null)} />
    </div>
  );
};

export default DistrictDirectory;
