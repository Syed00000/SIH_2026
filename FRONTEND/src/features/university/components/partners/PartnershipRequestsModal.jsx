import React from 'react';
import { X, FileText, CheckCircle2, Clock, Ban } from 'lucide-react';

export const PartnershipRequestsModal = ({
  isOpen,
  onClose,
  partner
}) => {
  if (!isOpen || !partner) return null;

  const requestsList = [
    { id: 'REQ-101', title: 'Water Quality Telemetry CSR MoU', date: '15 May 2026', grant: '₹ 5.00 Lakhs', status: 'Approved', remarks: 'MoU signed by State Higher Education Department & Corporate Trustee.' },
    { id: 'REQ-102', title: 'Smart Irrigation Solar Lab Support', date: '02 May 2026', grant: '₹ 3.50 Lakhs', status: 'Pending Review', remarks: 'Under evaluation by Technical Evaluation Board.' },
    { id: 'REQ-103', title: 'NABL Equipment Donation Pilot', date: '10 Jan 2026', grant: '₹ 2.00 Lakhs', status: 'Completed', remarks: 'Hardware delivered to Ranchi University Central Lab.' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden rounded-none">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-slate-900" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Partnership Requests & MoUs — {partner.name}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
          {requestsList.map((req) => (
            <div key={req.id} className="p-3 bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{req.id}</span>
                  <span className="text-xs font-bold text-slate-900">{req.title}</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold border ${
                  req.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                  req.status === 'Completed' ? 'bg-purple-50 text-purple-800 border-purple-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {req.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <span>Dispatched: {req.date}</span>
                <span className="font-mono font-bold text-slate-900">Grant: {req.grant}</span>
              </div>

              <p className="text-[11px] text-slate-600 border-t border-slate-200 pt-1.5 leading-relaxed font-medium">
                {req.remarks}
              </p>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnershipRequestsModal;
