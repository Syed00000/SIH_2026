import React, { useState, useEffect } from 'react';
import { Droplet, ChevronDown, Check } from 'lucide-react';

export const ManualOverrideCard = ({ selectedIssue, onApplyOverride }) => {
  const [targetDomain, setTargetDomain] = useState('Public Infrastructure');
  const [overrideReason, setOverrideReason] = useState(
    'Misclassified. This is actually a drainage infrastructure issue.'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (selectedIssue) {
      if (selectedIssue.domain === 'Water') {
        setTargetDomain('Public Infrastructure');
        setOverrideReason('Misclassified. This is actually a drainage infrastructure issue.');
      } else {
        setTargetDomain('Water Management');
        setOverrideReason('');
      }
    }
  }, [selectedIssue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onApplyOverride && selectedIssue) {
      onApplyOverride(selectedIssue.id, targetDomain, overrideReason);
    }
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleCancel = () => {
    setTargetDomain('Public Infrastructure');
    setOverrideReason('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-900 text-sm pb-2.5 border-b border-slate-100 mb-3">
          2. Manual Taxonomy Override
        </h3>

        {/* Issue & AI Predicted Domain Details */}
        <div className="flex items-center justify-between p-2.5 rounded-md bg-slate-50/80 border border-slate-100 mb-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Issue ID
            </span>
            <span className="font-extrabold text-slate-900 mt-0.5 block">
              {selectedIssue?.id || 'IS-2026-00521'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              AI Predicted Domain
            </span>
            <span className="inline-flex items-center px-2 py-0.5 mt-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
              <Droplet className="w-3 h-3 mr-1" />
              {selectedIssue?.domain || 'Water'}
            </span>
          </div>
        </div>

        {/* Override Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Select Correct Domain <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-md pl-3 pr-8 py-1.5 bg-white text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              >
                <option value="Public Infrastructure">Public Infrastructure</option>
                <option value="Water Management">Water Management</option>
                <option value="Agriculture & Farming">Agriculture & Farming</option>
                <option value="Public Health & Sanitation">Public Health & Sanitation</option>
                <option value="Education & Skills">Education & Skills</option>
                <option value="Rural Livelihoods">Rural Livelihoods</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Reason for Override (Optional)
            </label>
            <textarea
              rows={2}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="Provide justification for manual reclassification..."
              className="w-full border border-slate-200 rounded-md p-2 text-xs text-slate-700 outline-none resize-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 placeholder:text-slate-400"
            />
          </div>

          {isSuccess && (
            <div className="flex items-center text-emerald-700 text-xs font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
              <Check className="w-3.5 h-3.5 mr-1" />
              Taxonomy override applied successfully!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="border border-slate-200 rounded-md px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Apply Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualOverrideCard;
