import React from 'react';
import { Award, Info } from 'lucide-react';

export const PerformanceLeaderboard = ({ leaderboardData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">2. HEI Performance Leaderboard</h3>
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
                {leaderboardData.map((uni) => (
                  <tr key={uni.rank} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="w-5.5 h-5.5 rounded-full flex items-center justify-center font-bold text-[10px] bg-slate-100 text-slate-700">
                        {uni.rank <= 3 ? (
                          <Award className={`w-3.5 h-3.5 ${uni.rank === 1 ? 'text-amber-500' : uni.rank === 2 ? 'text-slate-400' : 'text-amber-700'}`} />
                        ) : (
                          uni.rank
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">{uni.name}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-600">{uni.assigned}</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">{uni.submitted}</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-600">{uni.active}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-800">{uni.credits.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-4 gap-2 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl px-4 mt-4">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Top Performer</span>
            <span className="text-xs font-extrabold text-slate-900 block mt-0.5">BIT Mesra</span>
          </div>
          <div className="text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Most Active Teams</span>
            <span className="text-xs font-extrabold text-slate-900 block mt-0.5">42 <span className="text-[10px] text-slate-400 font-semibold">(BIT Mesra)</span></span>
          </div>
          <div className="text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Most Solutions</span>
            <span className="text-xs font-extrabold text-slate-900 block mt-0.5">28 <span className="text-[10px] text-slate-400 font-semibold">(BIT Mesra)</span></span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Most Credits</span>
            <span className="text-xs font-extrabold text-slate-900 block mt-0.5">1,920 <span className="text-[10px] text-slate-400 font-semibold">(BIT Mesra)</span></span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs space-y-4">
        <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-2.5">Academic Leaderboard Rules</h4>
        <div className="space-y-3 font-medium text-slate-600">
          <div className="flex items-start">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-[10px] shrink-0 mr-2">1</span>
            <p className="leading-relaxed"><strong>Assigned Weightage</strong>: Problems allocated to university labs hold primary points scaling.</p>
          </div>
          <div className="flex items-start">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-[10px] shrink-0 mr-2">2</span>
            <p className="leading-relaxed"><strong>Credit Accrual</strong>: Student researchers earn academic credits mapped under NEP 2020 framework upon successful solution verification.</p>
          </div>
          <div className="flex items-start">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-[10px] shrink-0 mr-2">3</span>
            <p className="leading-relaxed"><strong>Milestone Compliance</strong>: Rejections or delayed reviews decrease cumulative credit performance rating.</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 flex items-start space-x-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-[10.5px] text-slate-500 leading-relaxed font-medium">Rank positions are re-calibrated dynamically upon every milestone approval approval.</p>
        </div>
      </div>
    </div>
  );
};
export default PerformanceLeaderboard;
