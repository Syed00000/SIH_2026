import React, { useState, useRef } from 'react';
import { Camera, Video, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { citizenService } from '../../services/citizenService.js';
import { validateEvidenceFile } from './evidenceValidation.js';
import { useCameraRecorder } from './useCameraRecorder.js';
import { CameraRecorderModal } from './CameraRecorderModal.jsx';
import { EvidenceMediaGrid } from './EvidenceMediaGrid.jsx';

export const EvidenceUploader = ({
  mediaList = [],
  setMediaList,
  citizenId = null,
  challengeId = null,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const processAndUploadFile = async (file) => {
    setErrorMsg('');
    setSuccessMsg('');

    const validationError = validateEvidenceFile(file);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setUploading(true);
    setUploadProgressMsg(`Uploading ${file.name} securely...`);

    try {
      const response = await citizenService.uploadEvidence(file, {
        citizenId,
        challengeId,
        caption: file.name
      });

      const uploadedItem = response?.data || response;

      const mediaRecord = {
        mediaId: uploadedItem.mediaId || `MED-${Date.now()}`,
        url: uploadedItem.accessUrl || uploadedItem.url,
        fileName: uploadedItem.fileName || file.name,
        fileType:
          uploadedItem.fileType ||
          (file.type.startsWith('video/')
            ? 'video'
            : file.type === 'application/pdf'
              ? 'pdf'
              : 'image'),
        fileSize: uploadedItem.fileSize || file.size,
        mimeType: uploadedItem.mimeType || file.type,
        caption: uploadedItem.caption || file.name,
        uploadedAt: uploadedItem.createdAt || new Date().toISOString()
      };

      setMediaList((prev) => [...prev, mediaRecord]);
      setSuccessMsg(`"${file.name}" uploaded successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload evidence file. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgressMsg('');
    }
  };

  const camera = useCameraRecorder({
    onCaptureFile: processAndUploadFile,
    photoInputRef,
    videoInputRef
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processAndUploadFile(file);
    e.target.value = '';
  };

  const handleDeleteMedia = async (index, item) => {
    if (disabled) return;
    setErrorMsg('');
    setMediaList((prev) => prev.filter((_, i) => i !== index));

    if (item?.mediaId) {
      try {
        await citizenService.deleteEvidence(item.mediaId);
        setSuccessMsg('Media deleted permanently.');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.warn('Failed to delete media on backend:', err);
      }
    }
  };

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*,application/pdf" onChange={handleFileChange} disabled={disabled || uploading} />
      <input ref={photoInputRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} disabled={disabled || uploading} />
      <input ref={videoInputRef} type="file" className="hidden" accept="video/*" capture="environment" onChange={handleFileChange} disabled={disabled || uploading} />
      <canvas ref={camera.canvasRef} className="hidden" />

      {/* 3 Action Trigger Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => camera.openCamera('photo')}
          disabled={disabled || uploading}
          className="flex items-center space-x-2.5 p-3 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950 font-bold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer group active:scale-[0.98] disabled:opacity-60"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div className="text-left min-w-0">
            <div className="font-extrabold text-emerald-950 flex items-center space-x-1">
              <span className="truncate">Take Photo</span>
              <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full font-semibold shrink-0">CAM</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-medium truncate">Snap ground reality</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => camera.openCamera('video')}
          disabled={disabled || uploading}
          className="flex items-center space-x-2.5 p-3 rounded-xl border border-rose-300 bg-rose-50/70 hover:bg-rose-100/80 text-rose-950 font-bold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer group active:scale-[0.98] disabled:opacity-60"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div className="text-left min-w-0">
            <div className="font-extrabold text-rose-950 flex items-center space-x-1">
              <span className="truncate">Record Video</span>
              <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded-full font-semibold shrink-0">REC</span>
            </div>
            <div className="text-[10px] text-rose-700 font-medium truncate">Walkthrough & audio</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer group active:scale-[0.98] disabled:opacity-60"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Upload className="w-4 h-4" />
          </div>
          <div className="text-left min-w-0">
            <div className="font-extrabold text-slate-900 truncate">Upload File</div>
            <div className="text-[10px] text-slate-500 font-medium truncate">PDF (≤1MB) / Media</div>
          </div>
        </button>
      </div>

      {uploading && (
        <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center space-x-2.5 text-xs text-emerald-900 font-semibold animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-700 shrink-0" />
          <span>{uploadProgressMsg || 'Uploading evidence to secure storage...'}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <EvidenceMediaGrid mediaList={mediaList} onDelete={handleDeleteMedia} disabled={disabled || uploading} />
      <CameraRecorderModal camera={camera} />
    </div>
  );
};

export default EvidenceUploader;
