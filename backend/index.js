require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initializeDB, readSheet, writeSheet } = require('./excelDb');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the database on startup
initializeDB();

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const users = readSheet('Users');
    
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role, username: user.username });
});

// --- Patient Routes ---

// Get all patients
app.get('/api/patients', authenticateToken, (req, res) => {
    const patients = readSheet('Patients');
    res.json(patients);
});

// Create new patient
app.post('/api/patients', authenticateToken, (req, res) => {
    const patients = readSheet('Patients');
    const newPatient = req.body;
    
    // Auto-generate serialNo based on max existing or 1
    const maxSerial = patients.length > 0 ? Math.max(...patients.map(p => parseInt(p.serialNo) || 0)) : 0;
    newPatient.serialNo = maxSerial + 1;
    newPatient.createdAt = new Date().toISOString();
    newPatient.updatedAt = new Date().toISOString();
    
    // Make sure arrays are joined or stringified for Excel, since Excel cells can't hold arrays
    if (Array.isArray(newPatient.classifications)) {
        newPatient.classifications = newPatient.classifications.join(',');
    }

    patients.push(newPatient);
    writeSheet('Patients', patients);
    res.status(201).json(newPatient);
});

// Update patient
app.put('/api/patients/:serialNo', authenticateToken, (req, res) => {
    const patients = readSheet('Patients');
    const serialNo = parseInt(req.params.serialNo);
    const index = patients.findIndex(p => parseInt(p.serialNo) === serialNo);
    
    if (index === -1) return res.status(404).json({ message: 'Patient not found' });
    
    const updatedData = req.body;
    updatedData.updatedAt = new Date().toISOString();
    
    if (Array.isArray(updatedData.classifications)) {
        updatedData.classifications = updatedData.classifications.join(',');
    }

    patients[index] = { ...patients[index], ...updatedData, serialNo };
    writeSheet('Patients', patients);
    res.json(patients[index]);
});

// Delete patient
app.delete('/api/patients/:serialNo', authenticateToken, (req, res) => {
    let patients = readSheet('Patients');
    const serialNo = parseInt(req.params.serialNo);
    
    const initialLength = patients.length;
    patients = patients.filter(p => parseInt(p.serialNo) !== serialNo);
    
    if (patients.length === initialLength) {
        return res.status(404).json({ message: 'Patient not found' });
    }
    
    writeSheet('Patients', patients);
    res.json({ message: 'Patient deleted successfully' });
});

// --- Analytics Routes ---
app.get('/api/analytics/dashboard', authenticateToken, (req, res) => {
    const patients = readSheet('Patients');
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);

    const totalPatients = patients.length;
    
    const newPatientsToday = patients.filter(p => {
        return p.createdAt && p.createdAt.startsWith(today);
    }).length;
    
    const newPatientsThisMonth = patients.filter(p => {
        return p.createdAt && p.createdAt.startsWith(currentMonth);
    }).length;

    const activeTreatments = patients.filter(p => p.status === 'Active Treatment').length;
    const completedCases = patients.filter(p => p.status === 'Completed').length;

    // Calculate monthly data for the chart (last 6 months)
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthStr = d.toISOString().substring(0, 7); // YYYY-MM
        const monthName = d.toLocaleString('default', { month: 'short' });
        
        const count = patients.filter(p => p.createdAt && p.createdAt.startsWith(monthStr)).length;
        chartData.push({ name: monthName, Patients: count });
    }

    res.json({
        totalPatients,
        newPatientsToday,
        newPatientsThisMonth,
        activeTreatments,
        completedCases,
        chartData
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
