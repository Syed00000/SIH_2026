import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Building,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Phone,
  Mail,
  AlertTriangle,
  GraduationCap,
  Camera,
  Video,
  Mic,
  FileText,
  Compass,
  ExternalLink,
  Download,
  Share2,
  CheckCircle,
  Eye,
  Maximize2,
  RotateCcw,
  Sparkles,
  Layers,
  FileCheck,
  Navigation
} from 'lucide-react';
import { exportChallengeDossierPdf } from '../../../shared/utils/pdfExport.js';

export const ProblemEvidenceDossierModal = ({
  challenge,
  isOpen,
  onClose,
  onOpenTriage,
  onOpenReassign
}) => {
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'media' | 'location'
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState(null);

  if (!isOpen || !challenge) return null;

  const chlId = challenge.challengeId || challenge.id || 'CHL-JH-2026-0001';
  const district = challenge.location?.district || challenge.district || 'Jharkhand';
  const block = challenge.location?.block || 'Not specified';
  const panchayat = challenge.location?.panchayatOrWard || 'Not specified';
  const landmark = challenge.location?.landmark || 'Ground Location';
  const pincode = challenge.location?.pincode || 'N/A';
  const fullAddress =
    challenge.location?.fullAddress ||
    [landmark, panchayat, block, district, 'Jharkhand'].filter(Boolean).join(', ');
  const coordinates = challenge.location?.coordinates || 'Coordinates not provided';

  const formattedDate = challenge.submittedAt
    ? new Date(challenge.submittedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '29 Aug 2026';

  const submitter = challenge.submitter || {
    name: challenge.submittedBy || 'Citizen',
    mobileNumber: 'Verified Citizen',
    email: '',
    role: 'Local Resident',
    organization: ''
  };

  const assignedUni = challenge.assignedUniversity || {};
  const acceptance = assignedUni.acceptanceStatus || challenge.acceptanceStatus || (assignedUni.name ? 'Pending Review' : 'Not Assigned');
  const isAccepted = acceptance === 'Accepted';
  const isDeclined = acceptance === 'Declined';

  // Extract only real uploaded media from MongoDB (no dummy fallback data!)
  const evidenceMedia = Array.isArray(challenge.mediaUrls)
    ? challenge.mediaUrls.filter((m) => m && (m.url || typeof m === 'string'))
    : [];

  const handleDownloadFormattedReport = () => {
    exportChallengeDossierPdf(challenge);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs select-none overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col max-h-[92vh] overflow-hidden text-left my-auto animate-in zoom-in-95 duration-150">
        
        {/* 1. Modal Top Banner */}
        <div className="p-4 sm:p-5 bg-[#064e3b] text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 border border-emerald-500/40 flex items-center justify-center text-emerald-100 shadow-2xs">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-black tracking-wider text-emerald-200">
                  {chlId}
                </span>
                <span className="text-emerald-400">&bull;</span>
                <span className="text-xs font-bold text-white">
                  {challenge.domain || 'Rural Infrastructure'}
                </span>
                <span className="bg-emerald-800/90 text-emerald-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-600/60">
                  Ground Dossier
                </span>
              </div>
              <p className="text-[11.5px] text-emerald-200 font-medium mt-0.5">
                Official Evidence, Telemetry & Location Record &bull; Jharkhand State Innovation Cell
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadFormattedReport}
              className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors cursor-pointer border border-emerald-600/60 flex items-center space-x-1 px-2.5 text-xs font-bold"
              title="Download Official Ground Investigation Dossier"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors cursor-pointer border border-emerald-600/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Dossier Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 text-xs">
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dossier')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'dossier'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#047857]" />
              <span>Investigation Dossier</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'media'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#047857]" />
              <span>Evidence Attachments ({evidenceMedia.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('location')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'location'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-[#047857]" />
              <span>Geo-Spatial Spec</span>
            </button>
          </div>

          <span className="text-[11px] font-bold text-slate-500 hidden sm:inline-block">
            Submitted: {formattedDate}
          </span>
        </div>

        {/* 3. Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 text-xs">
          
          {/* TAB 1: FULL INVESTIGATION DOSSIER */}
          {activeTab === 'dossier' && (
            <div className="space-y-5">
              {/* Problem Title & Testimony */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                    Citizen Problem Statement
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold border ${
                    challenge.priority === 'Critical' || challenge.priority === 'High'
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    Priority: {challenge.priority || 'Medium'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {challenge.title}
                </h3>
                <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200/90 leading-relaxed">
                  "{challenge.description || challenge.problemStatement}"
                </p>
              </div>

              {/* Form Grid: Location Table */}
              <div className="border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between font-extrabold text-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#047857]" />
                    <span>Administrative Location Spec</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">{coordinates}</span>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 text-xs">
                    <div className="p-3 bg-white flex items-center justify-between border-r sm:border-slate-100">
                      <span className="text-slate-500 font-medium">State</span>
                      <span className="font-bold text-slate-900">Jharkhand</span>
                    </div>
                    <div className="p-3 bg-white flex items-center justify-between">
                      <span className="text-slate-500 font-medium">District</span>
                      <span className="font-bold text-slate-900">{district}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 text-xs">
                    <div className="p-3 bg-white flex items-center justify-between border-r sm:border-slate-100">
                      <span className="text-slate-500 font-medium">Block / Sub-Division</span>
                      <span className="font-bold text-slate-900">{block}</span>
                    </div>
                    <div className="p-3 bg-white flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Gram Panchayat / Ward</span>
                      <span className="font-bold text-slate-900">{panchayat}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 text-xs">
                    <div className="p-3 bg-white flex items-center justify-between border-r sm:border-slate-100">
                      <span className="text-slate-500 font-medium">Landmark</span>
                      <span className="font-bold text-slate-900">{landmark}</span>
                    </div>
                    <div className="p-3 bg-white flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Pincode</span>
                      <span className="font-mono font-bold text-slate-900">{pincode}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium block">Full Ground Address:</span>
                      <span className="font-bold text-slate-800">{fullAddress}</span>
                    </div>
                    {coordinates && coordinates !== 'Coordinates not provided' && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold flex items-center space-x-1.5 shadow-2xs shrink-0 cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#047857]" />
                        <span>Open on Map</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Submitter & Impact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Submitter Credentials */}
                <div className="border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-extrabold text-slate-800 text-xs flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#047857]" />
                    <span>Citizen Submitter Verification</span>
                  </div>
                  <div className="p-3.5 space-y-2.5 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Submitter Name</span>
                      <span className="font-bold text-slate-900">{submitter.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Mobile Number</span>
                      <span className="font-mono font-bold text-emerald-800 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-[#047857]" />
                        <span>{submitter.mobileNumber}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Role</span>
                      <span className="font-bold text-slate-800">{submitter.role || 'Citizen'}</span>
                    </div>
                  </div>
                </div>

                {/* HEI Allocation Status */}
                <div className="border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-extrabold text-slate-800 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-[#047857]" />
                      <span>HEI Allocation</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      isAccepted
                        ? 'bg-emerald-50 text-[#064e3b] border-emerald-200'
                        : isDeclined
                        ? 'bg-rose-50 text-rose-900 border-rose-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}>
                      {isAccepted ? 'Accepted' : isDeclined ? 'Declined' : 'Pending Review'}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-2 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">University</span>
                      <span className="font-bold text-slate-900">{assignedUni.name || 'Not Allocated Yet'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Department</span>
                      <span className="font-bold text-slate-800">{assignedUni.department || 'Awaiting Allocation'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Mentor</span>
                      <span className="font-bold text-slate-800">{assignedUni.mentorName || 'Assigned Faculty Lead'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Media Evidence Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#047857]" />
                    <span>Attached Ground Media</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {evidenceMedia.length} Uploaded Media
                  </span>
                </div>

                {evidenceMedia.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-1.5 text-slate-400">
                    <Camera className="w-6 h-6 mx-auto text-slate-300" />
                    <h4 className="text-xs font-bold text-slate-600">No Ground Media Files Uploaded</h4>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      The citizen filed this problem statement as a text testimony. Media attachments (photos / videos) are optional.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {evidenceMedia.map((m, idx) => {
                      const url = typeof m === 'string' ? m : m.url;
                      const caption = typeof m === 'object' ? m.caption || `Evidence File ${idx + 1}` : `Evidence File ${idx + 1}`;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedPhotoPreview(url)}
                          className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 aspect-video cursor-pointer shadow-2xs"
                        >
                          <img
                            src={url}
                            alt={caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                            <span className="font-bold text-[11px] leading-tight truncate">{caption}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ATTACHMENTS */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              {evidenceMedia.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2 text-slate-400">
                  <Camera className="w-8 h-8 mx-auto text-slate-300" />
                  <h4 className="text-xs font-bold text-slate-700">No Multi-Media Attachments Uploaded</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Photos, drone footage, or voice memos are optional during citizen ground filing.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {evidenceMedia.map((m, idx) => {
                    const url = typeof m === 'string' ? m : m.url;
                    const caption = typeof m === 'object' ? m.caption || `Evidence File ${idx + 1}` : `Evidence File ${idx + 1}`;
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs space-y-2 p-3"
                      >
                        <div
                          onClick={() => setSelectedPhotoPreview(url)}
                          className="relative rounded-lg overflow-hidden bg-slate-100 aspect-video cursor-pointer group"
                        >
                          <img
                            src={url}
                            alt={caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-xs">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs truncate">{caption}</h4>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GEO-SPATIAL SPEC */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-[#047857]" />
                    <h4 className="font-extrabold text-slate-900 text-xs">Geo-Spatial Coordinates</h4>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {coordinates}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">Ground Location Address:</span>
                  <p className="text-slate-600 leading-relaxed font-medium">{fullAddress}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Status:</span>
            <span className="font-extrabold text-slate-900">{challenge.status || 'Under Review'}</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-500 font-medium">HEI:</span>
            <span className="font-extrabold text-emerald-800">{assignedUni.name || 'Not Allocated'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadFormattedReport}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#047857]" />
              <span>Download Dossier</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                if (assignedUni.name && onOpenReassign) {
                  onOpenReassign(challenge);
                } else if (onOpenTriage) {
                  onOpenTriage(challenge);
                }
              }}
              className="px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#064e3b] text-white font-extrabold shadow-2xs transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{assignedUni.name ? 'Reassign / Edit' : 'Triage & Allocate HEI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal Lightbox */}
      {selectedPhotoPreview && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedPhotoPreview(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedPhotoPreview(null)}
              className="absolute -top-10 right-0 text-white hover:text-emerald-400 p-1.5 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhotoPreview}
              alt="Evidence Preview"
              className="max-h-[85vh] max-w-full rounded-xl object-contain border border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemEvidenceDossierModal;
