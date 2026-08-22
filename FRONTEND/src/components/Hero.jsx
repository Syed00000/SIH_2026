import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="pulse-dot"></span> Smart India Hackathon 2026
        </div>
        <h1 className="hero-title">
          Empowering Innovation with <span className="gradient-text">Smart React Apps</span>
        </h1>
        <p className="hero-subtitle">
          A high-performance React application structure built with Vite, Tailwind CSS, TanStack Query, and GraphQL.
        </p>
        <div className="hero-buttons">
          <a href="#dashboard" className="btn btn-lg btn-primary">
            Explore Platform <ArrowRight size={18} />
          </a>
          <a href="#features" className="btn btn-lg btn-outline">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
