import React, { useState } from 'react';
import { CheckSquare, Square, ShieldCheck, RefreshCw } from 'lucide-react';
import { COMPLIANCE_CHECKLIST_ITEMS } from '../../data/csrConstants.js';

export const CSRComplianceChecklist = () => {
  const [checklist, setChecklist] = useState(COMPLIANCE_CHECKLIST_ITEMS);
  const [refreshing, setRefreshing] = useState(false);

  const toggleItem = (id) => {
    setChecklist(
      checklist.map((item) => {
        if (item.id === id) {
          const isVerified = item.status === 'Verified';
          return {
            ...item,
            status: isVerified ? 'Pending' : 'Verified',
            statusType: isVerified ? 'pending' : 'verified'
          };
        }
        return item;
      })
    );
  };

  const handleAuditRecheck = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setChecklist(
        checklist.map((item) => ({
          ...item,
          status: 'Verified',
          statusType: 'verified'
        }))
      );
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
            Statutory & Escrow Compliance Checklist
          </h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Audit compliance validations under General Financial Rules (GFR 2017) and MCA CSR Framework.
          </p>
        </div>

        <button
          onClick={handleAuditRecheck}
          disabled={refreshing}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-900 transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Re-verify Audit Rules</span>
        </button>
      </div>

      {/* Checklist items */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-md">
        {checklist.map((item) => {
          const isVerified = item.status === 'Verified';
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {isVerified ? (
                    <CheckSquare className="w-4 h-4 text-slate-900" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Certifying Authority: <span className="font-semibold text-slate-700">{item.authority}</span>
                  </p>
                </div>
              </div>

              <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                isVerified ? 'bg-slate-100 text-slate-900' : 'bg-slate-50 text-slate-400'
              }`}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CSRComplianceChecklist;
