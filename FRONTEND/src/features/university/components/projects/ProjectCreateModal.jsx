import React, { useState } from 'react';
import { X, Loader2, PlusCircle, Calculator } from 'lucide-react';

export const ProjectCreateModal = ({ isOpen, onClose, onSave, facultyList = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Water',
    challengeId: 'CHL-1024',
    leadMentor: facultyList[0]?.name || 'Dr. Priya Sharma',
    studentTeam: 'Aqua Sentinel Innovators',
    deadline: '30 Dec 2026',
    problemStatement: '',
    status: 'In Progress'
  });

  const [hardwareCost, setHardwareCost] = useState(35000);
  const [fabCost, setFabCost] = useState(20000);
  const [fieldCost, setFieldCost] = useState(12000);
  const [overheadCost, setOverheadCost] = useState(8000);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const totalCalculatedBudget = Number(hardwareCost) + Number(fabCost) + Number(fieldCost) + Number(overheadCost);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      ...formData,
      budget: `₹ ${totalCalculatedBudget.toLocaleString('en-IN')}`,
      budgetBreakdown: [
        { category: 'Hardware & Microcontrollers', amount: `₹ ${Number(hardwareCost).toLocaleString('en-IN')}` },
        { category: 'Lab & Prototype Fabrication', amount: `₹ ${Number(fabCost).toLocaleString('en-IN')}` },
        { category: 'Field Testing & Calibration', amount: `₹ ${Number(fieldCost).toLocaleString('en-IN')}` },
        { category: 'Institutional Overhead & Fellowship', amount: `₹ ${Number(overheadCost).toLocaleString('en-IN')}` }
      ]
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 select-none backdrop-blur-xs">
      <div className="bg-white border border-slate-200 w-full max-w-lg shadow-xl overflow-hidden rounded-none">
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Faculty Project & Budget Proposal</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs overflow-y-auto max-h-[80vh]">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Project Title *</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Smart Aqua IoT Water Quality Network"
              className="w-full p-2 border border-slate-200 text-xs focus:border-slate-900 focus:outline-none rounded-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Thematic Domain *</label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full p-2 border border-slate-200 text-xs focus:border-slate-900 focus:outline-none rounded-none"
              >
                <option value="Water">Water</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Environment">Environment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Energy">Energy</option>
                <option value="Agriculture">Agriculture</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Lead Faculty Mentor *</label>
              <input
                type="text"
                value={formData.leadMentor}
                onChange={(e) => setFormData({ ...formData, leadMentor: e.target.value })}
                className="w-full p-2 border border-slate-200 text-xs focus:border-slate-900 focus:outline-none rounded-none"
              />
            </div>
          </div>

          {/* Line-Item Budget Section */}
          <div className="p-3 bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase text-[10.5px] flex items-center space-x-1">
                <Calculator className="w-3.5 h-3.5 text-blue-600" />
                <span>Faculty Line-Item Budget Estimation</span>
              </span>
              <span className="font-mono font-black text-blue-700">₹ {totalCalculatedBudget.toLocaleString('en-IN')} Total</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block">Hardware / Sensors (₹)</span>
                <input
                  type="number"
                  value={hardwareCost}
                  onChange={(e) => setHardwareCost(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Lab Prototype (₹)</span>
                <input
                  type="number"
                  value={fabCost}
                  onChange={(e) => setFabCost(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Field Pilots / Testing (₹)</span>
                <input
                  type="number"
                  value={fieldCost}
                  onChange={(e) => setFieldCost(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 font-mono text-xs"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Institutional Overhead (₹)</span>
                <input
                  type="number"
                  value={overheadCost}
                  onChange={(e) => setOverheadCost(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Problem Statement & Scope</label>
            <textarea
              rows={2}
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              placeholder="Describe technical research scope and expected field deliverables..."
              className="w-full p-2 border border-slate-200 text-xs focus:border-slate-900 focus:outline-none rounded-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer rounded-none">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs rounded-none"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>{loading ? 'Submitting...' : 'Submit Proposal for Grant'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreateModal;
