const BASE_URL = 'http://localhost:3000/api/v1';

const testAPI = async () => {
  console.log('--- API Integration Tests ---');
  try {
    // 1. Test Government Admin Login
    console.log('\nTesting Government Admin Login...');
    const govLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@dtejharkhand.gov.in', password: 'Admin@123456' })
    });
    const govLoginData = await govLoginRes.json();
    if (govLoginRes.ok && govLoginData.data?.accessToken) {
      console.log('✅ Government Admin Login successful!');
    } else {
      console.error('❌ Government Admin Login failed:', govLoginData);
    }

    // 2. Test University Admin Login
    console.log('\nTesting Ranchi University Admin Login...');
    const ruLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'registrar@ranchiuniversity.ac.in', password: 'Univ@123456' })
    });
    const ruLoginData = await ruLoginRes.json();
    if (ruLoginRes.ok && ruLoginData.data?.accessToken) {
      console.log('✅ Ranchi University Admin Login successful!');
    } else {
      console.error('❌ Ranchi University Admin Login failed:', ruLoginData);
    }

    // 3. Test University Projects API
    console.log('\nTesting Ranchi University Projects API...');
    const projectsRes = await fetch(`${BASE_URL}/university/projects?universityCode=RU001`);
    const projectsData = await projectsRes.json();
    if (projectsRes.ok && Array.isArray(projectsData.data || projectsData)) {
      const list = projectsData.data || projectsData;
      console.log(`✅ Ranchi University Projects retrieved successfully! Found ${list.length} projects.`);
      list.forEach((p) => {
        console.log(`   - [${p.projectId}] ${p.title} (${p.domain}) - Status: ${p.status}`);
      });
    } else {
      console.error('❌ Ranchi University Projects API failed:', projectsData);
    }

    // 4. Test Government Overview Stats API
    console.log('\nTesting Government Overview Stats API...');
    const statsRes = await fetch(`${BASE_URL}/government/overview/stats`);
    const statsData = await statsRes.json();
    if (statsRes.ok) {
      console.log('✅ Government Overview Stats retrieved successfully!', statsData.data || statsData);
    } else {
      console.error('❌ Government Overview Stats API failed:', statsData);
    }

  } catch (err) {
    console.error('❌ Connection or request failed:', err.message);
  }
};

testAPI();
