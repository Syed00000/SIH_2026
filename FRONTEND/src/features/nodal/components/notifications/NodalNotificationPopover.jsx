import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, RefreshCw, Trash2, MapPin } from 'lucide-react';
import { citizenService } from '../../../citizen/services/citizenService.js';

export const NodalNotificationPopover = ({ user, nodalDistrict = '', onSelectNotification }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const popoverRef = useRef(null);

  const getStorageKey = () => `nodal_cleared_${user?._id || user?.id || user?.email || 'nodal'}`;

  const loadNotifications = async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      const res = await citizenService.fetchChallenges({ limit: 150 });
      let list = res?.challenges || (Array.isArray(res) ? res : []) || [];
      if (nodalDistrict && nodalDistrict !== 'All' && nodalDistrict !== 'All Districts') {
        list = list.filter((c) => {
          const dist = c.location?.district || c.district || c.assignedNodalOfficer?.district;
          return dist && dist.toLowerCase() === nodalDistrict.toLowerCase();
        });
      }

      const clearedIds = new Set(JSON.parse(localStorage.getItem(getStorageKey()) || '[]'));
      const items = list
        .filter((c) => !clearedIds.has(c.challengeId || c.id || String(c._id)))
        .map((c) => {
          const isDeployed = c.status === 'Deployed' || Boolean(c.isDeployed) || Boolean(c.isLocked);
          let category = isDeployed ? 'Deployed' : (c.status === 'In Progress' || c.assignedUniversity?.name) ? 'HEI Working' : c.status === 'Clarification Requested' ? 'Clarification' : 'Under Review';
          let badgeColor = isDeployed ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : category === 'HEI Working' ? 'bg-blue-50 text-blue-800 border-blue-200' : category === 'Clarification' ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-amber-50 text-amber-800 border-amber-200';
          let title = isDeployed ? `🔒 Deployed: ${c.title}` : category === 'HEI Working' ? `Assigned: ${c.title}` : `Problem: ${c.title}`;
          return {
            id: c.challengeId || c.id || String(c._id),
            challenge: c,
            title,
            category,
            badgeColor,
            description: c.description || 'Ground submission awaiting triage.',
            district: c.location?.district || c.district || 'Jharkhand',
            time: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'
          };
        });

      setNotifications(items);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { loadNotifications(); }, [nodalDistrict, user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleClearAll = () => {
    const existing = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
    localStorage.setItem(getStorageKey(), JSON.stringify([...new Set([...existing, ...notifications.map((n) => n.id)])]));
    setNotifications([]);
  };

  const handleDismissOne = (e, id) => {
    e.stopPropagation();
    const existing = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
    localStorage.setItem(getStorageKey(), JSON.stringify([...existing, id]));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className={`p-1.5 sm:p-2 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs relative flex items-center justify-center ${
          isOpen ? 'bg-slate-100 text-slate-900' : 'bg-white text-slate-600 hover:bg-slate-50'
        }`}
      >
        <Bell className="w-4 h-4" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#047857] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
            {notifications.length > 99 ? '99+' : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-[52px] right-2 w-[320px] sm:absolute sm:top-auto sm:right-0 sm:mt-2 sm:w-[410px] bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] origin-top-right select-none animate-in fade-in duration-150">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">Live Database Notifications</h3>
              <span className="text-[10px] font-bold text-[#047857] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {notifications.length}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); loadNotifications(true); }}
                disabled={isRefreshing || loading}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Refresh from Database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto overscroll-contain flex-1 bg-white custom-scrollbar max-h-[380px]">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2">
                <div className="w-5 h-5 border-2 border-[#047857] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-semibold">Syncing with database...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center space-y-2 px-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <BellOff className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">No Pending Notifications</h4>
                <p className="text-[11px] text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                  All alerts have been cleared or there are no new problem submissions requiring triage.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => { setIsOpen(false); onSelectNotification?.(n.challenge); }}
                    className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group flex items-start justify-between gap-3 text-left"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border ${n.badgeColor}`}>
                          {n.category}
                        </span>
                        <span className="font-mono text-[9.5px] text-slate-400 font-bold">{n.id}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#047857] truncate transition-colors">
                        {n.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">{n.description}</p>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-0.5">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{n.district}</span>
                        </span>
                        <span>&bull;</span>
                        <span>{n.time}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDismissOne(e, n.id)}
                      className="p-1.5 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                      title="Dismiss"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NodalNotificationPopover;
