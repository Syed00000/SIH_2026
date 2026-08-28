import React from 'react';
import { Mail, Phone, Globe, Calendar, MapPin, ExternalLink, ArrowRight, Send, FileText } from 'lucide-react';

export const PartnerDrawerTabs = ({
  partner,
  activeTab,
  onOpenSendRequest,
  onOpenViewRequests
}) => {
  const contact = partner?.contactPerson || {
    name: 'Mr. Rajesh Kumar',
    role: 'Head - CSR & Partnerships',
    email: 'rajesh.kumar@abcindustries.com',
    phone: '+91 98765 43210'
  };

  const collaborations = partner?.collaborations?.length ? partner.collaborations : [
    { title: 'Water Quality Monitoring in Rural Areas', support: 'Support: Funding + Equipment', status: 'In Progress' },
    { title: 'Smart Irrigation System', support: 'Support: Mentorship', status: 'In Progress' },
    { title: 'Solar Powered Water Purifier', support: 'Support: Funding', status: 'Planning' }
  ];

  if (activeTab === 'overview') {
    return (
      <div className="space-y-3.5 select-none">
        <div className="p-2.5 bg-slate-50 border border-slate-200 space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Contact Person</div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {contact.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs">{contact.name}</div>
              <div className="text-[10.5px] text-slate-500 font-medium">{contact.role}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email</span>
              </span>
              <span className="font-mono text-[11px] text-slate-900 font-bold">{contact.email}</span>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone</span>
              </span>
              <span className="font-mono text-[11px] text-slate-900 font-bold">{contact.phone}</span>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-600">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Website</span>
              </span>
              <a href={`https://${partner?.website || 'www.abcindustries.com'}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline flex items-center space-x-0.5 font-mono text-[11px] font-bold">
                <span>{partner?.website || 'www.abcindustries.com'}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Registered On</span>
              </span>
              <span className="font-mono text-[11px] text-slate-900 font-bold">{partner?.registeredOn || '15 Jan 2024'}</span>
            </div>

            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Location</span>
              </span>
              <span className="text-[11px] text-slate-900 font-bold">{partner?.location || 'Ranchi, Jharkhand, India'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1 bg-slate-50 p-2.5 border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">About Organization</span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {partner?.about || 'We partner with academic institutions to fund and mentor innovative student projects that create social and environmental impact.'}
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Active Collaborations ({collaborations.length})
            </h4>
            <button className="text-[11px] font-bold text-slate-900 underline cursor-pointer">View All</button>
          </div>

          <div className="space-y-2">
            {collaborations.map((col, idx) => (
              <div key={idx} className="p-2.5 bg-white border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{col.title}</div>
                  <div className="text-[10.5px] text-slate-500 font-medium">{col.support}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold border ${col.status === 'In Progress' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-800 border-slate-300'}`}>
                    {col.status}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
          <button
            onClick={onOpenSendRequest}
            className="py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Partnership Request</span>
          </button>
          <button
            onClick={onOpenViewRequests}
            className="py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View All Requests</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-xs text-slate-500 font-medium">
      No additional documents attached for {partner?.name}.
    </div>
  );
};

export default PartnerDrawerTabs;
