import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { citizenService } from '../services/citizenService.js';
import { SubmitChallengeFormFields } from './SubmitChallengeFormFields.jsx';
import { SubmitChallengeSuccessView } from './SubmitChallengeSuccessView.jsx';

export const SubmitChallengeModal = ({
  isOpen = true,
  onClose,
  user,
  onSuccess,
  isInline = false,
  defaultDomain = 'Urban Development'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    domain: defaultDomain || 'Urban Development',
    description: '',
    district: 'Ranchi',
    block: '',
    panchayatOrWard: '',
    landmark: '',
    pincode: '',
    fullAddress: '',
    submitterName: user?.fullName || '',
    submitterPhone: user?.mobileNumber || '',
    submitterEmail: user?.email || '',
    submitterRole: 'Citizen',
    designation: '',
    organization: '',
    priority: 'Medium',
    affectedPopulation: '',
    mediaUrl: ''
  });

  const [customDomain, setCustomDomain] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedChallenge, setSubmittedChallenge] = useState(null);

  useEffect(() => {
    if (defaultDomain && defaultDomain !== 'All') {
      setFormData((prev) => ({ ...prev, domain: defaultDomain }));
    }
  }, [defaultDomain]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'domain' && value === 'Other') {
      setIsCustomMode(true);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePresetPhoto = (url) => {
    setFormData((prev) => ({ ...prev, mediaUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalDomain =
      (isCustomMode || formData.domain === 'Other') && customDomain.trim()
        ? customDomain.trim()
        : formData.domain;

    if (!formData.title.trim()) {
      setError('Please enter a challenge heading / title');
      return;
    }
    if (!finalDomain) {
      setError('Please select or specify a challenge area / domain');
      return;
    }
    if (!formData.description.trim() || formData.description.length < 15) {
      setError('Please provide a detailed problem statement of at least 15 characters');
      return;
    }
    if (!formData.district) {
      setError('Please select a district in Jharkhand');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        domain: finalDomain,
        description: formData.description,
        district: formData.district,
        block: formData.block,
        panchayatOrWard: formData.panchayatOrWard,
        landmark: formData.landmark,
        pincode: formData.pincode,
        fullAddress:
          formData.fullAddress ||
          `${formData.landmark ? formData.landmark + ', ' : ''}${
            formData.block ? formData.block + ', ' : ''
          }${formData.district}, Jharkhand`,
        submitterName: formData.submitterName,
        submitterPhone: formData.submitterPhone || '9876543210',
        submitterEmail: formData.submitterEmail,
        submitterRole: formData.submitterRole,
        designation: formData.designation,
        organization: formData.organization,
        priority: formData.priority,
        affectedPopulation: formData.affectedPopulation || '~ 1,000+ residents',
        mediaUrls: formData.mediaUrl
          ? [{ url: formData.mediaUrl, caption: 'Submitted issue photo' }]
          : []
      };

      const result = await citizenService.submitChallenge(payload);
      setSubmittedChallenge(result);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError(err.message || 'Failed to submit problem statement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formBody = submittedChallenge ? (
    <SubmitChallengeSuccessView
      challenge={submittedChallenge}
      defaultDomain={formData.domain}
      onClose={() => {
        setSubmittedChallenge(null);
        if (onClose) onClose();
      }}
    />
  ) : (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <SubmitChallengeFormFields
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        handlePresetPhoto={handlePresetPhoto}
        customDomain={customDomain}
        setCustomDomain={setCustomDomain}
        isCustomMode={isCustomMode}
        setIsCustomMode={setIsCustomMode}
        loading={loading}
        onClose={onClose}
      />
    </form>
  );

  if (isInline) {
    return (
      <div className="space-y-5 text-left pb-6 animate-fadeIn w-full">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Submit a Problem Statement
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Department of Higher and Technical Education &bull; Jharkhand Societal Innovation Portal
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs">
          {formBody}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f4f8f5] flex flex-col h-screen w-screen overflow-hidden text-left animate-in fade-in duration-150">
      <div className="px-6 py-3.5 bg-[#064e3b] text-white flex items-center justify-between flex-shrink-0 shadow-xs border-b border-emerald-900/30">
        <div>
          <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
            Submit a Problem Statement
          </h3>
          <p className="text-xs text-emerald-100/90 font-medium">
            Jharkhand Societal Innovation Portal &bull; Department of Higher and Technical Education
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center cursor-pointer"
          title="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col items-center custom-scrollbar">
        <div className="max-w-4xl w-full bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs">
          {formBody}
        </div>
      </div>
    </div>
  );
};

export default SubmitChallengeModal;
