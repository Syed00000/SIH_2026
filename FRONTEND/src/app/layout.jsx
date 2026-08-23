import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '../shared/components/ui/button.jsx';
import { useCurrentUser, useLogout } from '../features/auth/index.js';
import { formatFullName } from '../entities/user/index.js';

export function RootLayout({ children }) {
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">
              University ERP
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                activeProps={{ className: 'text-slate-900 font-semibold' }}
                inactiveProps={{ className: 'text-slate-500 hover:text-slate-900' }}
                className="text-sm transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-medium">
                  {formatFullName(user)} ({user.role})
                </span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white text-center py-6 text-xs text-slate-500">
        &copy; {new Date().getFullYear()} University ERP Platform. All rights reserved.
      </footer>
    </div>
  );
}
