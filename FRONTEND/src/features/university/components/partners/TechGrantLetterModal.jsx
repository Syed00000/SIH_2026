import React, { useState } from 'react';
import {
  X, Printer, Copy, Check, ShieldCheck,
  Building2, Key, Calendar, Award
} from 'lucide-react';

export const TechGrantLetterModal = ({ isOpen, onClose, toolItem, project }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !toolItem) return null;

  const letter = toolItem.grantLetter || {};
  const letterNo = letter.letterNo || toolItem.letterNo || `IND-GRANT/${toolItem.toolId || 'TECH'}/${Date.now().toString().slice(-4)}`;
  const dispatchDate = letter.dispatchDate ? new Date(letter.dispatchDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const partnerName = letter.issuingPartner || toolItem.industryName || 'Industry Corporate Partner';
  const universityName = letter.recipientUniversity || 'Ranchi University';
  const projectTitle = letter.projectTitle || project?.title || 'Innovation Research Project';
  const accessKey = letter.accessCredentials || toolItem.accessCredentials || 'TECH-UNSET-KEY';
  const validity = letter.validity || toolItem.validity || '1 Year Active R&D';
  const toolName = letter.toolName || toolItem.toolName || toolItem.name || 'Industrial Tech Tool';
  const category = letter.category || toolItem.category || 'Technology Infrastructure';
  const licenseType = letter.licenseType || toolItem.licenseType || 'Commercial R&D License';
  const notes = letter.notes || toolItem.notes || 'Granted for dedicated state university innovation research.';

  const handleCopy = () => {
    navigator.clipboard.writeText(accessKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Award className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-black tracking-widest text-emerald-300 block">OFFICIAL AUTHORIZATION LETTER</span>
              <h3 className="text-sm font-black text-white">Industrial Technology Grant & License</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Letter Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-xs bg-slate-50/60 flex-1">
          {/* Letterhead */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#007A61] block">{partnerName}</span>
                <span className="text-[10px] text-slate-500 font-medium">Corporate Research & Innovation Division</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] font-bold text-slate-600 block">Dispatch Ref: {letterNo}</span>
                <span className="text-[10px] text-slate-500 flex items-center justify-end space-x-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Date: {dispatchDate}</span>
                </span>
              </div>
            </div>

            {/* Recipient */}
            <div className="text-[11px] text-slate-700 leading-relaxed font-medium">
              <p><strong>To:</strong></p>
              <p>The Dean of Research & Development / Nodal Officer</p>
              <p>{universityName}, Higher & Technical Education, Jharkhand</p>
            </div>

            {/* Subject */}
            <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 text-slate-900 font-bold text-xs">
              Subject: Grant of Industrial Technology Access & Proprietary License for "{projectTitle}"
            </div>

            {/* Formal Body Paragraph */}
            <p className="text-xs text-slate-700 leading-relaxed">
              We are pleased to inform you that under the <strong>Joharsetu Industry-Academia R&D Partnership</strong>, our organization has formally approved and sanctioned technical tool access for your designated research squad. The required credentials and operating scopes are outlined below:
            </p>

            {/* Credential Highlight Box */}
            <div className="bg-gradient-to-r from-teal-50 via-white to-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-950 flex items-center space-x-1.5">
                  <Key className="w-4 h-4 text-[#007A61]" />
                  <span>Sanctioned Tech Tool & Official Access ID Key</span>
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md text-[10px] font-extrabold border border-emerald-300">
                  {licenseType}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">{toolName}</h4>
                <p className="text-[10.5px] text-slate-500 font-medium">Category: {category} &bull; Authorized by: {partnerName}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OFFICIAL ACCESS ID / KEY</span>
                  <span className="font-mono text-sm font-black text-emerald-800 tracking-wide">{accessKey}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Key'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10.5px] text-slate-600 font-medium pt-1">
                <span>Validity: <strong className="text-slate-900">{validity}</strong></span>
                <span>Deployment: <strong className="text-emerald-700">Certified Active</strong></span>
              </div>
            </div>

            {notes && (
              <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                Operating Scope: "{notes}"
              </p>
            )}

            {/* Signature & Seal Block */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <div>
                <span className="font-bold text-slate-900 block">Authorized Corporate R&D Signatory</span>
                <span className="text-slate-500 font-medium">{partnerName} Innovation Cell</span>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold inline-flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digitally Verified & Locked</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Official Letter</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-bold text-[#007A61] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center space-x-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-[#007A61]" />}
              <span>{copied ? 'Access Key Copied!' : 'Copy Access Key'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechGrantLetterModal;
