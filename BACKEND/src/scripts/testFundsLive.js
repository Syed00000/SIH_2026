async function testLiveEndpoint() {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/v1/government/funds');
    const data = await res.json();
    console.log('HTTP Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

testLiveEndpoint();
