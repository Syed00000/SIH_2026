import React from 'react';
import { Building2, MapPin, Eye, Edit3, Trash2, UserCheck, Phone, Mail, KeyRound } from 'lucide-react';

export const DistrictBlocksList = ({
  blocks = [],
  challenges = [],
  onViewBlock,
  onEditBlock,
  onDeleteBlock
}) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2 select-none">
        <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
        <h4 className="text-sm font-bold text-slate-700">No Administrative Blocks Registered Yet</h4>
        <p className="text-xs text-slate-500">Click &quot;Add Block / Gram Panchayat&quot; above to register blocks.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden select-none">
      {/* Table Header */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#007A61]" />
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Registered District Blocks ({blocks.length})
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-semibold">
          Administrative blocks management (CRUD operations & credentials)
        </span>
      </div>

      {/* Blocks List */}
      <div className="divide-y divide-slate-100">
        {blocks.map((block, idx) => {
          const blockNameLower = (block.name || '').toLowerCase();
          const bId = (block.blockId || '').toUpperCase();

          const blockIssues = challenges.filter((c) => {
            const aId = (c.assignedDepartment?.deptId || c.assignedDepartment?.id || '').toUpperCase();
            const aBlock = (c.assignedDepartment?.block || c.location?.block || '').toLowerCase();
            const aName = (c.assignedDepartment?.name || '').toLowerCase();
            return aId === bId || aBlock.includes(blockNameLower) || aName.includes(blockNameLower);
          });

          const activeCount = blockIssues.filter((c) => c.status !== 'Resolved' && c.status !== 'Deployed').length;
          const panchayats = block.panchayats || [];
          const loginId = block.credentials?.loginId || block.credentials?.loginEmail || block.bdoEmail || 'bdo.kanke@jharkhand.gov.in';

          return (
            <div
              key={block.blockId || block._id || idx}
              className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left Column: Block Identity & District */}
              <div className="flex items-start gap-3.5 min-w-[240px]">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#007A61] border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900">{block.name}</h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                      {block.blockId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#007A61]" />
                    <span>{block.district} District</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-600">{panchayats.length} Gram Panchayats</span>
                  </p>
                </div>
              </div>

              {/* Middle Column: BDO Officer & Login Credential info */}
              <div className="min-w-[220px] text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-[#007A61]" />
                  <span>{block.bdoName || 'BDO Officer'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10.5px]">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[180px]">{loginId}</span>
                </div>
              </div>

              {/* Gram Panchayats Preview */}
              <div className="flex-1 max-w-sm">
                <div className="flex flex-wrap gap-1 items-center">
                  {panchayats.slice(0, 4).map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                    >
                      {p}
                    </span>
                  ))}
                  {panchayats.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                      +{panchayats.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-extrabold inline-flex items-center gap-1 ${
                    activeCount > 0
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  {activeCount} Active Issues
                </span>
              </div>

              {/* Only CRUD Action Buttons: View, Edit, Delete */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* View (See) */}
                <button
                  type="button"
                  onClick={() => onViewBlock && onViewBlock(block)}
                  title="View Block Details & Credentials"
                  className="p-2 bg-slate-100 hover:bg-emerald-50 hover:text-[#007A61] text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => onEditBlock && onEditBlock(block)}
                  title="Edit Block & Credentials"
                  className="p-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDeleteBlock && onDeleteBlock(block)}
                  title="Delete Block"
                  className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DistrictBlocksList;
