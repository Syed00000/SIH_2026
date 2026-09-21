import React from 'react';
import { LandingLayout } from '../../../landing/components/layout/LandingLayout';
import { LoginHeroBanner } from './LoginHeroBanner.jsx';
import { LoginFormCard } from './LoginFormCard.jsx';
import { LoginSidebars } from './LoginSidebars.jsx';

export const LoginForm = ({ onNavigate }) => {
  return (
    <LandingLayout onNavigate={onNavigate} currentPath="/login">
      {/* Hero Section Banner */}
      <LoginHeroBanner />

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 bg-slate-50/30">
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          {/* Left Column (Login Form Card) */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <LoginFormCard onNavigate={onNavigate} />
          </div>

          {/* Right Column (Sidebars) */}
          <LoginSidebars />
        </div>
      </div>
    </LandingLayout>
  );
};

export default LoginForm;
