const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const ExcelJS = require('exceljs');
const fs = require('fs');

// Middleware to parse POST request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const culturalExcelPath = 'Cultural_Registrations.xlsx';
const volunteerExcelPath = 'Volunteer_Registrations.xlsx';

// Initialize Excel file if it doesn't exist
const initializeExcelFile = (filePath, headers) => {
  try {
    if (!fs.existsSync(filePath)) {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Registrations');
      sheet.addRow(headers); // Add header row
      workbook.xlsx.writeFile(filePath).then(() => {
        console.log(`${filePath} initialized successfully.`);
      }).catch((err) => {
        console.error(`Failed to create ${filePath}:`, err);
      });
    }
  } catch (error) {
    console.error(`Error initializing file ${filePath}:`, error);
  }
};

// Initialize Excel files for cultural and volunteer registrations
initializeExcelFile(culturalExcelPath, ['Performance Name', 'Performance Type', 'Team Size', 'Team Members']);
initializeExcelFile(volunteerExcelPath, ['Volunteer Name', 'Department', 'Section', 'Year']);

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
app.post('/cultural-registration', async (req, res) => {
  const { 'performance-name': performanceName, 'performance-type': performanceType, 'team-size': teamSize, ...teamMembers } = req.body;

  const members = [];
  for (let i = 1; i <= teamSize; i++) {
    members.push(teamMembers[`team-member-${i}`]);
  }

  try {
    const workbook = new ExcelJS.Workbook();

    // Validate file existence and content
    if (fs.existsSync(culturalExcelPath)) {
      const stats = fs.statSync(culturalExcelPath);
      if (stats.size > 0) {
        await workbook.xlsx.readFile(culturalExcelPath);
      } else {
        console.warn(`${culturalExcelPath} is empty. Initializing a new workbook.`);
        initializeExcelFile(culturalExcelPath, ['Performance Name', 'Performance Type', 'Team Size', 'Team Members']);
        await workbook.xlsx.readFile(culturalExcelPath);
      }
    } else {
      console.warn(`${culturalExcelPath} does not exist. Creating a new file.`);
      initializeExcelFile(culturalExcelPath, ['Performance Name', 'Performance Type', 'Team Size', 'Team Members']);
      await workbook.xlsx.readFile(culturalExcelPath);
    }

    // Ensure the sheet exists
    let sheet = workbook.getWorksheet('Registrations');
    if (!sheet) {
      console.warn(`Worksheet 'Registrations' not found. Creating a new one.`);
      sheet = workbook.addWorksheet('Registrations');
      sheet.addRow(['Performance Name', 'Performance Type', 'Team Size', 'Team Members']); // Add headers
    }

    // Add the new row with registration data
    sheet.addRow([performanceName, performanceType, teamSize, members.join(', ')]);
    
    // Write the changes to the file
    await workbook.xlsx.writeFile(culturalExcelPath);

    res.send('Cultural Performance Registration Submitted!');
  } catch (error) {
    console.error('Error saving cultural registration:', error);
    res.status(500).send('Error saving cultural registration. Please try again.');
  }
});

// Handle POST request for Volunteer Registration
app.post('/volunteer-registration', async (req, res) => {
  const { 'volunteer-name': volunteerName, 'volunteer-dept': volunteerDept, 'volunteer-section': volunteerSection, 'volunteer-year': volunteerYear } = req.body;

  try {
    const workbook = new ExcelJS.Workbook();
    
    // Check if file exists and read it
    if (fs.existsSync(volunteerExcelPath)) {
      const stats = fs.statSync(volunteerExcelPath);
      if (stats.size > 0) {
        await workbook.xlsx.readFile(volunteerExcelPath);
      } else {
        console.warn(`${volunteerExcelPath} is empty. Initializing a new workbook.`);
        initializeExcelFile(volunteerExcelPath, ['Volunteer Name', 'Department', 'Section', 'Year']);
        await workbook.xlsx.readFile(volunteerExcelPath);
      }
    } else {
      console.warn(`${volunteerExcelPath} does not exist. Creating a new file.`);
      initializeExcelFile(volunteerExcelPath, ['Volunteer Name', 'Department', 'Section', 'Year']);
      await workbook.xlsx.readFile(volunteerExcelPath);
    }

    // Ensure the sheet exists
    let sheet = workbook.getWorksheet('Registrations');
    if (!sheet) {
      console.warn(`Worksheet 'Registrations' not found. Creating a new one.`);
      sheet = workbook.addWorksheet('Registrations');
      sheet.addRow(['Volunteer Name', 'Department', 'Section', 'Year']); // Add headers
    }

    // Add the new row with registration data
    sheet.addRow([volunteerName, volunteerDept, volunteerSection, volunteerYear]);
    
    // Write the changes to the file
    await workbook.xlsx.writeFile(volunteerExcelPath);

    res.send('Volunteer Registration Submitted!');
  } catch (error) {
    console.error('Error saving volunteer registration:', error);
    res.status(500).send('Error saving volunteer registration');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
