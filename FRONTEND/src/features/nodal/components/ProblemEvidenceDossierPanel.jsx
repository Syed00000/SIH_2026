import React, { useState } from 'react';
import { exportChallengeDossierPdf } from '../../../shared/utils/pdfExport.js';
import { DossierOverviewTab } from './dossier/DossierOverviewTab.jsx';
import { DossierMediaTab } from './dossier/DossierMediaTab.jsx';
import { DossierLocationTab } from './dossier/DossierLocationTab.jsx';
import { DossierActionFooter } from './dossier/DossierActionFooter.jsx';
import { FullPageDetailPanel } from '../../../shared/components/layout/FullPageDetailPanel.jsx';
import { FileText, Image, MapPin, Download, Lock } from 'lucide-react';

const DOSSIER_TABS = [
  { id: 'dossier', label: 'Problem Dossier & Vetting', icon: FileText },
  { id: 'media', label: 'Ground Truth Media & Evidence', icon: Image },
  { id: 'location', label: 'Geo-Coordinates & Demographics', icon: MapPin }
];

export const ProblemEvidenceDossierPanel = ({
  challenge,
  onClose,
  onOpenTriage,
  onOpenReassign,
  isUniversityView = false,
  onAccept,
  onRequestClarification,
  onDecline,
  onAssignFaculty,
  onOpenChat
}) => {
  const [activeTab, setActiveTab] = useState('dossier');

  if (!challenge) return null;

  const chlId = challenge.challengeId || challenge.id || 'CHL-JH-2026-0001';
  const district = challenge.location?.district || challenge.district || 'Jharkhand';
  const block = challenge.location?.block && challenge.location.block !== 'Not specified' ? challenge.location.block : (challenge.location?.subDivision || 'Not specified');
  const panchayat = challenge.location?.panchayatOrWard && challenge.location.panchayatOrWard !== 'Not specified' ? challenge.location.panchayatOrWard : (challenge.location?.gramPanchayat || 'Not specified');
  const fullAddress = challenge.location?.fullAddress || [panchayat, block, district, 'Jharkhand'].filter(b => b && b !== 'Not specified').join(', ') || `${district}, Jharkhand`;
  const coordinates = challenge.location?.coordinates || 'Coordinates not provided';

  const formattedDate = challenge.submittedAt
    ? new Date(challenge.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '29 Aug 2026';

  const submitter = challenge.submitter || { name: challenge.submittedBy || 'Citizen', role: 'Local Resident' };
  const assignedUni = challenge.assignedUniversity || {};
  const acceptance = assignedUni.acceptanceStatus || challenge.acceptanceStatus || (assignedUni.name ? 'Pending Review' : 'Not Assigned');
  const isAccepted = acceptance === 'Accepted';
  const isDeclined = acceptance === 'Declined';
  const evidenceMedia = Array.isArray(challenge.mediaUrls) ? challenge.mediaUrls.filter((m) => m && (m.url || typeof m === 'string')) : [];

  const statusStr = String(challenge.status || '').toLowerCase();
  const isDeployed = statusStr === 'resolved' || statusStr === 'completed' || Boolean(challenge.isDeployed);

  return (
    <FullPageDetailPanel
      onBack={onClose}
      backLabel="Back to District Challenges Queue"
      breadcrumbs={['Nodal Officer Cell', 'Problem Statement Dossier', chlId]}
      idBadge={chlId}
      statusBadge={
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center space-x-1 ${
          isDeployed
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : isAccepted
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
            : isDeclined
            ? 'bg-rose-50 text-rose-800 border-rose-300'
            : 'bg-amber-50 text-amber-800 border-amber-300'
        }`}>
          {isDeployed ? (
            <>
              <Lock className="w-3 h-3 text-emerald-700" />
              <span>✓ Deployed (TRL-9) · Locked</span>
            </>
          ) : (
            <span>{acceptance}</span>
          )}
        </span>
      }
      title={challenge.title}
      subtitle={`Submitted by ${submitter.name} on ${formattedDate} · Ground Location: ${fullAddress}`}
      headerActions={
        <button
          type="button"
          onClick={() => exportChallengeDossierPdf(challenge)}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-emerald-300" />
          <span>Export Dossier PDF</span>
        </button>
      }
      tabs={DOSSIER_TABS}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id)}
      stickyFooter={
        <DossierActionFooter
          isUniversityView={isUniversityView}
          isAccepted={isAccepted}
          isDeclined={isDeclined}
          assignedUni={assignedUni}
          onOpenChat={onOpenChat}
          onOpenTriage={onOpenTriage}
          onOpenReassign={onOpenReassign}
          onAccept={onAccept}
          onRequestClarification={onRequestClarification}
          onDecline={onDecline}
          onAssignFaculty={onAssignFaculty}
        />
      }
    >
      <div className="space-y-4">
        {activeTab === 'dossier' && (
          <DossierOverviewTab
            challenge={challenge}
            chlId={chlId}
            formattedDate={formattedDate}
            submitter={submitter}
            assignedUni={assignedUni}
            fullAddress={fullAddress}
            coordinates={coordinates}
            evidenceCount={evidenceMedia.length}
            onViewEvidence={() => setActiveTab('media')}
          />
        )}
        {activeTab === 'media' && <DossierMediaTab evidenceMedia={evidenceMedia} />}
        {activeTab === 'location' && (
          <DossierLocationTab
            location={challenge.location}
            district={district}
            block={block}
            panchayat={panchayat}
            fullAddress={fullAddress}
            coordinates={coordinates}
          />
        )}
      </div>
    </FullPageDetailPanel>
  );
};

export default ProblemEvidenceDossierPanel;
