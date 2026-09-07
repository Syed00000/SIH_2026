import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const FullPageDetailPanel = ({
  onBack,
  backLabel = 'Back to List',
  breadcrumbs = [],
  idBadge,
  statusBadge,
  title,
  subtitle,
  headerActions,
  tabs = [],
  activeTab,
  onTabChange,
  children,
  stickyFooter
}) => {
  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-140px)] bg-slate-50/60 rounded-xl border border-slate-200 shadow-xs overflow-hidden select-none animate-fadeIn">
      {/* Top Navigation & Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 space-y-3">
        {/* Breadcrumb & Back button */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-500">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center space-x-1 font-bold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#047857] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{backLabel}</span>
            </button>
            {breadcrumbs.length > 0 && (
              <span className="text-slate-300">/</span>
            )}
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                <span className={idx === breadcrumbs.length - 1 ? 'font-bold text-slate-800' : 'hover:text-slate-700'}>
                  {b}
                </span>
                {idx < breadcrumbs.length - 1 && <span className="text-slate-300">/</span>}
              </React.Fragment>
            ))}
          </div>

          {headerActions && (
            <div className="flex items-center space-x-2">
              {headerActions}
            </div>
          )}
        </div>

        {/* Main Entity Title & Status Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5 flex-wrap">
              {idBadge && (
                <span className="font-mono text-xs font-bold text-[#047857]">
                  {idBadge}
                </span>
              )}
              {statusBadge}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Optional Tabs Navigation */}
        {tabs.length > 0 && (
          <div className="flex items-center space-x-1 border-b border-slate-200 -mb-4 pt-2 overflow-x-auto">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange?.(t.id)}
                  className={`py-2.5 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer inline-flex items-center space-x-1.5 whitespace-nowrap ${
                    isActive
                      ? 'border-[#047857] text-[#047857] font-black bg-emerald-50/60'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{t.label}</span>
                  {t.badge && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Scrollable Page Body Content */}
      <div className="p-6 flex-1 space-y-6 overflow-y-auto">
        {children}
      </div>

      {/* Sticky Bottom Action Bar */}
      {stickyFooter && (
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-6 shadow-md flex items-center justify-between shrink-0">
          {stickyFooter}
        </div>
      )}
    </div>
  );
};

export default FullPageDetailPanel;
