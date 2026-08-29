import React, { useState, useEffect } from 'react';
import { Megaphone, Bell, CheckCircle2, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { citizenService } from '../services/citizenService.js';

export const CitizenUpdates = ({ onSelectChallenge }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-4 text-left pb-20">
      <div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Portal Updates & Announcements
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Official responses, grant allocations, and milestone notifications
        </p>
      </div>

      <div className="space-y-3">
        {updates.map((upd) => (
          <div
            key={upd.id}
            onClick={() => {
              if (upd.challengeId && onSelectChallenge) {
                onSelectChallenge({ challengeId: upd.challengeId });
              }
            }}
            className={`p-3.5 rounded-2xl bg-white border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs space-y-2 ${
              upd.isUnread ? 'border-emerald-200 ring-1 ring-emerald-500/10' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                {upd.category}
              </span>
              <span className="text-[10px] text-slate-400 font-medium flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {upd.timestamp}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              {upd.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {upd.description}
            </p>

            {upd.challengeId && (
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                <span>View Challenge {upd.challengeId}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitizenUpdates;
