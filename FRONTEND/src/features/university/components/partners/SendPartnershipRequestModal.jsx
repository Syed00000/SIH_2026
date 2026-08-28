import React, { useState } from 'react';
import { X, Send, Loader2, Check } from 'lucide-react';

export const SendPartnershipRequestModal = ({
  isOpen,
  onClose,
  partner,
  onSendSuccess
}) => {
  const [formData, setFormData] = useState({
    proposalTitle: 'R&D Lab Testing & Mentorship MoU Request',
    supportRequired: 'Funding + Technical Support',
    projectScope: 'Water Quality Telemetry Tele-Van & Smart Sensor R&D',
    estimatedGrant: '₹ 5.00 Lakhs',
    remarks: 'Dispatched via University Innovation Nodal Portal for corporate MoU signoff.'
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen || !partner) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onSendSuccess && onSendSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden rounded-none">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Send className="w-4 h-4 text-slate-900" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Send Partnership Proposal to {partner.name}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Partnership Proposal Dispatched!</h4>
            <p className="text-xs text-slate-500 font-medium">Official invitation sent to {partner.contactPerson?.email || 'corporate office'}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs text-slate-700">
            <div>
              <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Proposal Title *</label>
              <input
                type="text"
                required
                value={formData.proposalTitle}
                onChange={(e) => setFormData({ ...formData, proposalTitle: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-900 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Support Required</label>
                <select
                  value={formData.supportRequired}
                  onChange={(e) => setFormData({ ...formData, supportRequired: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-900 font-medium"
                >
                  <option value="Funding + Technical Support">Funding + Technical Support</option>
                  <option value="Mentorship + Lab Testing">Mentorship + Lab Testing</option>
                  <option value="Pilot Field Testing">Pilot Field Testing</option>
                  <option value="Hardware Equipment">Hardware Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Estimated Grant</label>
                <input
                  type="text"
                  value={formData.estimatedGrant}
                  onChange={(e) => setFormData({ ...formData, estimatedGrant: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Project Scope Details</label>
              <textarea
                rows={2}
                value={formData.projectScope}
                onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-900 resize-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Official Cover Note</label>
              <textarea
                rows={2}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs text-slate-900 resize-none font-medium"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center space-x-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{loading ? 'Dispatching...' : 'Send Proposal'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendPartnershipRequestModal;
