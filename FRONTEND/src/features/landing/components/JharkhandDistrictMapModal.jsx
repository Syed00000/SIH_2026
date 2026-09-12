import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, Navigation, ExternalLink, Building2, Users, Search, RefreshCw, Compass, ChevronDown } from 'lucide-react';

const JHARKHAND_DIVISIONS = [
  'All 24 Districts',
  'South Chotanagpur',
  'North Chotanagpur',
  'Santhal Pargana',
  'Kolhan',
  'Palamu'
];

const DISTRICTS_DATA = [
  { id: 'ranchi', name: 'Ranchi', division: 'South Chotanagpur', hq: 'Ranchi (State Capital)', area: '5,097 km²', pop: '29.1 Lakh', problems: 42, nodal: 'Ranchi University & BIT Mesra', query: 'Ranchi+District+Jharkhand' },
  { id: 'dhanbad', name: 'Dhanbad', division: 'North Chotanagpur', hq: 'Dhanbad (Coal Capital)', area: '2,040 km²', pop: '26.8 Lakh', problems: 38, nodal: 'IIT ISM Dhanbad', query: 'Dhanbad+District+Jharkhand' },
  { id: 'east-singhbhum', name: 'East Singhbhum (Jamshedpur)', division: 'Kolhan', hq: 'Jamshedpur', area: '3,533 km²', pop: '22.9 Lakh', problems: 35, nodal: 'NIT Jamshedpur & XLRI', query: 'Jamshedpur+East+Singhbhum+Jharkhand' },
  { id: 'bokaro', name: 'Bokaro', division: 'North Chotanagpur', hq: 'Bokaro Steel City', area: '2,883 km²', pop: '20.6 Lakh', problems: 29, nodal: 'Bokaro Steel City Nodal College', query: 'Bokaro+District+Jharkhand' },
  { id: 'hazaribagh', name: 'Hazaribagh', division: 'North Chotanagpur', hq: 'Hazaribagh', area: '3,555 km²', pop: '17.3 Lakh', problems: 26, nodal: 'Vinoba Bhave University', query: 'Hazaribagh+District+Jharkhand' },
  { id: 'deoghar', name: 'Deoghar', division: 'Santhal Pargana', hq: 'Deoghar (Cultural Capital)', area: '2,477 km²', pop: '15.0 Lakh', problems: 24, nodal: 'AIIMS Deoghar & SKMU Sub-center', query: 'Deoghar+District+Jharkhand' },
  { id: 'giridih', name: 'Giridih', division: 'North Chotanagpur', hq: 'Giridih', area: '4,962 km²', pop: '24.5 Lakh', problems: 22, nodal: 'Giridih College & VBU Unit', query: 'Giridih+District+Jharkhand' },
  { id: 'ramgarh', name: 'Ramgarh', division: 'North Chotanagpur', hq: 'Ramgarh Cantonment', area: '1,341 km²', pop: '9.5 Lakh', problems: 19, nodal: 'Ramgarh Engineering College', query: 'Ramgarh+District+Jharkhand' },
  { id: 'dumka', name: 'Dumka', division: 'Santhal Pargana', hq: 'Dumka (Sub-Capital)', area: '3,761 km²', pop: '13.2 Lakh', problems: 27, nodal: 'Sido Kanhu Murmu University', query: 'Dumka+District+Jharkhand' },
  { id: 'palamu', name: 'Palamu', division: 'Palamu', hq: 'Medininagar (Daltonganj)', area: '4,393 km²', pop: '19.4 Lakh', problems: 21, nodal: 'Nilamber-Pitamber University', query: 'Medininagar+Palamu+Jharkhand' },
  { id: 'west-singhbhum', name: 'West Singhbhum', division: 'Kolhan', hq: 'Chaibasa', area: '7,224 km²', pop: '15.0 Lakh', problems: 18, nodal: 'Kolhan University Chaibasa', query: 'Chaibasa+West+Singhbhum+Jharkhand' },
  { id: 'gumla', name: 'Gumla', division: 'South Chotanagpur', hq: 'Gumla', area: '5,360 km²', pop: '10.2 Lakh', problems: 15, nodal: 'Gumla Polytechnic & DSPMU Sub-center', query: 'Gumla+District+Jharkhand' },
  { id: 'garhwa', name: 'Garhwa', division: 'Palamu', hq: 'Garhwa', area: '4,044 km²', pop: '13.2 Lakh', problems: 16, nodal: 'NPU Garhwa College', query: 'Garhwa+District+Jharkhand' },
  { id: 'chatra', name: 'Chatra', division: 'North Chotanagpur', hq: 'Chatra', area: '3,718 km²', pop: '10.4 Lakh', problems: 14, nodal: 'Chatra College & VBU Unit', query: 'Chatra+District+Jharkhand' },
  { id: 'koderma', name: 'Koderma', division: 'North Chotanagpur', hq: 'Koderma', area: '1,500 km²', pop: '7.1 Lakh', problems: 17, nodal: 'Koderma Mining Institute', query: 'Koderma+District+Jharkhand' },
  { id: 'latehar', name: 'Latehar', division: 'Palamu', hq: 'Latehar', area: '4,291 km²', pop: '7.3 Lakh', problems: 13, nodal: 'Latehar Govt Polytechnic', query: 'Latehar+District+Jharkhand' },
  { id: 'simdega', name: 'Simdega', division: 'South Chotanagpur', hq: 'Simdega', area: '3,771 km²', pop: '6.0 Lakh', problems: 11, nodal: 'Simdega College & RU Center', query: 'Simdega+District+Jharkhand' },
  { id: 'khunti', name: 'Khunti', division: 'South Chotanagpur', hq: 'Khunti', area: '2,535 km²', pop: '5.3 Lakh', problems: 15, nodal: 'Birsa Agricultural University Khunti', query: 'Khunti+District+Jharkhand' },
  { id: 'pakur', name: 'Pakur', division: 'Santhal Pargana', hq: 'Pakur', area: '1,806 km²', pop: '9.0 Lakh', problems: 12, nodal: 'Pakur Polytechnic & SKMU', query: 'Pakur+District+Jharkhand' },
  { id: 'jamtara', name: 'Jamtara', division: 'Santhal Pargana', hq: 'Jamtara', area: '1,811 km²', pop: '7.9 Lakh', problems: 16, nodal: 'Jamtara Engineering College', query: 'Jamtara+District+Jharkhand' },
  { id: 'sahibganj', name: 'Sahibganj', division: 'Santhal Pargana', hq: 'Sahibganj', area: '2,063 km²', pop: '11.5 Lakh', problems: 14, nodal: 'Sahibganj Multi-modal Hub Center', query: 'Sahibganj+District+Jharkhand' },
  { id: 'godda', name: 'Godda', division: 'Santhal Pargana', hq: 'Godda', area: '2,266 km²', pop: '13.1 Lakh', problems: 15, nodal: 'Godda College & SKMU', query: 'Godda+District+Jharkhand' },
  { id: 'seraikela-kharsawan', name: 'Seraikela Kharsawan', division: 'Kolhan', hq: 'Seraikela', area: '2,657 km²', pop: '10.6 Lakh', problems: 20, nodal: 'NIT Jamshedpur Extension & KU', query: 'Seraikela+Kharsawan+Jharkhand' },
  { id: 'lohardaga', name: 'Lohardaga', division: 'South Chotanagpur', hq: 'Lohardaga', area: '1,502 km²', pop: '4.6 Lakh', problems: 10, nodal: 'Lohardaga Bauxite R&D Cell', query: 'Lohardaga+District+Jharkhand' }
];

