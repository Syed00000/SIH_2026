import React, { useState, useEffect } from 'react';
import { Bell, BellOff, ChevronRight, Clock, Trash2, X, AlertTriangle } from 'lucide-react';
import { citizenService } from '../services/citizenService.js';

export const CitizenUpdates = ({ onSelectChallenge }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const data = await citizenService.fetchUpdates();
        setUpdates(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  const handleConfirmDeleteAll = () => {
    setUpdates([]);
    setIsConfirmModalOpen(false);
  };

  const handleDeleteOne = (e, id) => {
    e.stopPropagation();
    setUpdates((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-4 text-left pb-6 animate-fadeIn relative">
      {/* Header Bar with Delete All CTA */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Notifications & Alerts
            </h2>
            {updates.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {updates.length}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Official milestone updates, approvals, and citizen alerts
          </p>
        </div>

        {updates.length > 0 && (
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
            title="Delete all notifications"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All</span>
          </button>
        )}
      </div>

      {/* Notifications List or Empty State */}
      {updates.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200/60">
            <BellOff className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">No Notifications</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              You are all caught up! There are no active notifications at this time.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((upd) => (
            <div
              key={upd.id}
              onClick={() => {
                if (upd.challengeId && onSelectChallenge) {
                  onSelectChallenge({ challengeId: upd.challengeId });
                }
              }}
              className={`group p-4 rounded-xl bg-white border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs space-y-2 text-left relative ${
                upd.isUnread
                  ? 'border-emerald-300 ring-1 ring-emerald-500/10'
                  : 'border-slate-200/90 hover:border-emerald-300'
              }`}
            >
              {/* Header inside item */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200/80">
                    {upd.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {upd.timestamp}
                  </span>
                </div>

                {/* Individual Delete Button */}
                <button
                  onClick={(e) => handleDeleteOne(e, upd.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
                  title="Delete this notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Body */}
              <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-900 transition-colors">
                {upd.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {upd.description}
              </p>

              {upd.challengeId && (
                <div className="pt-1 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>View Challenge {upd.challengeId}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">
                Clear All Notifications?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Are you sure you want to delete all notifications? This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenUpdates;
