import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck, BookOpen, FlaskConical, Trophy, AlertCircle, ChevronRight, Trash2, MessageSquare } from 'lucide-react';
import { facultyApiService } from '../../services/facultyApiService.js';

const TYPE_META = {
  submission: { icon: BookOpen, color: '#007A61', bg: '#e6f4f1' },
  achievement: { icon: Trophy, color: '#7c3aed', bg: '#ede9fe' },
  alert: { icon: AlertCircle, color: '#d97706', bg: '#fef3c7' },
  lab: { icon: FlaskConical, color: '#0284c7', bg: '#e0f2fe' },
  directive: { icon: MessageSquare, color: '#d97706', bg: '#fffbeb' },
  info: { icon: Bell, color: '#64748b', bg: '#f1f5f9' }
};

const relTime = (ts) => {
  if (!ts) return 'Recently';
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

export const FacultyHeader = ({
  universityName = 'Ranchi University',
  facultyName = 'Dr. Binod Kumar',
  facultyRole = 'Senior Research Scientist',
  department = 'Electrical & Electronics',
  notificationCount = 0,
  notifications = [],
  onSelectNotification,
  onViewAllNotifications,
  universityCode = 'RU001'
}) => {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const bellRef = useRef(null);
  const initials = (facultyName || 'FM').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const fn = (e) => { if (!panelRef.current?.contains(e.target) && !bellRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const directiveItems = (notifications || []).map((d) => ({
      id: d.id, title: d.title, description: d.message, type: 'directive', time: d.date, projectId: d.projectId, read: false
    }));
    facultyApiService.getNotifications(universityCode)
      .then((data) => setNotifs([...directiveItems, ...(data || []).map((n) => ({ ...n, read: false }))]))
      .catch(() => setNotifs(directiveItems))
      .finally(() => setLoading(false));
  }, [open, universityCode, notifications]);

  const unread = notifs.filter((n) => !n.read).length || notificationCount || (notifications || []).length;
  const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  const clearAll = async () => { setNotifs([]); await facultyApiService.clearNotifications(universityCode).catch(() => {}); };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 px-4 md:px-6 py-2.5 flex items-center justify-between flex-shrink-0 shadow-xs select-none">
        <div className="flex items-center space-x-3">
          <img src="https://www.jharkhand.gov.in/images/jhlogo55.PNG" alt="Logo" className="w-10 h-10 object-contain drop-shadow-2xs" />
          <div>
            <h1 className="font-bold text-slate-900 text-xs md:text-sm leading-tight">Government of Jharkhand</h1>
            <p className="text-[10px] md:text-[11px] text-slate-500 font-medium leading-tight">Department of Higher and Technical Education</p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#007A61] animate-pulse" />
            <span className="font-extrabold text-[#007A61] text-base tracking-wider uppercase">JOHARSETU FACULTY</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">Research Mentorship &amp; Prototyping Node</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            ref={bellRef}
            onClick={() => setOpen((o) => !o)}
            className="relative p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            title="Notifications & Directives"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                {unread}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-[#007A61] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">{initials}</div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">{facultyName}</span>
              <span className="text-[10px] text-slate-500 font-medium leading-tight truncate max-w-[140px]">{facultyRole} • {universityName}</span>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            style={{ position: 'fixed', top: '60px', right: '16px', zIndex: 50, width: '390px', maxWidth: 'calc(100vw - 32px)', maxHeight: '82vh' }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50/70 to-amber-50/60">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#007A61]" />
                <span className="font-bold text-slate-900 text-sm">Notifications & Directives</span>
                {unread > 0 && <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">{unread}</span>}
              </div>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-[11px] font-semibold text-[#007A61] hover:text-emerald-800 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors">
                    <CheckCheck className="w-3.5 h-3.5" /> Read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-slate-400 text-xs font-medium">Loading notifications...</div>
              ) : notifs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Bell className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No active notifications</p>
                </div>
              ) : (
                notifs.map((n) => {
                  const m = TYPE_META[n.type] || TYPE_META.info;
                  const Icon = m.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.projectId && onSelectNotification) {
                          onSelectNotification(n);
                          setOpen(false);
                        }
                      }}
                      className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors ${n.read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/40 hover:bg-emerald-50/70'}`}
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5" style={{ background: m.bg }}>
                        <Icon className="w-4 h-4" style={{ color: m.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs leading-snug ${n.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>{n.title}</p>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">{n.description}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{relTime(n.time)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50 flex items-center gap-2">
              <button
                onClick={() => { setOpen(false); onViewAllNotifications?.(); }}
                className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#007A61] hover:text-emerald-800 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-5 bg-slate-200" />
              <button
                onClick={clearAll}
                className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-slate-400 hover:text-rose-500 py-2 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear all
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FacultyHeader;
