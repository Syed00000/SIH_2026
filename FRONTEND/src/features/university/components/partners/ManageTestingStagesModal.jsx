import React, { useState } from 'react';
import { X, FlaskConical, Plus, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const ManageTestingStagesModal = ({ isOpen, onClose, request, onStagesUpdated }) => {
  if (!isOpen || !request) return null;

  const defaultStages = [
    { stageNumber: 1, title: 'Sample Intake & Equipment Calibration', description: 'Validation and baseline spectrometer calibration.', expectedDays: '5 Days', status: 'In Progress', notes: '' },
    { stageNumber: 2, title: 'Core Material & Sensor Stress Testing', description: 'Thermal variance testing and real-time sensor metric validation.', expectedDays: '10 Days', status: 'Pending', notes: '' },
    { stageNumber: 3, title: 'Final Compliance & Certified Lab Report', description: 'Issuing formal compliance certificate and laboratory dossier.', expectedDays: '7 Days', status: 'Pending', notes: '' }
  ];

  const [stages, setStages] = useState(request.testingStages?.length ? request.testingStages : defaultStages);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDays, setNewDays] = useState('7 Days');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddStage = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setStages([...stages, {
      stageNumber: stages.length + 1,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Laboratory test procedure and technical evaluation.',
      expectedDays: newDays.trim() || '7 Days',
      status: 'Pending',
      notes: ''
    }]);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteStage = (index) => {
    setStages(stages.filter((_, i) => i !== index).map((s, idx) => ({ ...s, stageNumber: idx + 1 })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const reqId = request.requestId || request.id;
      await universityApiService.updateIndustryRequestStatus(reqId, 'Approved', 'RU001', { testingStages: stages });
      onStagesUpdated && onStagesUpdated(reqId, stages);
      onClose();
    } catch (err) {
      console.error('Failed to save testing stages:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#004D3D] via-[#007A61] to-[#004D3D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-emerald-200">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">University Testing Protocol</span>
              <h2 className="text-sm font-black text-white">Define Research Lab Testing Stages</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Strip */}
        <div className="px-6 py-2 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 truncate">Project: {request.projectTitle}</span>
          <span className="text-[#007A61] font-extrabold flex items-center space-x-1 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Partner: {request.partnerName}</span>
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fafafa]">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
              <span>Current Testing Stages ({stages.length})</span>
              <span className="text-slate-400 font-normal normal-case">Syncs with Industry Lab</span>
            </div>
            {stages.map((stage, idx) => (
              <div key={idx} className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#007A61] text-[10px] font-black uppercase">
                      Stage {stage.stageNumber}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800">{stage.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{stage.expectedDays || '7 Days'}</span>
                    <button type="button" onClick={() => handleDeleteStage(idx)} className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium pl-1">{stage.description}</p>
                {stage.notes && (
                  <p className="text-[10.5px] text-emerald-800 italic bg-emerald-50 p-1.5 rounded border border-emerald-100">
                    Lab Observation: {stage.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Add Form */}
          <form onSubmit={handleAddStage} className="p-3.5 bg-white border border-dashed border-emerald-300 rounded-2xl space-y-2.5 shadow-2xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#007A61] flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Next Testing Milestone Stage</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Stage title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="sm:col-span-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 10 Days)"
                value={newDays}
                onChange={(e) => setNewDays(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Specify requirements, apparatus needed, and validation parameters..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stage to Protocol</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Saving Protocol...' : 'Save & Push to Industry Lab'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTestingStagesModal;
