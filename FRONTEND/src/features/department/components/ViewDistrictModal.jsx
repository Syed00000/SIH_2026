import React from 'react';
import { X, Building2, MapPin, Mail, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export const ViewDistrictModal = ({ isOpen, onClose, district }) => {
  if (!isOpen || !district) return null;

  const loginEmail = district.headEmail || district.credentials?.loginEmail || '-';
  const password = district.credentials?.password || '-';
  const isInactive = district.status === 'Inactive' || district.status === 'Suspended';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800">District Profile</h2>
              <p className="text-xs text-slate-500 font-medium">Department Details & Access Credentials</p>
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
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-6 text-sm">
          
          {/* Identity */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Identity</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 mb-0.5">Department Name</div>
                  <div className="font-extrabold text-slate-800">{district.name || '-'}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 mb-0.5">Department Code</div>
                    <div className="font-mono font-bold text-slate-700 bg-slate-200/50 px-2 py-0.5 rounded text-xs">{district.code || district.deptId || '-'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 mb-0.5 text-right">Status</div>
                    <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        !isInactive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${!isInactive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>{!isInactive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fund Pool */}
          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Allocated Fund Pool</span>
              <div className="text-base font-black text-[#007A61]">₹ {(Number(district.allocatedFundPool) || 0).toLocaleString('en-IN')}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.href = `/department?deptId=${encodeURIComponent(district.deptId || district.id)}`;
              }}
              className="px-3 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition"
            >
              Open Department Portal
            </button>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Jurisdiction</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 mb-0.5">District Coverage</div>
                  <div className="font-bold text-slate-800">{district.district || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 mb-0.5">Category</div>
                  <div className="font-bold text-slate-700">{district.category || 'District Department'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5"/> Portal Access Credentials</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 mb-0.5 flex items-center gap-1"><Mail className="w-3 h-3"/> Login ID / Email</div>
                  <div className="font-mono font-bold text-slate-800">{loginEmail}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 mb-0.5">Password</div>
                  <div className="font-mono font-bold text-slate-800">{password === '-' ? 'Not Set' : password}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
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
