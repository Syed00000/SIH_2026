import React, { useState, useEffect } from 'react';
import { X, Share2 } from 'lucide-react';
import { industryTechService } from '../../services/industryTechService.js';
import { PrototypePreviewCard } from './PrototypePreviewCard.jsx';

export const GrantTechAccessModal = ({
  isOpen, onClose, onSuccess, initialTool, tools = [], eligibleProblems = []
}) => {
  const [selectedToolId, setSelectedToolId] = useState(initialTool?.toolId || '');
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [credentials, setCredentials] = useState('');
  const [validity, setValidity] = useState('1 Year Active R&D');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTool?.toolId) setSelectedToolId(initialTool.toolId);
    else if (tools.length > 0 && !selectedToolId) setSelectedToolId(tools[0].toolId);
    if (eligibleProblems.length > 0 && !selectedProblemId) {
      setSelectedProblemId(eligibleProblems[0].projectId);
    }
    setCredentials(`TECH-${Date.now().toString().slice(-6)}-KEY`);
  }, [initialTool, tools, eligibleProblems, isOpen]);

  if (!isOpen) return null;

  const currentTool = tools.find((t) => t.toolId === selectedToolId) || initialTool;
  const currentProblem = eligibleProblems.find((p) => p.projectId === selectedProblemId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentTool || !currentProblem) return;

    try {
      setLoading(true);
      await industryTechService.grantTechHelp(currentTool.toolId, {
        projectId: currentProblem.projectId,
        challengeId: currentProblem.challengeId || '',
        projectTitle: currentProblem.title,
        universityCode: 'RU001',
        studentTeam: currentProblem.studentTeam,
        accessCredentials: credentials,
        validity,
        notes: notes || `Technical tool ${currentTool.name} provisioned for ${currentProblem.title}.`
      });

      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to grant tech tool access:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#007A61] text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Grant Tech Access & Assistance</h3>
              <p className="text-[11px] text-slate-500 font-medium">Allocate industry tech tools to university prototype blueprints</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white/80 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[78vh] overflow-y-auto">
          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Select Industry Tech Tool / IP</label>
            <select
              value={selectedToolId}
              onChange={(e) => setSelectedToolId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            >
              {tools.map((t) => (
                <option key={t.toolId} value={t.toolId}>
                  [{t.category}] {t.name} ({t.version}) - {t.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Target University Prototype / Problem Statement</label>
            {eligibleProblems.length === 0 ? (
              <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                No submitted prototypes found. Student teams must submit their blueprints first.
              </p>
            ) : (
              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              >
                {eligibleProblems.map((p) => (
                  <option key={p.projectId} value={p.projectId}>
                    [{p.projectId}] {p.title} ({p.studentTeam})
                  </option>
                ))}
              </select>
            )}
          </div>

          <PrototypePreviewCard problem={currentProblem} tool={currentTool} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Access Key / Credentials</label>
              <input
                type="text"
                required
                value={credentials}
                onChange={(e) => setCredentials(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Grant Validity</label>
              <select
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              >
                <option value="6 Months R&D">6 Months R&D</option>
                <option value="1 Year Active R&D">1 Year Active R&D</option>
                <option value="Full Project Lifecycle (2 Years)">Full Project Lifecycle (2 Years)</option>
                <option value="Perpetual Academic License">Perpetual Academic License</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Technical Assistance & Provisioning Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Granted API quota with dedicated technical assistance from our senior lab engineer."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !currentProblem}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#00604c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{loading ? 'Dispatching...' : 'Grant Tech Help to University'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrantTechAccessModal;
