import http from 'http';

const data = JSON.stringify({
  status: 'Approved',
  trlLevel: 'TRL-9',
  remarks: 'Test handover',
  department: 'water department',
  sendToDepartment: true
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/university/projects/landslide/government-prototype-status?universityCode=RU001',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', e => console.error('Error:', e));
req.write(data);
req.end();
