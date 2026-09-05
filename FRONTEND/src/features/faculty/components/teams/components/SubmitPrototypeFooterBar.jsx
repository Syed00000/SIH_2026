import React from 'react';
import { Send } from 'lucide-react';

export const SubmitPrototypeFooterBar = ({ teams = [], filtered = [], onSendPrototype }) => {
  if (!teams || teams.length === 0) return null;

  const targetTeam = teams.find((t) => t.pdfUrl) || filtered.find((t) => t.pdfUrl) || filtered[0] || teams[0];
  const isPdfUploaded = Boolean(targetTeam?.pdfUrl);
  const isDeployed = Boolean(targetTeam?.isDeployed || targetTeam?.status === 'Deployed');
  const isAlreadySubmitted = isDeployed || targetTeam?.prototypeStatus === 'In Review' || targetTeam?.prototypeStatus === 'Approved';

  return (
    <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center space-x-2.5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
          isDeployed ? 'bg-emerald-100 text-emerald-800' : isAlreadySubmitted ? 'bg-blue-100 text-blue-700' : isPdfUploaded ? 'bg-emerald-100 text-[#007A61]' : 'bg-slate-200 text-slate-400'
        }`}>
          <Send className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800">
            {isDeployed ? 'Challenge Publicly Deployed' : isAlreadySubmitted ? 'Prototype Submitted to University' : 'Submit Prototype to University'}
          </div>
          <div className="text-[10.5px] text-slate-500">
            {isDeployed ? (
              <span className="text-emerald-700 font-bold">✓ Problem & Solution officially deployed to Citizen Registry by State Government.</span>
            ) : isAlreadySubmitted ? (
              <span className="text-blue-700 font-bold">✓ Prototype blueprint submitted to University and under review.</span>
            ) : isPdfUploaded ? (
              <span className="text-emerald-700 font-bold">✓ Technical PDF uploaded ({targetTeam.pdfName || 'Report.pdf'}). Click button to send to University.</span>
            ) : (
              <span>Upload prototype PDF (&lt; 1MB) above to activate the Send to University button.</span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!isPdfUploaded || isAlreadySubmitted}
        onClick={() => isPdfUploaded && !isAlreadySubmitted && onSendPrototype && onSendPrototype(targetTeam)}
        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-2xs ${
          isDeployed
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
            : isAlreadySubmitted
            ? 'bg-blue-100 text-blue-800 border border-blue-200 cursor-default'
            : isPdfUploaded
            ? 'bg-[#007A61] hover:bg-[#00604c] text-white cursor-pointer hover:shadow-md'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
        }`}
        title={isDeployed ? 'Challenge already deployed' : isAlreadySubmitted ? 'Prototype already submitted' : isPdfUploaded ? 'Send Prototype to University' : 'Upload PDF first to activate'}
      >
        <Send className="w-3.5 h-3.5" />
        <span>{isDeployed ? 'Publicly Deployed (Locked)' : isAlreadySubmitted ? 'Submitted to University' : 'Send to University'}</span>
      </button>
    </div>
  );
};

export default SubmitPrototypeFooterBar;
