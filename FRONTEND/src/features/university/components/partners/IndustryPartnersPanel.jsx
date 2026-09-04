import React, { useState, useEffect } from 'react';
import { Plus, Factory, Sparkles, Building2 } from 'lucide-react';
import { PartnersKpis } from './PartnersKpis.jsx';
import { PartnersFilterBar } from './PartnersFilterBar.jsx';
import { PartnersTable } from './PartnersTable.jsx';
import { PartnerDetailModal } from './PartnerDetailModal.jsx';
import { CreatePartnershipModal } from './CreatePartnershipModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const IndustryPartnersPanel = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [supportFilter, setSupportFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [detailPartner, setDetailPartner] = useState(null);
  const [requestPartner, setRequestPartner] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await universityApiService.getPartners('RU001');
      setPartners(Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []));
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
  const activeCount = partners.filter((p) => p.status === 'Active' || p.verificationStatus === 'Verified').length;
  const pendingCount = partners.filter((p) => p.status === 'Pending').length;

  const handleResetFilters = () => {
    setSearch('');
    setIndustryFilter('All');
    setSupportFilter('All');
    setStatusFilter('All');
  };

  const filtered = partners.filter((p) => {
    if (industryFilter !== 'All' && (p.industryType || p.type || p.category) !== industryFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (supportFilter !== 'All') {
      const sup = Array.isArray(p.supportOffered) ? p.supportOffered : (Array.isArray(p.supportModes) ? p.supportModes : []);
      if (!sup.some((s) => s.toLowerCase().includes(supportFilter.toLowerCase()))) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const name = (p.name || p.legalName || '').toLowerCase();
      const ind = (p.industryType || p.type || p.category || '').toLowerCase();
      const loc = (p.location || '').toLowerCase();
      return name.includes(q) || ind.includes(q) || loc.includes(q);
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
          className="px-4 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-sm transition-all cursor-pointer hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Partnership Proposal</span>
        </button>
      </div>

      {/* KPIs Bar */}
      <PartnersKpis
        total={totalCount}
        active={activeCount}
        pending={pendingCount}
        loading={loading}
      />

      {/* Filter Bar */}
      <PartnersFilterBar
        search={search}
        setSearch={setSearch}
        industryFilter={industryFilter}
        setIndustryFilter={setIndustryFilter}
        supportFilter={supportFilter}
        setSupportFilter={setSupportFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onResetFilters={handleResetFilters}
      />

      {/* Partners Table */}
      <PartnersTable
        partners={filtered}
        loading={loading}
        onSelectPartner={(partner) => setDetailPartner(partner)}
        onOpenSendRequest={(partner) => {
          setRequestPartner(partner);
          setIsCreateModalOpen(true);
        }}
      />

      {/* Partner Detail Modal */}
      <PartnerDetailModal
        partner={detailPartner}
        isOpen={Boolean(detailPartner)}
        onClose={() => setDetailPartner(null)}
        onOpenSendRequest={(partner) => {
          setDetailPartner(null);
          setRequestPartner(partner);
          setIsCreateModalOpen(true);
        }}
      />

      {/* Create / Send Partnership Request Modal */}
      <CreatePartnershipModal
        isOpen={isCreateModalOpen}
        partner={requestPartner}
        onClose={() => {
          setIsCreateModalOpen(false);
          setRequestPartner(null);
        }}
        onSuccess={() => {
          fetchPartners();
        }}
      />
    </div>
  );
};

export default IndustryPartnersPanel;
