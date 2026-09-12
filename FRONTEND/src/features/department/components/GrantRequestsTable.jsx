import React from 'react';
import { CheckCircle2, Clock, XCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const GrantRequestsTable = ({ requests = [], type = 'all', onReviewRequest }) => {
  if (requests.length === 0) {
    return (
      <div className="p-10 text-center text-xs text-slate-400 font-medium bg-white rounded-2xl border border-slate-200/80">
        {type === 'inbound'
          ? 'No incoming grant requisitions from subordinate offices.'
          : type === 'outbound'
          ? 'No outbound grant requisitions submitted yet. Click "+ Request Extra Grant" to create a requisition.'
          : 'No grant requisitions found in this view.'}
      </div>
    );
  }

  const showDirectionCol = type === 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden text-left select-none text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              {showDirectionCol && <th className="py-3 px-4">Flow</th>}
              <th className="py-3 px-4">Request ID & Date</th>
              <th className="py-3 px-4">{showDirectionCol ? 'Office / Authority' : type === 'inbound' ? 'Requester Office' : 'Approving Authority'}</th>
              <th className="py-3 px-4">Problem Statement / Purpose</th>
              <th className="py-3 px-4">Requested</th>
              <th className="py-3 px-4">Sanctioned & UTR</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((r) => {
              const isInbound = r.direction === 'inbound' || type === 'inbound';
              const isGranted = r.status === 'Granted';
              const isPending = r.status === 'Pending';
              const isRejected = r.status === 'Rejected';
              const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'Recent';
              const tierMap = {
                WARD_TO_BLOCK: 'Ward Requisition',
                BLOCK_TO_DISTRICT: 'Block Requisition',
                DISTRICT_TO_STATE: 'District Requisition',
                WARD_TO_DISTRICT: 'Ward ➔ District (SOS)',
                WARD_TO_STATE: 'Ward ➔ State (SOS)',
                BLOCK_TO_STATE: 'Block ➔ State (SOS)'
              };
              const tierLabel = tierMap[r.tier] || 'Grant Requisition';

              return (
                <tr key={r.requestId || r._id} className={`hover:bg-slate-50/70 transition-colors ${r.isEmergency ? 'bg-rose-50/40' : ''}`}>
                  {showDirectionCol && (
                    <td className="py-3.5 px-4">
                      {isInbound ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <ArrowDownLeft className="w-3 h-3 text-blue-600" />
                          <span>Incoming</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <ArrowUpRight className="w-3 h-3 text-purple-600" />
                          <span>Outgoing</span>
                        </span>
                      )}
                    </td>
                  )}

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-mono font-bold text-[#007A61]">
                      <span>{r.requestId}</span>
                      {r.isEmergency && <span className="px-1 py-0.1 rounded text-[9px] font-black bg-rose-600 text-white animate-pulse">SOS</span>}
                    </div>
                    <span className="text-[10px] text-slate-400">{dateStr}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900">
                      {isInbound ? (r.requesterName || 'Subordinate Department') : (r.targetName || 'Higher Authority')}
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block mt-0.5 ${r.isEmergency ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
                      {tierLabel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 truncate" title={r.purpose}>{r.purpose}</div>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-slate-100 text-slate-600 inline-block mt-0.5">
                      {r.sector || 'Civic Infrastructure'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ₹ {Number(r.requestedAmount || 0).toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    {isGranted ? (
                      <div>
                        <span className="font-extrabold text-emerald-700">
                          ₹ {Number(r.sanctionedAmount || r.requestedAmount).toLocaleString('en-IN')}
                        </span>
                        {r.utrNumber && <div className="text-[9.5px] text-slate-400 truncate max-w-[130px]">{r.utrNumber}</div>}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      isGranted ? 'bg-emerald-100 text-emerald-800' : isPending ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isGranted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                      {isRejected && <XCircle className="w-3 h-3 text-rose-600" />}
                      <span>{r.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {isInbound && isPending ? (
                      <button
                        type="button"
                        onClick={() => onReviewRequest && onReviewRequest(r)}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs cursor-pointer text-xs"
                      >
                        Sanction Grant
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {isInbound ? 'Processed' : 'Awaiting Review'}
                      </span>
                    )}
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

export default GrantRequestsTable;
