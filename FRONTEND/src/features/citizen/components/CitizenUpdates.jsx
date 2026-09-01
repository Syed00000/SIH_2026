import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellOff, 
  ChevronRight, 
  Clock, 
  Trash2, 
  RefreshCw
} from 'lucide-react';
import { citizenService } from '../services/citizenService.js';

export const CitizenUpdates = ({ onSelectChallenge, user, onUnreadCountChange }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const getStorageKey = () => `citizen_notifications_${user?._id || user?.id || 'default_citizen'}`;

  // Initial load: fetch from API, or fallback to saved localStorage, or seed initial alerts
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      const storageKey = getStorageKey();
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUpdates(parsed);
          if (onUnreadCountChange) {
            onUnreadCountChange(parsed.filter((n) => n.isUnread).length);
          }
          setLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing stored notifications:', e);
        }
      }

      try {
        const apiData = await citizenService.fetchUpdates();
        if (Array.isArray(apiData) && apiData.length > 0) {
          setUpdates(apiData);
          localStorage.setItem(storageKey, JSON.stringify(apiData));
          if (onUnreadCountChange) {
            onUnreadCountChange(apiData.filter((n) => n.isUnread).length);
          }
        } else {
          // 2 Original Citizen Notifications
          const seeded = [
            {
              id: 'notif-1',
              sender: 'Triage Cell',
              title: 'Under Review: CHL-JH-2026-8806',
              description: 'Your challenge statement has been assigned to the State Nodal Officer for review.',
              category: 'Triage',
              timestamp: 'Just now',
              isUnread: true,
              challengeId: 'CHL-JH-2026-8806'
            },
            {
              id: 'notif-2',
              sender: 'BIT Sindri Lab',
              title: 'University R&D Matched',
              description: 'Environmental Engineering Lab matched with your problem statement for prototype testing.',
              category: 'University',
              timestamp: '15m ago',
              isUnread: true,
              challengeId: 'CHL-JH-2026-8806'
            }
          ];
          setUpdates(seeded);
          localStorage.setItem(storageKey, JSON.stringify(seeded));
          if (onUnreadCountChange) {
            onUnreadCountChange(seeded.filter((n) => n.isUnread).length);
          }
        }
      } catch (e) {
        console.error('Error loading notifications:', e);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  // Persist notifications updates
  const saveAndSync = (newList) => {
    setUpdates(newList);
    localStorage.setItem(getStorageKey(), JSON.stringify(newList));
    if (onUnreadCountChange) {
      onUnreadCountChange(newList.filter((n) => n.isUnread).length);
    }
  };

  // Delete all notifications
  const handleConfirmDeleteAll = () => {
    saveAndSync([]);
    setIsConfirmModalOpen(false);
  };

  // Delete single notification
  const handleDeleteOne = (id) => {
    const updated = updates.filter((u) => u.id !== id);
    saveAndSync(updated);
  };

  // Toggle single item read status on click
  const handleRowClick = (upd) => {
    if (upd.isUnread) {
      const updated = updates.map((u) => u.id === upd.id ? { ...u, isUnread: false } : u);
      saveAndSync(updated);
    }
    if (upd.challengeId && onSelectChallenge) {
      onSelectChallenge({ challengeId: upd.challengeId });
    }
  };

  // Refresh notifications with spin loading
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const apiData = await citizenService.fetchUpdates();
      if (Array.isArray(apiData) && apiData.length > 0) {
        saveAndSync(apiData);
      } else {
        const fresh = [
          {
            id: 'notif-1',
            sender: 'Triage Cell',
            title: 'Under Review: CHL-JH-2026-8806',
            description: 'Your challenge statement has been assigned to the State Nodal Officer for review.',
            category: 'Triage',
            timestamp: 'Just now',
            isUnread: true,
            challengeId: 'CHL-JH-2026-8806'
          },
          {
            id: 'notif-2',
            sender: 'BIT Sindri Lab',
            title: 'University R&D Matched',
            description: 'Environmental Engineering Lab matched with your problem statement for prototype testing.',
            category: 'University',
            timestamp: '15m ago',
            isUnread: true,
            challengeId: 'CHL-JH-2026-8806'
          }
        ];
        saveAndSync(fresh);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 550);
    }
  };

  const unreadCount = updates.filter((u) => u.isUnread).length;

  return (
    <div className="text-left pb-6 animate-in fade-in duration-200 relative max-w-3xl mx-auto px-1">
      {/* 1. Seamless Header Bar */}
      <div className="flex items-center justify-between py-2.5 px-1 border-b border-slate-200/80 mb-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Notifications
          </h2>
          {!isRefreshing && !loading && updates.length > 0 && (
            <span className="text-xs font-semibold text-slate-400">
              ({updates.length})
            </span>
          )}
          {!isRefreshing && !loading && unreadCount > 0 && (
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center space-x-1 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              <span>{unreadCount} unread</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-all cursor-pointer disabled:opacity-60"
            title="Refresh notifications"
          >
            <span className={`inline-flex items-center justify-center w-3.5 h-3.5 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`}>
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <span>Refresh</span>
          </button>

          {!isRefreshing && !loading && updates.length > 0 && (
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold transition-all cursor-pointer"
              title="Clear all notifications"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Centered Background Spin Loading State */}
      {isRefreshing || loading ? (
        <div className="py-14 flex flex-col items-center justify-center space-y-3 animate-fadeIn select-none">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400 tracking-wide">
            Checking for updates...
          </span>
        </div>
      ) : updates.length === 0 ? (
        /* 3. Original Clean Empty State */
        <div className="py-12 text-center space-y-3">
          <div className="flex items-center justify-center mx-auto">
            <BellOff className="w-8 h-8 text-slate-300 stroke-[1.5]" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-800">No Notifications</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              You are all caught up! There are no active notifications at this time.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {updates.map((upd) => (
              <motion.div
                key={upd.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ 
                  opacity: 0, 
                  height: 0, 
                  marginBottom: 0,
                  transition: { duration: 0.2, ease: "easeOut" } 
                }}
                className="relative overflow-hidden rounded-xl group border border-slate-200/70 shadow-2xs"
              >
                {/* Background Red Swipe Reveal Layer */}
                <div className="absolute inset-0 z-0 bg-rose-50 rounded-xl flex items-center px-4 justify-start text-rose-600 font-semibold text-xs select-none">
                  <div className="flex items-center space-x-1.5">
                    <Trash2 className="w-4 h-4" />
                    <span>Swipe to Delete</span>
                  </div>
                </div>

                {/* Foreground Email Row */}
                <motion.div
                  drag="x"
                  dragDirectionLock
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={{ left: 0.05, right: 0.8 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x > 90 || info.velocity.x > 300) {
                      handleDeleteOne(upd.id);
                    }
                  }}
                  onClick={() => handleRowClick(upd)}
                  className={`relative z-10 bg-white py-2.5 px-3 sm:px-4 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 select-none ${
                    upd.isUnread
                      ? 'hover:bg-slate-50 text-slate-900 font-medium'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {/* Left: Unread Dot + Sender + Snippet */}
                  <div className="flex items-start sm:items-center space-x-2.5 min-w-0 flex-1">
                    {/* Unread Indicator Dot */}
                    <div className="pt-1 sm:pt-0 shrink-0">
                      {upd.isUnread ? (
                        <span className="w-2 h-2 rounded-full bg-[#007A61] inline-block ring-2 ring-emerald-100" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-transparent inline-block" />
                      )}
                    </div>

                    {/* Content Column: Sender, Subject and Inline Snippet */}
                    <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                      <span className={`text-xs shrink-0 ${
                        upd.isUnread 
                          ? 'font-bold text-slate-900' 
                          : 'font-semibold text-slate-600'
                      }`}>
                        {upd.sender || upd.category}
                      </span>

                      <div className="min-w-0 flex-1 truncate text-xs">
                        <span className={`${
                          upd.isUnread 
                            ? 'font-bold text-slate-900' 
                            : 'font-normal text-slate-600'
                        }`}>
                          {upd.title}
                        </span>
                        <span className="text-slate-400 font-normal ml-1.5 hidden md:inline truncate">
                          — {upd.description}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Timestamp & Hover Action */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                      {upd.timestamp}
                    </span>

                    {/* Email Hover Delete Action */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOne(upd.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 3. Confirmation Modal for Clear All */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xs p-5 space-y-3.5 text-center animate-in zoom-in-95 duration-150">
            {/* Clean Delete Icon without background box */}
            <div className="flex items-center justify-center mx-auto pt-1">
              <Trash2 className="w-7 h-7 text-rose-600 stroke-[1.75]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Clear All Notifications?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[220px] mx-auto">
                Are you sure you want to delete all notifications?
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="flex-1 py-2 px-3 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 text-xs font-semibold transition-all duration-150 shadow-2xs cursor-pointer active:scale-95"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenUpdates;
