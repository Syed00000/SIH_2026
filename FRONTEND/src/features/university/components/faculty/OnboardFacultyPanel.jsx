import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { FacultyOnboardHeader } from './onboard/FacultyOnboardHeader.jsx';
import { FacultyOnboardFormFields } from './onboard/FacultyOnboardFormFields.jsx';
import { FacultyOnboardPreviewCard } from './onboard/FacultyOnboardPreviewCard.jsx';

export const OnboardFacultyPanel = ({ onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    designation: 'Associate Professor',
    department: 'Water Resources Engineering',
    email: '',
    phone: '',
    qualification: 'Ph.D. in Engineering',
    experience: '8 Years',
    specialization: 'Water Quality, IoT Sensors, Data Analysis',
    bio: '',
    maxProjects: 4,
    availabilityStatus: 'Available',
    password: ''
  });

  const initials = formData.name
    ? formData.name.replace(/^Dr\.\s*|^Prof\.\s*/i, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'FM'
    : 'FM';

  const specsList = formData.specialization
    ? formData.specialization.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        designation: formData.designation,
        department: formData.department,
        email: formData.email,
        phone: formData.phone || '+91 98351 22334',
        qualification: formData.qualification,
        experience: formData.experience,
        specialization: specsList.length > 0 ? specsList : ['Applied Research', 'Innovation'],
        bio: formData.bio || `${formData.name} is specialized in ${formData.department} with active contributions to grassroots research.`,
        password: formData.password || 'Faculty@123456',
        status: 'Active',
        availabilityStatus: formData.availabilityStatus || 'Available',
        activeProjects: 0,
        completedProjects: 0
      };

      await universityApiService.createFaculty(payload);
      setSuccessMessage(`Faculty mentor "${formData.name}" successfully registered and onboarded into Ranchi University node!`);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else if (onBack) onBack();
      }, 1200);
    } catch (err) {
      console.error('Failed to onboard faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      <FacultyOnboardHeader onBack={onBack} />

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center space-x-2.5 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 space-y-4">
          <FacultyOnboardFormFields
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </div>

        <div className="lg:col-span-4 sticky top-6">
          <FacultyOnboardPreviewCard
            formData={formData}
            initials={initials}
            specsList={specsList}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default OnboardFacultyPanel;
