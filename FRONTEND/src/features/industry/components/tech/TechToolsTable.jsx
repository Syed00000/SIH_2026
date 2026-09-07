import React, { useState } from 'react';
import { Cpu, Share2, CheckCircle2, ShieldCheck, Tag, Trash2, ArrowUpRight } from 'lucide-react';

export const TechToolsTable = ({ tools = [], onGrant, onRevoke }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'IoT & Embedded', 'AI & Analytics', 'Hardware & Simulation', 'Cloud & APIs', 'Proprietary IP & Patents'];

  const filtered = tools.filter((t) => {
    const matchesCat = filterCategory === 'All' || t.category === filterCategory;
    const matchesSearch = !searchTerm ||
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.techStackTags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterCategory === c
                  ? 'bg-[#007A61] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by tool, tech stack, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] max-w-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              <th className="pb-2.5">Tech Tool / IP Name</th>
              <th className="pb-2.5">Category & Version</th>
              <th className="pb-2.5">Compatible Tech Stack</th>
              <th className="pb-2.5">License & Support</th>
              <th className="pb-2.5">Status & Grants</th>
              <th className="pb-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                  No technical tools or IP found matching filter.
                </td>
              </tr>
            ) : (
              filtered.map((t) => {
                const isAllocated = (t.allocatedProjects?.length || 0) > 0;
                return (
                  <tr key={t.toolId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="font-extrabold text-slate-900 flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#007A61] flex items-center justify-center shrink-0">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div>{t.name}</div>
                          <span className="text-[9.5px] font-mono text-slate-400 font-normal">{t.toolId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-2">
                      <span className="font-bold text-slate-700 block">{t.category}</span>
                      <span className="text-[10px] text-slate-400">{t.version}</span>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="flex items-center flex-wrap gap-1">
                        {(t.techStackTags || []).map((tag, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono font-bold rounded border border-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-2">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-full font-extrabold text-[9.5px] block w-max">
                        {t.licenseType}
                      </span>
                      <span className="text-[10px] text-slate-500 block pt-0.5">{t.supportLevel}</span>
                    </td>
                    <td className="py-3 pr-2">
                      {isAllocated ? (
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-full font-bold text-[9.5px] inline-flex items-center space-x-1">
                            <Share2 className="w-2.5 h-2.5" />
                            <span>Granted to {t.allocatedProjects.length} Project(s)</span>
                          </span>
                          <div className="text-[9.5px] text-slate-600 truncate max-w-[150px]">
                            {t.allocatedProjects[0]?.projectTitle}
                          </div>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-[9.5px] inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Available</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => onGrant && onGrant(t)}
                          className="px-2.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xl text-[11px] font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Grant Help</span>
                        </button>
                        {isAllocated && onRevoke && (
                          <button
                            type="button"
                            onClick={() => onRevoke(t.toolId, t.allocatedProjects[0]?.projectId)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            title="Revoke allocation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechToolsTable;
