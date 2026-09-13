import React from 'react';
import { Award, Info } from 'lucide-react';

export const PerformanceLeaderboard = ({ leaderboardData = [] }) => {
  const data = leaderboardData || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">1. Institutional Performance Leaderboard</h3>
              <p className="text-[10.5px] text-slate-400 font-medium">Rank index based on total allocated problems, successfully resolved solutions, and NEP credits.</p>
            </div>
            <button className="text-[11px] text-slate-900 font-bold hover:underline cursor-pointer">View Full Leaderboard</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10.5px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-2 px-3">Rank</th>
                  <th className="py-2 px-3">HEI Name</th>
                  <th className="py-2 px-3 text-center">Problems Assigned</th>
                  <th className="py-2 px-3 text-center">Solutions Submitted</th>
                  <th className="py-2 px-3 text-center">Active Teams</th>
                  <th className="py-2 px-3 text-right">NEP Credits Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                      <Info className="w-5 h-5 mx-auto text-slate-300 mb-1.5" />
                      No institutional performance records registered yet.
                    </td>
                  </tr>
                ) : (
                  data.map((uni, idx) => (
                    <tr key={uni.id || uni.rank || idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="w-5.5 h-5.5 rounded-full flex items-center justify-center font-bold text-[10px] bg-slate-100 text-slate-700">
                          {uni.rank <= 3 ? (
                            <Award className={`w-3.5 h-3.5 ${uni.rank === 1 ? 'text-amber-500' : uni.rank === 2 ? 'text-slate-400' : 'text-amber-700'}`} />
                          ) : (
                            uni.rank || idx + 1
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{uni.name}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-600">{uni.assigned || 0}</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-600">{uni.submitted || 0}</td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-600">{uni.active || 0}</td>
                      <td className="py-3 px-3 text-right font-extrabold text-slate-800">{(uni.credits || 0).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Highlights */}
        {data.length > 0 && (
          <div className="grid grid-cols-4 gap-2 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl px-4 mt-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Top Performer</span>
              <span className="text-xs font-extrabold text-slate-900 block mt-0.5">{data[0]?.name || 'N/A'}</span>
            </div>
            <div className="text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Most Active Teams</span>
              <span className="text-xs font-extrabold text-slate-900 block mt-0.5">{data[0]?.name || 'N/A'}</span>
            </div>
            <div className="text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Fastest Solution</span>
              <span className="text-xs font-extrabold text-slate-900 block mt-0.5">{data[1]?.name || data[0]?.name || 'N/A'}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Total Credits</span>
              <span className="text-xs font-black text-slate-900 block mt-0.5">
                {data.reduce((acc, curr) => acc + (curr.credits || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Academic Credit Policy */}
      <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs space-y-4 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Info className="w-4 h-4 text-slate-600 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-xs">NEP Credit Guidelines</h4>
              <p className="text-[10px] text-slate-400 font-medium">Jharkhand Higher Education Council</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="font-bold text-slate-800 text-[11px] block">Problem Statement Resolution</span>
              <span className="text-[10.5px] text-slate-500 block mt-0.5">4 Credits awarded per approved lab-validated solution.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
              <span className="font-bold text-slate-800 text-[11px] block">Field Deployment Pilot</span>
              <span className="text-[10.5px] text-slate-500 block mt-0.5">6 Credits awarded upon successful block demonstration.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceLeaderboard;
