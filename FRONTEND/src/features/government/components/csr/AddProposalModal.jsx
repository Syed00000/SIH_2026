import React, { useState } from 'react';
import { X, Plus, FileSpreadsheet, Building2, ShieldCheck } from 'lucide-react';

export const AddProposalModal = ({ isOpen, onClose, onAddProposal }) => {
  const [form, setForm] = useState({
    id: `PROP-0${Math.floor(10 + Math.random() * 90)}`,
    institutionName: '',
    projectTitle: '',
    district: 'Ranchi',
    sourceScheme: 'Corporate CSR (Tata)',
    donor: 'Tata Steel CSR Foundation',
    dueDiligence: 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: 'Approved (A-Grade)',
    mouExecution: 'Signed & Active',
    allocatedAmount: '₹3.50 Cr',
    disbursedToDate: '₹0.00 Cr',
    csr1Number: 'CSR000' + Math.floor(10000 + Math.random() * 90000),
    pan80G: '80G-VALIDATED',
    leadSpoc: '',
    feasibilityScore: '90/100',
    totalTranches: 3,
    currentTranche: 1,
    remarks: 'New CSR / Government Grant proposal registered in pipeline.'
  });

  if (!isOpen) return null;

  const handleSchemeChange = (scheme) => {
    let donor = 'Tata Steel CSR Foundation';
    if (scheme.includes('ONGC')) donor = 'ONGC CSR Directorate';
    if (scheme.includes('BCCL')) donor = 'BCCL / Coal India CSR';
    if (scheme.includes('Govt')) donor = 'Mukhyamantri Takniki Protsahan Yojna';
    if (scheme.includes('Joint')) donor = 'CCL + State Joint R&D Hub';

    setForm({
      ...form,
      sourceScheme: scheme,
      donor: donor
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.institutionName.trim()) {
      alert('Please enter institution / university name');
      return;
    }
    if (!form.projectTitle.trim()) {
      alert('Please enter project title');
      return;
    }

    onAddProposal(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Register New Proposal & Grant Entry</h3>
              <p className="text-[11px] text-slate-500 font-medium">Add CSR / State Grant proposal under Section 135 & Schedule VII</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Proposal Code *</label>
              <input
                type="text"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Sanctioned Budget *</label>
              <input
                type="text"
                placeholder="e.g. ₹4.50 Cr"
                value={form.allocatedAmount}
                onChange={(e) => setForm({ ...form, allocatedAmount: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Beneficiary University / HEI Name *</label>
            <input
              type="text"
              placeholder="e.g. BIT Mesra (Innovation Hub)"
              value={form.institutionName}
              onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project Scope & Innovation Title *</label>
            <input
              type="text"
              placeholder="e.g. Solar-Powered Smart Water Purifiers for Rural Blocks"
              value={form.projectTitle}
              onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">District Location</label>
              <select
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                <option value="Ranchi">Ranchi</option>
                <option value="East Singhbhum">East Singhbhum</option>
                <option value="Dhanbad">Dhanbad</option>
                <option value="Bokaro">Bokaro</option>
                <option value="Hazaribagh">Hazaribagh</option>
                <option value="Dumka">Dumka</option>
                <option value="West Singhbhum">West Singhbhum</option>
                <option value="Palamu">Palamu</option>
                <option value="Deoghar">Deoghar</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Source & Scheme</label>
              <select
                value={form.sourceScheme}
                onChange={(e) => handleSchemeChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
              >
                <option value="Corporate CSR (Tata)">Corporate CSR (Tata)</option>
                <option value="Corporate CSR (ONGC)">Corporate CSR (ONGC)</option>
                <option value="Corporate CSR (BCCL)">Corporate CSR (BCCL)</option>
                <option value="Govt Grant (State)">Govt Grant (State)</option>
                <option value="Joint (CCL + State)">Joint (CCL + State)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">MCA CSR-1 Registration No.</label>
              <input
                type="text"
                value={form.csr1Number}
                onChange={(e) => setForm({ ...form, csr1Number: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Lead Research SPOC</label>
              <input
                type="text"
                placeholder="e.g. Dr. Amitabh Verma"
                value={form.leadSpoc}
                onChange={(e) => setForm({ ...form, leadSpoc: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Due Diligence Status</label>
              <select
                value={form.dueDiligence}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dueDiligence: e.target.value,
                    dueDiligenceStatus: e.target.value.includes('Passed') ? 'passed' : 'review'
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
              >
                <option value="Passed (All Checks)">Passed (All Checks)</option>
                <option value="Under Technical Review">Under Technical Review</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Board Sanction Status</label>
              <select
                value={form.boardApproval}
                onChange={(e) => setForm({ ...form, boardApproval: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
              >
                <option value="Approved (A-Grade)">Approved (A-Grade)</option>
                <option value="Sanctioned Board">Sanctioned Board</option>
                <option value="Pending Meeting">Pending Meeting</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProposalModal;
