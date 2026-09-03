import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, Clock, Loader2, ArrowLeft, Trash2, FileText, ChevronRight } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const UniversityNotificationsPanel = ({
  universityCode = 'RU001',
  onBack,
  onClearNotifications,
  onNavigateTab
}) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFirstLoad = useRef(true);

  const load = async () => {
    if (isFirstLoad.current) setLoading(true);
    try {
      const [summary, approvals] = await Promise.all([
        universityApiService.getDashboardSummary(universityCode),
        universityApiService.getApprovals(universityCode)
      ]);
      const actItems = summary?.recentActivities || [];
      const appItems = (Array.isArray(approvals) ? approvals : [])
        .filter((a) => a.status === 'Pending')
        .map((a) => ({
          _id: `app-${a.approvalId || a._id}`,
          text: `Proposal Submitted: "${a.project || 'Project'}" formulated by Faculty Mentor ${a.requestedBy || 'Faculty'}. Review and approve budget in Approvals.`,
          type: 'PROPOSAL_SUBMITTED',
          relativeTime: a.dateTime || a.date || 'Recent',
          isApproval: true,
          targetTab: 'approvals'
        }));
      const combined = [...appItems, ...actItems];
      setActivities((prev) => {
        const prevIds = prev.map((p) => p._id).join(',');
        const newIds = combined.map((m) => m._id).join(',');
        return prevIds === newIds ? prev : combined;
      });
    } catch {
      setActivities([]);
    } finally {
      if (isFirstLoad.current) {
        setLoading(false);
        isFirstLoad.current = false;
      }
    }
  };

  useEffect(() => { load(); }, [universityCode]);

  const handleClearAll = async () => {
    setActivities([]);
    await universityApiService.clearActivities(universityCode).catch(() => {});
    if (onClearNotifications) onClearNotifications();
  };

  return (
    <div className="flex flex-col h-full min-h-[550px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden select-none">
      <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex-shrink-0">
        <div className="flex items-center justify-between w-full">
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
                <h2 className="font-extrabold text-slate-900 text-sm leading-tight">Institutional Notifications Hub</h2>
                <p className="text-[10px] text-slate-500 font-medium">{activities.length} notifications from database</p>
              </div>
            </div>
          </div>
          {activities.length > 0 && (
            <button onClick={handleClearAll} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 w-full">
        {loading ? (
          <div className="p-12 flex items-center justify-center space-x-2 text-xs font-bold text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-[#007A61]" />
            <span>Loading records from database...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Bell className="w-8 h-8 opacity-30 mb-2" />
            <p className="font-semibold text-sm">No notifications found in database</p>
          </div>
        ) : (
          activities.map((a, idx) => (
            <div
              key={a._id || idx}
              onClick={() => { if (a.targetTab && onNavigateTab) onNavigateTab(a.targetTab); }}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${a.isApproval ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-50/80 cursor-pointer' : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${a.isApproval ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-[#007A61]'}`}>
                  {a.isApproval ? <FileText className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{a.text}</h3>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" />{a.relativeTime || 'Recently'}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-700 uppercase font-bold text-[10px]">{a.type || 'SYSTEM'}</span>
                  </div>
                </div>
              </div>
              {a.targetTab && (
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-[#007A61] bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-emerald-50">
                  Review <ChevronRight className="w-3 h-3" />
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UniversityNotificationsPanel;
