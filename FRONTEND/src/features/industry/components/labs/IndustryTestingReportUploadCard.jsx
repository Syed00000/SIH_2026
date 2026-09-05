import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Lock, ExternalLink, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';
import { facultyProjectsApi } from '../../../university/services/api/facultyProjectsApi.js';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const IndustryTestingReportUploadCard = ({ project, stages = [], allStagesCompleted = false, onDossierSubmitted }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(project?.testingReportPdfUrl || '');
  const [pdfName, setPdfName] = useState(project?.testingReportPdfName || '');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(Boolean(project?.testingCompleted || project?.prototypeStatus === 'Pending Approval'));
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleRemoveOrReplacePdf = async () => {
    if (submitted) return;
    const targetId = project?.projectId || project?.id || project?.requestId;
    const targetCode = project?.universityCode || 'RU001';
    try {
      await facultyProjectsApi.deleteProjectPdf(targetId, 'testing-report', targetCode);
    } catch (_) {}
    setPdfUrl('');
    setPdfName('');
    setPdfFile(null);
  };

  useEffect(() => {
    if (project?.testingReportPdfUrl && !pdfUrl) {
      setPdfUrl(project.testingReportPdfUrl);
      setPdfName(project.testingReportPdfName || 'Certified_Lab_Report.pdf');
    }
    if (project?.testingCompleted || project?.prototypeStatus === 'Pending Approval') {
      setSubmitted(true);
    }
  }, [project?.testingReportPdfUrl, project?.testingCompleted, project?.prototypeStatus]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') return setErrorMsg('Only PDF documents are allowed.');
    if (file.size > 1024 * 1024) return setErrorMsg('File size exceeds 1MB limit. Please upload a PDF under 1MB.');

    setPdfFile(file);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('type', 'testing-report');
      const targetId = project?.projectId || project?.id || project?.requestId;
      const targetCode = project?.universityCode || 'RU001';
      const res = await fetch(`http://localhost:3000/api/v1/university/projects/${encodeURIComponent(targetId)}/upload-pdf?universityCode=${encodeURIComponent(targetCode)}`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data?.data?.url || data?.data?.pdfUrl) {
        setPdfUrl(data.data.url || data.data.pdfUrl);
        setPdfName(data.data.fileName || file.name);
      } else {
        throw new Error(data?.error?.message || 'Upload failed');
      }
    } catch (err) {
      setErrorMsg('Upload error: ' + err.message);
      setPdfFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitDossier = async () => {
    if (!pdfUrl || submitting) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const targetId = project?.requestId || project?.id || project?.projectId;
      const targetCode = project?.universityCode || 'RU001';
      await universityApiService.updateIndustryRequestStatus(targetId, 'Approved', targetCode, {
        testingStages: stages,
        testingReportPdfUrl: pdfUrl,
        testingReportPdfName: pdfName || 'Certified_Lab_Report.pdf',
        submitDossier: true
      });
      setSubmitted(true);
      onDossierSubmitted && onDossierSubmitted();
    } catch (err) {
      setErrorMsg('Failed to submit testing dossier: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (project?.isDeployed || project?.status === 'Deployed') {
    return (
      <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-4 text-center space-y-1 select-none">
        <CheckCircle2 className="w-6 h-6 text-emerald-700 mx-auto" />
        <h5 className="text-xs font-black text-emerald-950">✓ Project Deployed & Challenge Resolved</h5>
        <p className="text-[11px] text-emerald-800 max-w-md mx-auto">
          State Government (DHTE) has officially certified and deployed this project. Submissions are locked.
        </p>
      </div>
    );
  }

  if (!allStagesCompleted) {
    return (
      <div className="bg-slate-50/80 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center space-y-1.5 select-none">
        <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center mx-auto"><Lock className="w-3.5 h-3.5" /></div>
        <h5 className="text-xs font-black text-slate-700">Certified Lab Report Upload Locked</h5>
        <p className="text-[11px] text-slate-500 max-w-md mx-auto">
          Complete all 3 testing stages above to activate official PDF lab report upload and submit dossier for University Prototype Approval.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 shadow-2xs space-y-3.5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#007A61]"><FileText className="w-4 h-4" /></div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Certified Laboratory Testing Report (PDF)</h4>
            <p className="text-[10.5px] text-slate-500">Upload official certified evaluation dossier (PDF under 1MB)</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black border border-emerald-200">STAGES COMPLETED</span>
      </div>
      </div>

      {errorMsg && (
        <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {pdfUrl ? (
        <div className="p-2.5 bg-emerald-50/80 border border-emerald-300 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 min-w-0">
            <FileText className="w-4 h-4 text-[#007A61] shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-black text-slate-900 truncate block">{pdfName || 'Certified_Lab_Report.pdf'}</span>
              <span className="text-[10px] text-emerald-700 font-bold block">✓ Verified Cloudinary PDF (&lt; 1MB)</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <a href={getPdfViewUrl(pdfUrl, pdfName)} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-2xs cursor-pointer">
              <span>View PDF</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {!submitted && (
              <button type="button" onClick={handleRemoveOrReplacePdf} className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer" title="Remove PDF">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()} className="p-5 border-2 border-dashed border-emerald-300 hover:border-[#007A61] bg-emerald-50/30 hover:bg-emerald-50/60 rounded-xl text-center cursor-pointer transition-colors space-y-1.5">
          <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" onChange={handleFileChange} className="hidden" />
          {uploading ? (
            <div className="flex flex-col items-center space-y-1 text-emerald-700">
              <Loader2 className="w-5 h-5 animate-spin" /><span className="text-xs font-bold">Uploading certified PDF to Cloudinary...</span>
            </div>
          ) : (
            <>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#007A61] flex items-center justify-center mx-auto"><Upload className="w-3.5 h-3.5" /></div>
              <p className="text-xs font-black text-slate-800">Click or drag &amp; drop to upload certified test report PDF</p>
              <p className="text-[10px] text-slate-500">Only PDF files under 1MB are accepted</p>
            </>
          )}
        </div>
      )}

      {submitted ? (
        <div className="p-2.5 bg-emerald-100/90 border border-emerald-300 rounded-xl flex items-center justify-between text-xs font-black text-emerald-900 shadow-2xs">
          <div className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-[#007A61] shrink-0" /><span>Certified Testing Dossier &amp; Report Successfully Submitted to University!</span></div>
          <span className="px-2 py-0.5 bg-white text-emerald-800 rounded-md font-mono text-[10px]">PENDING APPROVAL</span>
        </div>
      ) : (
        <button
          type="button"
          disabled={!pdfUrl || submitting}
          onClick={handleSubmitDossier}
          className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all shadow-md ${
            pdfUrl ? 'bg-[#007A61] hover:bg-[#00604c] text-white cursor-pointer animate-pulse' : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" /><span className="ml-2">Submitting Dossier to University...</span></>) : (<><CheckCircle2 className="w-4 h-4" /><span className="ml-2">{pdfUrl ? 'Submit Certified Lab Report to University for Prototype Approval' : 'Upload PDF Report Above to Activate Submission'}</span></>)}
        </button>
      )}
    </div>
  );
};

export default IndustryTestingReportUploadCard;
