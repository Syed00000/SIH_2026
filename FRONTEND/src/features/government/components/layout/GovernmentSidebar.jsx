import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  GraduationCap,
  IndianRupee,
  Map,
  Users,
  FileText,
  Settings,
  LogOut,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  FileDown,
  Sliders,
  Calendar,
  History,
  ShieldCheck,
  Building2,
  Briefcase,
  Plus,
  Award,
  Layers,
  FolderKanban,
  PlayCircle,
  FileCheck,
  CheckCircle2,
  Cpu,
  Rocket,
  Lightbulb
} from 'lucide-react';

export const GovernmentSidebar = ({
  activeTab = 'overview',
  setActiveTab,
  isSidebarExpanded = true,
  setIsSidebarExpanded,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onLogout
}) => {
  const [openDropdowns, setOpenDropdowns] = useState({
    projects_solutions: true,
    user_governance: true,
    reports: false
  });

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const mainNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'triage', label: 'Problem Triage', icon: Layers },
    { id: 'heis', label: 'HEI Hub', icon: GraduationCap },
    { id: 'csr', label: 'CSR Grants', icon: IndianRupee },
    { id: 'gis', label: 'GIS Map', icon: Map },
    {
      id: 'projects_solutions',
      label: 'Projects & Solutions',
      icon: FolderKanban,
      subItems: [
        { id: 'projects_active', label: 'Active Projects', icon: PlayCircle },
        { id: 'projects_proposals', label: 'Solution Proposals', icon: FileCheck },
        { id: 'projects_milestones', label: 'Milestones & Monitoring', icon: CheckCircle2 },
        { id: 'projects_prototypes', label: 'Prototypes & TRL', icon: Cpu }
      ]
    },
    {
      id: 'user_governance',
      label: 'User Governance',
      icon: Users,
      subItems: [
        { id: 'governance_universities', label: 'Manage Universities', icon: Building2 },
        { id: 'governance_industries', label: 'Manage Industries', icon: Briefcase },
        { id: 'users_admin', label: 'User Admin', icon: ShieldCheck },
        { id: 'users_audit', label: 'Audit Logs', icon: FileText }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      subItems: [
        { id: 'reports_overview', label: 'Report Overview', icon: LayoutDashboard },
        { id: 'reports_quick', label: 'Quick Exports', icon: FileDown },
        { id: 'reports_custom', label: 'Custom Reports', icon: Sliders },
        { id: 'reports_scheduled', label: 'Scheduled Reports', icon: Calendar },
        { id: 'reports_history', label: 'Report History', icon: History }
      ]
    },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 px-3 pt-3 pb-4 flex flex-col justify-between flex-shrink-0 transition-all duration-200 h-full z-20 shadow-xs select-none ${isMobileMenuOpen
          ? 'absolute inset-y-0 left-0 w-60 shadow-xl bg-white md:relative md:shadow-none'
          : 'hidden md:flex'
        } ${isSidebarExpanded ? 'w-60' : 'w-16'}`}
    >
      <div className="space-y-3 overflow-y-auto pr-0.5">
        {/* Header with Navigation Label & Hamburger/Cross Collapse Toggle */}
        <div className="flex items-center justify-between pb-1 px-1">
          {isSidebarExpanded && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Navigation
            </span>
          )}
          <button
            onClick={() => {
              if (isMobileMenuOpen && setIsMobileMenuOpen) {
                setIsMobileMenuOpen(false);
              } else if (setIsSidebarExpanded) {
                setIsSidebarExpanded(!isSidebarExpanded);
              }
            }}
            className={`p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors bg-white cursor-pointer ${!isSidebarExpanded ? 'mx-auto' : ''
              }`}
            title={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isSidebarExpanded ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Main Nav Links */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const IconComponent = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isParentActive = activeTab === item.id || item.subItems?.some((s) => s.id === activeTab);
            const isOpen = openDropdowns[item.id];

            return (
              <div key={item.id} className="space-y-0.5">
                {/* Parent Nav Button */}
                <button
                  onClick={() => {
                    if (hasSubItems) {
                      if (!isSidebarExpanded && setIsSidebarExpanded) {
                        setIsSidebarExpanded(true);
                      }
                      toggleDropdown(item.id);
                      if (item.id === 'projects_solutions') {
                        setActiveTab && setActiveTab('projects_solutions');
                      } else if (item.id === 'user_governance') {
                        setActiveTab && setActiveTab('governance_universities');
                      }
                    } else {
                      setActiveTab && setActiveTab(item.id);
                      if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                    isSidebarExpanded ? 'px-3 py-2.5 text-left' : 'p-2.5 justify-center'
                  } ${
                    isParentActive && !hasSubItems
                      ? 'bg-slate-900 text-white shadow-xs'
                      : isParentActive && hasSubItems
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <IconComponent
                      className={`w-4 h-4 shrink-0 ${
                        isParentActive && !hasSubItems ? 'text-white' : 'text-slate-500'
                      }`}
                    />
                    {isSidebarExpanded && (
                      <span className="truncate tracking-tight">{item.label}</span>
                    )}
                  </div>

                  {/* Dropdown Chevron */}
                  {hasSubItems && isSidebarExpanded && (
                    <div className="shrink-0 text-slate-400">
                      {isOpen ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  )}
                </button>

                {/* Sub-Items Accordion Dropdown */}
                {hasSubItems && isOpen && isSidebarExpanded && (
                  <div className="space-y-0.5 pl-3 pt-0.5 pb-1 border-l-2 border-slate-100 ml-4">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = activeTab === sub.id;

                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveTab && setActiveTab(sub.id);
                            if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-left ${
                            isSubActive
                              ? 'bg-slate-900 text-white shadow-2xs font-bold'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                          }`}
                        >
                          <SubIcon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSubActive ? 'text-white' : 'text-slate-400'
                            }`}
                          />
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

      {/* Bottom Logout Action */}
      <div className="pt-2 border-t border-slate-100 bg-white">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer ${isSidebarExpanded ? 'px-3 py-2.5 space-x-2.5 text-left' : 'p-2.5 justify-center'
            }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0 text-red-500" />
          {isSidebarExpanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default GovernmentSidebar;
