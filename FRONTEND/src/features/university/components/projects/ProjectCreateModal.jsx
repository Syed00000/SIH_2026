import React, { useState } from 'react';
import { X, Loader2, PlusCircle, Calculator } from 'lucide-react';

export const ProjectCreateModal = ({ isOpen, onClose, onSave, facultyList = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Water',
    challengeId: '',
    leadMentor: facultyList[0]?.name || '',
    studentTeam: '',
    deadline: 'N/A',
    problemStatement: '',
    status: 'Proposal Stage'
  });

  const [hardwareCost, setHardwareCost] = useState(0);
  const [fabCost, setFabCost] = useState(0);
  const [fieldCost, setFieldCost] = useState(0);
  const [overheadCost, setOverheadCost] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const totalCalculatedBudget = Number(hardwareCost) + Number(fabCost) + Number(fieldCost) + Number(overheadCost);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      ...formData,
      budget: totalCalculatedBudget > 0 ? `₹ ${totalCalculatedBudget.toLocaleString('en-IN')}` : 'N/A',
      budgetStatus: 'Pending University Approval',
      budgetBreakdown: totalCalculatedBudget > 0 ? [
        { category: 'Hardware & Microcontrollers', amount: `₹ ${Number(hardwareCost).toLocaleString('en-IN')}` },
        { category: 'Lab & Prototype Fabrication', amount: `₹ ${Number(fabCost).toLocaleString('en-IN')}` },
        { category: 'Field Testing & Calibration', amount: `₹ ${Number(fieldCost).toLocaleString('en-IN')}` },
        { category: 'Institutional Overhead & Fellowship', amount: `₹ ${Number(overheadCost).toLocaleString('en-IN')}` }
      ] : []
    });
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200 shadow-2xs">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Faculty Project & Budget Proposal</h2>
              <span className="text-[10px] text-slate-400">Initialize R&D workspace proposal</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto custom-scrollbar flex-1">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Project Title *</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Grassroots Fluoride Filtration Sensor Network"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Thematic Domain *</label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
              >
                <option value="Water">Water & Sanitation</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Environment">Environment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Energy">Energy</option>
                <option value="Agriculture">Agriculture</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Lead Faculty Mentor</label>
              <input
                type="text"
                value={formData.leadMentor}
                onChange={(e) => setFormData({ ...formData, leadMentor: e.target.value })}
                placeholder="e.g. Dr. Binod Kumar (or Unassigned)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Problem Statement & Scope</label>
            <textarea
              rows={2}
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              placeholder="Describe problem scoping, target parameters, and proposed methodology..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Line-Item Budget Section */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 uppercase text-[10.5px] flex items-center space-x-1.5">
                <Calculator className="w-3.5 h-3.5 text-[#007A61]" />
                <span>Proposed Budget Breakdown (Optional)</span>
              </span>
              <span className="font-extrabold font-mono text-[#007A61] text-xs">
                Total: ₹ {totalCalculatedBudget.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 font-medium block mb-0.5">Hardware & Components</span>
                <input
                  type="number"
                  min="0"
                  value={hardwareCost}
                  onChange={(e) => setHardwareCost(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <span className="text-slate-500 font-medium block mb-0.5">Fabrication & Lab Consumables</span>
                <input
                  type="number"
                  min="0"
                  value={fabCost}
                  onChange={(e) => setFabCost(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <span className="text-slate-500 font-medium block mb-0.5">Field Trials & Logistics</span>
                <input
                  type="number"
                  min="0"
                  value={fieldCost}
                  onChange={(e) => setFieldCost(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <span className="text-slate-500 font-medium block mb-0.5">Overhead / Fellowship</span>
                <input
                  type="number"
                  min="0"
                  value={overheadCost}
                  onChange={(e) => setOverheadCost(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              <span>Initialize Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreateModal;
