import React from 'react';
import { Building2, Landmark, Handshake } from 'lucide-react';
import { MOCK_CSR_FUNDING_SOURCES } from '../../data/mockCsrLifecycleData.js';

const ICONS = {
  corporate_csr: Building2,
  govt_grants: Landmark,
  joint_funding: Handshake
};

export const CSRFundingSources = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {MOCK_CSR_FUNDING_SOURCES.map((source) => {
        const IconComponent = ICONS[source.id] || Building2;
        return (
          <div
            key={source.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-all"
          >
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-1.5 rounded-lg border ${source.iconColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  {source.title}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">
                {source.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {source.id === 'corporate_csr' && `Active Donors: ${source.activeDonors}`}
                {source.id === 'govt_grants' && `Active Schemes: ${source.activeCount}`}
                {source.id === 'joint_funding' && `Active Projects: ${source.activeCount}`}
              </span>
              <span className={`font-bold px-2.5 py-0.5 rounded-md border text-[11px] ${source.poolColor} border-slate-200/50`}>
                Pool: {source.poolAmount}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CSRFundingSources;
