import React, { useState, useEffect, useRef } from 'react';
import { Bell, RefreshCw, CheckCircle2, Clock, Landmark, AlertTriangle, ChevronRight, X } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';

export const GovernmentNotificationPopover = ({ onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('gov_read_notifications') || '[]'));
    } catch {
      return new Set();
    }
  });
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('government/overview/notifications');
      const list = res?.data?.data?.notifications || res?.data?.notifications || [];
      setNotifications(list);
    } catch (err) {
      console.warn('Failed to load government notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const markAllAsRead = () => {
    const allIds = new Set([...readIds, ...notifications.map((n) => n.id)]);
    setReadIds(allIds);
    localStorage.setItem('gov_read_notifications', JSON.stringify([...allIds]));
  };

  const handleNotificationClick = (notif) => {
    const nextRead = new Set([...readIds, notif.id]);
    setReadIds(nextRead);
    localStorage.setItem('gov_read_notifications', JSON.stringify([...nextRead]));
    if (notif.actionTab && onNavigateTab) {
      onNavigateTab(notif.actionTab);
    }
    setIsOpen(false);
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'action_required':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'success':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs relative"
        title="Live System Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white font-extrabold text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center ring-2 ring-white shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[400px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px] origin-top-right animate-in fade-in select-none">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-slate-900 tracking-tight">System Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#007A61] text-white">
                  {unreadCount} New
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={fetchNotifications}
                disabled={loading}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#007A61]' : ''}`} />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10.5px] font-bold text-[#007A61] hover:underline cursor-pointer px-1"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[380px]">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">All Caught Up</p>
                <p className="text-[11px]">No pending requisitions or unreviewed grievances.</p>
              </div>
            ) : (
              [...notifications]
                .sort((a, b) => {
                  const aUnread = !readIds.has(a.id);
                  const bUnread = !readIds.has(b.id);
                  if (aUnread !== bUnread) return aUnread ? -1 : 1;
                  return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
                })
                .map((n) => {
                const isRead = readIds.has(n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3 transition-colors cursor-pointer flex items-start gap-3 text-left ${
                      isRead ? 'bg-white hover:bg-slate-50/80 opacity-75' : 'bg-slate-50/40 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md border ${getTypeStyle(n.type)}`}>
                        {n.category}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs truncate ${isRead ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>
                          {n.title}
                        </span>
                        {!isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#007A61] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                        </span>
                        <span className="font-bold text-[#007A61] hover:underline flex items-center">
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentNotificationPopover;
