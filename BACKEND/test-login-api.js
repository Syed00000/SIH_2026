const testLogin = async () => {
  try {
    console.log('Testing login for shadanakram82@gmail.com...');
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'shadanakram82@gmail.com',
        password: '123456789'
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
};

testLogin();
