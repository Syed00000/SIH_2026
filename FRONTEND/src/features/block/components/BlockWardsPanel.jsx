import React, { useState } from 'react';
import { Landmark, Plus, Search, MapPin, Mail, Eye, Edit2, Trash2 } from 'lucide-react';

export const BlockWardsPanel = ({
  wards = [],
  challenges = [],
  block,
  onAddWard,
  onViewWard,
  onEditWard,
  onDeleteWard
}) => {
  const [search, setSearch] = useState('');

  const filteredWards = wards.filter((w) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (w.name || '').toLowerCase().includes(term) || (w.wardId || '').toLowerCase().includes(term) ||
      (w.councillorName || '').toLowerCase().includes(term) || (w.localities || []).some((l) => l.toLowerCase().includes(term));
  });

  const totalLocalities = wards.reduce((acc, w) => acc + (w.localities?.length || 0), 0);
  const totalAssigned = challenges.filter((c) => Boolean(c.assignedWard?.wardId || c.assignedWard?.id)).length;

  return (
    <div className="space-y-4 select-none text-left">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 leading-none">Block Wards Directory</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#007A61]/10 text-[#007A61]">
                {block?.name || 'Block'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Register and supervise municipal wards under this Local Body jurisdiction.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddWard}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#007A61] hover:bg-[#006651] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Ward</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{wards.length}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Managed Wards</p>
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
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 leading-none">{totalAssigned}</span>
            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Ward Civic Tasks</p>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search wards by name, ward ID, councillor, or locality..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#007A61]"
        />
      </div>

      {/* Wards List */}
      {filteredWards.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#007A61]/10 text-[#007A61] mx-auto flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Wards Registered Under This Block</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Add Ward" to register the first municipal ward and generate its access ID & password.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredWards.map((ward) => {
            const wardId = ward.wardId || ward.id || ward._id;
            const assignedCount = challenges.filter(
              (c) => c.assignedWard?.wardId === ward.wardId || c.assignedWard?.id === wardId
            ).length;

            return (
              <div
                key={wardId}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#007A61]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-left"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-black text-slate-900 leading-tight">{ward.name}</h2>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                        {ward.wardId}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Ward #{ward.wardNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {ward.localities?.length || 0} Localities
                      </span>
                      {ward.councillorName && <span className="font-semibold text-slate-700">In-charge: {ward.councillorName}</span>}
                      {ward.councillorEmail && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {ward.councillorEmail}
                        </span>
                      )}
                    </div>

                    {ward.localities && ward.localities.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {ward.localities.slice(0, 4).map((loc, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{loc}</span>
                        ))}
                        {ward.localities.length > 4 && (
                          <span className="text-[10px] text-slate-400 font-semibold">+{ward.localities.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {assignedCount} Assigned
                  </span>

                  <button type="button" onClick={() => onViewWard && onViewWard(ward)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer" title="View Ward"><Eye className="w-4 h-4" /></button>
                  <button type="button" onClick={() => onEditWard && onEditWard(ward)} className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer" title="Edit Ward"><Edit2 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => onDeleteWard && onDeleteWard(ward)} className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer" title="Delete Ward"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlockWardsPanel;
