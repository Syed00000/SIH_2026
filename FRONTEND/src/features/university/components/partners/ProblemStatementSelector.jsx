import React from 'react';
import { FolderGit2, FileText, UserCheck, Sparkles, Users, ExternalLink, FlaskConical } from 'lucide-react';

export const ProblemStatementSelector = ({
  problemStatements = [], selectedItem = null, onSelect,
  customTitle = '', onChangeCustomTitle, customStatement = '', onChangeCustomStatement
}) => {
  const isCustom = selectedItem?.id === 'custom';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center space-x-1.5">
          <FolderGit2 className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Select Submitted Student Prototype *</span>
        </label>
        <span className="text-[10px] font-bold text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {problemStatements.length} Submitted Prototypes
        </span>
      </div>

      {problemStatements.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
          <FlaskConical className="w-6 h-6 text-slate-400 mx-auto" />
          <p className="text-xs font-bold text-slate-700">No Student Prototypes Submitted Yet</p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Data will only appear here once the student research squad uploads their technical PDF and submits the prototype to Ranchi University.
          </p>
        </div>
      ) : (
        <select
          value={selectedItem?.id || ''}
          onChange={(e) => {
            const found = problemStatements.find((p) => p.id === e.target.value);
            if (found) onSelect(found);
          }}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
        >
          {problemStatements.map((pr) => (
            <option key={pr.id} value={pr.id}>
              [{pr.id}] {pr.title} ({pr.studentTeam || 'Student Team'})
            </option>
          ))}
        </select>
      )}

      {/* Selected Problem & Solution Prototype Details Card */}
      {selectedItem && !isCustom && (
        <div className="p-3.5 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-emerald-50/30 border border-emerald-200/80 rounded-xl space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] font-extrabold text-[#007A61] bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                {selectedItem.id}
              </span>
              <span className="text-xs font-black text-slate-900 line-clamp-1">{selectedItem.title}</span>
            </div>
            {selectedItem.domain && (
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                {selectedItem.domain}
              </span>
            )}
          </div>

          {/* 1. Ground Problem Statement Description */}
          <div className="space-y-1 pt-1 border-t border-emerald-100/70">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block flex items-center space-x-1">
              <FileText className="w-3 h-3 text-[#007A61]" />
              <span>Ground Problem Statement Description:</span>
            </span>
            <p className="text-xs text-slate-800 italic bg-white/90 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed font-medium">
              "{selectedItem.problemStatement || selectedItem.title}"
            </p>
          </div>

          {/* 2. Solution Prototype Details */}
          <div className="space-y-1.5 p-2.5 bg-white rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Solution Prototype Deliverable</span>
              </span>
              <span className="text-emerald-700 font-bold lowercase">1st grant: {selectedItem.sanctionedBudget}</span>
            </div>
            <div className="text-[11px] text-slate-700 font-medium leading-relaxed">
              {selectedItem.prototypeData?.content || 'Laboratory validation, telemetry testing & field deployment blueprint.'}
            </div>
            <div className="flex items-center space-x-1 text-[10.5px] text-slate-600 font-semibold pt-1 border-t border-slate-100">
              <Users className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Student Squad: <strong className="text-slate-900">{selectedItem.studentTeam}</strong> (Lead: {selectedItem.studentLead})</span>
            </div>
          </div>

          {/* 3. Attached Cloudinary Solution PDF */}
          {selectedItem.pdfUrl && (
            <div className="flex items-center justify-between p-2.5 bg-rose-50/80 border border-rose-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-slate-900 line-clamp-1">{selectedItem.pdfName}</div>
                  <div className="text-[9.5px] text-emerald-700 font-semibold">✓ Attached Technical Blueprint (Cloudinary)</div>
                </div>
              </div>
              <a
                href={selectedItem.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 shadow-2xs"
              >
                <span>View Attached PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="flex items-center justify-between text-[10.5px] text-slate-600 font-medium pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1.5 truncate max-w-[70%]">
              <UserCheck className="w-3.5 h-3.5 text-[#007A61] shrink-0" />
              <span className="truncate">Faculty Mentor: <strong className="text-slate-800">{selectedItem.facultyName || 'Dr. Binod Kumar'}</strong></span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Ready for Industry Lab
            </span>
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
