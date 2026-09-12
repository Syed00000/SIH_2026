import React, { useState } from 'react';
import { Building2, Plus, RefreshCw, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { AddBlockToWardModal } from './AddBlockToWardModal.jsx';

export const WardBlocksPanel = ({
  ward,
  blocks = [],
  loading = false,
  onRefresh,
  onBlockCreated,
  onNavigate
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-150">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-900 leading-none">Administrative Blocks</h2>
          <p className="text-xs text-slate-500 mt-1">
            Blocks registered under {ward?.name || 'this Ward'} in {ward?.district || 'Ranchi'} district.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#007A61]' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#007A61] hover:bg-[#006651] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          Loading blocks...
        </div>
      ) : blocks.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Blocks Registered Under This Ward</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Add Block" to create an administrative block linked to this Ward.
          </p>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#007A61] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Block</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {blocks.map((b) => {
            const bId = b.blockId || b.id || b._id;
            return (
              <div
                key={bId}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#007A61]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-left"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-900">{b.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                      {b.blockId}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {b.district} District
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                    {b.bdoName && (
                      <span className="font-semibold text-slate-700">BDO: {b.bdoName}</span>
                    )}
                    {b.bdoEmail && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {b.bdoEmail}
                      </span>
                    )}
                    {b.bdoPhone && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {b.bdoPhone}
                      </span>
                    )}
                  </div>

                  {b.panchayats && b.panchayats.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] text-slate-400 font-bold">Panchayats:</span>
                      {b.panchayats.slice(0, 5).map((p, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {p}
                        </span>
                      ))}
                      {b.panchayats.length > 5 && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          +{b.panchayats.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {b.panchayats?.length || 0} Panchayats
                  </span>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate(`/block?blockId=${encodeURIComponent(b.blockId)}`)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                      title="Open Block Portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddBlockToWardModal
        isOpen={isAddOpen}
        ward={ward}
        onClose={() => setIsAddOpen(false)}
        onBlockCreated={(newBlock) => {
          if (onBlockCreated) onBlockCreated(newBlock);
        }}
      />
    </div>
  );
};

export default WardBlocksPanel;
