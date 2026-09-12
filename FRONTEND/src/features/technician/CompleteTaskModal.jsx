import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Wrench, FileText, Camera, RefreshCw } from 'lucide-react';

export const CompleteTaskModal = ({ challenge, isOpen, onClose, onConfirm, completing }) => {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setRemarks('');
      setError('');
      setAttachment(null);
    }
  }, [isOpen]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  if (!isOpen || !challenge) return null;

  const startCamera = async () => {
    setError('');
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError('Could not access the camera. Please check permissions.');
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setAttachment(dataUrl);
      stopCamera();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setError('Please enter field remediation details / work summary before completing.');
      return;
    }
    setError('');
    onConfirm(challenge, remarks.trim(), attachment);
  };

  const setQuickRemark = (text) => {
    setRemarks((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black leading-tight">Mark Assignment as Completed</h3>
              <p className="text-[11px] text-slate-500 font-medium">Record ground action to resolve citizen problem</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={completing} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Snapshot */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.5 rounded">
                {challenge.challengeId || challenge.id}
              </span>
              <span className="font-bold text-slate-900 truncate">{challenge.title}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Location: <strong className="text-slate-700">{challenge.location?.panchayatOrWard || challenge.location?.panchayat || challenge.district || 'Field Area'}</strong>
            </p>
          </div>

          {/* Quick Remarks */}
          <div>
            <span className="block text-[11px] font-bold text-slate-600 mb-1.5">Quick Action Tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {['Ground inspection completed', 'Defective wiring repaired', 'Service supply restored', 'Safety hazard cleared', 'Component replaced'].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setQuickRemark(tag)}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 text-[10.5px] font-semibold text-slate-700 transition cursor-pointer"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Remediation / Work Completion Summary *
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Describe work performed on site, parts repaired/replaced, and final ground status..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-xs resize-none"
              disabled={completing}
              required
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              This summary will be published to the citizen portal and department administration.
            </span>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
              <span>Capture Valid Proof (Photo)</span>
              {attachment && <span className="text-[10px] text-emerald-600 font-bold">Proof Captured</span>}
            </label>

            {attachment ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-32 flex items-center justify-center">
                <img src={attachment} alt="Captured proof" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setAttachment(null); startCamera(); }}
                  className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 text-slate-700 rounded-lg shadow-sm text-[10px] font-bold flex items-center gap-1 hover:bg-white cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retake
                </button>
              </div>
            ) : isCameraOpen ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-black h-48 flex items-center justify-center flex-col">
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-slate-300 hover:border-emerald-500 shadow-md transition-all cursor-pointer z-10"
                />
                <button
                  type="button"
                  onClick={stopCamera}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 cursor-pointer z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                disabled={completing}
                className="w-full h-24 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#007A61] bg-slate-50 hover:bg-[#007A61]/5 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-6 h-6 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-600">Open Camera</span>
              </button>
            )}

            <span className="text-[10px] text-slate-400 block mt-1.5">
              Capture a live photo verifying the completed work. This evidence is required for the Ward Commissioner's cross-check.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={completing}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={completing}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completing ? 'Resolving Task...' : 'Confirm Work Completed'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
