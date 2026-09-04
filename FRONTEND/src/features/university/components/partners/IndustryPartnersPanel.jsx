import React, { useState, useEffect } from 'react';
import { Plus, Factory, IndianRupee, AlertCircle } from 'lucide-react';
import { IndustryApprovalBanner } from './IndustryApprovalBanner.jsx';
import { PartnersKpis } from './PartnersKpis.jsx';
import { PartnersFilterBar } from './PartnersFilterBar.jsx';
import { PartnersTable } from './PartnersTable.jsx';
import { PartnerDetailModal } from './PartnerDetailModal.jsx';
import { CreatePartnershipModal } from './CreatePartnershipModal.jsx';
import { ApproveIndustryAmountModal } from './ApproveIndustryAmountModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const IndustryPartnersPanel = () => {
  const [partners, setPartners] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [supportFilter, setSupportFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [detailPartner, setDetailPartner] = useState(null);
  const [requestPartner, setRequestPartner] = useState(null);
  const [requestProblem, setRequestProblem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [amountModalData, setAmountModalData] = useState(null);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const [partnersData, reqsData] = await Promise.all([
        universityApiService.getPartners('RU001'),
        universityApiService.getIndustryRequests('RU001')
      ]);
      setPartners(Array.isArray(partnersData) ? partnersData : (partnersData?.data || []));
      setRequests(Array.isArray(reqsData) ? reqsData : (reqsData?.data || []));
    } catch (err) {
      console.error('Failed to load partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const totalCount = partners.length;
  const approvedReqs = requests.filter((r) => r.status === 'Approved');
  const activeCount = approvedReqs.length > 0 ? approvedReqs.length : partners.filter((p) => p.status === 'Active' || p.verificationStatus === 'Verified').length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const pendingQuotes = requests.filter((r) => r.labChargesQuoted && r.quoteStatus !== 'Accepted' && r.quoteStatus !== 'Declined');

  const filtered = partners.filter((p) => {
    if (industryFilter !== 'All' && (p.industryType || p.type || p.category) !== industryFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (supportFilter !== 'All') {
      const sup = Array.isArray(p.supportOffered) ? p.supportOffered : (p.supportModes || []);
      if (!sup.some((s) => s.toLowerCase().includes(supportFilter.toLowerCase()))) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (p.name || p.legalName || '').toLowerCase().includes(q) || (p.location || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>University Nodal Center</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Industry Collaborations</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Factory className="w-5 h-5 text-[#007A61]" />
            <span>Corporate & CSR Industry Partners</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect state innovation projects with Jharkhand's verified industrial CSR funds, laboratories, and corporate mentors.
          </p>
        </div>

        <button
          onClick={() => {
            setRequestPartner(null);
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Partnership Proposal</span>
        </button>
      </div>

      {/* Pending Fee Quotes Alert Notification Banner */}
      {pendingQuotes.length > 0 && (
        <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-950">
                {pendingQuotes.length} Industry Fee Proposal(s) Awaiting University Approval
              </h4>
              <p className="text-[11px] text-amber-800 font-medium">
                Industry requested laboratory testing charges. Review and click "Approve Amount from Industry" to lock.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-lg text-xs font-black self-start sm:self-auto shrink-0">
            Action Required
          </span>
        </div>
      )}

      {/* Top Industry Approval Notification Banner */}
      <IndustryApprovalBanner approvedRequests={approvedReqs} partners={partners} onSelectPartner={setDetailPartner} />

      {/* KPIs Bar */}
      <PartnersKpis total={totalCount} active={activeCount} pending={pendingCount} loading={loading} />

      {/* Filter Bar */}
      <PartnersFilterBar
        search={search} setSearch={setSearch} industryFilter={industryFilter} setIndustryFilter={setIndustryFilter}
        supportFilter={supportFilter} setSupportFilter={setSupportFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        onResetFilters={() => { setSearch(''); setIndustryFilter('All'); setSupportFilter('All'); setStatusFilter('All'); }}
      />

      {/* Partners Table */}
      <PartnersTable
        partners={filtered}
        requests={requests}
        loading={loading}
        onSelectPartner={setDetailPartner}
        onOpenSendRequest={(p) => { setRequestPartner(p); setIsCreateModalOpen(true); }}
        onApproveAmount={(p, req) => setAmountModalData({ partner: p, request: req })}
      />

      {/* Partner Detail Modal */}
      <PartnerDetailModal
        partner={detailPartner}
        isOpen={Boolean(detailPartner)}
        onClose={() => setDetailPartner(null)}
        onOpenSendRequest={(p, prob) => {
          setDetailPartner(null);
          setRequestPartner(p);
          setRequestProblem(prob || null);
          setIsCreateModalOpen(true);
        }}
      />

      {/* Create / Send Partnership Request Modal */}
      <CreatePartnershipModal
        isOpen={isCreateModalOpen}
        partner={requestPartner}
        initialProblem={requestProblem}
        onClose={() => { setIsCreateModalOpen(false); setRequestPartner(null); setRequestProblem(null); }}
        onSuccess={fetchPartners}
      />

      {/* Approve Amount from Industry Modal */}
      <ApproveIndustryAmountModal
        isOpen={Boolean(amountModalData)}
        partner={amountModalData?.partner}
        request={amountModalData?.request}
        onClose={() => setAmountModalData(null)}
        onSuccess={fetchPartners}
      />
    </div>
  );
};

export default IndustryPartnersPanel;
