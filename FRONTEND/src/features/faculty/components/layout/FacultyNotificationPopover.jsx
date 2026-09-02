import React, { useState, useEffect, useRef, useMemo } from "react";
import { Bell, BellOff, Trash2, AlertCircle, GitPullRequestArrow, Layers, CheckCircle2 } from "lucide-react";

const DISMISSED_KEY = "fac_notif_dismissed_";

function timeAgo(iso) {
  if (!iso) return "Just now";
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function buildNotifications(revisions, projects, challenges) {
  const items = [];

  // Revision requests — highest priority
  (revisions || []).forEach((r, i) => {
    items.push({
      id: `rev-${r._id || r.id || i}`,
      type: "revision",
      label: "Revision Request",
      icon: GitPullRequestArrow,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      dot: "bg-amber-500",
      title: r.title || `Revision #${i + 1}`,
      body: r.remarks || r.message || "A revision has been requested for your proposal.",
      time: r.createdAt || r.date || null,
    });
  });

  // Projects with changes required
  (projects || []).forEach((p) => {
    const statuses = [p.budgetStatus, p.prototypeStatus, p.governmentStatus, p.status];
    const needsChange = statuses.some((s) => String(s || "").toLowerCase().includes("changes required"));
    if (!needsChange) return;
    items.push({
      id: `proj-chg-${p.projectId || p.challengeId || p._id}`,
      type: "changes",
      label: "Changes Required",
      icon: AlertCircle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
      dot: "bg-rose-500",
      title: p.title || p.challengeTitle || "Project Needs Attention",
      body: p.adminRemarks || "Changes have been requested. Review and update your submission.",
      time: p.updatedAt || null,
    });
  });

  // Active / in-progress projects
  (projects || []).forEach((p) => {
    const s = String(p.status || "").toLowerCase();
    if (s.includes("changes required") || s.includes("rejected")) return;
    if (!p.status) return;
    items.push({
      id: `proj-${p.projectId || p.challengeId || p._id}`,
      type: "project",
      label: "Project Update",
      icon: Layers,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      dot: "bg-blue-400",
      title: p.title || p.challengeTitle || "Project Active",
      body: `Status: ${p.status}${p.budgetStatus ? " · Budget: " + p.budgetStatus : ""}`,
      time: p.updatedAt || null,
    });
  });

  // Assigned challenges
  (challenges || []).forEach((c, i) => {
    items.push({
      id: `ch-${c._id || c.challengeId || i}`,
      type: "challenge",
      label: "Assigned Challenge",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      dot: "bg-emerald-500",
      title: c.title || c.challengeTitle || `Challenge ${i + 1}`,
      body: c.description ? c.description.slice(0, 90) + "…" : "You have been assigned a new challenge to mentor.",
      time: c.assignedAt || c.createdAt || null,
    });
  });

  return items;
}

export const FacultyNotificationPopover = ({ revisions = [], projects = [], challenges = [], facultyId = "default" }) => {
  const key = DISMISSED_KEY + facultyId;
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const all = useMemo(() => buildNotifications(revisions, projects, challenges), [revisions, projects, challenges]);
  const visible = useMemo(() => all.filter((n) => !dismissed.includes(n.id)), [all, dismissed]);

  useEffect(() => { localStorage.setItem(key, JSON.stringify(dismissed)); }, [dismissed, key]);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [isOpen]);

  const dismiss = (e, id) => { e.stopPropagation(); setDismissed((p) => [...p, id]); };
  const clearAll = () => setDismissed((p) => [...p, ...visible.map((n) => n.id)]);
  const count = visible.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Notifications"
        className={`relative p-2 rounded-xl border transition-all duration-150 cursor-pointer ${
          isOpen ? "bg-[#007A61]/10 border-[#007A61]/30 text-[#007A61]"
                 : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 shadow-xs"
        }`}
      >
        <Bell className="w-4 h-4" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white leading-none">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[380px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden max-h-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#007A61]" />
              <span className="text-sm font-extrabold text-slate-800">Notifications</span>
              {count > 0 && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full tabular-nums">
                  {count} new
                </span>
              )}
            </div>
            {visible.length > 0 && (
              <button onClick={clearAll} className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
                Clear all
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {visible.length === 0 ? (
              <div className="py-14 flex flex-col items-center gap-2 text-center">
                <BellOff className="w-9 h-9 text-slate-200" />
                <p className="text-sm font-bold text-slate-500">All caught up!</p>
                <p className="text-xs text-slate-400 max-w-[170px] leading-relaxed">No pending notifications at this time.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {visible.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="group flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
                      <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-xl ${n.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-[15px] h-[15px] ${n.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${n.dot}`} />
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{n.label}</span>
                          <span className="ml-auto text-[10px] text-slate-400 whitespace-nowrap shrink-0">{timeAgo(n.time)}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate mb-0.5">{n.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{n.body}</p>
                      </div>
                      <button
                        onClick={(e) => dismiss(e, n.id)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1 p-1 rounded text-slate-300 hover:text-rose-500 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyNotificationPopover;
