import React from 'react';
import {
  GraduationCap,
  Save,
  Loader2,
  Crown,
  Trash2
} from 'lucide-react';

export const TeamRosterList = ({
  teamName,
  teamMembers = [],
  faculty,
  saving,
  savedSuccess,
  onSaveTeam,
  onToggleLead,
  onRemoveMember
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-extrabold text-slate-900">
            Student Researcher Roster ({teamMembers.length} Members)
          </h3>
          <span className="text-[10px] text-slate-500">
            Team: <strong>{teamName || 'Research Team'}</strong> • Lead: {faculty?.name}
          </span>
        </div>
        <button
          type="button"
          onClick={onSaveTeam}
          disabled={saving}
          className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{savedSuccess ? 'Team Saved to University!' : 'Save Team Roster'}</span>
        </button>
      </div>

      {teamMembers.length === 0 ? (
        <div className="py-8 text-center text-slate-400 space-y-1">
          <GraduationCap className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">No student researchers added yet.</p>
          <p className="text-[11px]">Use the form below to recruit student innovators into this R&D team.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {teamMembers.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between shadow-2xs transition-all ${
                m.isLead
                  ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300/60'
                  : 'bg-slate-50 border-slate-200/80'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border ${
                    m.isLead
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {m.isLead ? <Crown className="w-4 h-4 text-amber-700" /> : m.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-xs truncate">{m.name}</span>
                    {m.isLead && (
                      <span className="text-[9.5px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                        Team Lead
                      </span>
                    )}
                    <span className="text-[9.5px] font-mono bg-white border border-slate-200 px-1 rounded text-slate-500">
                      {m.rollNo}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 truncate">
                    {m.role} • {m.department} ({m.year})
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => onToggleLead(idx)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    m.isLead
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-800'
                  }`}
                >
                  {m.isLead ? 'Lead' : 'Set Lead'}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveMember(idx)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamRosterList;
