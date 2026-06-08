const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.xlsx');

const initializeDB = async () => {
    if (!fs.existsSync(dbPath)) {
        const wb = xlsx.utils.book_new();
        
        // Initialize Users Sheet
        const initialAdminPassword = await bcrypt.hash('admin123', 10);
        const usersData = [
            { id: 1, username: 'admin', password: initialAdminPassword, role: 'Admin' }
        ];
        const usersSheet = xlsx.utils.json_to_sheet(usersData);
        xlsx.utils.book_append_sheet(wb, usersSheet, 'Users');

        // Initialize Patients Sheet
        const patientsData = [];
        const patientsSheet = xlsx.utils.json_to_sheet(patientsData);
        xlsx.utils.book_append_sheet(wb, patientsSheet, 'Patients');

        xlsx.writeFile(wb, dbPath);
        console.log('Database initialized at', dbPath);
    }
};

const readSheet = (sheetName) => {
    if (!fs.existsSync(dbPath)) return [];
    const wb = xlsx.readFile(dbPath);
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return [];
    return xlsx.utils.sheet_to_json(sheet);
};

const writeSheet = (sheetName, data) => {
    let wb;
    if (fs.existsSync(dbPath)) {
        wb = xlsx.readFile(dbPath);
    } else {
        wb = xlsx.utils.book_new();
    }
    
    const newSheet = xlsx.utils.json_to_sheet(data);
    wb.Sheets[sheetName] = newSheet;
    
    xlsx.writeFile(wb, dbPath);
};

module.exports = {
    initializeDB,
    readSheet,
    writeSheet
};
