import React from 'react';
import { X, Building2, BookOpen, FlaskConical } from 'lucide-react';

export const ProfileModalHeader = ({ activeTab, setActiveTab, onClose }) => {
  return (
    <div className="border-b border-slate-100 bg-slate-50/50">
      <div className="flex items-center justify-between p-4 px-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Edit Institution Profile</h2>
          <p className="text-xs text-slate-500 font-medium">Update institutional information, departments, and research labs</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2 px-6 border-t border-slate-100 bg-white">
        {[
          { id: 'basic', label: 'Basic Info & Address', icon: Building2 },
          { id: 'departments', label: 'Academic Departments', icon: BookOpen },
          { id: 'research', label: 'Research & Facilities', icon: FlaskConical }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileModalHeader;
