import React from 'react';
import { Eye, CheckCircle2, XCircle, Clock, AlertTriangle, Landmark, Send, ArrowRight } from 'lucide-react';

export const DepartmentRequestsTable = ({
  requests = [],
  onApprove,
  onReject,
  onViewDetails
}) => {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xs p-12 text-center border border-slate-200 text-slate-400 shadow-xs space-y-2">
        <Landmark className="w-8 h-8 text-slate-300 mx-auto" />
        <div className="text-xs font-bold text-slate-700">No Department Fund Requisitions Found</div>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
          No grant requisitions match your filter. Requisitions submitted by State and District Departments will appear here in real time for clearance and fund transfer.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xs shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3.5">Requisition ID</th>
              <th className="py-3 px-3.5">Requester Department</th>
              <th className="py-3 px-3.5 text-right">Requested Amount</th>
              <th className="py-3 px-3.5">Purpose & Sector</th>
              <th className="py-3 px-3.5">Submission Date</th>
              <th className="py-3 px-3.5 text-center">Status</th>
              <th className="py-3 px-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {requests.map((req) => {
              const reqAmt = Number(req.requestedAmount) || 0;
              const sancAmt = Number(req.sanctionedAmount) || 0;
              const isPending = req.status === 'Pending';
              const isGranted = req.status === 'Granted';
              const isRejected = req.status === 'Rejected';
              const isEmergency = req.isEmergency || req.priority === 'Emergency SOS';

              const formattedDate = req.createdAt
                ? new Date(req.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })
                : 'N/A';

              return (
                <tr key={req._id || req.requestId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
                      {req.requestId}
                    </span>
                    {isEmergency && (
                      <span className="ml-1.5 px-1.5 py-0.2 bg-rose-100 text-rose-700 font-bold text-[9px] rounded-xs border border-rose-200 animate-pulse inline-flex items-center space-x-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>EMERGENCY</span>
                      </span>
                    )}
                    <div className="text-[10px] text-slate-400 mt-0.5">{req.tier || 'DISTRICT_TO_STATE'}</div>
                  </td>

                  <td className="py-3 px-3.5">
                    <div className="font-bold text-slate-900">{req.requesterName}</div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-xs">
                        {req.requesterCategory}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {req.district || 'Ranchi'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="font-black font-mono text-slate-900 text-sm">
                      ₹ {reqAmt.toLocaleString('en-IN')}
                    </div>
                    {isGranted && sancAmt > 0 && (
                      <div className="text-[10px] font-bold text-[#007A61]">
                        Sanctioned: ₹ {sancAmt.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3.5 max-w-xs">
                    <div className="font-bold text-slate-800 truncate" title={req.purpose}>
                      {req.purpose}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Sector: {req.sector || 'Civic Works'}
                    </div>
                  </td>

                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-600 font-medium">
                    {formattedDate}
                  </td>

                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1 ${
                      isGranted ? 'bg-emerald-100 text-[#007A61] border border-emerald-300' :
                      isRejected ? 'bg-rose-100 text-rose-700 border border-rose-300' :
                      'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {isGranted && <CheckCircle2 className="w-3 h-3" />}
                      {isRejected && <XCircle className="w-3 h-3" />}
                      {isPending && <Clock className="w-3 h-3" />}
                      <span>{req.status}</span>
                    </span>
                  </td>

                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      {isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() => onApprove(req)}
                            className="px-2.5 py-1 bg-[#007A61] hover:bg-[#00624e] text-white text-[11px] font-bold rounded-xs inline-flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <Send className="w-3 h-3" />
                            <span>Approve & Transfer</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onReject(req)}
                            className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold rounded-xs inline-flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewDetails(req)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xs inline-flex items-center space-x-1 transition-colors cursor-pointer border border-slate-200 shadow-xs"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Dossier</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentRequestsTable;
