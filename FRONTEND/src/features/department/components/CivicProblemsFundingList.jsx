import React from 'react';
import { AlertTriangle, CheckCircle2, IndianRupee, Send, ShieldCheck, Flame } from 'lucide-react';

export const CivicProblemsFundingList = ({
  problems = [],
  availableBalance = 0,
  approvingAuthorityName = 'Higher Authority',
  onFundDirectly,
  onRequestExtraFund
}) => {
  if (problems.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 font-medium bg-white rounded-2xl border border-slate-200/80">
        No active civic problem statements assigned to this jurisdiction.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden text-left select-none text-xs">
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-extrabold text-slate-900 text-xs">Civic Problems & Grant Fund Utilization</h3>
          <p className="text-[11px] text-slate-500">Fund civic resolution within available budget or request shortfall grant</p>
        </div>
        <span className="text-[11px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
          Available: <strong className="text-emerald-700 font-mono">₹ {availableBalance.toLocaleString('en-IN')}</strong>
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {problems.slice(0, 8).map((p) => {
          const cost = Number(p.estimatedCost || p.sanctionedBudget || p.budget || 250000);
          const isFunded = Boolean(p.isGrantFunded || p.grantDisbursed || p.status === 'Resolved' || p.status === 'Deployed');
          const hasShortfall = !isFunded && cost > availableBalance;
          const shortfall = hasShortfall ? cost - availableBalance : 0;

          return (
            <div key={p.challengeId || p.id || p._id} className="p-3.5 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 pr-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 truncate">{p.title}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold bg-slate-100 text-slate-700 shrink-0">
                    {p.challengeId || 'CHL-JH'}
                  </span>
                  {p.priority === 'Critical' && (
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" /> Urgent
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10.5px] text-slate-500 mt-1">
                  <span>Sector: <strong>{p.sector || p.category || 'Civic Infrastructure'}</strong></span>
                  <span>•</span>
                  <span>Required Cost: <strong className="text-slate-900 font-mono">₹ {cost.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isFunded ? (
                  <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Funded & Active</span>
                  </span>
                ) : hasShortfall ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Shortfall: ₹ {shortfall.toLocaleString('en-IN')}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onRequestExtraFund && onRequestExtraFund(p, shortfall)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs cursor-pointer transition text-xs"
                      title={`Request extra funds from ${approvingAuthorityName}`}
                    >
                      <Send className="w-3 h-3" />
                      <span>Request Extra Grant</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onFundDirectly && onFundDirectly(p, cost)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer transition text-xs"
                  >
                    <IndianRupee className="w-3 h-3" />
                    <span>Fund from Budget (₹ {cost.toLocaleString('en-IN')})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CivicProblemsFundingList;
