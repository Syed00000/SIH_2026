import React, { useState, useEffect, useRef } from 'react';
import { Bell, Trash2, BellOff, RefreshCw } from 'lucide-react';
import { citizenService } from '../services/citizenService.js';

export const CitizenNotificationPopover = ({ user, onSelectNotification }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const popoverRef = useRef(null);

  const getStorageKey = () => `citizen_notifications_${user?._id || user?.id || 'default_citizen'}`;

  const loadNotifications = async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    const storageKey = getStorageKey();
    
    if (!isRefresh) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUpdates(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing stored notifications:', e);
        }
      }
    }

    try {
      const apiData = await citizenService.fetchUpdates();
      if (Array.isArray(apiData)) {
        setUpdates(apiData);
        localStorage.setItem(storageKey, JSON.stringify(apiData));
      } else {
        setUpdates([]);
        localStorage.setItem(storageKey, JSON.stringify([]));
      }
    } catch (e) {
      console.error('Error loading notifications:', e);
      if (!isRefresh) setUpdates([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const saveAndSync = (newList) => {
    setUpdates(newList);
    localStorage.setItem(getStorageKey(), JSON.stringify(newList));
  };

  const handleClearAll = () => {
    saveAndSync([]);
  };

  const handleDeleteOne = (e, id) => {
    e.stopPropagation();
    const updated = updates.filter((u) => u.id !== id);
    saveAndSync(updated);
  };

  const handleRowClick = (upd) => {
    if (upd.isUnread) {
      const updated = updates.map((u) => u.id === upd.id ? { ...u, isUnread: false } : u);
      saveAndSync(updated);
    }
    setIsOpen(false);
    if (upd.challengeId && onSelectNotification) {
      onSelectNotification({ challengeId: upd.challengeId });
    }
  };

  const unreadCount = updates.filter((u) => u.isUnread).length;
  const sortedUpdates = [...updates].sort((a, b) => {
    const aUnread = Boolean(a.isUnread);
    const bUnread = Boolean(b.isUnread);
    if (aUnread !== bUnread) return aUnread ? -1 : 1;
    return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
  });

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className={`p-2 rounded-lg transition-colors cursor-pointer relative ${
          isOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-[56px] right-2 w-[300px] sm:absolute sm:top-auto sm:right-0 sm:mt-2 sm:w-[400px] bg-white border border-slate-200/90 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] origin-top-right">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <h3 className="text-sm font-extrabold text-slate-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  loadNotifications(true);
                }}
                disabled={isRefreshing || loading}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              {updates.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto overscroll-contain flex-1 bg-white hide-scrollbar max-h-[400px]">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sortedUpdates.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <div className="flex items-center justify-center mx-auto mb-3">
                  <BellOff className="w-8 h-8 text-slate-200" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No Notifications</h4>
                <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                  You have no new updates or messages at this time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sortedUpdates.map((upd) => (
                  <div
                    key={upd.id}
                    onClick={() => handleRowClick(upd)}
                    className={`group p-4 flex gap-3 cursor-pointer transition-colors duration-150 ${
                      upd.isUnread ? 'bg-emerald-50/30 hover:bg-emerald-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="pt-1.5 shrink-0">
                      {upd.isUnread ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-100" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`text-xs truncate ${upd.isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {upd.sender || upd.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap shrink-0">
                          {upd.timestamp || 'Just now'}
                        </span>
                      </div>
                      
                      <h4 className={`text-xs truncate mb-1 ${upd.isUnread ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                        {upd.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {upd.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center justify-center">
                      <button
                        onClick={(e) => handleDeleteOne(e, upd.id)}
                        className="p-1.5 rounded text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

export default CitizenNotificationPopover;
