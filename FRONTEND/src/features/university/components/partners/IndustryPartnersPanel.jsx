import React, { useState, useEffect } from 'react';
import { Plus, Factory } from 'lucide-react';
import { PartnersKpis } from './PartnersKpis.jsx';
import { PartnersFilterBar } from './PartnersFilterBar.jsx';
import { PartnersTable } from './PartnersTable.jsx';
import { PartnerDetailPanel } from './PartnerDetailPanel.jsx';
import { ProjectDetailPanel } from '../projects/ProjectDetailPanel.jsx';
import { ProblemEvidenceDossierPanel } from '../../../nodal/components/ProblemEvidenceDossierPanel.jsx';
import { CreatePartnershipModal } from './CreatePartnershipModal.jsx';
import { ApproveIndustryAmountModal } from './ApproveIndustryAmountModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const IndustryPartnersPanel = () => {
  const [partners, setPartners] = useState([]);
  const [requests, setRequests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [supportFilter, setSupportFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [detailPartner, setDetailPartner] = useState(null);
  const [selectedProblemProject, setSelectedProblemProject] = useState(null);
  const [dossierChallenge, setDossierChallenge] = useState(null);
  const [requestPartner, setRequestPartner] = useState(null);
  const [requestProblem, setRequestProblem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [amountModalData, setAmountModalData] = useState(null);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const [partnersData, reqsData, prjsData] = await Promise.all([
        universityApiService.getPartners('RU001'),
        universityApiService.getIndustryRequests('RU001'),
        universityApiService.getProjects('RU001')
      ]);
      setPartners(Array.isArray(partnersData) ? partnersData : (partnersData?.data || []));
      setRequests(Array.isArray(reqsData) ? reqsData : (reqsData?.data || []));
      setProjects(Array.isArray(prjsData) ? prjsData : (prjsData?.data || []));
    } catch (err) {
      console.error('Failed to load partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartners(); }, []);

  const submittedPrototypes = projects.filter((p) => 
    p.sentToUniversity === true || p.prototypeStatus === 'In Review' || p.prototypeStatus === 'Approved' || Boolean(p.prototypeData?.title)
  );
  const totalCount = submittedPrototypes.length > 0 ? partners.length : 0;
  const approvedReqs = requests.filter((r) => r.status === 'Approved');
  const activeCount = approvedReqs.length > 0 ? approvedReqs.length : (submittedPrototypes.length > 0 ? partners.filter((p) => p.status === 'Active' || p.verificationStatus === 'Verified').length : 0);
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

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

  if (dossierChallenge) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto select-none animate-in fade-in duration-150">
        <ProblemEvidenceDossierPanel
          challenge={{ ...dossierChallenge, challengeId: dossierChallenge.challengeId || dossierChallenge.projectId, description: dossierChallenge.problemStatement || dossierChallenge.description }}
          onClose={() => setDossierChallenge(null)}
          isUniversityView={true}
        />
      </div>
    );
  }

  if (selectedProblemProject) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto select-none animate-in fade-in duration-150">
        <ProjectDetailPanel
          project={selectedProblemProject}
          onClose={() => setSelectedProblemProject(null)}
          onViewProblemDossier={(p) => setDossierChallenge(p)}
        />
      </div>
    );
  }

  if (detailPartner) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left animate-in fade-in duration-150">
        <PartnerDetailPanel
          partner={detailPartner}
          initialProblem={requestProblem}
          onClose={() => { setDetailPartner(null); setRequestProblem(null); }}
          onOpenSendRequest={(p, prob) => { setDetailPartner(null); setRequestPartner(p); setRequestProblem(prob || null); setIsCreateModalOpen(true); }}
          onViewProblemDossier={(prob) => setDossierChallenge(prob)}
        />
        <CreatePartnershipModal
          isOpen={isCreateModalOpen} partner={requestPartner} initialProblem={requestProblem}
          onClose={() => { setIsCreateModalOpen(false); setRequestPartner(null); setRequestProblem(null); }}
          onSuccess={fetchPartners}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Factory className="w-5 h-5 text-[#007A61]" />
            <span>Corporate & CSR Industry Partners</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Connect state innovation projects with Jharkhand's verified industrial CSR funds, laboratories, and mentors.</p>
        </div>
        <button
          onClick={() => { setRequestPartner(null); setRequestProblem(submittedPrototypes[0] || null); setIsCreateModalOpen(true); }}
          className="px-4 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Partnership Proposal</span>
        </button>
      </div>

      <PartnersKpis total={totalCount} active={activeCount} pending={pendingCount} loading={loading} />

      <PartnersFilterBar
        search={search} setSearch={setSearch} industryFilter={industryFilter} setIndustryFilter={setIndustryFilter}
        supportFilter={supportFilter} setSupportFilter={setSupportFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        onResetFilters={() => { setSearch(''); setIndustryFilter('All'); setSupportFilter('All'); setStatusFilter('All'); }}
      />

      <PartnersTable
        partners={filtered} submittedPrototypes={submittedPrototypes} requests={requests} loading={loading}
        onSelectPartner={(p, proto) => { setDetailPartner(p); setRequestProblem(proto || null); }}
        onOpenSendRequest={(p, proto) => { setRequestPartner(p); setRequestProblem(proto || null); setIsCreateModalOpen(true); }}
        onApproveAmount={(p, req) => setAmountModalData({ partner: p, request: req })}
      />

      <CreatePartnershipModal
        isOpen={isCreateModalOpen} partner={requestPartner} initialProblem={requestProblem}
        onClose={() => { setIsCreateModalOpen(false); setRequestPartner(null); setRequestProblem(null); }}
        onSuccess={fetchPartners}
      />

      <ApproveIndustryAmountModal
        isOpen={Boolean(amountModalData)} partner={amountModalData?.partner} request={amountModalData?.request}
        onClose={() => setAmountModalData(null)} onSuccess={fetchPartners}
      />
    </div>
  );
};

export default IndustryPartnersPanel;
