import http from 'http';

http.get('http://localhost:3000/api/v1/university/projects?universityCode=ALL', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const projects = json.data || json;
    const deployed = projects.filter(p => p.status === 'Deployed' || p.isDeployed);
    deployed.forEach(p => console.log(p.title + ' | handoverDepartment: ' + p.handoverDepartment));
  });
});
