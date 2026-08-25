import React, { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';

export const PriorityEscalationCard = ({ selectedIssue }) => {
  const [priorityLevel, setPriorityLevel] = useState('Critical');
  const [remarks, setRemarks] = useState(
    'Potential public health risk. Immediate inspection required.'
  );
  const [isEscalated, setIsEscalated] = useState(false);

  const priorityOptions = [
    { id: 'Normal', label: 'Normal', color: 'border-slate-200 text-slate-700' },
    { id: 'High', label: 'High', color: 'border-amber-300 text-amber-700' },
    { id: 'Urgent', label: 'Urgent', color: 'border-orange-400 text-orange-800' },
    { id: 'Critical', label: 'Critical', color: 'border-red-500 text-red-700 bg-red-50' }
  ];

  const handleEscalate = (e) => {
    e.preventDefault();
    setIsEscalated(true);
    setTimeout(() => setIsEscalated(false), 3000);
  };

  const handleCancel = () => {
    setPriorityLevel('Normal');
    setRemarks('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-900 text-sm pb-2.5 border-b border-slate-100 mb-3">
          4. Priority Escalation
        </h3>

        {/* Issue ID and Current Priority */}
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
              Current Priority
            </span>
            <span className="inline-flex px-2 py-0.5 mt-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
              Normal
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleEscalate} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              Select Priority Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {priorityOptions.map((opt) => {
                const isSelected = priorityLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPriorityLevel(opt.id)}
                    className={`flex items-center justify-center space-x-1.5 py-1.5 px-1 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? opt.id === 'Critical'
                          ? 'border-red-500 bg-red-50 text-red-700 shadow-2xs'
                          : 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected
                          ? opt.id === 'Critical'
                            ? 'bg-red-500'
                            : 'bg-white'
                          : 'bg-slate-300'
                      }`}
                    />
                    <span className="text-[11px]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Escalation Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter reasons for high-priority routing..."
              className="w-full border border-slate-200 rounded-md p-2 text-xs text-slate-700 outline-none resize-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 placeholder:text-slate-400"
            />
          </div>

          {isEscalated && (
            <div className="flex items-center text-red-700 text-xs font-semibold bg-red-50 p-2 rounded border border-red-200">
              <Check className="w-3.5 h-3.5 mr-1 text-red-600" />
              Priority escalated to {priorityLevel}. District team notified!
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
              className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              Escalate Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriorityEscalationCard;
