import React from 'react';
import { FileText } from 'lucide-react';

export const ProjectDocumentsTab = ({ documents = [] }) => (
  <div className="space-y-2.5">
    <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
      <span className="font-bold text-slate-700">Project Documents &amp; Repository</span>
      <span className="text-[10.5px] font-mono text-slate-400">{documents.length} Files</span>
    </div>

    {documents.length === 0 ? (
      <div className="p-6 bg-slate-50/70 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
        <FileText className="w-6 h-6 text-slate-300 mx-auto" />
        <div className="text-xs font-bold text-slate-700">No documents attached yet</div>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
          Project proposals, test logs, and calibration documents uploaded by faculty mentors will appear here.
        </p>
      </div>
    ) : (
      documents.map((d, idx) => (
        <div
          key={idx}
          className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs"
        >
          <div>
            <div className="font-bold text-slate-900 text-xs">{d.name}</div>
            <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
              {d.size} {d.date ? `• ${d.date}` : ''}
            </div>
          </div>
          <button type="button" className="text-xs font-bold text-[#007A61] hover:underline cursor-pointer">
            Download
          </button>
        </div>
      ))
    )}
  </div>
);

export default ProjectDocumentsTab;
