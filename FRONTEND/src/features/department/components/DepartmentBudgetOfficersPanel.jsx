import React, { useState } from 'react';
import { Calculator, Plus, Eye, Edit2, Trash2, Search } from 'lucide-react';
import { budgetOfficerService } from '../../government/services/budgetOfficerService.js';
import { DepartmentBudgetOfficerCard } from './DepartmentBudgetOfficerCard.jsx';

export const DepartmentBudgetOfficersPanel = ({
  officers = [],
  department,
  onAddOfficer,
  onViewOfficer,
  onEditOfficer,
  onDeletedOfficer
}) => {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filtered = officers.filter((o) => {
    const q = search.toLowerCase();
    return (o.name || o.fullName || '').toLowerCase().includes(q) || 
           (o.designation || '').toLowerCase().includes(q) || 
           (o.officerId || '').toLowerCase().includes(q) || 
           (o.phone || '').toLowerCase().includes(q);
  });

  const handleDelete = async (officer) => {
    const officerId = officer.officerId || officer.id || officer._id;
    if (!window.confirm(`Are you sure you want to remove budget officer "${officer.name || officer.fullName}"?`)) return;
    try {
      setDeletingId(officerId);
      await budgetOfficerService.deleteOfficer(officerId);
      if (onDeletedOfficer) onDeletedOfficer(officerId);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete budget officer');
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
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 leading-tight">
              Budget Officers ({officers.length})
            </h2>
            <p className="text-xs text-slate-500">
              Register, manage credentials & dispatch financial planners
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
              placeholder="Search officers..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#007A61]"
            />
          </div>
          <button
            type="button"
            onClick={onAddOfficer}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007A61] hover:bg-[#006651] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Officer</span>
          </button>
        </div>
      </div>

      {/* Content: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No budget officers registered for this department. Click "Add Officer" to create credentials.
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden p-3 space-y-3 bg-slate-50/50">
              {filtered.map((officer) => (
                <DepartmentBudgetOfficerCard
                  key={officer.officerId || officer.id || officer._id}
                  officer={officer}
                  onView={onViewOfficer}
                  onEdit={onEditOfficer}
                  onDelete={handleDelete}
                  isDeleting={deletingId === (officer.officerId || officer.id || officer._id)}
                />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Officer & ID</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Portal Login ID</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((officer) => {
                    const targetId = officer.officerId || officer.id || officer._id;
                    const loginEmail = officer.credentials?.loginEmail || officer.email || 'officer@jharkhand.gov.in';
                    const password = officer.credentials?.password || officer.credentials?.generatedPassword || '••••••••';
                    return (
                      <tr key={targetId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">{officer.name || officer.fullName}</div>
                          <span className="text-[10px] font-mono font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.2 rounded inline-block mt-0.5">
                            {officer.officerId || targetId}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{officer.designation || 'Budget Planner'}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{officer.phone || 'N/A'}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">{loginEmail}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                            {password}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            officer.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                            officer.status === 'On Leave' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {officer.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              title="View Officer"
                              onClick={() => onViewOfficer && onViewOfficer(officer)}
                              className="p-1.5 text-slate-500 hover:text-[#007A61] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Edit Officer"
                              onClick={() => onEditOfficer && onEditOfficer(officer)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Delete Officer"
                              disabled={deletingId === targetId}
                              onClick={() => handleDelete(officer)}
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

export default DepartmentBudgetOfficersPanel;
