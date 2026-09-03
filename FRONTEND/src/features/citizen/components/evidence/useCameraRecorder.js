import { useState, useRef, useEffect } from 'react';
import { MAX_RECORDING_SECONDS } from './evidenceValidation.js';

const getSupportedVideoMimeType = () => {
  if (typeof MediaRecorder === 'undefined') return '';
  const types = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
};

export const useCameraRecorder = ({ onCaptureFile, photoInputRef, videoInputRef }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('photo');
  const [facingMode, setFacingMode] = useState('environment');
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stream]);

  const initStream = async (facing = facingMode, currentMode = mode) => {
    setError('');
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (currentMode === 'video' && videoInputRef.current) videoInputRef.current.click();
        else if (photoInputRef.current) photoInputRef.current.click();
        return;
      }

      const constraints = {
        video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: currentMode === 'video'
      };

      let newStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        if (currentMode === 'video') {
          newStream = await navigator.mediaDevices.getUserMedia({ video: constraints.video, audio: false });
        } else {
          throw err;
        }
      }

      setStream(newStream);
      setIsActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play().catch(() => {});
        }
      }, 150);
    } catch (err) {
      console.warn('Camera stream failed:', err);
      if (currentMode === 'video' && videoInputRef.current) videoInputRef.current.click();
      else if (photoInputRef.current) photoInputRef.current.click();
      else setError('Unable to open camera. Please select file from device.');
    }
  };

  const openCamera = (m = 'photo') => {
    setMode(m);
    setIsRecording(false);
    setRecordingSeconds(0);
    initStream(facingMode, m);
  };

  const flipCamera = () => {
    if (isRecording) return;
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    initStream(nextFacing, mode);
  };

  const switchMode = (m) => {
    if (isRecording || m === mode) return;
    setMode(m);
    setIsRecording(false);
    setRecordingSeconds(0);
    initStream(facingMode, m);
  };

  const closeCamera = () => {
    if (isRecording && mediaRecorderRef.current) {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setStream(null);
    setIsRecording(false);
    setIsActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth || 1280;
    c.height = v.videoHeight || 720;
    const ctx = c.getContext('2d');
    if (facingMode === 'user') {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0, c.width, c.height);

    c.toBlob((blob) => {
      if (!blob) return;
      closeCamera();
      onCaptureFile(new File([blob], `camera_evidence_${Date.now()}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.9);
  };

  const startRecording = () => {
    if (!stream) return;
    recordedChunksRef.current = [];
    const mimeType = getSupportedVideoMimeType();

    try {
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      rec.ondataavailable = (e) => {
        if (e.data?.size > 0) recordedChunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        if (recordedChunksRef.current.length === 0) return;
        const blobType = mimeType || 'video/webm';
        const blob = new Blob(recordedChunksRef.current, { type: blobType });
        const ext = blobType.includes('mp4') ? 'mp4' : 'webm';
        closeCamera();
        onCaptureFile(new File([blob], `video_evidence_${Date.now()}.${ext}`, { type: blobType }));
      };

      rec.start(1000);
      mediaRecorderRef.current = rec;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          if (s >= MAX_RECORDING_SECONDS - 1) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch (err) {
      setError('Recording failed: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  return {
    isActive, mode, facingMode, error, isRecording, recordingSeconds,
    videoRef, canvasRef, openCamera, closeCamera, flipCamera, switchMode,
    capturePhoto, startRecording, stopRecording
  };
};

export default useCameraRecorder;
