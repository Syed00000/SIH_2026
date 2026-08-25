import React, { useState } from 'react';
import { Check, X, Layers } from 'lucide-react';

export const DeduplicationMatrixCard = () => {
  const [statusMessage, setStatusMessage] = useState(null);

  const clusterItems = [
    {
      id: 'IS-2026-00401',
      submittedBy: 'Suresh Yadav',
      location: 'Dumka',
      submittedOn: '20 May 2026',
      similarity: '100% (Master)',
      isMaster: true
    },
    {
      id: 'IS-2026-00411',
      submittedBy: 'Pinki Kumari',
      location: 'Dumka',
      submittedOn: '20 May 2026',
      similarity: '96%',
      isMaster: false
    },
    {
      id: 'IS-2026-00423',
      submittedBy: 'Vikash Mahto',
      location: 'Dumka',
      submittedOn: '21 May 2026',
      similarity: '86%',
      isMaster: false
    }
  ];

  const handleApprove = () => {
    setStatusMessage({ type: 'success', text: 'Cluster CL-2026-0045 merged successfully into Master issue!' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleReject = () => {
    setStatusMessage({ type: 'error', text: 'Merge rejected. Issues marked as distinct submissions.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-900 text-sm pb-2.5 border-b border-slate-100 mb-3">
          3. Deduplication Resolution Matrix
        </h3>

        {/* Cluster Header */}
        <div className="flex items-center justify-between p-2.5 rounded-md bg-slate-50/80 border border-slate-100 mb-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Cluster ID
            </span>
            <span className="font-extrabold text-slate-900 mt-0.5 block">
              CL-2026-0045
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              AI Confidence
            </span>
            <span className="font-extrabold text-emerald-700 mt-0.5 block">
              92%
            </span>
          </div>
        </div>

        {/* Similarity Comparison Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-md mb-3">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="text-slate-500 font-bold border-b border-slate-200 bg-slate-50/80">
                <th className="py-2 px-2.5">Issue ID</th>
                <th className="py-2 px-2.5">Submitted By</th>
                <th className="py-2 px-2.5">Location</th>
                <th className="py-2 px-2.5">Submitted On</th>
                <th className="py-2 px-2.5 text-right">Similarity Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {clusterItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-2.5 font-bold text-slate-900 whitespace-nowrap">
                    {item.id}
                  </td>
                  <td className="py-2 px-2.5 whitespace-nowrap">{item.submittedBy}</td>
                  <td className="py-2 px-2.5 text-slate-500 whitespace-nowrap">{item.location}</td>
                  <td className="py-2 px-2.5 text-slate-400 whitespace-nowrap">{item.submittedOn}</td>
                  <td className="py-2 px-2.5 text-right font-bold whitespace-nowrap">
                    <span
                      className={
                        item.isMaster
                          ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]'
                          : 'text-slate-800'
                      }
                    >
                      {item.similarity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {statusMessage && (
          <div
            className={`flex items-center text-xs font-semibold p-2 rounded mb-2 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-3.5 h-3.5 mr-1" />
            ) : (
              <X className="w-3.5 h-3.5 mr-1" />
            )}
            {statusMessage.text}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => alert('Opening full cluster CL-2026-0045 inspection details...')}
          className="border border-slate-200 rounded-md px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center"
        >
          <Layers className="w-3.5 h-3.5 mr-1 text-slate-500" />
          View Cluster Details
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleReject}
            className="border border-red-200 rounded-md px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 text-xs font-bold transition-colors cursor-pointer"
          >
            Reject Merge
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            Approve & Merge
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeduplicationMatrixCard;
