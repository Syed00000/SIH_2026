import React from 'react';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { ShieldAlert, ArrowRight, LogOut } from 'lucide-react';
import { LoginForm } from '../features/auth/components/LoginForm.jsx';

export const ProtectedRoute = ({
  allowedRoles,
  children,
  onNavigate
}) => {
  const { isAuthenticated, user, loading, logout } = useAuth();

  const userRole = (user?.role || '').toUpperCase();

  // If role check is requested
  const isRoleAllowed =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    allowedRoles.some((r) => userRole.includes(r.toUpperCase())) ||
    userRole === 'SUPER_ADMIN' ||
    userRole === 'GOVERNMENT';

  // If not authenticated, render login page directly
  if (!loading && !isAuthenticated) {
    return <LoginForm onNavigate={onNavigate} />;
  }

  // If logged in but role not permitted
  if (!loading && isAuthenticated && !isRoleAllowed) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-6 shadow-md text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 text-base">Access Restricted</h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Your account role (<span className="font-bold text-slate-900">{userRole}</span>) does not have authorization to access this portal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={() => (onNavigate ? onNavigate('/dashboard') : (window.location.href = '/dashboard'))}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={logout}
              className="py-2 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
