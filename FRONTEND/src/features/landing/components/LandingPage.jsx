import React, { useState, useEffect } from 'react';
import { Lightbulb, Droplet, Recycle, Sprout, Bus, GraduationCap } from 'lucide-react';
import { LandingLayout } from './layout/LandingLayout';
import { JharkhandDistrictMapModal } from './JharkhandDistrictMapModal';
import { citizenService } from '../../citizen/services/citizenService.js';
import { HeroCarousel } from './HeroCarousel';
import { QuickActionCards } from './QuickActionCards';
import { JharkhandOverviewSection } from './JharkhandOverviewSection';
import { LiveTickersSection } from './LiveTickersSection';
import { SectorsGallery } from './SectorsGallery';

export const LandingPage = ({ onNavigate }) => {
  const [isDistrictMapOpen, setIsDistrictMapOpen] = useState(false);
  const [notices, setNotices] = useState([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [noticesError, setNoticesError] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [updatesError, setUpdatesError] = useState(null);
  const [challengesList, setChallengesList] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setNoticesLoading(true);
        const res = await fetch('http://localhost:3000/api/v1/public/notices');
        const data = await res.json();
        if (data.status === 'success') setNotices(data.data.notices);
        else setNoticesError('Unable to load latest notices.');
      } catch (err) {
        setNoticesError('Unable to load latest notices.');
      } finally {
        setNoticesLoading(false);
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setUpdatesLoading(true);
        const res = await fetch('http://localhost:3000/api/v1/public/updates?limit=6');
        const data = await res.json();
        if (data.status === 'success') setUpdates(data.data.updates);
        else setUpdatesError('Unable to load latest updates.');
      } catch (err) {
        setUpdatesError('Unable to load latest updates.');
      } finally {
        setUpdatesLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  useEffect(() => {
    const fetchChallengesData = async () => {
      try {
        const data = await citizenService.fetchChallenges({ limit: 10, sort: '-createdAt' });
        if (data?.challenges?.length > 0) {
          const icons = [Lightbulb, Droplet, Recycle, Sprout, Bus, GraduationCap];
          const colors = ["bg-teal-600", "bg-blue-600", "bg-emerald-600", "bg-green-600", "bg-amber-500", "bg-[#1e3a8a]"];
          const mapped = data.challenges.map((c, i) => ({
            icon: icons[i % icons.length],
            iconBg: colors[i % colors.length],
            title: c.title,
            location: c.location?.district || "Jharkhand",
            date: new Date(c.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            isNew: i === 0
          }));
          setChallengesList(mapped);
        } else {
          setChallengesList([]);
        }
      } catch (err) {
        console.error("Error fetching latest challenges:", err);
      }
    };
    fetchChallengesData();
  }, []);

  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/">
      {/* Hero Section Carousel */}
      <HeroCarousel onNavigate={onNavigate} />

      {/* Action Buttons */}
      <QuickActionCards onNavigate={onNavigate} />

      {/* 3-Column Main Portal Section */}
      <section className="py-2.5 md:py-3.5 bg-[#fbfcfb] border-b border-gray-100">
        <div className="w-full px-4 md:px-8 lg:px-12">
          {/* Top Row: Jharkhand Overview, Leadership, and District Glance */}
          <JharkhandOverviewSection 
            onNavigate={onNavigate} 
            onOpenDistrictMap={() => setIsDistrictMapOpen(true)} 
          />

          {/* Marquee Tickers: Challenges, Updates, and Notices */}
          <LiveTickersSection
            challengesList={challengesList}
            updates={updates}
            updatesLoading={updatesLoading}
            updatesError={updatesError}
            notices={notices}
            noticesLoading={noticesLoading}
            noticesError={noticesError}
          />

          {/* 8-Sector Horizontal Image Gallery */}
          <SectorsGallery />
        </div>
      </section>

      {/* Interactive Jharkhand District Map Modal */}
      <JharkhandDistrictMapModal 
        isOpen={isDistrictMapOpen} 
        onClose={() => setIsDistrictMapOpen(false)} 
      />
    </LandingLayout>
  );
};

export default LandingPage;
