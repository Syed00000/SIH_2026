import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  Mail,
  Globe,
  Award,
  FileText,
  Users,
  UserCheck,
  FolderGit2,
  TrendingUp,
  FlaskConical,
  Beaker,
  MapPin,
  Phone,
  Clock,
  Edit3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
  Cpu,
  Droplets,
  Sprout,
  SunMedium,
  HeartPulse,
  BarChart3,
  Leaf,
  Layers
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import EditUniversityProfileModal from './EditUniversityProfileModal.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } }
};

// Research area icon helper
const getResearchIcon = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('ai') || lower.includes('intelligence') || lower.includes('iot')) return Cpu;
  if (lower.includes('water')) return Droplets;
  if (lower.includes('agriculture') || lower.includes('crop')) return Sprout;
  if (lower.includes('energy') || lower.includes('solar')) return SunMedium;
  if (lower.includes('health') || lower.includes('medical')) return HeartPulse;
  if (lower.includes('data') || lower.includes('analytics')) return BarChart3;
  if (lower.includes('environment')) return Leaf;
  return Layers;
};

export const UniversityProfilePanel = ({ universityData }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await universityApiService.getProfile('RU001');
      if (res) {
        setProfile(res);
      } else {
        setProfile(universityData || getFallbackProfile());
      }
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
        lastUpdatedBy: {
          name: 'Dr. Ankit Verma',
          updatedAt: new Date()
        }
      }));
    }
  };

  const getFallbackProfile = () => ({
    name: 'Ranchi University',
    shortName: 'RU',
    code: 'RU001',
    aisheCode: 'U-0467',
    tagline: 'Ranchi University is a premier state university committed to quality education, research and solving real-world problems for societal impact.',
    about: 'Ranchi University has a rich legacy of academic excellence and research. We collaborate with industries, government and communities to develop innovative solutions for real-world challenges, especially in the areas of sustainability, technology and social development.',
    universityType: 'State University',
    establishmentYear: 1960,
    website: 'www.ranchiuniversity.ac.in',
    universityEmail: 'info@ranchiuniversity.ac.in',
    universityPhone: '+91 651 220 1234',
    accreditation: {
      naacGrade: 'NAAC A+',
      validity: '2028-12-31',
      nirfRanking: 85
    },
    address: {
      campus: 'Ranchi University, Morabadi, Ranchi, Jharkhand - 834008',
      district: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834008'
    },
    stats: {
      facultyMembers: 128,
      students: 6240,
      activeTeams: 42,
      activeProjects: 28,
      completedProjects: 18
    },
    departments: [
      { name: 'Computer Science & Engineering', facultyCount: 18 },
      { name: 'Civil Engineering', facultyCount: 14 },
      { name: 'Electrical Engineering', facultyCount: 12 },
      { name: 'Mechanical Engineering', facultyCount: 10 },
      { name: 'Chemistry', facultyCount: 8 },
      { name: 'Biotechnology', facultyCount: 6 },
      { name: 'Environmental Science', facultyCount: 5 },
      { name: 'Social Work', facultyCount: 4 }
    ],
    researchAreas: [
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
    facilities: [
      'AI & Data Science Lab',
      'IoT & Embedded Systems Lab',
      'Water Testing & Quality Lab',
      'Renewable Energy Lab',
      'Innovation & Incubation Centre',
      '3D Printing & Prototyping Lab',
      'Smart Classroom Facility'
    ],
    lastUpdatedBy: {
      name: 'Dr. Ankit Verma',
      updatedAt: new Date('2026-05-25T10:30:00.000Z')
    }
  });

  const u = profile || getFallbackProfile();
  const firstLetter = u.name ? u.name.charAt(0).toUpperCase() : 'R';

  const formatDate = (dateInput) => {
    if (!dateInput) return '25 May 2026, 10:30 AM';
    const d = new Date(dateInput);
    return d.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 text-zinc-900 animate-spin mb-4" />
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Loading University Profile...</p>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6 max-w-[1400px] mx-auto select-none pb-12 font-sans">
      {/* 1. Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">University Profile</h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">
            View and manage university information, capabilities and resources.
          </p>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-all cursor-pointer w-fit"
        >
          <Edit3 className="w-4 h-4 text-white" />
          <span>Edit Profile</span>
        </button>
      </motion.div>

      {/* 2. Main University Banner Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs flex flex-col lg:flex-row gap-6 items-stretch"
      >
        {/* Monogram Landscape Rectangle (1st Letter Avatar) */}
        <div className="w-full lg:w-72 h-44 shrink-0 rounded-lg bg-zinc-950 p-6 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner">
          {/* Stylized background watermark initial */}
          <div className="absolute -right-4 -bottom-8 text-zinc-800/40 text-9xl font-black select-none pointer-events-none">
            {firstLetter}
          </div>
          <div className="w-16 h-16 rounded-xl bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center shadow-lg relative z-10">
            <span className="text-3xl font-bold text-white tracking-tighter">{firstLetter}</span>
          </div>
          <div className="mt-3 text-center relative z-10">
            <div className="text-xs font-bold text-zinc-300 tracking-wider uppercase">{u.shortName || 'RU'}</div>
            <div className="text-[10px] text-zinc-400 font-medium">Verified HEI Portal</div>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">{u.name}</h2>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-md text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" />
                <span>Verified</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 font-normal mt-2 leading-relaxed max-w-4xl">
              {u.tagline}
            </p>
          </div>

          {/* 6 Info Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-zinc-100">
            {/* University Type */}
            <div className="flex items-center space-x-3 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div className="w-8 h-8 rounded-md bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">University Type</div>
                <div className="text-xs font-bold text-zinc-900 truncate">{u.universityType}</div>
              </div>
            </div>

            {/* Established Year */}
            <div className="flex items-center space-x-3 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div className="w-8 h-8 rounded-md bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Established Year</div>
                <div className="text-xs font-bold text-zinc-900">{u.establishmentYear}</div>
              </div>
            </div>

            {/* University Email */}
            <div className="flex items-center space-x-3 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div className="w-8 h-8 rounded-md bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Mail className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">University Email</div>
                <div className="text-xs font-bold text-zinc-900 truncate">{u.universityEmail}</div>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-center space-x-3 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div className="w-8 h-8 rounded-md bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Globe className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Website</div>
                <a
                  href={u.website?.startsWith('http') ? u.website : `https://${u.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-zinc-900 hover:underline truncate block"
                >
                  {u.website}
                </a>
              </div>
            </div>

            {/* Accreditation */}
            <div className="flex items-center space-x-3 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div className="w-8 h-8 rounded-md bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Accreditation</div>
                <div className="text-xs font-bold text-zinc-900">{u.accreditation?.naacGrade || 'NAAC A+'}</div>
              </div>
            </div>

            {/* AISHE Code */}
            <div className="flex items-center space-x-3 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div className="w-8 h-8 rounded-md bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">AISHE Code</div>
                <div className="text-xs font-bold font-mono text-zinc-900">{u.aisheCode || 'U-0467'}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. 5 Stats Cards Row (Small Rectangles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Faculty */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-950 tracking-tight">
                {u.stats?.facultyMembers?.toLocaleString() || 128}
              </div>
              <div className="text-[11px] font-medium text-zinc-500">Faculty Members</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center text-xs font-semibold text-zinc-900 group-hover:text-zinc-600">
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Students */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-950 tracking-tight">
                {u.stats?.students?.toLocaleString() || '6,240'}
              </div>
              <div className="text-[11px] font-medium text-zinc-500">Students</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center text-xs font-semibold text-zinc-900 group-hover:text-zinc-600">
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Active Teams */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-950 tracking-tight">
                {u.stats?.activeTeams?.toLocaleString() || 42}
              </div>
              <div className="text-[11px] font-medium text-zinc-500">Active Teams</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center text-xs font-semibold text-zinc-900 group-hover:text-zinc-600">
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Active Projects */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-950 tracking-tight">
                {u.stats?.activeProjects?.toLocaleString() || 28}
              </div>
              <div className="text-[11px] font-medium text-zinc-500">Active Projects</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center text-xs font-semibold text-zinc-900 group-hover:text-zinc-600">
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Completed Projects */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-950 tracking-tight">
                {u.stats?.completedProjects?.toLocaleString() || 18}
              </div>
              <div className="text-[11px] font-medium text-zinc-500">Completed Projects</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center text-xs font-semibold text-zinc-900 group-hover:text-zinc-600">
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </div>

      {/* 4. Middle 3 Cards Row (Departments, Research Areas, Labs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Departments */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-900 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950">Departments</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {u.departments?.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    <span className="font-medium text-zinc-800">{dept.name}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-md font-semibold text-[11px]">
                    {dept.facultyCount} Faculty
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-6 pt-4 border-t border-zinc-100 text-xs font-semibold text-zinc-900 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </motion.div>

        {/* Research Areas / Expertise */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-900 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950">Research Areas / Expertise</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {u.researchAreas?.map((area, idx) => {
                const IconComponent = getResearchIcon(area);
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-50 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 transition-colors"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span>{area}</span>
                  </span>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-6 pt-4 border-t border-zinc-100 text-xs font-semibold text-zinc-900 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Research Areas</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </motion.div>

        {/* Labs / Facilities */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-900 flex items-center justify-center">
                  <Beaker className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950">Labs / Facilities</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {u.facilities?.map((lab, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 shrink-0" />
                  <span className="font-medium text-zinc-800">{lab}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-6 pt-4 border-t border-zinc-100 text-xs font-semibold text-zinc-900 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Facilities</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </motion.div>
      </div>

      {/* 5. Bottom Row: Address & About University */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Address & Contact Info (5 Cols) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-2.5 pb-4 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-900 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950">Address & Contact Information</h3>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              {/* Campus Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-zinc-800">{u.address?.campus}</div>
                </div>
              </div>

              {/* District */}
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4 text-zinc-500 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900">{u.address?.district || u.district}</div>
                  <div className="text-[10px] text-zinc-400 font-semibold uppercase">District</div>
                </div>
              </div>

              {/* State */}
              <div className="flex items-center space-x-3">
                <Award className="w-4 h-4 text-zinc-500 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900">{u.address?.state || 'Jharkhand'}</div>
                  <div className="text-[10px] text-zinc-400 font-semibold uppercase">State</div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-zinc-100" />

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900">{u.universityEmail}</div>
                  <div className="text-[10px] text-zinc-400 font-semibold uppercase">University Email</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900">{u.universityPhone}</div>
                  <div className="text-[10px] text-zinc-400 font-semibold uppercase">Phone Number</div>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-zinc-500 shrink-0" />
                <div>
                  <a
                    href={u.website?.startsWith('http') ? u.website : `https://${u.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-zinc-900 hover:underline block"
                  >
                    {u.website}
                  </a>
                  <div className="text-[10px] text-zinc-400 font-semibold uppercase">Website</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About University (7 Cols) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-2.5 pb-4 border-b border-zinc-100">
              <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-900 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-950">About University</h3>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              {u.about}
            </p>
          </div>

          {/* Last Updated Banner */}
          <div className="mt-6 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center space-x-2.5 text-xs text-zinc-800">
            <Clock className="w-4 h-4 text-zinc-600 shrink-0" />
            <span className="font-medium">
              Last Updated by <strong className="text-zinc-950">{u.lastUpdatedBy?.name || 'Dr. Ankit Verma'}</strong> on {formatDate(u.lastUpdatedBy?.updatedAt)}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <EditUniversityProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={u}
        onSaveSuccess={handleSaveProfile}
      />
    </motion.div>
  );
};

export default UniversityProfilePanel;
