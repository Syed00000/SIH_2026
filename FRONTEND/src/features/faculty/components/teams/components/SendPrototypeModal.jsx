import React, { useState } from 'react';
import { Send, FlaskConical, CheckCircle2, X, Sparkles, Clock, FileUp, FileText, Loader2 } from 'lucide-react';
import { facultyApiService } from '../../../services/facultyApiService.js';

export const SendPrototypeModal = ({ team, project, faculty, isOpen, onClose, onSuccess }) => {
  const [timeline, setTimeline] = useState(project?.prototypeData?.timeline || '4 Weeks (Deployment in Seismic Zone)');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(team?.pdfUrl || project?.prototypeData?.pdfUrl || '');
  const [pdfName, setPdfName] = useState(team?.pdfName || project?.prototypeData?.pdfName || '');

  if (!isOpen || !team) return null;

  const targetProjectId = team.projectId || project?.projectId;

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF documents are allowed (.pdf)');
      return;
    }
    if (file.size > 1024 * 1024) {
      alert(`PDF file size must be under 1MB. (Selected: ${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      return;
    }

    setUploadingPdf(true);
    try {
      const res = await facultyApiService.uploadProjectPdf(targetProjectId, file);
      if (res?.url) {
        setPdfUrl(res.url);
        setPdfName(res.fileName || file.name);
      }
    } catch (err) {
      alert('Failed to upload PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingPdf(false);
      e.target.value = '';
    }
  };

  const defaultPhases = project?.prototypeData?.phases || {
    labDesign: '<p><strong>Phase 1: Lab Architecture:</strong> Triaxial MEMS accelerometer array calibrated in geotechnical lab.</p>',
    fieldTest: '<p><strong>Phase 2: Field Telemetry:</strong> LoRaWAN low-power mesh network tested across 5km radius with sub-second alert latency.</p>',
    stateCert: '<p><strong>Phase 3: State Standards:</strong> Calibrated against BIS seismic zone standards for Jharkhand urban centers.</p>',
    publicDeploy: '<p><strong>Phase 4: Early Siren Broadcast:</strong> Direct integration with district sirens and mobile telemetry push.</p>'
  };

  const handleSendToUniversity = async () => {
    setSubmitting(true);
    try {
      const payload = {
        phases: defaultPhases,
        content: defaultPhases.labDesign,
        timeline,
        pdfUrl: pdfUrl || team?.pdfUrl || project?.prototypeData?.pdfUrl || '',
        pdfName: pdfName || team?.pdfName || project?.prototypeData?.pdfName || 'Prototype_Report.pdf',
        facultyEmail: faculty?.email || 'binod@ru.ac.in',
        facultyName: faculty?.name || 'Dr. Binod Kumar',
        teamName: team.name,
        teamLead: team.studentLead,
        teamMembersCount: team.membersCount || team.members?.length || 3
      };

      const res = await facultyApiService.submitPrototype(targetProjectId, payload);
      if (res?.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          if (onSuccess) onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to send prototype to university:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-200 text-left">
        <div className="bg-gradient-to-r from-emerald-800 to-[#007A61] p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><FlaskConical className="w-4 h-4 text-white" /></div>
            <div>
              <h3 className="text-sm font-bold">Send Prototype to University</h3>
              <p className="text-[10.5px] text-emerald-100">Submit completed prototype blueprint for Ranchi University Technical Evaluation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[#007A61] uppercase tracking-wider">Linked Problem & Grant</span>
              <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">1st Grant: ₹ 80,000 Disbursed</span>
            </div>
            <p className="font-extrabold text-slate-900 text-xs">{team.project || project?.title}</p>
          </div>

          {/* PDF Upload Section (< 1MB) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Prototype Report PDF (&lt; 1MB)</span>
              {uploadingPdf && (
                <span className="text-[10px] font-bold text-[#007A61] flex items-center space-x-1">
                  <Loader2 className="w-3 h-3 animate-spin" /><span>Uploading to Cloudinary...</span>
                </span>
              )}
            </div>
            {pdfUrl ? (
              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                  <div><p className="font-bold text-slate-800 line-clamp-1">{pdfName || 'Prototype_Report.pdf'}</p><p className="text-[9.5px] text-emerald-600 font-medium">✓ Uploaded to Cloudinary</p></div>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10.5px] font-bold cursor-pointer">
                    Replace PDF<input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex items-center justify-center space-x-2 p-3 bg-white border border-dashed border-slate-300 hover:border-[#007A61] rounded-xl cursor-pointer transition-colors group">
                <FileUp className="w-4 h-4 text-slate-400 group-hover:text-[#007A61]" />
                <span className="text-slate-600 group-hover:text-[#007A61] font-bold text-xs">Choose PDF to Upload (&lt; 1MB)</span>
                <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
              </label>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">Target Timeline / Deployment ETA</label>
            <div className="relative">
              <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61]" />
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2">
          <button type="button" onClick={onClose} disabled={submitting} className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer">Cancel</button>
          <button
            type="button" onClick={handleSendToUniversity} disabled={submitting || submitted}
            className="px-4 py-2 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : submitted ? <> <CheckCircle2 className="w-4 h-4 text-emerald-300" /> <span>Sent to University!</span> </> : <> <Send className="w-3.5 h-3.5" /> <span>Send Prototype to University</span> </>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendPrototypeModal;
