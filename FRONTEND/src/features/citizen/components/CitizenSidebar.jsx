import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  User,
  HelpCircle,
  LogOut,
  X,
  Menu,
  ChevronDown,
  Layers,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export const CitizenSidebar = ({
  activeTab = 'home',
  setActiveTab,
  onSubmitClick,
  isSidebarExpanded = true,
  setIsSidebarExpanded,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onLogout
}) => {
  const [openDropdowns, setOpenDropdowns] = useState({
    challenges: true
  });

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const navItems = [
    { id: 'home', label: 'Overview / Home', icon: LayoutDashboard },
    {
      id: 'challenges',
      label: 'My Challenges',
      icon: FileText,
      subItems: [
        { id: 'challenges_all', label: 'All Submissions', icon: Layers },
        { id: 'challenges_review', label: 'Under Review', icon: FileCheck },
        { id: 'challenges_progress', label: 'In Progress', icon: CheckCircle2 }
      ]
    },
    { id: 'submit', label: 'Submit Challenge', icon: PlusCircle, isAction: true },
    { id: 'updates', label: 'Portal Updates', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'guidelines', label: 'Help & Guidelines', icon: HelpCircle }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/90 px-2.5 pt-3 pb-4 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full z-20 shadow-2xs select-none ${
        isMobileMenuOpen
          ? 'absolute inset-y-0 left-0 w-60 shadow-xl bg-white md:relative md:shadow-none'
          : 'hidden md:flex'
      } ${isSidebarExpanded ? 'w-60' : 'w-16'}`}
    >
      <div className="space-y-3 overflow-y-auto pr-0.5">
        {/* Collapse Toggle Bar */}
        <div className={`flex items-center ${isSidebarExpanded ? 'justify-end' : 'justify-center'} pb-1 px-1`}>
          <button
            onClick={() => {
              if (isMobileMenuOpen && setIsMobileMenuOpen) {
                setIsMobileMenuOpen(false);
              } else if (setIsSidebarExpanded) {
                setIsSidebarExpanded(!isSidebarExpanded);
              }
            }}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors bg-white cursor-pointer shadow-2xs"
            title={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isSidebarExpanded ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Main Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isParentActive = activeTab === item.id || item.subItems?.some((s) => s.id === activeTab);
            const isOpen = openDropdowns[item.id];

            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  onClick={() => {
                    if (item.isAction) {
                      onSubmitClick && onSubmitClick();
                      return;
                    }
                    if (hasSubItems) {
                      if (!isSidebarExpanded && setIsSidebarExpanded) {
                        setIsSidebarExpanded(true);
                      }
                      toggleDropdown(item.id);
                      setActiveTab && setActiveTab(item.id);
                    } else {
                      setActiveTab && setActiveTab(item.id);
                      if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
                    isSidebarExpanded ? 'px-3 py-2 text-left' : 'p-2 justify-center'
                  } ${
                    item.isAction
                      ? 'bg-[#047857] hover:bg-[#064e3b] text-white font-bold shadow-2xs my-1.5'
                      : isParentActive && !hasSubItems
                      ? 'bg-[#064e3b] text-white font-bold shadow-2xs'
                      : isParentActive && hasSubItems
                      ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/80'
                      : 'text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-900'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <IconComponent
                      className={`w-4 h-4 shrink-0 ${
                        item.isAction
                          ? 'text-white'
                          : isParentActive && !hasSubItems
                          ? 'text-white'
                          : isParentActive
                          ? 'text-emerald-800'
                          : 'text-slate-500'
                      }`}
                    />
                    {isSidebarExpanded && (
                      <span className="truncate tracking-tight">{item.label}</span>
                    )}
                  </div>

                  {/* Dropdown Chevron */}
                  {hasSubItems && isSidebarExpanded && (
                    <div className="shrink-0 text-slate-400">
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-emerald-700' : ''
                        }`}
                      />
                    </div>
                  )}
                </button>

                {/* Sub-items Render */}
                {hasSubItems && isOpen && isSidebarExpanded && (
                  <div className="pl-3.5 pr-1 py-1 space-y-0.5 border-l-2 border-emerald-200 ml-3.5 my-1">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = activeTab === sub.id || (sub.id === 'challenges_all' && activeTab === 'challenges');
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveTab && setActiveTab('challenges');
                            if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                            isSubActive
                              ? 'bg-[#064e3b] text-white font-bold shadow-2xs'
                              : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'
                          }`}
                        >
                          <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-white' : 'text-emerald-700/70'}`} />
                          <span className="truncate">{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout Area */}
      <div className="pt-2 border-t border-slate-100 space-y-1">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
            isSidebarExpanded ? 'px-3 py-2 space-x-2.5' : 'p-2 justify-center'
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
          {isSidebarExpanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default CitizenSidebar;
