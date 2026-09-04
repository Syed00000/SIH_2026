import React from 'react';
import { FolderGit2, FileText, UserCheck, Sparkles, MapPin, Tag } from 'lucide-react';

export const ProblemStatementSelector = ({
  problemStatements = [],
  selectedItem = null,
  onSelect,
  customTitle = '',
  onChangeCustomTitle,
  customStatement = '',
  onChangeCustomStatement
}) => {
  const isCustom = selectedItem?.id === 'custom';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center space-x-1.5">
          <FolderGit2 className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Select Actual Problem Statement / Challenge *</span>
        </label>
        <span className="text-[10px] font-bold text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Govt Allocated Problems ({problemStatements.length})
        </span>
      </div>

      <select
        value={selectedItem?.id || ''}
        onChange={(e) => {
          const val = e.target.value;
          const found = problemStatements.find((p) => p.id === val);
          if (found) onSelect(found);
        }}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
      >
        {problemStatements.map((pr) => (
          <option key={pr.id} value={pr.id}>
            {pr.id !== 'custom' ? `[${pr.id}] ` : ''}{pr.title}{pr.domain ? ` — ${pr.domain}` : ''}
          </option>
        ))}
      </select>

      {/* Selected Problem Statement Details Card */}
      {selectedItem && !isCustom && (
        <div className="p-3.5 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-emerald-50/30 border border-emerald-200/80 rounded-xl space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] font-extrabold text-[#007A61] bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                {selectedItem.id}
              </span>
              <span className="text-xs font-black text-slate-900 line-clamp-1">
                {selectedItem.title}
              </span>
            </div>
            {selectedItem.domain && (
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                {selectedItem.domain}
              </span>
            )}
          </div>

          <div className="space-y-1 pt-1 border-t border-emerald-100/70">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block flex items-center space-x-1">
              <FileText className="w-3 h-3 text-[#007A61]" />
              <span>Actual Problem Statement Description:</span>
            </span>
            <p className="text-xs text-slate-800 italic bg-white/90 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed font-medium">
              "{selectedItem.problemStatement || selectedItem.title}"
            </p>
          </div>

          <div className="flex items-center justify-between text-[10.5px] text-slate-600 font-medium pt-1">
            <div className="flex items-center space-x-1.5 truncate max-w-[70%]">
              <UserCheck className="w-3.5 h-3.5 text-[#007A61] shrink-0" />
              <span className="truncate">Mentor: <strong className="text-slate-800">{selectedItem.facultyName || 'University Faculty Lead'}</strong></span>
            </div>
            {selectedItem.location && (
              <span className="flex items-center space-x-1 text-slate-500 shrink-0">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{selectedItem.location}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Custom Option Inputs */}
      {isCustom && (
        <div className="space-y-2 pt-1">
          <input
            type="text"
            value={customTitle}
            onChange={(e) => onChangeCustomTitle(e.target.value)}
            placeholder="Enter Custom Project / Problem Title..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs"
          />
          <textarea
            rows={2}
            value={customStatement}
            onChange={(e) => onChangeCustomStatement(e.target.value)}
            placeholder="Type actual problem statement context and challenges to address in the research lab..."
            className="w-full text-xs font-medium text-slate-700 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] resize-none shadow-2xs"
          />
        </div>
      )}
    </div>
  );
};

export default ProblemStatementSelector;
