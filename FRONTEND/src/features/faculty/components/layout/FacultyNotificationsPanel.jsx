import React, { useState, useEffect } from 'react';
import { Bell, BookOpen, FlaskConical, Trophy, AlertCircle, CheckCheck, Trash2, Filter, Search, ArrowLeft, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { facultyApiService } from '../../services/facultyApiService.js';

const TYPE_META = {
  directive: { icon: MessageSquare, color: '#d97706', bg: '#fef3c7' }, submission: { icon: BookOpen, color: '#007A61', bg: '#e6f4f1' },
  achievement: { icon: Trophy, color: '#7c3aed', bg: '#ede9fe' }, alert: { icon: AlertCircle, color: '#dc2626', bg: '#fee2e2' },
  lab: { icon: FlaskConical, color: '#0284c7', bg: '#e0f2fe' }, info: { icon: Bell, color: '#64748b', bg: '#f1f5f9' }
};

const CATEGORIES = [
  { key: 'all', label: 'All', color: '#64748b' }, { key: 'directive', label: 'Directives', color: '#d97706' },
  { key: 'submission', label: 'Submissions', color: '#007A61' }, { key: 'alert', label: 'Alerts', color: '#dc2626' },
  { key: 'achievement', label: 'Achievements', color: '#7c3aed' }, { key: 'lab', label: 'Lab', color: '#0284c7' }
];

const relTime = (ts) => {
  if (!ts) return 'just now';
  const t = new Date(ts).getTime();
  if (isNaN(t)) return typeof ts === 'string' && ts.trim() ? ts : 'just now';
  const diff = Math.max(0, Date.now() - t);
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

const getDateGroup = (ts) => {
  const d = new Date(ts);
  if (!ts || isNaN(d.getTime())) return 'Recent';
  const diff = Math.max(0, Date.now() - d.getTime());
  if (diff < 86400000) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const FacultyNotificationsPanel = ({ onBack, universityCode = 'RU001', notifications = [], onNavigateProject, onClearNotifications }) => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    const mapped = (notifications || []).map((d) => ({
      id: d.id, title: d.title, description: d.message, type: d.type || 'directive', time: d.date || d.time, projectId: d.projectId, challengeId: d.challengeId, read: false
    }));
    setNotifs((prev) => {
      const pIds = prev.map((p) => p.id).join(',');
      const nIds = mapped.map((m) => m.id).join(',');
      return pIds === nIds ? prev : mapped;
    });
  }, [notifications]);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const filtered = notifs.filter((n) => {
    const mtCat = cat === 'all' || (n.type || 'info') === cat;
    const mtSrc = n.title?.toLowerCase().includes(search.toLowerCase()) || n.description?.toLowerCase().includes(search.toLowerCase());
    return mtCat && mtSrc && (!unreadOnly || !n.read);
  });
  const grouped = filtered.reduce((acc, n) => {
    const d = getDateGroup(n.time);
    if (!acc[d]) acc[d] = [];
    acc[d].push(n);
    return acc;
  }, {});

  const markAllRead = () => setNotifs(p => p.map(n => ({ ...n, read: true })));
  const markOneRead = (id) => setNotifs(p => p.map(n => (n.id === id ? { ...n, read: true } : n)));
  const clearAll = async () => {
    setNotifs([]);
    await facultyApiService.clearNotifications(universityCode).catch(() => {});
    if (onClearNotifications) onClearNotifications();
  };

  return (
    <div className="flex flex-col h-full min-h-[550px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3 w-full">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </button>
            )}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-[#007A61]" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-sm leading-tight">Notifications & Directives Hub</h2>
                <p className="text-[10px] text-slate-500 font-medium">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#007A61] bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer">
                <CheckCheck className="w-3.5 h-3.5" /> Mark read
              </button>
            )}
            {notifs.length > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" />
          </div>
          <button onClick={() => setUnreadOnly(!unreadOnly)} className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-lg border ${unreadOnly ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}`}>
            <Filter className="w-3 h-3" /> Unread only
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-0.5 w-full">
          {CATEGORIES.map(c => {
            const count = c.key === 'all' ? notifs.length : notifs.filter(n => (n.type || 'info') === c.key).length;
            return (
              <button key={c.key} onClick={() => setCat(c.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${cat === c.key ? 'text-white' : 'bg-white text-slate-600'}`}
                style={cat === c.key ? { background: c.color, borderColor: c.color } : {}}>
                {c.label} <span className={`px-1 py-0.2 text-[9px] font-bold rounded-full ${cat === c.key ? 'bg-white/25' : 'bg-slate-100'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 w-full">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 font-medium text-xs">Loading notifications...</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Bell className="w-8 h-8 opacity-30 mb-2" />
            <p className="font-semibold text-sm">No notifications found</p>
          </div>
        ) : Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{date}</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-2.5">
              {items.map(n => {
                const m = TYPE_META[n.type] || TYPE_META.info;
                const Icon = m.icon;
                return (
                  <div key={n.id} onClick={() => markOneRead(n.id)} className={`group relative flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${n.read ? 'bg-white' : 'bg-emerald-50/50 hover:bg-emerald-50/70 border-emerald-200/60'}`}>
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: m.bg }}>
                      <Icon className="w-4 h-4" style={{ color: m.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-snug ${n.read ? 'font-medium text-slate-800' : 'font-extrabold text-slate-900'}`}>{n.title}</p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!n.read && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                          <span className="text-[10.5px] text-slate-400 font-medium whitespace-nowrap">{relTime(n.time)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{n.description}</p>
                      {n.projectId && onNavigateProject && (
                        <button onClick={(e) => { e.stopPropagation(); onNavigateProject(n.projectId); }}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#007A61] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200/70">
                          Open Project Workspace <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyNotificationsPanel;
