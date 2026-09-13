import React from 'react';
import { LayoutDashboard, FileText, Building2, Landmark, LogOut, HandCoins, Wrench } from 'lucide-react';

export const BlockSidebar = ({
  activePanel = 'overview',
  onSelectPanel,
  block,
  challengesCount = 0,
  departmentsCount = 0,
  wardsCount = 0,
  techniciansCount = 0,
  onLogout,
  onBackToDistrict
}) => {
  const blockName = block?.name || 'Kanke Block';
  const blockId = block?.blockId || 'BLK-JH-RN-01';

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'challenges', label: 'Civic Challenges', icon: FileText, badge: challengesCount },
    { id: 'departments', label: 'Block Departments', icon: Building2, badge: departmentsCount },
    { id: 'wards', label: 'Wards Directory', icon: Landmark, badge: wardsCount },
    { id: 'technicians', label: 'Technicians', icon: Wrench, badge: techniciansCount },
    { id: 'csr-grant', label: 'CSR Grant', icon: HandCoins, badge: null }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none min-h-screen">
      <div>
        {/* Emblem & Block Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xs font-black text-slate-900 leading-tight truncate">{blockName}</h2>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold bg-[#007A61]/10 text-[#007A61]">
                {blockId}
              </span>
              <span className="text-[10px] text-slate-500 truncate">{block?.district || 'Ranchi'} District</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPanel(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#007A61] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sign Out Action */}
      <div className="p-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 space-x-2.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default BlockSidebar;
