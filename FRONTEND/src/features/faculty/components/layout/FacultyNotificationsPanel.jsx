import React, { useState, useEffect } from 'react';
import { Bell, BookOpen, FlaskConical, Trophy, AlertCircle, CheckCheck, Trash2, Filter, Search, ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { facultyApiService } from '../../services/facultyApiService.js';

const TYPE_META = {
  submission:  { icon: BookOpen,     color: '#007A61', bg: '#e6f4f1', label: 'New Submission' },
  achievement: { icon: Trophy,       color: '#7c3aed', bg: '#ede9fe', label: 'Achievement' },
  alert:       { icon: AlertCircle,  color: '#d97706', bg: '#fef3c7', label: 'Alert' },
  lab:         { icon: FlaskConical, color: '#0284c7', bg: '#e0f2fe', label: 'Lab Update' },
  info:        { icon: Bell,         color: '#64748b', bg: '#f1f5f9', label: 'Notification' },
};

const CATEGORIES = [
  { key: 'all', label: 'All', color: '#64748b' },
  { key: 'submission', label: 'Submissions', color: '#007A61' },
  { key: 'alert', label: 'Alerts', color: '#d97706' },
  { key: 'achievement', label: 'Achievements', color: '#7c3aed' },
  { key: 'lab', label: 'Lab & Resources', color: '#0284c7' },
];

const relTime = (ts) => {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

const getDateGroup = (ts) => {
  if (!ts) return 'Unknown';
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 86400000) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const FacultyNotificationsPanel = ({ onBack, universityCode = 'RU001' }) => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const fetchNotifs = async () => {
    setLoading(true);
    const data = await facultyApiService.getNotifications(universityCode);
    if (data) setNotifs(data.map(n => ({ ...n, read: false })));
    setLoading(false);
  };

  useEffect(() => { fetchNotifs(); }, [universityCode]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filtered = notifs.filter((n) => {
    const mtCat = cat === 'all' || (n.type || 'info') === cat;
    const mtSrc = n.title?.toLowerCase().includes(search.toLowerCase()) || n.description?.toLowerCase().includes(search.toLowerCase());
    const mtUnr = !unreadOnly || !n.read;
    return mtCat && mtSrc && mtUnr;
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
    await facultyApiService.clearNotifications(universityCode);
  };
  const deleteOne = (id) => setNotifs(p => p.filter(n => n.id !== id)); // Note: Only clears locally for now, backend clear all will wipe it all.

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#007A61]" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base leading-tight">Notifications</h2>
                <p className="text-[11px] text-slate-500 font-medium">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-[#007A61] hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg">
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
            {notifs.length > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-400" />
          </div>
          <button onClick={() => setUnreadOnly(!unreadOnly)} className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg border ${unreadOnly ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}`}>
            <Filter className="w-3 h-3" /> Unread only
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-0.5">
          {CATEGORIES.map(c => {
            const count = c.key === 'all' ? notifs.length : notifs.filter(n => (n.type || 'info') === c.key).length;
            return (
              <button key={c.key} onClick={() => setCat(c.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full border ${cat === c.key ? 'text-white' : 'bg-white text-slate-600'}`}
                style={cat === c.key ? { background: c.color, borderColor: c.color } : {}}>
                {c.label} <span className={`px-1 py-0.5 text-[9px] font-bold rounded-full ${cat === c.key ? 'bg-white/25' : 'bg-slate-100'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 font-medium">Loading notifications...</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Bell className="w-8 h-8 opacity-30 mb-4" />
            <p className="font-semibold text-sm">No notifications found</p>
          </div>
        ) : Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{date}</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-2">
              {items.map(n => {
                const m = TYPE_META[n.type] || TYPE_META.info;
                const Icon = m.icon;
                return (
                  <div key={n.id} onClick={() => markOneRead(n.id)} className={`group relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer ${n.read ? 'bg-white' : 'bg-emerald-50/70'}`}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: m.bg }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: m.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-snug ${n.read ? 'font-medium' : 'font-bold'}`}>{n.title}</p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{relTime(n.time)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{n.description}</p>
                    </div>
                    <div className="absolute right-3 top-3 hidden group-hover:flex items-center gap-1">
                      {!n.read && <button onClick={(e) => { e.stopPropagation(); markOneRead(n.id); }} className="p-1 rounded-md text-slate-400 hover:text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /></button>}
                      <button onClick={(e) => { e.stopPropagation(); deleteOne(n.id); }} className="p-1 rounded-md text-slate-400 hover:text-red-500"><XCircle className="w-3.5 h-3.5" /></button>
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
