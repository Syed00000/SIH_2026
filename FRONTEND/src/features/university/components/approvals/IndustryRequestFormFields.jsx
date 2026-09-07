import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const IndustryRequestFormFields = ({
  partners,
  loadingPartners,
  selectedPartnerId,
  setSelectedPartnerId,
  partner,
  outcome,
  setOutcome,
  budget,
  setBudget,
  duration,
  setDuration,
  funding,
  setFunding,
  labAccess,
  setLabAccess,
  techMentorship,
  setTechMentorship,
  approval
}) => {
  return (
    <>
      {/* Target Industry Partner Dropdown */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Select Target Industry Partner *</span>
          </label>
          <span className="text-[10px] font-bold text-slate-400">
            {partners.length} Verified Partners in DB
          </span>
        </div>

        {loadingPartners ? (
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        ) : (
          <select
            value={selectedPartnerId}
            onChange={(e) => setSelectedPartnerId(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
          >
            {partners.map((p) => {
              const id = p.partnerId || p._id;
              const name = p.name || p.legalName;
              const category = p.industryType || p.type || p.category || 'Private Industry';
              const loc = p.location || (p.address?.city ? `${p.address.city}, JH` : 'Jharkhand');
              return (
                <option key={id} value={id}>
                  {name} — {category} ({loc})
                </option>
              );
            })}
          </select>
        )}

        {/* Selected Partner Preview Badge */}
        {partner && (
          <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#007A61] text-white font-black text-[10px] flex items-center justify-center">
                {partner.logoText || (partner.name || partner.legalName || 'IND').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-xs">{partner.name || partner.legalName}</p>
                <p className="text-[10px] text-slate-500 font-semibold">{partner.contactPerson?.name || partner.spocName || 'CSR Head'} • {partner.location || 'Jharkhand'}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-emerald-200 text-[#007A61]">
              {partner.industryType || partner.type || 'Corporate'}
            </span>
          </div>
        )}
      </div>

      {/* Execution Outcome & CSR Value */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Execution Outcome &amp; Value Proposition *
        </label>
        <textarea 
          rows={3}
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          placeholder="Explain how this prototype aligns with the industry partner's goals, CSR priorities, and what the expected technical outcome is..."
          className="w-full text-xs font-medium text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] resize-none shadow-2xs"
        />
      </div>

      {/* Budget Support & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Budget Support Requested (CSR)
          </label>
          <input 
            type="text" 
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. ₹ 5,00,000 for pilot scale-up"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs"
          />
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Expected Partnership Duration
          </label>
          <select 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] shadow-2xs cursor-pointer"
          >
            <option>1 Month</option>
            <option>3 Months</option>
            <option>6 Months</option>
            <option>1 Year</option>
            <option>Ongoing / Permanent</option>
          </select>
        </div>
      </div>

      {/* Support Modalities */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Specific Support Required
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <label className="flex items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
            <input type="checkbox" checked={funding} onChange={(e) => setFunding(e.target.checked)} className="w-4 h-4 text-[#007A61] rounded border-slate-300 focus:ring-[#007A61] accent-[#007A61]" />
            <span className="ml-2 text-xs font-bold text-slate-700">CSR Funding</span>
          </label>

          <label className="flex items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
            <input type="checkbox" checked={labAccess} onChange={(e) => setLabAccess(e.target.checked)} className="w-4 h-4 text-[#007A61] rounded border-slate-300 focus:ring-[#007A61] accent-[#007A61]" />
            <span className="ml-2 text-xs font-bold text-slate-700">Lab Access</span>
          </label>

          <label className="flex items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
            <input type="checkbox" checked={techMentorship} onChange={(e) => setTechMentorship(e.target.checked)} className="w-4 h-4 text-[#007A61] rounded border-slate-300 focus:ring-[#007A61] accent-[#007A61]" />
            <span className="ml-2 text-xs font-bold text-slate-700">Mentorship</span>
          </label>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs font-bold text-slate-800">
        <span>Faculty: {approval.faculty?.name || approval.requestedBy || 'Lead Mentor'}</span>
        <span>Team: {approval.teamName || approval.team?.name || 'Student Research Team'}</span>
      </div>
    </>
  );
};

export default IndustryRequestFormFields;
