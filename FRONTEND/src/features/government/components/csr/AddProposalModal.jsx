import React, { useState } from 'react';
import { X, FileSpreadsheet } from 'lucide-react';

export const AddProposalModal = ({ isOpen, onClose, onAddProposal }) => {
  const [form, setForm] = useState({
    id: `PROP-0${Math.floor(10 + Math.random() * 90)}`,
    projectId: 'PRJ-101',
    projectTitle: 'Smart Dam Water Quality IoT',
    institutionName: '',
    sourceScheme: 'Corporate CSR (Tata)',
    dueDiligence: 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: 'Approved (A-Grade)',
    mouExecution: 'Signed & Active',
    allocatedAmount: '₹3.50 Cr',
    dprBudget: '₹18.50 Lakhs'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.institutionName.trim()) return alert('Please enter institution / requester name');
    onAddProposal(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add CSR Proposal Entry</h3>
              <p className="text-[11px] text-slate-500 font-medium">Link with Project DPR & Statutory Verification</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Proposal Code *</label>
              <input type="text" value={form.id} onChange={e => setForm({...form, id: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Allocated Grant *</label>
              <input type="text" placeholder="e.g. ₹4.50 Cr" value={form.allocatedAmount} onChange={e => setForm({...form, allocatedAmount: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Linked Project / Solution Title *</label>
            <input type="text" placeholder="e.g. Smart Dam Water IoT System" value={form.projectTitle} onChange={e => setForm({...form, projectTitle: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Institution / Requester Name *</label>
            <input type="text" placeholder="e.g. BIT Mesra (Innovation Hub)" value={form.institutionName} onChange={e => setForm({...form, institutionName: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Source & Scheme</label>
              <select value={form.sourceScheme} onChange={e => setForm({...form, sourceScheme: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                <option value="Corporate CSR (Tata)">Corporate CSR (Tata)</option>
                <option value="Corporate CSR (ONGC)">Corporate CSR (ONGC)</option>
                <option value="Govt Grant (State)">Govt Grant (State)</option>
                <option value="Joint (CCL + State)">Joint (CCL + State)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Due Diligence Status</label>
              <select value={form.dueDiligence} onChange={e => setForm({...form, dueDiligence: e.target.value, dueDiligenceStatus: e.target.value.includes('Passed') ? 'passed' : 'review'})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                <option value="Passed (All Checks)">Passed (All Checks)</option>
                <option value="Under Technical Review">Under Technical Review</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Board Committee</label>
              <select value={form.boardApproval} onChange={e => setForm({...form, boardApproval: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                <option value="Approved (A-Grade)">Approved (A-Grade)</option>
                <option value="Sanctioned Board">Sanctioned Board</option>
                <option value="Pending Meeting">Pending Meeting</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">MoU Execution</label>
              <select value={form.mouExecution} onChange={e => setForm({...form, mouExecution: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                <option value="Signed & Active">Signed & Active</option>
                <option value="Executed">Executed</option>
                <option value="Drafting Stage">Drafting Stage</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs">Add Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProposalModal;
