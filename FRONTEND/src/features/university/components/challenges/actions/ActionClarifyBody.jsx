import React from 'react';

const QUICK_TEMPLATES = [
  'Historical water test / borehole lab data missing',
  'GPS survey boundary & forest clearance status needed',
  'Request joint site inspection with BDO / Panchayat'
];

export const ActionClarifyBody = ({ challenge, remarks, setRemarks }) => {
  const nodalOfficer = challenge?.allocatedBy || challenge?.nodalOfficer || {};
  const nodalName = nodalOfficer.name || 'Ritu Verma';
  const nodalDesignation = nodalOfficer.designation || 'State Nodal Officer';
  const nodalPhone = nodalOfficer.phone || nodalOfficer.mobileNumber || '+91 9123456789';
  const nodalEmail = nodalOfficer.email || 'ritu.verma@jh.gov.in';

  return (
    <div className="space-y-3 text-left">
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-amber-950 uppercase tracking-wider text-[10px] block">
            State Nodal Desk & Direct Intercom
          </span>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
            Govt. of Jharkhand
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-amber-900">
          <div>
            <span className="text-amber-700 block text-[10px]">Nodal Officer:</span>
            <strong>{nodalName}</strong> <span className="text-[10px] text-amber-800">({nodalDesignation})</span>
          </div>
          <div>
            <span className="text-amber-700 block text-[10px]">Helpline / Direct Call:</span>
            <strong className="font-mono text-slate-900">{nodalPhone}</strong>
          </div>
        </div>
        <div className="text-[10px] text-amber-800 font-mono">
          <span className="text-amber-700">Official Email: </span>
          <strong className="text-slate-900">{nodalEmail}</strong>
        </div>
        <p className="text-[10.5px] text-amber-800 font-medium border-t border-amber-200/80 pt-1.5 leading-snug">
          You can call the State Nodal Officer directly or submit this technical clarification request.
        </p>
      </div>

      <div className="space-y-1">
        <span className="text-[10.5px] font-bold text-slate-500 block">Quick Query Templates:</span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TEMPLATES.map((temp, tIdx) => (
            <button
              key={tIdx}
              type="button"
              onClick={() => setRemarks(temp)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-[#007A61] border border-slate-200 rounded-lg text-[10.5px] font-medium text-slate-700 cursor-pointer transition-colors text-left"
            >
              + {temp}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-slate-700 font-bold text-xs mb-1.5">
          Specific Technical Clarification / Missing Ground Data:
        </label>
        <textarea
          rows={4}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Specify what technical parameter, lab report, or ground coordinate validation is needed from the State Nodal Officer..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#007A61] focus:ring-1 focus:ring-[#007A61] outline-none transition-all resize-none shadow-2xs font-mono"
        />
      </div>
    </div>
  );
};

export default ActionClarifyBody;
