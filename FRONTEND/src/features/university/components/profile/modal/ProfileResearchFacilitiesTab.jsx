import React from 'react';
import { Plus, Trash2, FlaskConical, Sparkles } from 'lucide-react';

export const ProfileResearchFacilitiesTab = ({
  formData,
  newResearchArea,
  setNewResearchArea,
  handleAddResearchArea,
  handleRemoveResearchArea,
  newFacility,
  setNewFacility,
  handleAddFacility,
  handleRemoveFacility
}) => {
  return (
    <div className="space-y-6 text-xs">
      {/* Research Domains Section */}
      <div className="space-y-3">
        <form onSubmit={handleAddResearchArea} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Add Key Research Domain</label>
            <input
              type="text"
              placeholder="e.g. Quantum Computing & Cryptography"
              value={newResearchArea}
              onChange={(e) => setNewResearchArea(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {formData.researchAreas.map((area, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs"
            >
              <span>{area}</span>
              <button
                type="button"
                onClick={() => handleRemoveResearchArea(area)}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Facilities & Labs Section */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <form onSubmit={handleAddFacility} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Add Core Lab / Infrastructure</label>
            <input
              type="text"
              placeholder="e.g. Advanced Photonics & Drone Testing Facility"
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {formData.facilities.map((fac, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs"
            >
              <span>{fac}</span>
              <button
                type="button"
                onClick={() => handleRemoveFacility(fac)}
                className="text-emerald-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileResearchFacilitiesTab;
