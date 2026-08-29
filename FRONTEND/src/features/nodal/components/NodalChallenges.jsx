import React, { useState, useEffect } from 'react';
import { CheckCircle2, RefreshCw, AlertCircle, Layers } from 'lucide-react';
import { NodalFilterBar } from './NodalFilterBar.jsx';
import { NodalAssignModal } from './NodalAssignModal.jsx';
import { universityApiService } from '../../university/services/universityApiService.js';

export const NodalChallenges = ({ universityCode = 'RU001' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignedDept, setAssignedDept] = useState('Computer Science & Engineering');
  const [facultyLead, setFacultyLead] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const res = await universityApiService.getAssignedChallenges(universityCode);
      const list = res?.challenges || (Array.isArray(res) ? res : []) || (res?.data?.challenges || []);
      setChallenges(list);
    } catch (err) {
      console.warn('Error loading real challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [universityCode]);

  const handleOpenAssign = (chl) => {
    setSelectedChallenge(chl);
    setAssignedDept(chl.assignedFaculty?.department || 'Computer Science & Engineering');
    setFacultyLead(chl.assignedFaculty?.name || '');
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedChallenge) return;
    try {
      const targetId = selectedChallenge.challengeId || selectedChallenge.id;
      await universityApiService.assignFaculty(targetId, universityCode, {
        name: facultyLead,
        department: assignedDept
      });
      setIsAssignModalOpen(false);
      setToastMsg(`Successfully assigned ${targetId} to ${facultyLead} in database!`);
      await loadChallenges();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert('Failed to update assignment in database: ' + (err.message || 'Error'));
    }
  };

  const filtered = challenges.filter((c) => {
    const status = c.status || 'Pending';
    const domain = c.domain || '';
    const district = c.district || '';
    const priority = c.priority || 'Medium';

    if (statusFilter !== 'All Status' && status !== statusFilter) return false;
    if (domainFilter !== 'All Domains' && !domain.includes(domainFilter)) return false;
    if (districtFilter !== 'All Districts' && district !== districtFilter) return false;
    if (priorityFilter !== 'All Priority' && priority !== priorityFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        (c.title || '').toLowerCase().includes(q) ||
        (c.challengeId || c.id || '').toLowerCase().includes(q) ||
        district.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <NodalFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        totalCount={filtered.length}
      />

      {/* Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Fetching live challenges from database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-700">No Assigned Challenges Found</h3>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              There are currently no challenges allocated in the database matching your filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold text-[11px]">
                  <th className="py-3 px-3">Challenge ID</th>
                  <th className="py-3 px-3">Details & Statement</th>
                  <th className="py-3 px-3">Domain</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Allocated Faculty</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((item) => {
                  const id = item.challengeId || item.id || item._id;
                  const priority = item.priority || 'Medium';
                  const priorityBadge =
                    priority === 'High'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200';

                  return (
                    <tr key={id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{id}</td>
                      <td className="py-3 px-3 max-w-sm">
                        <p className="font-semibold text-slate-900 leading-snug truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">District: {item.district || 'Jharkhand'} &bull; Deadline: {item.deadline || 'Active'}</p>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{item.domain}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${priorityBadge}`}>
                          {priority}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-slate-900 font-semibold">{item.assignedFaculty?.department || 'Unallocated'}</p>
                        <p className="text-[10px] text-slate-500">{item.assignedFaculty?.name || '—'}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-blue-50 text-blue-700 border-blue-200">
                          {item.status || 'Assigned'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleOpenAssign(item)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          {item.assignedFaculty?.name ? 'Edit Allocation' : 'Assign Faculty'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Allocation Modal */}
      <NodalAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        challenge={selectedChallenge}
        assignedDept={assignedDept}
        setAssignedDept={setAssignedDept}
        facultyLead={facultyLead}
        setFacultyLead={setFacultyLead}
        onConfirm={handleConfirmAssignment}
      />
    </div>
  );
};

export default NodalChallenges;
