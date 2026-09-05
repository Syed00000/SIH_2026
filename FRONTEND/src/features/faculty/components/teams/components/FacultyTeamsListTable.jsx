import React, { useState } from 'react';
import { Users, Crown, Edit3, Trash2, Plus, Search, FileUp, Loader2 } from 'lucide-react';
import { facultyApiService } from '../../../services/facultyApiService.js';
import { SubmitPrototypeFooterBar } from './SubmitPrototypeFooterBar.jsx';

export const FacultyTeamsListTable = ({
  teams = [], onSelectTeam, onAddNewTeam, onDeleteTeam, onSendPrototype, onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [uploadingPdfId, setUploadingPdfId] = useState(null);

  const filtered = teams.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (t.name || '').toLowerCase().includes(q) ||
      (t.teamCode || '').toLowerCase().includes(q) ||
      (t.studentLead || '').toLowerCase().includes(q) ||
      (t.project || '').toLowerCase().includes(q);
  });

  const handlePdfUpload = async (team, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF documents (.pdf) are allowed');
      return;
    }
    if (file.size > 1024 * 1024) {
      alert(`PDF file size must be under 1MB. Selected file is ${(file.size / (1024 * 1024)).toFixed(2)} MB.`);
      return;
    }

    const tid = team.id || team.teamCode || team.projectId;
    setUploadingPdfId(tid);
    try {
      const pid = team.projectId || team.id;
      await facultyApiService.uploadProjectPdf(pid, file);
      if (onRefresh) await onRefresh();
      alert('PDF uploaded successfully to Cloudinary and saved to database!');
    } catch (err) {
      alert('Failed to upload PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingPdfId(null);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#007A61]" />
            <span>All Mentored Research Teams</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Student teams & research squads formed by your research cell.</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-[10.5px] font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">{teams.length} Teams</div>
          <button onClick={onAddNewTeam} className="flex items-center space-x-1.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add New Team</span>
          </button>
        </div>
      </div>

      <div className="p-3 border-b border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams by name, leader, roll number, project..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Team Identity</th>
              <th className="px-4 py-3">Linked Ground Problem / Project</th>
              <th className="px-4 py-3">Student Team Leader</th>
              <th className="px-4 py-3 text-center">Roster</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((t) => {
              const isUnassigned = !t.projectId || t.project?.includes('Not Assigned Yet');
              const isUploading = uploadingPdfId === (t.id || t.teamCode || t.projectId);

              return (
                <tr key={t.id || t.teamCode} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#007A61] flex items-center justify-center font-black text-xs shrink-0 border border-emerald-200">
                        {t.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 leading-snug">{t.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.teamCode}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 max-w-xs space-y-1">
                    {isUnassigned ? (
                      <span className="inline-flex px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold">Independent Lab</span>
                    ) : (
                      <div>
                        <div className="font-bold text-slate-800 line-clamp-1">{t.project}</div>
                        <div className="flex items-center flex-wrap gap-1 mt-1">
                          {t.projectId && <span className="text-[9.5px] font-mono text-slate-500 bg-slate-100 px-1 rounded">{t.projectId}</span>}
                          {t.prototypeStatus === 'Approved' ? (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded">✓ Prototype Approved</span>
                          ) : t.prototypeStatus === 'In Review' ? (
                            <span className="text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded">⏳ In Review</span>
                          ) : t.isFunded ? (
                            <span className="text-[9px] font-bold bg-emerald-50 text-[#007A61] border border-emerald-200 px-1.5 py-0.2 rounded">🚀 1st Grant Disbursed • Prototyping</span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    {t.studentLead && t.studentLead !== 'Unassigned' ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[9px] font-black shrink-0 border border-amber-300"><Crown className="w-3 h-3" /></div>
                        <div><div className="font-bold text-slate-800">{t.studentLead}</div><div className="text-[9.5px] text-slate-500 font-mono">{t.members?.find((m) => m.isLead)?.rollNo || 'Lead'}</div></div>
                      </div>
                    ) : <span className="text-[11px] text-slate-400 italic">Unassigned</span>}
                  </td>

                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Users className="w-3 h-3" /><span>{t.membersCount || t.members?.length || 0} Members</span>
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* PDF Upload Button (< 1MB) */}
                      {isUploading ? (
                        <span className="px-2 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10.5px] font-bold flex items-center space-x-1 border border-slate-200">
                          <Loader2 className="w-3 h-3 animate-spin text-[#007A61]" /><span>Uploading...</span>
                        </span>
                      ) : (
                        <label className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-[10.5px] font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer" title="Upload Prototype PDF (< 1MB)">
                          <FileUp className="w-3.5 h-3.5 text-rose-500" />
                          <span>{t.pdfUrl ? 'Replace PDF' : 'Upload PDF'}</span>
                          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handlePdfUpload(t, e)} />
                        </label>
                      )}

                      <button type="button" onClick={() => onSelectTeam(t)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#007A61] text-slate-700 hover:text-white border border-slate-200 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer">
                        <Edit3 className="w-3 h-3" /><span>Edit</span>
                      </button>

                      {onDeleteTeam && (
                        <button type="button" onClick={() => setTeamToDelete(t)} className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl transition-colors cursor-pointer" title="Delete Team from Database">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 1 Send to University Button at bottom - Active once PDF uploaded */}
      <SubmitPrototypeFooterBar teams={teams} filtered={filtered} onSendPrototype={onSendPrototype} />

      {teamToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-5 space-y-3 text-left">
            <h4 className="text-sm font-bold text-slate-900">Delete Team</h4>
            <p className="text-xs text-slate-600">Are you sure you want to permanently delete <strong>{teamToDelete.name}</strong> ({teamToDelete.teamCode}) from the database?</p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setTeamToDelete(null)} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
              <button type="button" onClick={() => { onDeleteTeam(teamToDelete); setTeamToDelete(null); }} className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer">Delete from Database</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyTeamsListTable;
