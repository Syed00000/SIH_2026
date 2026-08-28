/**
 * Neutral Minimal Design System (Black / White / Slate Theme)
 * Strict ShadCN-style Rectangular Architecture (Zero AI Slopes, No Rounded Curves, No Blue Cards)
 */

export const DESIGN_TOKENS = {
  radius: {
    none: 'rounded-none',
    xs: 'rounded-[1px]',
    sm: 'rounded-[2px]',
    md: 'rounded-sm'
  },
  borders: {
    default: 'border border-slate-200',
    subtle: 'border border-slate-100',
    strong: 'border border-slate-300',
    divider: 'divide-y divide-slate-200'
  },
  surfaces: {
    base: 'bg-white',
    muted: 'bg-slate-50',
    subtle: 'bg-slate-100/60',
    tableHeader: 'bg-slate-50 border-b border-slate-200 text-slate-700'
  },
  typography: {
    title: 'text-lg font-bold tracking-tight text-slate-900',
    subtitle: 'text-xs text-slate-500 font-medium',
    kpiValue: 'text-2xl font-bold tracking-tight text-slate-900',
    kpiLabel: 'text-xs font-semibold text-slate-700',
    bodyText: 'text-xs text-slate-700',
    badgeText: 'text-[11px] font-semibold leading-none'
  }
};

export const STATUS_PILL_STYLES = {
  Pending: 'bg-amber-50 text-amber-900 border border-amber-300 font-bold',
  Accepted: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold',
  Rejected: 'bg-rose-50 text-rose-800 border border-rose-300 font-bold',
  // Aliases
  Review: 'bg-amber-50 text-amber-900 border border-amber-300 font-bold',
  'Faculty Pending': 'bg-amber-50 text-amber-900 border border-amber-300 font-bold',
  'In Progress': 'bg-amber-50 text-amber-900 border border-amber-300 font-bold',
  Clarification: 'bg-amber-50 text-amber-900 border border-amber-300 font-bold',
  Declined: 'bg-rose-50 text-rose-800 border border-rose-300 font-bold'
};

export const PRIORITY_BADGE_STYLES = {
  High: 'text-rose-600 font-bold text-xs',
  Medium: 'text-amber-600 font-bold text-xs',
  Low: 'text-slate-600 font-medium text-xs'
};

export const DOMAIN_BADGE_STYLES = {
  Water: 'bg-slate-100 text-slate-800 border border-slate-200',
  Education: 'bg-slate-100 text-slate-800 border border-slate-200',
  Infrastructure: 'bg-slate-100 text-slate-800 border border-slate-200',
  Environment: 'bg-slate-100 text-slate-800 border border-slate-200',
  Agriculture: 'bg-slate-100 text-slate-800 border border-slate-200',
  Healthcare: 'bg-slate-100 text-slate-800 border border-slate-200',
  Health: 'bg-slate-100 text-slate-800 border border-slate-200',
  Energy: 'bg-slate-100 text-slate-800 border border-slate-200',
  Sanitation: 'bg-slate-100 text-slate-800 border border-slate-200'
};

export default DESIGN_TOKENS;
