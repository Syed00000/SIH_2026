import React from 'react';
import { FileText, Building2, Users, ChevronRight } from 'lucide-react';

export const QuickActionCards = ({ onNavigate }) => {
  const handleNav = (path) => {
    if (onNavigate) onNavigate(path);
    else window.location.href = path;
  };

  const actionItems = [
    {
      title: "Report a Problem",
      subtitle: "Be the Change",
      icon: FileText,
      link: "/login"
    },
    {
      title: "For Universities",
      subtitle: <>Collaborate <span className="mx-1 opacity-50">|</span> Solve <span className="mx-1 opacity-50">|</span> Grow</>,
      icon: Building2,
      link: "/login"
    },
    {
      title: "For Industry & Startups",
      subtitle: <>Innovate <span className="mx-1 opacity-50">|</span> Partner <span className="mx-1 opacity-50">|</span> Create Impact</>,
      icon: Users,
      link: "/apply-industry"
    }
  ];

  return (
    <section className="w-full relative z-20 bg-white py-2 md:py-3 px-4 md:px-8 lg:px-12">
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full">
        {actionItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              onClick={() => handleNav(item.link)} 
              className="flex-1 bg-white border border-gray-200 shadow-xs rounded-none px-4 py-2.5 md:py-3 flex items-center justify-between cursor-pointer hover:bg-[#0f4b3a] hover:border-[#0f4b3a] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#0f4b3a] group-hover:text-white transition-all" />
                <div className="text-left">
                  <h3 className="text-[#0f4b3a] group-hover:text-white text-[13px] md:text-[14px] font-bold tracking-tight transition-all">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-emerald-100/90 text-[9px] md:text-[10px] font-medium mt-0.5 transition-all">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActionCards;
