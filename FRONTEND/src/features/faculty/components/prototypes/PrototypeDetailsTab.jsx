import React, { useState } from 'react';
import { FileUp, FileText, ExternalLink, Loader2, CheckCircle2, Cpu, Globe } from 'lucide-react';
import { facultyApiService } from '../../services/facultyApiService.js';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const PrototypeDetailsTab = ({ project, prototypeData, onChangeData, isLocked, onRefresh }) => {
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const pId = project?.projectId || project?.challengeId || project?._id;
  const currentPdfUrl = prototypeData?.pdfUrl || project?.pdfUrl || project?.prototypeData?.pdfUrl;
  const currentPdfName = prototypeData?.pdfName || project?.pdfName || project?.prototypeData?.pdfName || 'Prototype_Blueprint_Dossier.pdf';

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
    <div className="space-y-4 text-left select-none">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Cpu className="w-4 h-4 text-[#007A61]" />
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            1. Prototype Architecture & Hardware-Software Stack
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
              Prototype Working Title / Nomenclature
            </label>
            <input
              type="text"
              disabled={isLocked}
              value={prototypeData?.title || ''}
              onChange={(e) => onChangeData('title', e.target.value)}
              placeholder="e.g., IoT Solar Telemetry Node v2.1"
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-[#007A61]"
            />
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
              Core Tech Stack & Controller Array
            </label>
            <input
              type="text"
              disabled={isLocked}
              value={prototypeData?.techStack || ''}
              onChange={(e) => onChangeData('techStack', e.target.value)}
              placeholder="e.g., ESP32, FreeRTOS, LoRaWAN, Python FastApi"
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-[#007A61]"
            />
          </div>
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
            Working Mechanism & Methodology
          </label>
          <textarea
            disabled={isLocked}
            rows={3}
            value={prototypeData?.mechanism || ''}
            onChange={(e) => onChangeData('mechanism', e.target.value)}
            placeholder="Describe the end-to-end mechanism, circuit loops, sensor integration, real-time telemetry pipelines, and fail-safe automation..."
            className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-[#007A61]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">
              Bill of Materials (BOM) & Key Sensors
            </label>
            <input
              type="text"
              disabled={isLocked}
              value={prototypeData?.bomSensors || ''}
              onChange={(e) => onChangeData('bomSensors', e.target.value)}
              placeholder="e.g., MQ-135, DHT22, SX1276 LoRa, LiFePO4 5000mAh"
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-[#007A61]"
            />
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1 flex items-center space-x-1">
              <Globe className="w-3 h-3 text-[#007A61]" />
              <span>Live Simulation / Demo URL (Optional)</span>
            </label>
            <input
              type="url"
              disabled={isLocked}
              value={prototypeData?.demoUrl || ''}
              onChange={(e) => onChangeData('demoUrl', e.target.value)}
              placeholder="https://wokwi.com/projects/... or live telemetry dashboard"
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-[#007A61]"
            />
          </div>
        </div>
      </div>

      {/* PDF Upload Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
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
          <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
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
    </div>
  );
};

export default PrototypeDetailsTab;
