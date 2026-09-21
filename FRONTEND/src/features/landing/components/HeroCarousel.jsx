import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import heroBanner1 from '../assets/hero-banner-1.png';
import heroBanner2 from '../assets/hero-banner-2.jpg';
import heroBannerInstitutions from '../assets/hero-banner-institutions.jpg';
import heroBannerIndustry from '../assets/hero-banner-industry.jpg';

const HERO_SLIDES = [
  {
    id: 1,
    image: heroBanner1,
    title: "Building a Knowledge Driven New India",
    subtitle: "Accessible Education | Inclusive Growth | A Brighter Tomorrow",
    buttonText: "READ MORE",
    link: "/about"
  },
  {
    id: 2,
    image: heroBanner2,
    title: "Connecting Challenges with Solutions",
    subtitle: "Empowering Grassroots Innovation & Driving Collaborative Impact for Jharkhand",
    buttonText: "EXPLORE IMPACT",
    link: "/about"
  },
  {
    id: 3,
    image: heroBannerInstitutions,
    title: "Building a Stronger Knowledge Ecosystem",
    subtitle: "Connecting Educational Institutions with Real-World Industry & Government Needs",
    buttonText: "FOR INSTITUTIONS",
    link: "/institutions"
  },
  {
    id: 4,
    image: heroBannerIndustry,
    title: "Accelerating Technological & Social Progress",
    subtitle: "Join hands with Government and Universities to build sustainable solutions",
    buttonText: "INDUSTRY PORTAL",
    link: "/industry"
  }
];

export const HeroCarousel = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNav = (path) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section 
      className="w-full relative h-[320px] sm:h-[380px] md:h-[430px] lg:h-[460px] bg-[#0c382b] overflow-hidden group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img 
            src={slide.image} 
            alt={`Johar Setu Hero Banner ${slide.id}`} 
            className="w-full h-full object-cover object-[center_35%]" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c382b]/90 via-[#0c382b]/60 to-transparent flex items-center z-10 px-8 md:px-16 lg:px-24">
            <div className="max-w-xl text-white space-y-3">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-sm">
                {slide.title}
              </h1>
              <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed drop-shadow-sm">
                {slide.subtitle}
              </p>
              <button 
                onClick={() => handleNav(slide.link || '/about')}
                className="mt-2 bg-white text-[#0f4b3a] px-5 py-2 rounded-none text-xs md:text-sm font-black flex items-center hover:bg-emerald-50 hover:scale-105 transition-all duration-300 shadow-md cursor-pointer"
              >
                {slide.buttonText} <ArrowRight className="ml-2 w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        aria-label="Previous Slide"
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-[#0f4b3a] text-white p-2 rounded-none transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
        aria-label="Next Slide"
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-[#0f4b3a] text-white p-2 rounded-none transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 transition-all duration-300 rounded-none cursor-pointer ${
              i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
