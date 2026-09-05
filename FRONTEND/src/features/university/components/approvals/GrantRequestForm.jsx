import React, { useState } from 'react';
import { Send, Clock, Coins } from 'lucide-react';

export const GrantRequestForm = ({
  pendingVal,
  rawDisbursed,
  trancheRequested,
  existingRequest,
  isRequesting,
  onSubmitRequest
}) => {
  const defaultAmt = existingRequest?.amount || pendingVal;
  const [requestedAmount, setRequestedAmount] = useState(defaultAmt);
  const [reason, setReason] = useState(
    existingRequest?.reason || 'Milestone research materials & lab equipment required. Requesting tranche disbursal from State Treasury.'
  );

  const isPending = trancheRequested || existingRequest?.status === 'Pending';
  const displayAmt = existingRequest?.amount || requestedAmount;

  if (isPending) {
    return (
      <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-blue-950">
              {rawDisbursed === 0 ? 'Initial Grant Disbursal' : 'Second EMI (Tranche 2)'} Requested
            </h4>
            <p className="text-[11px] text-blue-800 font-medium">
              Requested Amount: <span className="font-mono font-bold">₹ {Number(displayAmt).toLocaleString('en-IN')}</span> &bull; Awaiting State Government Approval & PFMS Release
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-blue-600 text-white font-mono text-[10px] font-extrabold rounded shrink-0">
          SUBMITTED TO GOVT
        </span>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200 rounded-xl space-y-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Coins className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">
            {rawDisbursed === 0 ? 'Request Initial Grant Disbursal (1st Installment)' : 'Request Second Installment / EMI (Tranche 2)'}
          </h4>
        </div>
        <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
          Max Available: ₹ {pendingVal.toLocaleString('en-IN')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            Amount Required (₹)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={1000}
              max={pendingVal}
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(Math.min(pendingVal, Math.max(1000, Number(e.target.value) || 0)))}
              className="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setRequestedAmount(pendingVal)}
              className="px-2 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold rounded-lg shrink-0 cursor-pointer transition-colors"
            >
              100% Full
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
            Milestone Purpose / Justification
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Phase 2 sensor calibration & testing..."
            className="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-[10.5px] text-blue-800 font-medium">
          Once submitted, State Government Officers will review and release funds directly via PFMS Escrow.
        </p>
        <button
          type="button"
          disabled={isRequesting || requestedAmount <= 0}
          onClick={() => onSubmitRequest(requestedAmount, reason)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-black rounded-lg flex items-center space-x-1.5 shadow-xs cursor-pointer transition-all shrink-0 hover:shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isRequesting ? 'Submitting...' : `Send Request to Govt (₹ ${requestedAmount.toLocaleString('en-IN')})`}</span>
        </button>
      </div>
    </div>
  );
};

export default GrantRequestForm;
