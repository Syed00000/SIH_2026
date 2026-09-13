import React from 'react';

export function RootLayout({ children }) {
  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans flex flex-col antialiased selection:bg-[#007A61] selection:text-white">
      {children}
    </div>
  );
}

export default RootLayout;
