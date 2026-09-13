import React from 'react';
import { Building2, Eye, IndianRupee, CheckCircle2, ChevronRight } from 'lucide-react';
import { parseGrantRupees } from './GrantPaymentModal.jsx';

export const ActiveProjectCard = ({
  project,
  onViewDetails,
  onInitiatePayment
}) => {
  const sancVal = parseGrantRupees(project.sanctionedGrant || project.budget) || 0;
  const disbVal = parseGrantRupees(project.disbursedAmount || project.disbursedGrant) || 0;
  const isFullyPaid = disbVal >= sancVal && sancVal > 0;
  const progress = project.progressPercentage || 50;

  return (
    <div className="bg-white border border-slate-200 p-4.5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-3.5 rounded-xs">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-300">
              {project.id}
            </span>
            <span className="text-xs font-bold text-slate-800">{project.sector}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${
            isFullyPaid
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}>
            {isFullyPaid ? 'Fully Disbursed ✓' : 'In Execution'}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 tracking-tight line-clamp-2">
          {project.title}
        </h3>

        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{project.hei || 'Ranchi University'}</span>
          <span>•</span>
          <span>{project.district || 'Ranchi'}</span>
        </div>

        {/* Progress Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-[10.5px] font-bold text-slate-600 mb-1">
            <span>Execution Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-xs overflow-hidden border border-slate-200">
            <div
              className="bg-[#007A61] h-full transition-all duration-300 rounded-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Financials */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Sanctioned</span>
            <span className="font-mono font-bold text-slate-900">{project.sanctionedGrant || '₹ 73,000'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Disbursed</span>
            <span className="font-mono font-bold text-[#007A61]">{project.disbursedAmount || project.disbursedGrant || '₹ 0'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onViewDetails(project)}
          className="flex-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xs transition-colors cursor-pointer flex items-center justify-center space-x-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        {!isFullyPaid && (
          <button
            type="button"
            onClick={() => onInitiatePayment(project)}
            className="flex-1 px-3 py-1.5 text-xs font-bold text-white bg-[#007A61] hover:bg-[#00624e] rounded-xs transition-colors cursor-pointer flex items-center justify-center space-x-1 shadow-xs"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Next Tranche</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveProjectCard;
