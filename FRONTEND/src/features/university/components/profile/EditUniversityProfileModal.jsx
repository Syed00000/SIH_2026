import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Building2,
  Calendar,
  Globe,
  Phone,
  MapPin,
  Award,
  BookOpen,
  FlaskConical,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck
} from 'lucide-react';

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
    tagline:
      profileData?.tagline ||
      'Ranchi University is a premier state university committed to quality education, research and solving real-world problems for societal impact.',
    about:
      profileData?.about ||
      'Ranchi University has a rich legacy of academic excellence and research. We collaborate with industries, government and communities to develop innovative solutions for real-world challenges, especially in the areas of sustainability, technology and social development.',
    website: profileData?.website || 'www.ranchiuniversity.ac.in',
    universityPhone: profileData?.universityPhone || '+91 651 220 1234',
    campusAddress: profileData?.address?.campus || 'Ranchi University, Morabadi, Ranchi, Jharkhand - 834008',
    district: profileData?.address?.district || profileData?.district || 'Ranchi',
    state: profileData?.address?.state || 'Jharkhand',
    pincode: profileData?.address?.pincode || '834008',
    departments: profileData?.departments?.length
      ? [...profileData.departments]
      : [
          { name: 'Computer Science & Engineering', facultyCount: 18 },
          { name: 'Civil Engineering', facultyCount: 14 },
          { name: 'Electrical Engineering', facultyCount: 12 },
          { name: 'Mechanical Engineering', facultyCount: 10 },
          { name: 'Chemistry', facultyCount: 8 },
          { name: 'Biotechnology', facultyCount: 6 },
          { name: 'Environmental Science', facultyCount: 5 },
          { name: 'Social Work', facultyCount: 4 }
        ],
    researchAreas: profileData?.researchAreas?.length
      ? [...profileData.researchAreas]
      : [
          'Artificial Intelligence',
          'IoT & Embedded Systems',
          'Water Technology',
          'Smart Agriculture',
          'Renewable Energy',
          'Public Health',
          'Data Science',
          'Environmental Studies',
          'Materials Science'
        ],
    facilities: profileData?.facilities?.length
      ? [...profileData.facilities]
      : [
          'AI & Data Science Lab',
          'IoT & Embedded Systems Lab',
          'Water Testing & Quality Lab',
          'Renewable Energy Lab',
          'Innovation & Incubation Centre',
          '3D Printing & Prototyping Lab',
          'Smart Classroom Facility'
        ]
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
      setFormData((prev) => ({
        ...prev,
        researchAreas: [...prev.researchAreas, newResearchArea.trim()]
      }));
    }
    setNewResearchArea('');
  };

  const handleRemoveResearchArea = (areaToRemove) => {
    setFormData((prev) => ({
      ...prev,
      researchAreas: prev.researchAreas.filter((a) => a !== areaToRemove)
    }));
  };

  const handleAddFacility = (e) => {
    e.preventDefault();
    if (!newFacility.trim()) return;
    if (!formData.facilities.includes(newFacility.trim())) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
    }
    setNewFacility('');
  };

  const handleRemoveFacility = (facilityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facilityToRemove)
    }));
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

  const handleRemoveDepartment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name: formData.name,
        shortName: formData.shortName,
        universityType: formData.universityType,
        establishmentYear: Number(formData.establishmentYear),
        tagline: formData.tagline,
        about: formData.about,
        website: formData.website,
        universityPhone: formData.universityPhone,
        accreditation: {
          naacGrade: formData.accreditationGrade
        },
        address: {
          campus: formData.campusAddress,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode
        },
        departments: formData.departments,
        researchAreas: formData.researchAreas,
        facilities: formData.facilities
      };

      await onSaveSuccess(payload);
      setSuccessMsg('University profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setError(err.message || 'Failed to update university profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white sticky top-0 z-20">
            <div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">Edit University Profile</h2>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Update institutional details, academic departments, research areas, and contact info.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Locked Identity Bar */}
          <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-zinc-700 font-medium">
              <Lock className="w-3.5 h-3.5 text-zinc-900" />
              <span>Official Identifiers & Credentials (Immutable)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded-md font-mono text-[11px] text-zinc-800 font-semibold">
                Code: {profileData?.code || 'RU001'}
              </span>
              <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded-md font-mono text-[11px] text-zinc-800 font-semibold">
                AISHE: {profileData?.aisheCode || 'U-0467'}
              </span>
              <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded-md font-mono text-[11px] text-zinc-800 font-semibold">
                Email: {profileData?.universityEmail || 'info@ranchiuniversity.ac.in'}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center px-6 pt-3 border-b border-zinc-200 bg-white gap-2">
            {[
              { id: 'basic', label: 'Basic Info & About', icon: Building2 },
              { id: 'contact', label: 'Contact & Location', icon: MapPin },
              { id: 'departments', label: 'Departments', icon: BookOpen },
              { id: 'research', label: 'Research & Labs', icon: FlaskConical }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-zinc-950 text-zinc-950'
                      : 'border-transparent text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content (Scrollable) */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {error && (
              <div className="p-3.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 text-xs font-medium flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-zinc-900" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-zinc-100 border border-zinc-300 rounded-lg text-zinc-950 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-zinc-950" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: BASIC INFO */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      University Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Short Name / Acronym
                    </label>
                    <input
                      type="text"
                      value={formData.shortName}
                      onChange={(e) => handleInputChange('shortName', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      University Type
                    </label>
                    <select
                      value={formData.universityType}
                      onChange={(e) => handleInputChange('universityType', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                    >
                      <option value="State University">State University</option>
                      <option value="Central University">Central University</option>
                      <option value="Private University">Private University</option>
                      <option value="Deemed University">Deemed University</option>
                      <option value="Institute of National Importance">Institute of National Importance</option>
                      <option value="Autonomous College">Autonomous College</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Established Year
                    </label>
                    <input
                      type="number"
                      value={formData.establishmentYear}
                      onChange={(e) => handleInputChange('establishmentYear', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Accreditation (NAAC)
                    </label>
                    <select
                      value={formData.accreditationGrade}
                      onChange={(e) => handleInputChange('accreditationGrade', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                    >
                      <option value="NAAC A++">NAAC A++</option>
                      <option value="NAAC A+">NAAC A+</option>
                      <option value="NAAC A">NAAC A</option>
                      <option value="NAAC B++">NAAC B++</option>
                      <option value="NAAC B+">NAAC B+</option>
                      <option value="NAAC B">NAAC B</option>
                      <option value="Non-Accredited">Non-Accredited</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Tagline / Brief Mission Statement
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-normal text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                    About University (Comprehensive Overview)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-normal text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: CONTACT & LOCATION */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Website URL
                    </label>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Official Phone / Helpline
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={formData.universityPhone}
                        onChange={(e) => handleInputChange('universityPhone', e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Campus Address & Location
                  </label>
                  <input
                    type="text"
                    value={formData.campusAddress}
                    onChange={(e) => handleInputChange('campusAddress', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-normal text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      District
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 text-xs space-y-2">
                  <div className="font-semibold text-zinc-900 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-zinc-900" />
                    <span>Protected Login Credentials</span>
                  </div>
                  <p className="text-zinc-500">
                    To change official login credentials or registered email (<code className="font-mono text-zinc-800">{profileData?.universityEmail}</code>), please request credential rotation via the Jharkhand State Higher Education Authority.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: DEPARTMENTS */}
            {activeTab === 'departments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Academic Departments ({formData.departments.length})
                  </span>
                </div>

                {/* Add new department */}
                <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <input
                    type="text"
                    placeholder="Department Name (e.g. Artificial Intelligence & DS)"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-white border border-zinc-200 rounded-md text-xs font-medium text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  />
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <input
                      type="number"
                      placeholder="Faculty Count"
                      value={newDeptFaculty}
                      onChange={(e) => setNewDeptFaculty(e.target.value)}
                      className="w-24 px-3.5 py-2 bg-white border border-zinc-200 rounded-md text-xs font-bold text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                    />
                    <button
                      type="button"
                      onClick={handleAddDepartment}
                      className="px-4 py-2 bg-zinc-950 text-white rounded-md text-xs font-semibold flex items-center space-x-1.5 hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Departments list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {formData.departments.map((dept, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-lg shadow-2xs hover:border-zinc-300 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                        <span className="text-xs font-semibold text-zinc-900">{dept.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200 text-[11px] font-semibold rounded-md">
                          {dept.facultyCount} Faculty
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDepartment(idx)}
                          className="p-1 text-zinc-400 hover:text-zinc-900 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: RESEARCH & LABS */}
            {activeTab === 'research' && (
              <div className="space-y-6">
                {/* Research Areas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Research Areas & Thrust Domains ({formData.researchAreas.length})
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add research domain (e.g. Nanotechnology)"
                      value={newResearchArea}
                      onChange={(e) => setNewResearchArea(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddResearchArea(e);
                        }
                      }}
                      className="flex-1 px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                    />
                    <button
                      type="button"
                      onClick={handleAddResearchArea}
                      className="px-4 py-2 bg-zinc-950 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 hover:bg-zinc-800 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.researchAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-900 rounded-md text-xs font-medium border border-zinc-200"
                      >
                        <Sparkles className="w-3 h-3 text-zinc-600" />
                        <span>{area}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveResearchArea(area)}
                          className="hover:text-zinc-600 cursor-pointer ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-zinc-200" />

                {/* Facilities & Labs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                      Labs & Advanced Facilities ({formData.facilities.length})
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add Lab / Infrastructure (e.g. Drone Testing Field)"
                      value={newFacility}
                      onChange={(e) => setNewFacility(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFacility(e);
                        }
                      }}
                      className="flex-1 px-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                    />
                    <button
                      type="button"
                      onClick={handleAddFacility}
                      className="px-4 py-2 bg-zinc-950 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 hover:bg-zinc-800 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {formData.facilities.map((fac, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                          <span>{fac}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(fac)}
                          className="p-1 text-zinc-400 hover:text-zinc-900 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 bg-white sticky bottom-0 z-20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-5 py-2 bg-zinc-950 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 hover:bg-zinc-800 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditUniversityProfileModal;
