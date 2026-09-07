import React, { useState } from 'react';
import { exportChallengeDossierPdf } from '../../../shared/utils/pdfExport.js';
import { DossierModalHeader } from './dossier/DossierModalHeader.jsx';
import { DossierOverviewTab } from './dossier/DossierOverviewTab.jsx';
import { DossierMediaTab } from './dossier/DossierMediaTab.jsx';
import { DossierLocationTab } from './dossier/DossierLocationTab.jsx';
import { DossierActionFooter } from './dossier/DossierActionFooter.jsx';

export const ProblemEvidenceDossierModal = ({
  challenge,
  isOpen,
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

  if (!isOpen || !challenge) return null;

  const chlId = challenge.challengeId || challenge.id || 'CHL-JH-2026-0001';
  const district = challenge.location?.district || challenge.district || 'Jharkhand';
  const block = challenge.location?.block && challenge.location.block !== 'Not specified' ? challenge.location.block : (challenge.location?.subDivision || 'Not specified');
  const panchayat = challenge.location?.panchayatOrWard && challenge.location.panchayatOrWard !== 'Not specified' ? challenge.location.panchayatOrWard : (challenge.location?.gramPanchayat || 'Not specified');
  const landmark = challenge.location?.landmark && challenge.location.landmark !== 'Ground Location' ? challenge.location.landmark : 'Ground Location';
  const fullAddress =
    challenge.location?.fullAddress ||
    [landmark !== 'Ground Location' ? landmark : '', panchayat !== 'Not specified' ? panchayat : '', block !== 'Not specified' ? block : '', district, 'Jharkhand'].filter(Boolean).join(', ') || `${district}, Jharkhand`;
  const coordinates = challenge.location?.coordinates || 'Coordinates not provided';

  const formattedDate = challenge.submittedAt
    ? new Date(challenge.submittedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '29 Aug 2026';

  const submitter = challenge.submitter || {
    name: challenge.submittedBy || 'Citizen',
    role: 'Local Resident'
  };

  const assignedUni = challenge.assignedUniversity || {};
  const acceptance = assignedUni.acceptanceStatus || challenge.acceptanceStatus || (assignedUni.name ? 'Pending Review' : 'Not Assigned');
  const isAccepted = acceptance === 'Accepted';
  const isDeclined = acceptance === 'Declined';

  const evidenceMedia = Array.isArray(challenge.mediaUrls)
    ? challenge.mediaUrls.filter((m) => m && (m.url || typeof m === 'string'))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200/90 shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 text-left">
        <DossierModalHeader
          chlId={chlId}
          domain={challenge.domain}
          priority={challenge.priority}
          onDownloadPdf={() => exportChallengeDossierPdf(challenge)}
          onPrint={() => window.print()}
          onClose={onClose}
        />

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-5 border-b border-slate-100 bg-slate-50/50 text-xs font-bold">
          {['dossier', 'media', 'location'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 px-3 border-b-2 transition-all capitalize cursor-pointer ${
                activeTab === tab
                  ? 'border-slate-900 text-slate-900 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'dossier' ? 'Ground Truth Overview' : tab === 'media' ? `Evidence Media (${evidenceMedia.length})` : 'Location & Demographics'}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'dossier' && (
            <DossierOverviewTab
              challenge={challenge}
              submitter={submitter}
              formattedDate={formattedDate}
              assignedUni={assignedUni}
              acceptance={acceptance}
            />
          )}

          {activeTab === 'media' && (
            <DossierMediaTab evidenceMedia={evidenceMedia} />
          )}

          {activeTab === 'location' && (
            <DossierLocationTab
              district={district}
              block={block}
              panchayat={panchayat}
              landmark={landmark}
            />
          )}
        </div>

        <DossierActionFooter
          isUniversityView={isUniversityView}
          isAccepted={isAccepted}
          isDeclined={isDeclined}
          onAccept={onAccept}
          onDecline={onDecline}
          onRequestClarification={onRequestClarification}
          onAssignFaculty={onAssignFaculty}
          onOpenChat={onOpenChat}
          onOpenTriage={onOpenTriage}
          onClose={onClose}
          challenge={challenge}
        />
      </div>
    </div>
  );
};

export default ProblemEvidenceDossierModal;
