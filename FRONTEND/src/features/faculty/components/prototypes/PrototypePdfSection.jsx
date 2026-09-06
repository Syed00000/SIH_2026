import React, { useState } from 'react';
import { FileUp, FileText, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { facultyApiService } from '../../services/facultyApiService.js';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const PrototypePdfSection = ({
  pId,
  currentPdfUrl,
  currentPdfName = 'Prototype_Blueprint_Dossier.pdf',
  isLocked,
  onChangeData,
  onRefresh
}) => {
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || isLocked) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Only PDF documents (.pdf) are allowed.');
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      alert('PDF file size must be under 1MB.');
      return;
    }
    setUploadingPdf(true);
    setUploadMsg('Uploading blueprint to Cloudinary...');
    try {
      const res = await facultyApiService.uploadProjectPdf(pId, file);
      const accessUrl = res?.url || res?.pdfUrl || res?.accessUrl || res?.data?.url || res?.data?.pdfUrl;
      onChangeData('pdfUrl', accessUrl || 'uploaded');
      onChangeData('pdfName', file.name);
      setUploadMsg('✓ Technical PDF uploaded & saved to database!');
      if (onRefresh) await onRefresh();
      setTimeout(() => setUploadMsg(''), 4000);
    } catch (err) {
      setUploadMsg('Upload failed: ' + (err.message || 'Error'));
    } finally {
      setUploadingPdf(false);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#007A61]" />
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            2. Technical Dossier & CAD Schematic (Official PDF)
          </h4>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
          PDF Document (&lt; 1MB)
        </span>
      </div>

      {currentPdfUrl ? (
        <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#007A61] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{currentPdfName}</div>
              <div className="text-[10.5px] text-emerald-800 font-semibold">
                Official Prototype Blueprint & Report Verified in Cloud Storage ✓
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={getPdfViewUrl(currentPdfUrl, currentPdfName)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View PDF</span>
            </a>
            {!isLocked && (
              <label className="px-3 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1">
                <FileUp className="w-3.5 h-3.5" />
                <span>Replace PDF</span>
                <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
              </label>
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-6 text-center bg-slate-50/50 transition-colors">
          <FileUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Upload Prototype Blueprint, CAD Diagram, or DPR Report</p>
          <p className="text-[11px] text-slate-400 mt-0.5">PDF format only. Maximum file size: 1 MB.</p>
          {!isLocked && (
            <label className="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer">
              {uploadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
              <span>{uploadingPdf ? 'Uploading to Cloudinary...' : 'Select Prototype PDF'}</span>
              <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} disabled={uploadingPdf} />
            </label>
          )}
        </div>
      )}
      {uploadMsg && <p className="text-[11px] font-bold text-emerald-700 mt-1">{uploadMsg}</p>}
    </div>
  );
};

export default PrototypePdfSection;
