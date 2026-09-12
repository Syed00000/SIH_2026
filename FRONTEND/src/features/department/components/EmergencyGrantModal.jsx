import React, { useState } from 'react';
import { X, Siren, AlertCircle, Send, Landmark, ShieldAlert, Zap } from 'lucide-react';
import grantRequestService from '../../government/services/grantRequestService.js';

export const EmergencyGrantModal = ({ department, isOpen, onClose, onCreated }) => {
  const category = department?.category || 'Ward Commissioner';
  const isWard = category === 'Ward Commissioner' || category === 'Ward';
  const isBlock = category === 'Block / Tehsil Office';
  const rawDist = department?.headquartersLocation || department?.district;
  const districtName = (rawDist && isNaN(rawDist)) ? rawDist : 'Ranchi';
  const [emergencyTarget, setEmergencyTarget] = useState(isWard ? 'DISTRICT' : 'STATE');
  const [amount, setAmount] = useState('');
  const [emergencyType, setEmergencyType] = useState('Drinking Water Contamination Crisis');
  const [purpose, setPurpose] = useState('');
  const [justification, setJustification] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const districtAuthority = `${districtName} District Department (DC / DM Cell)`;
  const stateAuthority = 'Jharkhand State Secretariat (Apex State Emergency Pool)';
  const targetAuthorityName = emergencyTarget === 'STATE' ? stateAuthority : districtAuthority;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmt = Number(String(amount).replace(/[^\d]/g, ''));
    if (!numAmt || numAmt <= 0) return setError('Please enter a valid emergency grant amount');
    if (!purpose.trim()) return setError('Please specify the urgent breakdown or problem statement');

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        requesterDeptId: department?.deptId || department?.id || 'DEPT-CURRENT',
        requesterName: department?.name || 'Local Authority',
        requesterCategory: category,
        targetDeptId: emergencyTarget === 'STATE' ? 'DEPT-JH-STATE' : (districtName?.toLowerCase() === 'dhanbad' ? 'DEPT-JH-DIST-DHN' : 'DEPT-JH-DIST-RNC'),
        targetName: targetAuthorityName,
        district: districtName,
        block: department?.block || '',
        wardId: department?.wardId || '',
        requestedAmount: numAmt,
        purpose: purpose.trim(),
        sector: 'Emergency Crisis Relief',
        justification: justification.trim(),
        priority: 'Emergency SOS',
        isEmergency: true,
        emergencyType,
        emergencyTargetTier: emergencyTarget
      };
      const created = await grantRequestService.createRequest(payload);
      if (onCreated) onCreated(created);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit emergency requisition');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border-2 border-rose-500 overflow-hidden text-left flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-rose-800 to-red-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-rose-200 animate-pulse"><Siren className="w-5 h-5" /></div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black">Emergency CSR Fund Requisition</h3>
                <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white font-black text-[9px] uppercase tracking-wider">SOS Fast-Track</span>
              </div>
              <p className="text-[11px] text-rose-200">Direct urgent funding from District or State Authority</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 custom-scrollbar text-xs">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2 font-medium"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}

          {/* Emergency Escalation Target Selection */}
          <div>
            <label className="block text-slate-900 font-extrabold mb-1.5 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Select Emergency Approving Authority *</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {isWard && (
                <button
                  type="button"
                  onClick={() => setEmergencyTarget('DISTRICT')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                    emergencyTarget === 'DISTRICT' ? 'border-rose-600 bg-rose-50/80 ring-1 ring-rose-500 text-rose-950 font-bold' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] text-rose-700 font-extrabold block uppercase tracking-wider">Direct to District</span>
                  <span className="text-xs font-bold block mt-0.5">{districtName} District Dept</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setEmergencyTarget('STATE')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                  emergencyTarget === 'STATE' ? 'border-rose-600 bg-rose-50/80 ring-1 ring-rose-500 text-rose-950 font-bold' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                } ${!isWard ? 'sm:col-span-2' : ''}`}
              >
                <span className="text-[10px] text-rose-700 font-extrabold block uppercase tracking-wider">Direct to State</span>
                <span className="text-xs font-bold block mt-0.5">Jharkhand State Secretariat (Apex Pool)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Emergency Fund Required (₹) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 500000"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black text-rose-800 focus:outline-none focus:border-rose-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Emergency Category</label>
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600 cursor-pointer"
              >
                <option value="Drinking Water Contamination Crisis">Drinking Water Contamination Crisis</option>
                <option value="Monsoon Drainage / Embankment Breach">Monsoon Drainage / Embankment Breach</option>
                <option value="High-Voltage Electrical Grid Fire">High-Voltage Electrical Grid Fire</option>
                <option value="Epidemic / Urgent Public Health Relief">Epidemic / Urgent Public Health Relief</option>
                <option value="Road Cave-in / Bridge Structural Damage">Road Cave-in / Bridge Structural Damage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Incident / Emergency Problem Statement *</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Urgent restoration of breached culvert causing civic flooding"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Immediate Rapid Response Justification (Within 24-48 Hours)</label>
            <textarea
              rows={2}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why standard departmental channels are bypassed for immediate emergency sanction..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-600 custom-scrollbar"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{submitting ? 'Dispatching SOS...' : 'Dispatch Emergency Requisition'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyGrantModal;
