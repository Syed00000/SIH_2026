import React, { useState } from 'react';
import {
  FileText, Key, Calendar, Building2, ShieldCheck,
  Check, Copy, Award, Cpu, AlertCircle, Clock
} from 'lucide-react';

export const OfficialGrantLetterCard = ({
  currentTool,
  currentProblem,
  credentials,
  setCredentials,
  validity,
  setValidity,
  notes,
  setNotes
}) => {
  const [copied, setCopied] = useState(false);
  const proto = currentProblem?.prototypeData || {};
  const techStack = currentProblem?.techStack || proto.techStack || '';
  const stackList = techStack ? techStack.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const letterRef = `JHR/IND-GRANT/${(currentTool?.toolId || 'TECH').replace('TECH-', '')}/${Date.now().toString().slice(-4)}`;
  const partnerName = currentTool?.industryName || 'Corporate Innovation & Testing Labs';
  const universityName = currentProblem?.universityName || 'Ranchi University';

  const handleCopy = () => {
    if (!credentials) return;
    navigator.clipboard.writeText(credentials);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-2 border-emerald-300 rounded-3xl p-6 shadow-md space-y-5 text-left text-slate-800">
      {/* Official Letter Header */}
      <div className="border-b-2 border-emerald-900/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#004D3D] to-[#007A61] text-white flex items-center justify-center shadow-sm shrink-0">
            <Award className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black text-emerald-800 tracking-widest uppercase block">
              Government of Jharkhand &bull; JoharSetu Industry Node
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
              Official Lab Access Authorization &amp; Technology Grant Letter
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              Issuing Authority: <strong className="text-emerald-900">{partnerName}</strong>
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono font-black text-slate-500 block">DISPATCH REF NO.</span>
          <span className="text-xs font-mono font-black text-[#007A61] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
            {letterRef}
          </span>
        </div>
      </div>

      {/* Recipient & Subject Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Recipient Institution</span>
          <p className="font-bold text-slate-900 mt-0.5">{universityName}</p>
          <p className="text-[11px] text-slate-600 font-medium">Research Squad: {currentProblem?.studentTeam || 'Student Research Team'}</p>
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Sanctioned Problem Statement</span>
          <p className="font-bold text-slate-900 mt-0.5 line-clamp-1">{currentProblem?.title}</p>
          <p className="text-[11px] text-emerald-800 font-bold">Lock Fee: {currentProblem?.feeAmount || '₹ 25,000'}</p>
        </div>
      </div>

      {/* Official Lab Access ID Key Box in Letter Form */}
      <div className="p-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl shadow-inner space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-emerald-300" />
            <span className="text-[10.5px] font-mono font-black tracking-widest text-emerald-200 uppercase">
              Authorized Lab Access ID &amp; Security Grant Key
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-white/15 text-emerald-200 text-[9.5px] font-mono font-bold">
            High-Security Token
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30 p-3 rounded-xl border border-white/10">
          <div className="flex-1">
            <span className="text-[9.5px] text-emerald-300/80 uppercase font-mono font-semibold block">Access Authorization Key</span>
            <input
              type="text"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              placeholder="e.g. LAB-ACC-RU001-KEY"
              className="w-full bg-transparent font-mono font-black text-emerald-300 text-sm focus:outline-none tracking-wider"
            />
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer shrink-0 self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5 text-emerald-950" />}
            <span>{copied ? 'Copied' : 'Copy Access ID'}</span>
          </button>
        </div>

        <p className="text-[10.5px] text-emerald-200/90 font-medium">
          * This official Access ID authorizes the university research squad to enter the testing laboratory, operate testing apparatus, and utilize authorized software suites.
        </p>
      </div>

      {/* Authorized Technologies & Apparatus Section */}
      <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-[#007A61]" />
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Authorized Technologies &amp; Lab Apparatus (From Student Prototype)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 block">Provisioned Tech Tool / Rig</span>
            <p className="font-black text-slate-900 mt-0.5">{currentTool?.name}</p>
            <p className="text-[11px] text-slate-600 font-medium">{currentTool?.category} &bull; {currentTool?.version || 'v1.0'}</p>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 block">Authorized Prototype Stack</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {stackList.length > 0 ? (
                stackList.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white text-emerald-900 font-mono font-bold text-[10px] rounded border border-emerald-300">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-500 italic font-medium">General Prototype Technologies</span>
              )}
            </div>
          </div>
        </div>

        {proto.bomSensors && (
          <div className="pt-2 border-t border-emerald-200/80 text-[11px] text-slate-700">
            <span className="font-bold text-slate-900">Permitted Hardware / Sensors:</span> {proto.bomSensors}
          </div>
        )}
      </div>

      {/* Validity & Deployment Scope Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Authorized Lab Access Validity *</span>
          </label>
          <select
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
          >
            <option value="3 Months Active Testing Access">3 Months Active Testing Access</option>
            <option value="6 Months Active Testing Access">6 Months Active Testing Access</option>
            <option value="1 Year Active R&D Access">1 Year Active R&D Access</option>
            <option value="Permanent Campus MoU Grant">Permanent Campus MoU Grant</option>
          </select>
        </div>

        <div>
          <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-700 block mb-1">
            Official Dispatch Terms &amp; Scope
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Official laboratory access terms, bench number, safety protocols..."
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default OfficialGrantLetterCard;
