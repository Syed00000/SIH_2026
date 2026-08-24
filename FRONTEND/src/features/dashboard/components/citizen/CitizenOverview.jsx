import React from 'react';
import {
  Plus,
  FileText,
  Hourglass,
  Activity,
  CheckCircle2,
  MapPin,
  Droplet,
  Wrench,
  BookOpen,
  Trash2,
  Sprout,
  HeartPulse,
  Leaf,
  Home,
  Accessibility,
  Briefcase,
  Pencil,
  ChevronRight
} from 'lucide-react';

export const CitizenOverview = ({ user, role, setActiveTab }) => {
  return (
    <div className="space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.fullName || 'Tauqueer wasi'} 👋
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Role: <span className="font-bold text-slate-800">{role || 'CITIZEN'}</span> | Societal Innovation Hub
          </p>
        </div>

        <button
          onClick={() => setActiveTab('challenges')}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-md shadow-xs flex items-center transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Submit a Challenge
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Submitted */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Total Submitted
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
              05
            </span>
            <span className="text-[10px] font-medium text-slate-400 block">Challenges</span>
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <Hourglass className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Under Review
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
              02
            </span>
            <span className="text-[10px] font-medium text-slate-400 block">Challenges</span>
          </div>
        </div>

        {/* In Evaluation */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              In Evaluation
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
              01
            </span>
            <span className="text-[10px] font-medium text-slate-400 block">Challenge</span>
          </div>
        </div>

        {/* Solved & Deployed */}
        <div className="bg-white border border-slate-200 p-3.5 rounded-md shadow-2xs hover:border-slate-300 transition-all flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Solved & Deployed
            </span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block leading-tight">
              02
            </span>
            <span className="text-[10px] font-medium text-slate-400 block">Challenges</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Recent Challenges Table + Timeline Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* My Recent Challenges Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-sm">My Recent Challenges</h3>
              <button
                onClick={() => setActiveTab('challenges')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100 bg-slate-50/60">
                    <th className="py-2 px-2.5">Challenge ID</th>
                    <th className="py-2 px-2.5">Title</th>
                    <th className="py-2 px-2.5">Location</th>
                    <th className="py-2 px-2.5">Category</th>
                    <th className="py-2 px-2.5">Status</th>
                    <th className="py-2 px-2.5">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-2.5 font-semibold text-slate-900">JH-2026-00124</td>
                    <td className="py-2.5 px-2.5 max-w-[180px] truncate font-medium text-slate-800">
                      Drinking Water Shortage in Rural Area
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
                        Ratu, Ranchi
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                        <Droplet className="w-3 h-3 mr-1" />
                        Water
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800">
                        Under Review
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-400 whitespace-nowrap">2 days ago</td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-2.5 font-semibold text-slate-900">JH-2026-00120</td>
                    <td className="py-2.5 px-2.5 max-w-[180px] truncate font-medium text-slate-800">
                      Broken Road Causing Travel Issues
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
                        Ratu, Ranchi
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        <Wrench className="w-3 h-3 mr-1" />
                        Infrastructure
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                        Submitted
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-400 whitespace-nowrap">4 days ago</td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-2.5 font-semibold text-slate-900">JH-2026-00115</td>
                    <td className="py-2.5 px-2.5 max-w-[180px] truncate font-medium text-slate-800">
                      School Toilet Facility Issue
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
                        Ratu, Ranchi
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Education
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                        In Evaluation
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-400 whitespace-nowrap">1 week ago</td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-2.5 font-semibold text-slate-900">JH-2026-00110</td>
                    <td className="py-2.5 px-2.5 max-w-[180px] truncate font-medium text-slate-800">
                      Garbage Disposal Problem
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
                        Ratu, Ranchi
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Sanitation
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800">
                        Under Review
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-400 whitespace-nowrap">1 week ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Challenge Journey Timeline */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Challenge Journey</h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Track the progress of your challenge
            </p>
          </div>

          <div className="mt-4 space-y-3.5 flex-1">
            {/* Stage 1 */}
            <div className="flex items-start relative pb-3">
              <div className="absolute left-2 top-4 w-0.5 h-full bg-emerald-500 z-0"></div>
              <div className="w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 z-10">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <div className="ml-2.5 flex-1 flex justify-between items-start">
                <div className="pr-1">
                  <p className="text-xs font-bold text-slate-800 leading-none">Submitted</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Challenge has been submitted successfully
                  </p>
                </div>
                <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
                  12 May 2026
                </span>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex items-start relative pb-3">
              <div className="absolute left-2 top-4 w-0.5 h-full bg-emerald-500 z-0"></div>
              <div className="w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 z-10">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <div className="ml-2.5 flex-1 flex justify-between items-start">
                <div className="pr-1">
                  <p className="text-xs font-bold text-slate-800 leading-none">Initial Screening</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Challenge is under initial screening
                  </p>
                </div>
                <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
                  13 May 2026
                </span>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex items-start relative pb-3">
              <div className="absolute left-2 top-4 w-0.5 h-full bg-slate-200 z-0"></div>
              <div className="w-4.5 h-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 z-10 border border-blue-200">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <div className="ml-2.5 flex-1 flex justify-between items-start">
                <div className="pr-1">
                  <p className="text-xs font-bold text-blue-600 leading-none">Expert Evaluation</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Challenge is being evaluated by experts
                  </p>
                </div>
                <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded whitespace-nowrap">
                  In Progress
                </span>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="flex items-start relative pb-3">
              <div className="absolute left-2 top-4 w-0.5 h-full bg-slate-200 z-0"></div>
              <div className="w-4.5 h-4.5 rounded-full bg-white border border-slate-300 flex items-center justify-center flex-shrink-0 z-10"></div>
              <div className="ml-2.5 flex-1">
                <p className="text-xs font-bold text-slate-400 leading-none">
                  Solution Development
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Solution is being developed by HEIs
                </p>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="flex items-start relative">
              <div className="w-4.5 h-4.5 rounded-full bg-white border border-slate-300 flex items-center justify-center flex-shrink-0 z-10"></div>
              <div className="ml-2.5 flex-1">
                <p className="text-xs font-bold text-slate-400 leading-none">Pilot & Deployment</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Solution will be piloted and deployed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Explore by Category + Community Challenges + Your Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Explore by Category Card */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-900 text-xs md:text-sm">Explore by Category</h3>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
              View All
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {/* 1 */}
            <div className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                Agriculture
              </span>
            </div>

            {/* 2 */}
            <div className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100">
                <Droplet className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                Water
              </span>
            </div>

            {/* 3 */}
            <div className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100">
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                Healthcare
              </span>
            </div>

            {/* 4 */}
            <div className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                Education
              </span>
            </div>

            {/* 5 */}
            <div className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-100">
                <Trash2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                Sanitation
              </span>
            </div>

            {/* 6 */}
            <div className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded bg-lime-50 text-lime-600 flex items-center justify-center group-hover:bg-lime-100">
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                Environment
              </span>
            </div>

            {/* 7 */}
            <div className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                Infrastructure
              </span>
            </div>

            {/* 8 */}
            <div className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100">
                <Home className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                Livelihood
              </span>
            </div>

            {/* 9 */}
            <div className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100">
                <Accessibility className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                Accessibility
              </span>
            </div>

            {/* 10 */}
            <div className="flex flex-col items-center text-center p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-100">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-semibold text-slate-600 mt-1 leading-tight">
                Services
              </span>
            </div>
          </div>
        </div>

        {/* Community Challenges Card */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <h3 className="font-bold text-slate-900 text-xs md:text-sm">Community Challenges</h3>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
              View All
            </button>
          </div>

          <div className="flex-1 divide-y divide-slate-100 text-xs">
            {/* Item 1 */}
            <div className="py-2 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 px-1 rounded transition-colors group">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Droplet className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 text-xs truncate">
                    Water scarcity in rural areas
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Dumka • Water Management | 34 citizens
                  </p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-all flex-shrink-0" />
            </div>

            {/* Item 2 */}
            <div className="py-2 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 px-1 rounded transition-colors group">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-7 h-7 rounded bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 text-xs truncate">
                    Poor road connectivity to health centre
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Gumla • Infrastructure | 28 citizens
                  </p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-all flex-shrink-0" />
            </div>

            {/* Item 3 */}
            <div className="py-2 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 px-1 rounded transition-colors group">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-7 h-7 rounded bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 text-xs truncate">
                    Irregular waste collection
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Ranchi • Sanitation | 19 citizens
                  </p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-all flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Your Location Card */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-900 text-xs md:text-sm">Your Location</h3>
            <button
              onClick={() => setActiveTab('profile')}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center transition-colors"
            >
              <Pencil className="w-2.5 h-2.5 mr-1" />
              Edit Profile
            </button>
          </div>

          <div className="flex-1 flex items-start space-x-3 bg-slate-50/70 p-3 rounded-md border border-slate-200/60">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="space-y-2.5 flex-1 text-xs text-slate-700">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                  District
                </span>
                <span className="font-bold text-slate-900 block mt-0.5 leading-none">
                  {user?.profile?.location?.district || user?.profile?.district || 'Ranchi'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                    Block / ULB
                  </span>
                  <span className="font-bold text-slate-900 block mt-0.5 leading-none">
                    {user?.profile?.location?.blockOrULB || user?.profile?.blockOrULB || 'Ratu'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                    Panchayat / Ward
                  </span>
                  <span className="font-bold text-slate-900 block mt-0.5 leading-none">
                    {user?.profile?.location?.panchayatOrWard ||
                      user?.profile?.panchayatOrWard ||
                      'Gram'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                  Preferred Language
                </span>
                <span className="font-bold text-slate-900 block mt-0.5 leading-none">
                  {user?.profile?.preferredLanguage || 'Hindi'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CitizenOverview;
