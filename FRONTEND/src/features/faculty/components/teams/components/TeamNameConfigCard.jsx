import React from 'react';
import { Edit3 } from 'lucide-react';
import { PRESET_TEAM_NAMES } from '../presets/teamPresets.js';

export const TeamNameConfigCard = ({ teamName, setTeamName }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200">
            <Edit3 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900">Student Team Name / Innovation Lab Title</h3>
            <span className="text-[10px] text-slate-500">Official team identity for University & Government records</span>
          </div>
        </div>
      </div>

      <div>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="e.g. Smart Aqua Innovators, Team Urja 2026"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
        />
      </div>

      {/* Preset Team Name Chips */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Quick Preset Ideas:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TEAM_NAMES.map((name, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTeamName(name)}
              className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamNameConfigCard;
