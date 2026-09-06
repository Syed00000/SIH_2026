import React from 'react';
import { LandingHeader } from './LandingHeader';
import { LandingFooter } from './LandingFooter';

export const LandingLayout = ({ children, onNavigate, currentPath }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <LandingHeader onNavigate={onNavigate} currentPath={currentPath} />
      <main className="flex-grow">
        {children}
      </main>
      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
};