export const JharkhandDistrictMapModal = ({ isOpen, onClose }) => {
  const [selectedDivision, setSelectedDivision] = useState('All 24 Districts');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const filteredDistricts = DISTRICTS_DATA.filter((d) => {
    const matchesDivision = selectedDivision === 'All 24 Districts' || d.division === selectedDivision;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.hq.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDivision && matchesSearch;
  });

  const activeDistrictQuery = selectedDistrict ? selectedDistrict.query : 'Jharkhand+State+India';
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(activeDistrictQuery)}&t=m&z=${selectedDistrict ? 11 : 8}&output=embed&iwloc=near`;
  const externalGpsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeDistrictQuery)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white border border-slate-300 w-full max-w-6xl h-[94vh] sm:h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#047857] text-white px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 border-b border-emerald-800">
          <div className="flex items-center space-x-2.5">
            <Compass className="w-5 h-5 text-emerald-200 animate-pulse shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold tracking-tight text-white">
                  Jharkhand State Interactive GPS District Map
                </h2>
                <span className="text-[11px] font-semibold text-emerald-200 opacity-90 hidden sm:inline">
                  • 24 Districts
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 font-medium hidden sm:block">
                Official Johar Setu Regional Innovation &amp; Civic Problem Mapping System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={externalGpsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md border border-emerald-600 transition-all shadow-2xs"
            >
              <span>Open Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-white hover:bg-[#dc2626] rounded-md transition-colors cursor-pointer"
              title="Close Map Modal"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Modal Main Body: Dual-Pane (Left: Filterable Districts List, Right: Interactive Google Map) */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-slate-50">
          
          {/* Left Sidebar: Division Filters & District Cards */}
          <div className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
            
            {/* Search & Select Dropdown Header */}
            <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2.5" ref={dropdownRef}>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search or select a district..."
                  value={searchQuery}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#047857]/40 focus:border-[#047857]"
                />
                <ChevronDown 
                  className={`w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 transition-transform duration-200 cursor-pointer ${isDropdownOpen ? 'rotate-180' : ''}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />

                {/* Dropdown Menu when typing/clicking Search Bar */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-56 overflow-y-auto z-30 divide-y divide-slate-100 text-xs custom-scrollbar">
                    <div 
                      onClick={() => {
                        setSelectedDistrict(null);
                        setSearchQuery('');
                        setIsDropdownOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-emerald-50 text-[#047857] font-bold cursor-pointer flex items-center justify-between"
                    >
                      <span>📍 View Entire State (All 24 Districts)</span>
                      <RefreshCw className="w-3.5 h-3.5 text-[#047857]" />
                    </div>
                    {filteredDistricts.map((dist) => (
                      <div
                        key={dist.id}
                        onClick={() => {
                          setSelectedDistrict(dist);
                          setSearchQuery(dist.name);
                          setIsDropdownOpen(false);
                        }}
                        className={`px-3 py-2 hover:bg-slate-100 cursor-pointer flex items-center justify-between font-medium ${
                          selectedDistrict?.id === dist.id ? 'bg-emerald-50 text-[#047857] font-bold' : 'text-slate-800'
                        }`}
                      >
                        <span>{dist.name}</span>
                        <span className="text-[10px] text-slate-500">{dist.hq}</span>
                      </div>
                    ))}
                    {filteredDistricts.length === 0 && (
                      <div className="px-3 py-2.5 text-center text-slate-400">
                        No districts matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Division Filter Tabs - Clean Rectangular Shadcn Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1">
                {JHARKHAND_DIVISIONS.map((div) => (
                  <button
                    key={div}
                    onClick={() => setSelectedDivision(div)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap border transition-all cursor-pointer ${
                      selectedDivision === div
                        ? 'bg-[#047857] text-white border-[#047857] shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {div}
                  </button>
                ))}
              </div>
            </div>

            {/* District List Scrollable */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <span>Districts ({filteredDistricts.length})</span>
                {selectedDistrict && (
                  <button
                    onClick={() => {
                      setSelectedDistrict(null);
                      setSearchQuery('');
                    }}
                    className="text-[#047857] hover:underline flex items-center gap-1 text-[10.5px] font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset View
                  </button>
                )}
              </div>

              {filteredDistricts.map((dist) => {
                const isSelected = selectedDistrict?.id === dist.id;
                return (
                  <div
                    key={dist.id}
                    onClick={() => setSelectedDistrict(dist)}
                    className={`p-2.5 rounded-md border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 border-[#047857] shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#047857]' : 'text-slate-400'}`} />
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-[#047857]' : 'text-slate-900'}`}>
                          {dist.name}
                        </h4>
                      </div>
                      <span className="text-[10.5px] font-semibold text-slate-500">
                        • {dist.division.split(' ')[0]}
                      </span>
                    </div>

                    <div className="mt-1.5 grid grid-cols-2 gap-2 text-[10.5px] text-slate-600 font-medium">
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">HQ</span>
                        <span className="font-semibold text-slate-800 line-clamp-1">{dist.hq}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Active Problems</span>
                        <span className="font-bold text-[#047857]">{dist.problems} Civic Needs</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Main Map Container */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-100 relative">
            {/* Map Top Bar */}
            <div className="bg-white px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-2xs z-10">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-[#047857]" />
                <span className="text-xs font-bold text-slate-900">
                  {selectedDistrict ? `GPS Location: ${selectedDistrict.name} District, Jharkhand` : 'GPS Location: State of Jharkhand (Entire Region)'}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                {selectedDistrict && (
                  <button
                    onClick={() => {
                      setSelectedDistrict(null);
                      setSearchQuery('');
                    }}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                  >
                    View Entire State
                  </button>
                )}
                <a
                  href={externalGpsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#047857] hover:underline flex items-center gap-1"
                >
                  Full GPS App <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Embedded Google Maps Frame */}
            <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-200">
              <iframe
                title="Jharkhand GPS District Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={embedUrl}
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Selected District Floating Info Overlay Card - Clean Shadcn Rectangular Styling */}
            {selectedDistrict && (
              <div className="absolute bottom-3 left-3 right-3 md:right-auto md:max-w-sm bg-white/95 backdrop-blur-md p-3.5 rounded-lg border border-slate-300 shadow-lg z-20 space-y-2 animate-slide-up">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <h3 className="text-xs font-bold text-[#047857] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedDistrict.name} District</span>
                  </h3>
                  <span className="text-[10.5px] font-medium text-slate-500">
                    {selectedDistrict.division}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                  <div className="bg-slate-50 p-2 rounded-md border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Area
                    </div>
                    <div className="font-bold text-slate-900">{selectedDistrict.area}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-md border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3" /> Population
                    </div>
                    <div className="font-bold text-slate-900">{selectedDistrict.pop}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-700 bg-emerald-50/80 p-2 rounded-md border border-emerald-200">
                  <div className="font-bold text-[#047857] mb-0.5">Nodal University Hub</div>
                  <div>{selectedDistrict.nodal}</div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={externalGpsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 bg-[#047857] hover:bg-[#064e3b] text-white text-center text-xs font-semibold rounded-md shadow-2xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Navigate on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Bottom Footer bar */}
        <div className="bg-slate-900 text-slate-300 px-4 sm:px-6 py-2 flex items-center justify-between text-xs shrink-0 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-medium text-slate-300 text-[11px]">
              Live GPS Geographic Information System (GIS) • All 24 Districts Enabled
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-md border border-slate-700 transition-colors cursor-pointer"
          >
            Close Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default JharkhandDistrictMapModal;
