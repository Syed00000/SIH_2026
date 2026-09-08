import React, { useState } from 'react';
import { Wrench, Plus, Eye, Edit2, Trash2, Search } from 'lucide-react';
import technicianService from '../../government/services/technicianService.js';
import { DepartmentTechnicianCard } from './DepartmentTechnicianCard.jsx';

export const DepartmentTechniciansPanel = ({
  technicians = [],
  department,
  onAddTech,
  onViewTech,
  onEditTech,
  onDeletedTech
}) => {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filtered = technicians.filter((t) => {
    const q = search.toLowerCase();
    return (
      (t.name || '').toLowerCase().includes(q) ||
      (t.specialization || '').toLowerCase().includes(q) ||
      (t.technicianId || '').toLowerCase().includes(q) ||
      (t.phone || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = async (tech) => {
    const techId = tech.technicianId || tech.id || tech._id;
    if (!window.confirm(`Are you sure you want to remove field technician "${tech.name}"?`)) return;
    try {
      setDeletingId(techId);
      await technicianService.deleteTechnician(techId);
      if (onDeletedTech) onDeletedTech(techId);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete technician');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 leading-tight">
              Technician Directory ({technicians.length})
            </h2>
            <p className="text-xs text-slate-500">
              Manage departmental field technicians & portal access credentials
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search technicians..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#007A61]"
            />
          </div>
          <button
            type="button"
            onClick={onAddTech}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007A61] hover:bg-[#006651] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tech</span>
          </button>
        </div>
      </div>

      {/* Content: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No technicians registered for this department. Click "Add Tech" to create credentials.
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden p-3 space-y-3 bg-slate-50/50">
              {filtered.map((tech) => (
                <DepartmentTechnicianCard
                  key={tech.technicianId || tech.id || tech._id}
                  tech={tech}
                  onView={onViewTech}
                  onEdit={onEditTech}
                  onDelete={handleDelete}
                  isDeleting={deletingId === (tech.technicianId || tech.id || tech._id)}
                />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Technician & ID</th>
                    <th className="py-3 px-4">Trade / Specialization</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Portal Login ID</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((tech) => {
                    const targetId = tech.technicianId || tech.id || tech._id;
                    const loginEmail = tech.credentials?.loginEmail || tech.email || 'tech@jharkhand.gov.in';
                    const password = tech.credentials?.password || tech.credentials?.generatedPassword || '••••••••';
                    return (
                      <tr key={targetId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">{tech.name}</div>
                          <span className="text-[10px] font-mono font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.2 rounded inline-block mt-0.5">
                            {tech.technicianId}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{tech.specialization}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{tech.phone || '9431100000'}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">{loginEmail}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                            {password}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tech.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                            tech.status === 'On Field' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {tech.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              title="View Technician"
                              onClick={() => onViewTech && onViewTech(tech)}
                              className="p-1.5 text-slate-500 hover:text-[#007A61] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Edit Technician"
                              onClick={() => onEditTech && onEditTech(tech)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Delete Technician"
                              disabled={deletingId === targetId}
                              onClick={() => handleDelete(tech)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DepartmentTechniciansPanel;
