import React from 'react';

export function RootLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-blue-500 selection:text-white">
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}

export default RootLayout;
