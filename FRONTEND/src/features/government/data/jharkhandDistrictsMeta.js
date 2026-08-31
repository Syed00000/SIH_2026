// Geographic center coordinates for 24 Jharkhand districts
export const JHARKHAND_DISTRICTS_META = [
  { id: 'ranchi', name: 'Ranchi', headquarters: 'Ranchi', lat: 23.3441, lng: 85.3096 },
  { id: 'dhanbad', name: 'Dhanbad', headquarters: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
  { id: 'east_singhbhum', name: 'East Singhbhum', headquarters: 'Jamshedpur', lat: 22.8046, lng: 86.2029 },
  { id: 'bokaro', name: 'Bokaro', headquarters: 'Bokaro Steel City', lat: 23.6693, lng: 86.1511 },
  { id: 'hazaribagh', name: 'Hazaribagh', headquarters: 'Hazaribagh', lat: 23.9937, lng: 85.3623 },
  { id: 'deoghar', name: 'Deoghar', headquarters: 'Deoghar', lat: 24.4826, lng: 86.7001 },
  { id: 'dumka', name: 'Dumka', headquarters: 'Dumka', lat: 24.2677, lng: 87.2535 },
  { id: 'palamu', name: 'Palamu', headquarters: 'Medininagar', lat: 24.0416, lng: 84.0725 },
  { id: 'west_singhbhum', name: 'West Singhbhum', headquarters: 'Chaibasa', lat: 22.5526, lng: 85.8081 },
  { id: 'giridih', name: 'Giridih', headquarters: 'Giridih', lat: 24.1856, lng: 86.3093 },
  { id: 'ramgarh', name: 'Ramgarh', headquarters: 'Ramgarh', lat: 23.6307, lng: 85.5186 },
  { id: 'seraikela', name: 'Seraikela Kharsawan', headquarters: 'Seraikela', lat: 22.7001, lng: 85.9287 },
  { id: 'khunti', name: 'Khunti', headquarters: 'Khunti', lat: 23.0729, lng: 85.2789 },
  { id: 'gumla', name: 'Gumla', headquarters: 'Gumla', lat: 23.0428, lng: 84.5414 },
  { id: 'simdega', name: 'Simdega', headquarters: 'Simdega', lat: 22.6167, lng: 84.5000 },
  { id: 'lohardaga', name: 'Lohardaga', headquarters: 'Lohardaga', lat: 23.4317, lng: 84.6811 },
  { id: 'latehar', name: 'Latehar', headquarters: 'Latehar', lat: 23.7431, lng: 84.4984 },
  { id: 'garhwa', name: 'Garhwa', headquarters: 'Garhwa', lat: 24.1611, lng: 83.8078 },
  { id: 'chatra', name: 'Chatra', headquarters: 'Chatra', lat: 24.2083, lng: 84.8717 },
  { id: 'koderma', name: 'Koderma', headquarters: 'Koderma', lat: 24.4697, lng: 85.5947 },
  { id: 'jamtara', name: 'Jamtara', headquarters: 'Jamtara', lat: 23.9622, lng: 86.8017 },
  { id: 'godda', name: 'Godda', headquarters: 'Godda', lat: 24.8267, lng: 87.2144 },
  { id: 'sahebganj', name: 'Sahebganj', headquarters: 'Sahebganj', lat: 25.2425, lng: 87.6436 },
  { id: 'pakur', name: 'Pakur', headquarters: 'Pakur', lat: 24.6333, lng: 87.8500 }
];

export const JHARKHAND_DISTRICTS_LIST = JHARKHAND_DISTRICTS_META.map((d) => d.name);

export const JHARKHAND_DISTRICTS_DICT = JHARKHAND_DISTRICTS_META.reduce((acc, d) => {
  acc[d.id] = {
    ...d,
    center: [d.lat, d.lng]
  };
  return acc;
}, {});

export default JHARKHAND_DISTRICTS_META;
