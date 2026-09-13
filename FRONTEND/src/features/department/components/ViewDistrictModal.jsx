import React, { useState } from 'react';
import { X, Building2, MapPin, Mail, KeyRound, Copy, Check, Eye, EyeOff, ShieldCheck, IndianRupee, Phone, Briefcase } from 'lucide-react';

export const ViewDistrictModal = ({ isOpen, onClose, district }) => {
  const [copied, setCopied] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  if (!isOpen || !district) return null;

  const loginEmail = district.headEmail || district.credentials?.loginEmail || district.credentials?.loginId || '-';
  const password = district.credentials?.password || district.credentials?.generatedPassword || '-';
  const isInactive = district.status === 'Inactive' || district.status === 'Suspended';

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Department: ${district.name}\nCode: ${district.code || district.deptId}\nLogin ID: ${loginEmail}\nPassword: ${password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f4b3a]/10 text-[#0f4b3a] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800">{district.name}</h2>
              <p className="text-xs text-slate-500 font-medium">Department Details & Portal Access Profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-4 text-xs">
          
          {/* Identity & Scope */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Department Name</div>
                <div className="font-extrabold text-slate-800 text-sm">{district.name || '-'}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Status</div>
                <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    !isInactive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${!isInactive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span>{!isInactive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/50">
              <div>
                <div className="text-[10px] font-bold text-slate-400 mb-0.5">Department Code / ID</div>
                <div className="font-mono font-bold text-slate-700 bg-slate-200/50 px-2 py-0.5 rounded text-xs inline-block">
                  {district.code || district.deptId || '-'}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 mb-0.5">Administrative Level</div>
                <div className="font-bold text-slate-700">{district.category || 'District Department'}</div>
              </div>
            </div>
          </div>

          {/* Fund Pool Banner */}
          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center">
                <IndianRupee className="w-4 h-4 font-bold" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Allocated Fund Pool</span>
                <div className="text-base font-black text-[#0f4b3a]">₹ {(Number(district.allocatedFundPool) || 0).toLocaleString('en-IN')}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg border border-emerald-200">
              Operational State Pool
            </span>
          </div>

          {/* Jurisdiction & Head */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Jurisdiction Area
              </div>
              <p className="font-extrabold text-slate-800">{district.district || district.block || district.ward || 'Jharkhand'}</p>
              <p className="text-[10.5px] text-slate-500">{district.district ? `${district.district} District` : 'State Jurisdiction'}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> In-Charge Officer
              </div>
              <p className="font-extrabold text-slate-800">{district.headName || 'Officer in Charge'}</p>
              <p className="text-[10.5px] text-slate-500">{district.headRole || 'Lead Nodal Officer'}</p>
            </div>
          </div>

          {/* Portal Access Credentials */}
          <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#0f4b3a] font-bold text-[11px] uppercase tracking-wider">
                <KeyRound className="w-4 h-4" />
                <span>Portal Access Credentials</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="flex items-center gap-1 text-[11px] font-bold text-[#0f4b3a] hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Credentials Copied' : 'Copy Credentials'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                <span className="text-[9.5px] text-slate-400 block font-bold uppercase mb-0.5">Login ID / Email</span>
                <span className="font-mono text-slate-800 font-bold truncate block">{loginEmail}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9.5px] text-slate-400 font-bold uppercase">Password</span>
                  {password !== '-' && (
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  )}
                </div>
                <span className="font-mono text-slate-800 font-bold tracking-wider block">
                  {password === '-' ? 'Not Set' : isPasswordVisible ? password : '••••••••••••'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="text-[11px] text-slate-400 font-medium">
            Authorized District Profile
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDistrictModal;

