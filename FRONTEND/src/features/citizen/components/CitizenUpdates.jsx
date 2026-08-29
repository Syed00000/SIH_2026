import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, Clock } from 'lucide-react';
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
    <div className="space-y-4 text-left pb-6 animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Portal Updates & Announcements
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
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
            className={`p-4 rounded-lg bg-white border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs space-y-2 text-left ${
              upd.isUnread ? 'border-emerald-300 ring-1 ring-emerald-500/10' : 'border-slate-200/90 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200/80">
                {upd.category}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {upd.timestamp}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug">
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
    </div>
  );
};

export default CitizenUpdates;
