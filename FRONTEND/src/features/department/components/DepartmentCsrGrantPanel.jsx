import React, { useState, useEffect } from 'react';
import { HandCoins, RefreshCw, Send, Siren, Inbox, SendHorizontal, LayoutList, AlertCircle } from 'lucide-react';
import grantRequestService from '../../government/services/grantRequestService.js';
import departmentService from '../../government/services/departmentService.js';
import { RequestGrantModal } from './RequestGrantModal.jsx';
import { EmergencyGrantModal } from './EmergencyGrantModal.jsx';
import { GrantFundsModal } from './GrantFundsModal.jsx';
import { GrantRequestsTable } from './GrantRequestsTable.jsx';
import { DepartmentCsrKpis } from './DepartmentCsrKpis.jsx';
import { AllocateFundModal } from './AllocateFundModal.jsx';

export const DepartmentCsrGrantPanel = ({ department }) => {
  const [deptData, setDeptData] = useState(department);
  const deptId = department?.deptId || deptData?.deptId || department?.id || deptData?.id || '';
  const category = deptData?.category || department?.category || 'Administrative Tier';
  const cat = category.toLowerCase();
  const isState = deptId === 'DEPT-JH-STATE' || cat.includes('state') || cat.includes('ministry');
  const isDistrict = deptId.includes('DIST') || cat.includes('district');
  const isBlock = deptId.includes('BLOCK') || deptId.startsWith('DEPT-KNK') || cat.includes('block') || cat.includes('tehsil');
  const isWard = deptId.includes('WARD') || cat.includes('ward') || cat.includes('commissioner');

  const defaultSubTab = isWard ? 'outbound' : isState ? 'inbound' : 'all';
  const [subTab, setSubTab] = useState(defaultSubTab);
  const [inboundReqs, setInboundReqs] = useState([]);
  const [outboundReqs, setOutboundReqs] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [reviewingReq, setReviewingReq] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setDeptData(department);
      setSubTab(isWard ? 'outbound' : isState ? 'inbound' : 'all');
    }
  }, [department, isWard, isState]);

  const rawDist = deptData?.headquartersLocation || deptData?.district;
  const districtName = (rawDist && isNaN(rawDist)) ? rawDist : 'Ranchi';

  const loadDepartment = async () => {
    if (!deptId) return;
    try {
      const data = await departmentService.getDepartmentById(deptId);
      if (data) setDeptData(data);
    } catch { /* ignore fallback */ }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const queryId = deptData?.deptId || department?.deptId || deptId;
      if (!isWard && queryId) {
        const inb = await grantRequestService.getRequests({ targetDeptId: queryId });
        setInboundReqs(Array.isArray(inb) ? inb : []);
      }
      if (queryId) {
        const out = await grantRequestService.getRequests({ requesterDeptId: queryId });
        setOutboundReqs(Array.isArray(out) ? out : []);
      }
    } catch (err) { console.warn('Error loading requests:', err); } finally { setLoading(false); }
  };

  useEffect(() => {
    loadDepartment();
    loadRequests();
    const timer = setInterval(() => { loadDepartment(); loadRequests(); }, 5000);
    return () => clearInterval(timer);
  }, [deptId]);

  const availableBalance = Number(deptData?.allocatedFundPool || 0);
  const totalAllocated = outboundReqs.filter((r) => r.status === 'Granted').reduce((sum, r) => sum + (r.sanctionedAmount || r.requestedAmount || 0), availableBalance);
  const totalDisbursedInbound = inboundReqs.filter((r) => r.status === 'Granted').reduce((sum, r) => sum + (r.sanctionedAmount || r.requestedAmount || 0), 0);
  const pendingInbound = inboundReqs.filter((r) => r.status === 'Pending').length;

  const inboundWithDir = inboundReqs.map((r) => ({ ...r, direction: 'inbound' }));
  const outboundWithDir = outboundReqs.map((r) => ({ ...r, direction: 'outbound' }));
  const displayedRequests = subTab === 'all' ? [...inboundWithDir, ...outboundWithDir] : subTab === 'inbound' ? inboundWithDir : outboundWithDir;

  const outboundLabel = isState ? 'Requisitions to State Innovation Pool' : isDistrict ? 'Requisitions to State Secretariat' : isBlock ? `Requisitions to ${districtName} District` : 'Outbound Requisitions';
  const allocateButtonLabel = isState ? 'Allocate Fund to District Department' : isDistrict ? 'Allocate Fund to Block' : isBlock ? 'Allocate Fund to Ward' : '';

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center shrink-0">
            <HandCoins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-slate-900 leading-tight">CSR & State Grants Fund Management</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{category}</span>
            </div>
            <p className="text-xs text-slate-500">Track inter-tier grant requisitions & manage departmental fund pool</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isWard && allocateButtonLabel && (
            <button type="button" onClick={() => setIsAllocateModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95">
              <Send className="w-3.5 h-3.5" /><span>{allocateButtonLabel}</span>
            </button>
          )}
          {(isWard || isBlock) && (
            <button type="button" onClick={() => setIsEmergencyModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all">
              <Siren className="w-3.5 h-3.5 text-rose-200 animate-pulse" /><span>Emergency CSR (SOS)</span>
            </button>
          )}
          <button type="button" onClick={() => setIsRequestModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95">
            <Send className="w-3.5 h-3.5" /><span>{isState ? 'Request Fund from State Pool' : 'Request Grant Fund'}</span>
          </button>
          <button type="button" onClick={() => { loadDepartment(); loadRequests(); }} disabled={loading} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {!isWard && availableBalance <= 0 && (
        <div className="p-3 bg-slate-100 border border-slate-300 rounded-2xl flex items-center justify-between gap-2 text-slate-800 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
            <span>Yeh department fund allocate nahi kar sakta kyunki iske paas ₹0 fund hai (Sufficient fund nahi hai).</span>
          </div>
          <button type="button" onClick={() => setIsRequestModalOpen(true)} className="px-3 py-1 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-[11px] font-bold shrink-0 cursor-pointer">
            Request Grant
          </button>
        </div>
      )}

      <DepartmentCsrKpis
        availableBalance={availableBalance} totalSpentOnProblems={totalDisbursedInbound} totalAllocated={totalAllocated}
        pendingCount={!isWard ? pendingInbound : outboundReqs.filter((r) => r.status === 'Pending').length}
        isWard={isWard} allocateLabel={allocateButtonLabel}
        onOpenAllocateFund={!isWard ? () => setIsAllocateModalOpen(true) : null}
      />

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {!isWard && !isState && (
          <button type="button" onClick={() => setSubTab('all')} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${subTab === 'all' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
            <LayoutList className="w-3.5 h-3.5" /><span>All Requisitions</span><span className="text-[10px] opacity-80">({displayedRequests.length})</span>
          </button>
        )}
        {!isWard && (
          <button type="button" onClick={() => setSubTab('inbound')} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${subTab === 'inbound' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
            <Inbox className="w-3.5 h-3.5" /><span>Incoming Requisitions</span>
            {pendingInbound > 0 && <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-amber-950">{pendingInbound}</span>}
            <span className="text-[10px] opacity-80">({inboundReqs.length})</span>
          </button>
        )}
        <button type="button" onClick={() => setSubTab('outbound')} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${subTab === 'outbound' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
          <SendHorizontal className="w-3.5 h-3.5" /><span>{outboundLabel}</span><span className="text-[10px] opacity-80">({outboundReqs.length})</span>
        </button>
      </div>

      <GrantRequestsTable requests={displayedRequests} type={subTab} onReviewRequest={setReviewingReq} />
      <RequestGrantModal department={deptData} isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} onCreated={(req) => { setOutboundReqs((p) => [req, ...p]); setSubTab('outbound'); }} />
      <EmergencyGrantModal department={deptData} isOpen={isEmergencyModalOpen} onClose={() => setIsEmergencyModalOpen(false)} onCreated={(req) => { setOutboundReqs((p) => [req, ...p]); setSubTab('outbound'); }} />
      <GrantFundsModal
        request={reviewingReq} currentDepartment={deptData || department} availableBalance={availableBalance}
        isOpen={Boolean(reviewingReq)} onClose={() => setReviewingReq(null)}
        onGranted={() => { loadRequests(); loadDepartment(); }} onRejected={() => { loadRequests(); loadDepartment(); }}
      />
      <AllocateFundModal
        currentDepartment={{ ...(deptData || department), allocatedFundPool: availableBalance }}
        isOpen={isAllocateModalOpen} onClose={() => setIsAllocateModalOpen(false)}
        onFundAllocated={(res) => {
          if (res?.fromDepartment?.newBalance !== undefined) setDeptData((prev) => ({ ...prev, allocatedFundPool: res.fromDepartment.newBalance }));
          loadDepartment(); loadRequests();
        }}
      />
    </div>
  );
};

export default DepartmentCsrGrantPanel;
