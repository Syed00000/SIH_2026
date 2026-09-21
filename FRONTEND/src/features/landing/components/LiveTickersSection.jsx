import React from 'react';
import updateMeet from '../assets/update_meet.png';

export const LiveTickersSection = ({
  challengesList = [],
  updates = [],
  updatesLoading = false,
  updatesError = null,
  notices = [],
  noticesLoading = false,
  noticesError = null
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4 items-stretch mb-4 md:mb-5">
      {/* Col 1: Latest Challenges */}
      <div className="bg-white rounded-none border border-gray-200/90 shadow-xs flex flex-col overflow-hidden">
        <div className="bg-[#0f4b3a] text-white px-3.5 py-2 flex items-center justify-between shrink-0">
          <h3 className="text-[13px] font-bold tracking-tight">Latest Challenges</h3>
        </div>

        <div className="h-[195px] overflow-hidden relative marquee-container cursor-pointer px-2.5 py-1 bg-white">
          <div className="animate-marquee-vertical flex flex-col divide-y divide-gray-100/90">
            {challengesList.length > 0 ? (
              [...challengesList, ...challengesList].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="py-2 flex items-center gap-2.5 group cursor-pointer hover:bg-slate-50/90 px-1 rounded-none transition-colors">
                    <div className={`w-7 h-7 ${item.iconBg} rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs`}>
                      <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-[11.5px] font-bold text-gray-900 leading-tight group-hover:text-[#0f4b3a] transition-colors truncate">
                          {item.title}
                        </h4>
                        {item.isNew && (
                          <span className="bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-none uppercase tracking-wide leading-tight shadow-2xs">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] text-gray-500 mt-0.5 leading-tight truncate">
                        {item.location} <span className="mx-1 text-gray-300">|</span> {item.date}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-gray-500 font-medium">No latest challenges available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Col 2: Important Updates */}
      <div className="bg-white rounded-none border border-gray-200/90 shadow-xs flex flex-col overflow-hidden">
        <div className="bg-[#0f4b3a] text-white px-3.5 py-2 flex items-center justify-between shrink-0">
          <h3 className="text-[13px] font-bold tracking-tight">Important Updates</h3>
        </div>

        <div className="h-[195px] overflow-hidden relative marquee-container cursor-pointer px-2.5 py-1 bg-white">
          <div className="animate-marquee-vertical flex flex-col divide-y divide-gray-100/90">
            {updatesLoading ? (
              <div className="flex flex-col gap-2 p-2">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="flex gap-2.5 animate-pulse items-center">
                    <div className="w-13 h-8 sm:w-14 sm:h-9 bg-gray-200 shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 w-3/4 mb-1" />
                      <div className="h-2 bg-gray-200 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : updatesError ? (
              <div className="p-4 text-center text-[11px] text-red-500 font-medium">{updatesError}</div>
            ) : updates.length === 0 ? (
              <div className="p-4 text-center text-[11px] text-gray-500 font-medium">No latest updates available.</div>
            ) : (
              [...updates, ...updates].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 flex items-center gap-2.5 group cursor-pointer hover:bg-slate-50/90 px-1 rounded-none transition-colors"
                >
                  <img 
                    src={item.thumbnailUrl || item.imageUrl || updateMeet} 
                    alt={item.title} 
                    className="w-13 h-8 sm:w-14 sm:h-9 object-cover rounded-none shrink-0 border border-gray-200 shadow-2xs" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-[11.5px] font-bold text-gray-900 leading-tight group-hover:text-[#0f4b3a] transition-colors truncate">
                        {item.title}
                      </h4>
                      {item.isNew && (
                        <span className="bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-none uppercase tracking-wide leading-tight shadow-2xs">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-[9.5px] text-gray-500 mt-0.5 leading-tight truncate">
                      {item.description}
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Col 3: Announcements / Notices */}
      <div className="bg-white rounded-none border border-gray-200/90 shadow-xs flex flex-col overflow-hidden">
        <div className="bg-[#0f4b3a] text-white px-3.5 py-2 flex items-center justify-between shrink-0">
          <h3 className="text-[13px] font-bold tracking-tight">Announcements / Notices</h3>
        </div>

        <div className="h-[195px] overflow-hidden relative marquee-container cursor-pointer px-2.5 py-1 bg-white">
          <div className="animate-marquee-vertical flex flex-col divide-y divide-gray-100/90">
            {noticesLoading ? (
              <div className="flex flex-col gap-2 p-2">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="flex gap-2 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-gray-200 mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 w-3/4 mb-1" />
                      <div className="h-2 bg-gray-200 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : noticesError ? (
              <div className="p-4 text-center text-[11px] text-red-500 font-medium">{noticesError}</div>
            ) : notices.length === 0 ? (
              <div className="p-4 text-center text-[11px] text-gray-500 font-medium">No notices available at the moment.</div>
            ) : (
              [...notices, ...notices].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 flex items-start gap-2 group cursor-pointer hover:bg-slate-50/90 px-1 rounded-none transition-colors"
                >
                  <span className="text-[#0f4b3a] font-black text-sm leading-none mt-0.5 shrink-0">•</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-[11.5px] font-bold text-gray-900 leading-tight group-hover:text-[#0f4b3a] transition-colors">
                        {item.title}
                      </h4>
                      {item.isNew && (
                        <span className="bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-none uppercase tracking-wide leading-tight shadow-2xs">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-[9.5px] text-gray-500 mt-0.5 leading-tight truncate">
                      {item.date}
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTickersSection;
