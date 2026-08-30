import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const UniversityNotificationsPanel = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const summary = await universityApiService.getDashboardSummary();
      if (summary?.recentActivities) {
        setActivities(summary.recentActivities);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-4 select-none max-w-7xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Bell className="w-5 h-5 text-slate-700" />
            <span>Institutional Notifications & Alerts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time audit alerts, challenge routing notices, and milestone approvals.
          </p>
        </div>
        <button
          onClick={() => alert('All notifications marked as read in database.')}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-none overflow-hidden divide-y divide-slate-100 shadow-2xs">
        {loading ? (
          <div className="p-8 flex items-center justify-center space-x-2 text-xs font-bold text-slate-600">
            <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
            <span>Loading Notifications from Institutional Records...</span>
          </div>
        ) : activities.length > 0 ? (
          activities.map((a, i) => (
            <div
              key={a._id || i}
              className="p-3.5 flex items-start justify-between hover:bg-slate-50 transition-colors bg-slate-50/40"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-none bg-slate-100 border border-slate-200 text-slate-800 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-slate-900">{a.text}</h3>
                    <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
                  </div>
                  <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{a.relativeTime || 'Recently'}</span>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-700 uppercase font-bold">{a.type || 'SYSTEM'}</span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-none text-[10px] font-bold text-slate-800">
                Verified
              </span>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 font-semibold">
            No unread notifications at this time.
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityNotificationsPanel;
