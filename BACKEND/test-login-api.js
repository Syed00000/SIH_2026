const accounts = [
  { email: 'admin@dtejharkhand.gov.in', password: 'Admin@123456', desc: 'Admin standard pass' },
  { email: 'admin@dtejharkhand.gov.in', password: '123456789', desc: 'Admin fallback pass' },
  { email: 'shadanakram82@gmail.com', password: '123456789', desc: 'Citizen Shadan pass' },
  { email: 'citizen@joharsetu.gov.in', password: 'Citizen@123456', desc: 'Citizen JoharSetu pass' },
  { email: 'citizen@joharsetu.gov.in', password: '123456789', desc: 'Citizen fallback pass' }
];

const runTests = async () => {
  for (const acc of accounts) {
    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: acc.email, password: acc.password })
      });
      const data = await res.json();
      console.log(`[${acc.desc}] Status: ${res.status} | Success: ${data.success} | Role: ${data?.data?.user?.role || 'N/A'}`);
    } catch (err) {
      console.error(`[${acc.desc}] Request Failed:`, err.message);
    }
  }
};

runTests();
