import React from 'react';
import { Home, FileText, Plus, HelpCircle, User } from 'lucide-react';

export const CitizenBottomNav = ({ activeTab = 'home', onChangeTab, onSubmitClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-3 py-1.5 max-w-md mx-auto sm:rounded-t-2xl">
      <div className="flex items-center justify-between relative w-full">
        {/* 1. Home */}
        <button
          onClick={() => onChangeTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span
            className={`text-[10px] mt-0.5 leading-tight ${
              activeTab === 'home' ? 'font-bold' : 'font-medium'
            }`}
          >
            Home
          </span>
        </button>

        {/* 2. My Challenges */}
        <button
          onClick={() => onChangeTab('challenges')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'challenges' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className={`w-5 h-5 ${activeTab === 'challenges' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span
            className={`text-[10px] mt-0.5 leading-tight whitespace-nowrap ${
              activeTab === 'challenges' ? 'font-bold' : 'font-medium'
            }`}
          >
            My Challenges
          </span>
        </button>

        {/* 3. Center Elevated Submit Button */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-6">
          <button
            onClick={onSubmitClick || (() => onChangeTab('submit'))}
            aria-label="Submit a Challenge"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#064e3b] to-[#047857] hover:from-[#047857] hover:to-[#059669] text-white shadow-md border-3 border-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer relative z-10"
          >
            <Plus className="w-6 h-6 stroke-[2.8]" />
          </button>
          <span className="text-[10px] font-bold text-emerald-800 mt-1 leading-tight">
            Submit
          </span>
        </div>

        {/* 4. Help */}
        <button
          onClick={() => onChangeTab('guidelines')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'guidelines' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <HelpCircle className={`w-5 h-5 ${activeTab === 'guidelines' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span
            className={`text-[10px] mt-0.5 leading-tight ${
              activeTab === 'guidelines' ? 'font-bold' : 'font-medium'
            }`}
          >
            Help
          </span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onChangeTab('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span
            className={`text-[10px] mt-0.5 leading-tight ${
              activeTab === 'profile' ? 'font-bold' : 'font-medium'
            }`}
          >
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};

export default CitizenBottomNav;
