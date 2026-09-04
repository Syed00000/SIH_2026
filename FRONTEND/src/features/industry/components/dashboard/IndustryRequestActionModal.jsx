import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, FileText, Building2, Calendar, Target } from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';

export const IndustryRequestActionModal = ({ request, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (status) => {
    setIsSubmitting(true);
    try {
      const targetId = request.requestId || request.id;
      const targetCode = request.universityCode || 'RU001';
      await universityApiService.updateIndustryRequestStatus(targetId, status, targetCode);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-700">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-black text-xs tracking-wider text-slate-300">COLLABORATION REQUEST</span>
              <h2 className="text-base font-black text-white mt-0.5">Review Proposal</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-slate-50 space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">{request.title}</h3>
            <div className="flex items-center text-sm font-medium text-slate-600">
              <Building2 className="w-4 h-4 mr-1.5" />
              {request.university}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">Required Support</p>
              <div className="flex flex-wrap gap-2">
                {request.required.split('+').map(req => req.trim()).map((req, i) => (
                  <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {req}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">Current Status</p>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                request.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                request.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                {request.status}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          {request.status !== 'Approved' && request.status !== 'Rejected' && (
            <>
              <button
                type="button"
                onClick={() => handleAction('Rejected')}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleAction('Approved')}
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Request</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustryRequestActionModal;
