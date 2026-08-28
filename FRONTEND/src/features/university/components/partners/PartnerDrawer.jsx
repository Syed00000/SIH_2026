import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PartnerDrawerTabs } from './PartnerDrawerTabs.jsx';

export const PartnerDrawer = ({
  partner,
  onClose,
  onOpenSendRequest,
  onOpenViewRequests
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!partner) return null;

  return (
    <div className="bg-white border border-slate-200 shadow-2xs select-none rounded-none flex flex-col justify-between h-full overflow-hidden">
      <div className="p-3.5 border-b border-slate-200 bg-slate-50 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-none bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {partner.logoText || (partner.name ? partner.name.slice(0, 3).toUpperCase() : 'ABC')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 leading-snug">{partner.name}</h2>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold border ${
                  partner.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-800 border-slate-300'
                }`}>
                  {partner.status || 'Active'}
                </span>
              </div>
              <div className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                {partner.industryType || partner.type || 'Technology'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-slate-200 text-xs">
          {['overview', 'collaborations', 'support offered', 'documents', 'activity'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-1 px-2 font-bold capitalize transition-colors cursor-pointer border-b-2 ${
                activeTab === t ? 'border-b-slate-900 text-slate-900' : 'border-b-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3.5 flex-1 overflow-y-auto space-y-3 text-xs text-slate-700">
        <PartnerDrawerTabs
          partner={partner}
          activeTab={activeTab}
          onOpenSendRequest={onOpenSendRequest}
          onOpenViewRequests={onOpenViewRequests}
        />
      </div>
    </div>
  );
};

export default PartnerDrawer;
