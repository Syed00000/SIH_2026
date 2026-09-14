const mongoose = require('mongoose');
const { CitizenChallenge } = require('./src/modules/citizen/infrastructure/models/citizen-challenge.schema.js');
const { UniversityFaculty } = require('./src/modules/university/infrastructure/models/faculty-team.schema.js');

mongoose.connect('mongodb://127.0.0.1:27017/sih_2026_db')
  .then(async () => {
    const challenges = await CitizenChallenge.find({'assignedFaculty': {$exists: true, $ne: null}}).lean();
    console.log("Challenges with assignedFaculty:", JSON.stringify(challenges.map(c => c.assignedFaculty), null, 2));

    const facs = await UniversityFaculty.find({}).lean();
    console.log("Faculty:", JSON.stringify(facs.map(f => ({ name: f.name, email: f.email })), null, 2));
    
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
