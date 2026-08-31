async function testLogin() {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'binod@ru.ac.in',
        password: 'Faculty@123456'
      })
    });

    const data = await res.json();
    console.log('--- Test Login Status for binod@ru.ac.in:', res.status);
    console.log('Response User:', data.data?.user?.fullName, '| Role:', data.data?.user?.role);
    console.log('Has Access Token:', !!data.data?.accessToken);

    const res2 = await fetch('http://127.0.0.1:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'pardhan@ac.in',
        password: 'Faculty@123456'
      })
    });

    const data2 = await res2.json();
    console.log('\n--- Test Login Status for pardhan@ac.in:', res2.status);
    console.log('Response User:', data2.data?.user?.fullName, '| Role:', data2.data?.user?.role);
    console.log('Has Access Token:', !!data2.data?.accessToken);
  } catch (err) {
    console.error('Test error:', err);
  }
}

testLogin();
