const http = require('http');

http.get('http://localhost:3000/api/v1/university/projects?universityCode=ALL', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const projects = json.data || json;
    console.log('Total projects:', projects.length);
    const deployed = projects.filter(p => p.status === 'Deployed' || p.isDeployed);
    console.log('Deployed projects:', deployed.length);
    deployed.forEach(p => {
      console.log(- Project:  | handoverDepartment:  | department:  | isDeployed: );
    });
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
