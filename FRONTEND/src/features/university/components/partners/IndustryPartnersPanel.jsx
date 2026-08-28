import React, { useState, useEffect } from 'react';
import { PartnersKpis } from './PartnersKpis.jsx';
import { PartnersFilterBar } from './PartnersFilterBar.jsx';
import { PartnersTable } from './PartnersTable.jsx';
import { PartnerDrawer } from './PartnerDrawer.jsx';
import { PartnershipRequestForm } from './PartnershipRequestForm.jsx';
import { PartnershipRequestsModal } from './PartnershipRequestsModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const IndustryPartnersPanel = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [supportFilter, setSupportFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [domainFilter, setDomainFilter] = useState('All');

  // Full-page form state — which partner to pre-fill (null = general request)
  const [requestFormPartner, setRequestFormPartner] = useState(undefined); // undefined = closed
  const [isViewRequestsModalOpen, setIsViewRequestsModalOpen] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    const data = await universityApiService.getPartners('RU001');
    const list = Array.isArray(data) ? data : [];
    setPartners(list);
    if (list.length > 0) setSelectedPartner(list[0]);
    else setSelectedPartner(null);
    setLoading(false);
  };

  useEffect(() => { fetchPartners(); }, []);

  const totalCount   = partners.length;
  const activeCount  = partners.filter((p) => p.status === 'Active' || p.verificationStatus === 'Verified').length;
  const pendingCount = partners.filter((p) => p.status === 'Pending').length;
  const completedCount = partners.filter((p) => p.status === 'Completed').length;

  const handleResetFilters = () => {
    setSearch(''); setIndustryFilter('All'); setSupportFilter('All');
    setStatusFilter('All'); setDomainFilter('All');
  };

  const filtered = partners.filter((p) => {
    if (industryFilter !== 'All' && (p.industryType || p.type || p.category) !== industryFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (supportFilter !== 'All') {
      const sup = Array.isArray(p.supportOffered) ? p.supportOffered : (Array.isArray(p.supportModes) ? p.supportModes : []);
      if (!sup.some((s) => s.toLowerCase().includes(supportFilter.toLowerCase()))) return false;
    }
    if (domainFilter !== 'All') {
      const doms = Array.isArray(p.domains) ? p.domains : (Array.isArray(p.thematicDomains) ? p.thematicDomains : []);
      if (!doms.includes(domainFilter)) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const name = (p.name || p.legalName || p.shortName || '').toLowerCase();
      const ind = (p.industryType || p.type || p.category || '').toLowerCase();
      return name.includes(q) || ind.includes(q);
    }
    return true;
  });

  // Full-page form is showing — render only form
  if (requestFormPartner !== undefined) {
    return (
      <PartnershipRequestForm
        partner={requestFormPartner}
        onClose={() => setRequestFormPartner(undefined)}
        onSuccess={() => { setRequestFormPartner(undefined); fetchPartners(); }}
      />
    );
  }

  return (
    <div className="space-y-3 max-w-7xl mx-auto select-none">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Industry Partners</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage industry partnerships and collaborations to support university projects.
          </p>
        </div>
        <button
          onClick={() => setRequestFormPartner(null)}
          className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors rounded-none"
        >
          <span>+ New Partnership Request</span>
        </button>
      </div>

      <PartnersKpis
        total={totalCount}
        active={activeCount}
        pending={pendingCount}
        completed={completedCount}
        loading={loading}
      />

      <PartnersFilterBar
        search={search}
        setSearch={setSearch}
        industryFilter={industryFilter}
        setIndustryFilter={setIndustryFilter}
        supportFilter={supportFilter}
        setSupportFilter={setSupportFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        onResetFilters={handleResetFilters}
        onApplyFilters={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        <div className={`${selectedPartner ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <PartnersTable
            partners={filtered}
            selectedPartnerId={selectedPartner?.partnerId || selectedPartner?._id}
            onSelectPartner={(p) => setSelectedPartner(p)}
            loading={loading}
          />
        </div>

        {selectedPartner && (
          <div className="lg:col-span-5 sticky top-20">
            <PartnerDrawer
              partner={selectedPartner}
              onClose={() => setSelectedPartner(null)}
              onOpenSendRequest={() => setRequestFormPartner(selectedPartner)}
              onOpenViewRequests={() => setIsViewRequestsModalOpen(true)}
            />
          </div>
        )}
      </div>

      <PartnershipRequestsModal
        isOpen={isViewRequestsModalOpen}
        onClose={() => setIsViewRequestsModalOpen(false)}
        partner={selectedPartner}
      />
    </div>
  );
};

export default IndustryPartnersPanel;
