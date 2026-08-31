import React, { useState, useEffect } from 'react';
import { universityApiService } from '../../services/universityApiService.js';
import EditUniversityProfileModal from './EditUniversityProfileModal.jsx';
import { ProfileHeader } from './view/ProfileHeader.jsx';
import { ProfileStatsGrid } from './view/ProfileStatsGrid.jsx';
import { ProfileDepartmentsList } from './view/ProfileDepartmentsList.jsx';
import { ProfileResearchFacilities } from './view/ProfileResearchFacilities.jsx';

export const UniversityProfilePanel = ({ universityData }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await universityApiService.getProfile('RU001');
      setProfile(res || universityData || getFallbackProfile());
    } catch (err) {
      console.error('Error fetching university profile:', err);
      setProfile(universityData || getFallbackProfile());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSaveProfile = async (updatedData) => {
    const updated = await universityApiService.updateProfile(updatedData, profile?.code || 'RU001');
    if (updated) {
      setProfile(updated);
    } else {
      setProfile((prev) => ({
        ...prev,
        ...updatedData,
        lastUpdatedBy: { name: 'Dr. Ankit Verma', updatedAt: new Date() }
      }));
    }
  };

  const getFallbackProfile = () => ({
    name: 'Ranchi University',
    shortName: 'RU',
    code: 'RU001',
    aisheCode: 'U-0467',
    tagline: 'Ranchi University is a premier state university committed to quality education, research and societal impact.',
    about: 'Ranchi University has a rich legacy of academic excellence and research.',
    universityType: 'State University',
    establishmentYear: 1960,
    website: 'www.ranchiuniversity.ac.in',
    universityEmail: 'info@ranchiuniversity.ac.in',
    universityPhone: '+91 651 220 1234',
    accreditation: { naacGrade: 'NAAC A+', validity: '2028-12-31', nirfRanking: 85 },
    address: { campus: 'Morabadi, Ranchi, Jharkhand - 834008', district: 'Ranchi', state: 'Jharkhand', pincode: '834008' },
    stats: { facultyMembers: 128, students: 6240, activeTeams: 42, activeProjects: 28, completedProjects: 18 },
    departments: [
      { name: 'Computer Science & Engineering', facultyCount: 18 },
      { name: 'Civil Engineering', facultyCount: 14 }
    ],
    researchAreas: ['Artificial Intelligence', 'Water Technology', 'Smart Agriculture'],
    facilities: ['AI & Data Science Lab', 'Water Testing Lab', '3D Printing Lab']
  });

  if (loading && !profile) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs font-semibold">Loading university profile...</span>
      </div>
    );
  }

  const p = profile || getFallbackProfile();

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none">
      <ProfileHeader profile={p} onOpenEdit={() => setIsEditModalOpen(true)} />
      <ProfileStatsGrid profile={p} />
      <ProfileDepartmentsList departments={p.departments} />
      <ProfileResearchFacilities researchAreas={p.researchAreas} facilities={p.facilities} />

      <EditUniversityProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={p}
        onSaveSuccess={handleSaveProfile}
      />
    </div>
  );
};

export default UniversityProfilePanel;
