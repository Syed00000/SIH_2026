import React, { useState } from 'react';
import { universityApiService } from '../../services/universityApiService.js';
import { ProfileModalHeader } from './modal/ProfileModalHeader.jsx';
import { ProfileBasicInfoTab } from './modal/ProfileBasicInfoTab.jsx';
import { ProfileDepartmentsTab } from './modal/ProfileDepartmentsTab.jsx';
import { ProfileResearchFacilitiesTab } from './modal/ProfileResearchFacilitiesTab.jsx';
import { ProfileModalFooter } from './modal/ProfileModalFooter.jsx';

export const EditUniversityProfileModal = ({ isOpen, onClose, profileData, onSaveSuccess }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    name: profileData?.name || 'Ranchi University',
    shortName: profileData?.shortName || 'RU',
    universityType: profileData?.universityType || 'State University',
    establishmentYear: profileData?.establishmentYear || 1960,
    accreditationGrade: profileData?.accreditation?.naacGrade || 'NAAC A+',
    tagline: profileData?.tagline || 'Ranchi University is a premier state university committed to quality education, research and societal impact.',
    about: profileData?.about || 'Ranchi University has a rich legacy of academic excellence and research.',
    website: profileData?.website || 'www.ranchiuniversity.ac.in',
    universityPhone: profileData?.universityPhone || '+91 651 220 1234',
    campusAddress: profileData?.address?.campus || 'Ranchi University, Morabadi, Ranchi, Jharkhand - 834008',
    district: profileData?.address?.district || profileData?.district || 'Ranchi',
    state: profileData?.address?.state || 'Jharkhand',
    pincode: profileData?.address?.pincode || '834008',
    departments: profileData?.departments?.length ? [...profileData.departments] : [
      { name: 'Computer Science & Engineering', facultyCount: 18 },
      { name: 'Civil Engineering', facultyCount: 14 }
    ],
    researchAreas: profileData?.researchAreas?.length ? [...profileData.researchAreas] : ['Artificial Intelligence', 'Water Technology'],
    facilities: profileData?.facilities?.length ? [...profileData.facilities] : ['AI & Data Science Lab', 'Water Testing Lab']
  });

  const [newResearchArea, setNewResearchArea] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptFaculty, setNewDeptFaculty] = useState(5);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddResearchArea = (e) => {
    e.preventDefault();
    if (!newResearchArea.trim()) return;
    if (!formData.researchAreas.includes(newResearchArea.trim())) {
      setFormData((prev) => ({ ...prev, researchAreas: [...prev.researchAreas, newResearchArea.trim()] }));
    }
    setNewResearchArea('');
  };

  const handleRemoveResearchArea = (area) => {
    setFormData((prev) => ({ ...prev, researchAreas: prev.researchAreas.filter((a) => a !== area) }));
  };

  const handleAddFacility = (e) => {
    e.preventDefault();
    if (!newFacility.trim()) return;
    if (!formData.facilities.includes(newFacility.trim())) {
      setFormData((prev) => ({ ...prev, facilities: [...prev.facilities, newFacility.trim()] }));
    }
    setNewFacility('');
  };

  const handleRemoveFacility = (fac) => {
    setFormData((prev) => ({ ...prev, facilities: prev.facilities.filter((f) => f !== fac) }));
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      departments: [...prev.departments, { name: newDeptName.trim(), facultyCount: Number(newDeptFaculty) || 1 }]
    }));
    setNewDeptName('');
    setNewDeptFaculty(5);
  };

  const handleRemoveDepartment = (idx) => {
    setFormData((prev) => ({ ...prev, departments: prev.departments.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await universityApiService.updateProfile(formData);
      setSuccessMsg('Profile updated successfully!');
      if (onSaveSuccess) onSaveSuccess(formData);
      setTimeout(() => { onClose(); setSuccessMsg(null); }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to save university profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 text-left">
        <ProfileModalHeader activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} />

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1">
            {activeTab === 'basic' && <ProfileBasicInfoTab formData={formData} handleInputChange={handleInputChange} />}
            {activeTab === 'departments' && (
              <ProfileDepartmentsTab
                formData={formData}
                newDeptName={newDeptName}
                setNewDeptName={setNewDeptName}
                newDeptFaculty={newDeptFaculty}
                setNewDeptFaculty={setNewDeptFaculty}
                handleAddDepartment={handleAddDepartment}
                handleRemoveDepartment={handleRemoveDepartment}
              />
            )}
            {activeTab === 'research' && (
              <ProfileResearchFacilitiesTab
                formData={formData}
                newResearchArea={newResearchArea}
                setNewResearchArea={setNewResearchArea}
                handleAddResearchArea={handleAddResearchArea}
                handleRemoveResearchArea={handleRemoveResearchArea}
                newFacility={newFacility}
                setNewFacility={setNewFacility}
                handleAddFacility={handleAddFacility}
                handleRemoveFacility={handleRemoveFacility}
              />
            )}
          </div>

          <ProfileModalFooter isSaving={isSaving} error={error} successMsg={successMsg} onClose={onClose} />
        </form>
      </div>
    </div>
  );
};

export default EditUniversityProfileModal;
