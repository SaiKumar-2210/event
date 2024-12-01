const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
// Middleware to parse POST request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle GET requests to serve the registration form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  
  app.get('/timetable.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'timetable.html'));
  });
  
  app.get('/photobooth.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'photobooth.html'));
  });
  
  app.get('/registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'));
  });
  app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  app.get('/foodstalls.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'foodstalls.html'));
  });
  

// Handle POST request for Cultural Performance Registration
app.post('/cultural-registration', (req, res) => {
  const { 'performance-name': performanceName, 'performance-type': performanceType, 'team-size': teamSize, ...teamMembers } = req.body;
  console.log('Cultural Performance Registration:');
  console.log(`Performance Name: ${performanceName}`);
  console.log(`Performance Type: ${performanceType}`);
  console.log(`Team Size: ${teamSize}`);
  console.log('Team Members:');
  for (let i = 1; i <= teamSize; i++) {
    console.log(`Team Member ${i}: ${teamMembers[`team-member-${i}`]}`);
  }

  res.send('Cultural Performance Registration Submitted!');
});

// Handle POST request for Volunteer Registration
app.post('/volunteer-registration', (req, res) => {
  const { 'volunteer-name': volunteerName, 'volunteer-dept': volunteerDept, 'volunteer-section': volunteerSection, 'volunteer-year': volunteerYear } = req.body;
  console.log('Volunteer Registration:');
  console.log(`Full Name: ${volunteerName}`);
  console.log(`Department: ${volunteerDept}`);
  console.log(`Section: ${volunteerSection}`);
  console.log(`Year: ${volunteerYear}`);

  res.send('Volunteer Registration Submitted!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
