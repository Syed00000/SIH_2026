import React, { useState, useEffect } from 'react';
import { universityApiService } from '../../services/universityApiService.js';
import { EditFacultyHeader } from './edit/EditFacultyHeader.jsx';
import { EditFacultyIdentityCard } from './edit/EditFacultyIdentityCard.jsx';
import { EditFacultyAcademicCard } from './edit/EditFacultyAcademicCard.jsx';
import { EditFacultyCapacityCard } from './edit/EditFacultyCapacityCard.jsx';

export const EditFacultyPanel = ({ faculty, onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const initialSpecs = Array.isArray(faculty?.specialization)
    ? faculty.specialization.join(', ')
    : typeof faculty?.specialization === 'string'
    ? faculty.specialization
    : 'Water Quality, IoT Sensors, Data Analysis';

  const [formData, setFormData] = useState({
    name: faculty?.name || '',
    designation: faculty?.designation || 'Associate Professor',
    department: faculty?.department || 'Water Resources Engineering',
    email: faculty?.email || '',
    phone: faculty?.phone || '',
    qualification: faculty?.qualification || 'Ph.D. in Engineering',
    experience: faculty?.experience || '8 Years',
    specialization: initialSpecs,
    bio: faculty?.bio || '',
    maxProjects: faculty?.maxProjects || 4,
    availabilityStatus: faculty?.availabilityStatus || 'Available',
    status: faculty?.status || 'Active',
    password: faculty?.password || ''
  });

  useEffect(() => {
    if (faculty) {
      const specs = Array.isArray(faculty.specialization)
        ? faculty.specialization.join(', ')
        : typeof faculty.specialization === 'string'
        ? faculty.specialization
        : '';
      setFormData({
        name: faculty.name || '',
        designation: faculty.designation || 'Associate Professor',
        department: faculty.department || 'Water Resources Engineering',
        email: faculty.email || '',
        phone: faculty.phone || '',
        qualification: faculty.qualification || 'Ph.D. in Engineering',
        experience: faculty.experience || '8 Years',
        specialization: specs,
        bio: faculty.bio || '',
        maxProjects: faculty.maxProjects || 4,
        availabilityStatus: faculty.availabilityStatus || 'Available',
        status: faculty.status || 'Active',
        password: faculty.password || ''
      });
    }
  }, [faculty]);

  if (!faculty) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No faculty selected for editing.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg">
          Back to Faculty Mentors
        </button>
      </div>
    );
  }

  const initials = formData.name
    ? formData.name.replace(/^Dr\.\s*|^Prof\.\s*/i, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'FM'
    : 'FM';

  const specsList = formData.specialization
    ? formData.specialization.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleQuickAddSkill = (skill) => {
    if (!specsList.includes(skill)) {
      const updated = specsList.length > 0 ? `${formData.specialization}, ${skill}` : skill;
      setFormData({ ...formData, specialization: updated });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = specsList.filter((s) => s !== skillToRemove).join(', ');
    setFormData({ ...formData, specialization: updated });
  };

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
        bio: formData.bio || `${formData.name} is specialized in ${formData.department}.`,
        status: formData.status || 'Active',
        availabilityStatus: formData.availabilityStatus || 'Available',
        maxProjects: Number(formData.maxProjects) || 4,
        ...(formData.password ? { password: formData.password } : {})
      };

      const facultyId = faculty._id || faculty.id || faculty.facultyId || faculty.name;
      const updated = await universityApiService.updateFaculty(facultyId, payload);
      setSuccessMessage(`Faculty profile for "${formData.name}" updated successfully!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(updated);
        else if (onBack) onBack();
      }, 1000);
    } catch (err) {
      console.error('Failed to update faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      <EditFacultyHeader onBack={onBack} loading={loading} />

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold">
          {successMessage}
        </div>
      )}

      <form id="edit-faculty-form" onSubmit={handleSubmit} className="space-y-4">
        <EditFacultyIdentityCard formData={formData} setFormData={setFormData} initials={initials} />
        <EditFacultyAcademicCard
          formData={formData}
          setFormData={setFormData}
          specsList={specsList}
          handleQuickAddSkill={handleQuickAddSkill}
          handleRemoveSkill={handleRemoveSkill}
        />
        <EditFacultyCapacityCard
          formData={formData}
          setFormData={setFormData}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </form>
    </div>
  );
};

export default EditFacultyPanel;
