import React, { useState } from 'react';
import { Cpu, Key, Clock, ShieldCheck, Sparkles, Building2, FileText } from 'lucide-react';
import { TechGrantLetterModal } from './TechGrantLetterModal.jsx';

export const GrantedTechHelpBadge = ({ techHelp = [], project }) => {
  const [selectedToolForLetter, setSelectedToolForLetter] = useState(null);
  const items = Array.isArray(techHelp) ? techHelp : (techHelp ? [techHelp] : []);
  if (items.length === 0) return null;

  return (
    <div className="p-3 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/70 border-2 border-emerald-400 rounded-xl space-y-2.5 shadow-2xs text-left animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Industry Tech Help & Tool Access Granted</span>
        </span>
        <span className="px-2 py-0.5 bg-[#007A61] text-white text-[9.5px] font-extrabold rounded-full">
          {items.length} Active Tool Grant{items.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-2.5 rounded-lg border border-emerald-200/90 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-[#007A61] flex items-center justify-center shrink-0">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900">{item.toolName || item.name}</h5>
                  <p className="text-[9.5px] text-slate-500 font-medium">
                    {item.category} • {item.version || 'Enterprise'} ({item.licenseType || 'Academic Grant'})
                  </p>
                </div>
              </div>
              <span className="text-[9.5px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                {item.industryName || 'Industry Partner'}
              </span>
            </div>

            {/* Access Credentials & Validity */}
            <div className="flex items-center flex-wrap gap-2 text-[10px] pt-1 border-t border-slate-100">
              {item.accessCredentials && (
                <div className="flex items-center space-x-1 font-mono font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  <Key className="w-3 h-3 text-[#007A61]" />
                  <span>Key: <strong className="text-emerald-700">{item.accessCredentials}</strong></span>
                </div>
              )}
              {item.validity && (
                <div className="flex items-center space-x-1 text-slate-500 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Validity: {item.validity}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedToolForLetter(item)}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-300 rounded-lg text-[10px] font-bold flex items-center space-x-1 shadow-2xs cursor-pointer ml-auto"
              >
                <FileText className="w-3.5 h-3.5 text-[#007A61]" />
                <span>View Grant Letter</span>
              </button>
            </div>

            {item.notes && (
              <p className="text-[10.5px] text-slate-600 italic bg-emerald-50/40 px-2 py-1 rounded border border-emerald-100">
                "{item.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      <TechGrantLetterModal
        isOpen={Boolean(selectedToolForLetter)}
        toolItem={selectedToolForLetter}
        project={project}
        onClose={() => setSelectedToolForLetter(null)}
      />
    </div>
  );
};

export default GrantedTechHelpBadge;
