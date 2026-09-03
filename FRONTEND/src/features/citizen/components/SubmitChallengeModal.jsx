import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { citizenService } from '../services/citizenService.js';
import { SubmitChallengeFormFields } from './SubmitChallengeFormFields.jsx';
import { SubmitChallengeSuccessView } from './SubmitChallengeSuccessView.jsx';
import { validateChallengeForm, buildChallengePayload } from './helpers/challengeSubmission.helper.js';

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
    affectedPopulation: '500 - 2,000 people (Village / Ward)',
    media: []
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

    const validationError = validateChallengeForm(formData, finalDomain);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = buildChallengePayload(formData, finalDomain, user);
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
      submittedChallenge={submittedChallenge}
      formData={formData}
      onClose={onClose}
      setSubmittedChallenge={setSubmittedChallenge}
      setFormData={setFormData}
      user={user}
    />
  ) : (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
        error={error}
      />
    </form>
  );

  if (isInline) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {formBody}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Submit Local Problem Statement
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Report an urgent ground issue in Jharkhand for university student innovation
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">{formBody}</div>
      </div>
    </div>
  );
};

export default SubmitChallengeModal;
