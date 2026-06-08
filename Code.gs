const USERS_SHEET = 'Users';
const PATIENTS_SHEET = 'Patients';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss.getSheetByName(USERS_SHEET)) {
    const sheet = ss.insertSheet(USERS_SHEET);
    sheet.appendRow(['id', 'username', 'password', 'role']);
    // admin / admin123 (Base64 encoded for simple obfuscation, real prod uses bcrypt)
    sheet.appendRow(['1', 'admin', Utilities.base64Encode('admin123'), 'Admin']); 
  }
  
  if (!ss.getSheetByName(PATIENTS_SHEET)) {
    const sheet = ss.insertSheet(PATIENTS_SHEET);
    sheet.appendRow(['serialNo', 'opdNo', 'orthoNo', 'name', 'age', 'gender', 'phone', 'address', 'referredBy', 'diagnosis', 'treatmentPlan', 'procedureDone', 'classifications', 'status', 'notes', 'createdAt']);
  }
}

function doPost(e) {
  // CORS setup for frontend access
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const action = e.parameter.action;
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'login') {
      const sheet = ss.getSheetByName(USERS_SHEET);
      const rows = sheet.getDataRange().getValues();
      const headers = rows.shift();
      
      const user = rows.find(row => {
        const u = row[headers.indexOf('username')];
        const p = Utilities.base64Decode(row[headers.indexOf('password')]);
        const pStr = Utilities.newBlob(p).getDataAsString();
        return u === data.username && pStr === data.password;
      });

      if (user) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          token: Utilities.base64Encode(data.username + '-' + Date.now()), // Dummy token
          user: { username: data.username, role: user[headers.indexOf('role')] }
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'Invalid credentials' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === 'getPatients') {
      const sheet = ss.getSheetByName(PATIENTS_SHEET);
      if(!sheet) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
      
      const rows = sheet.getDataRange().getValues();
      if(rows.length <= 1) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
      
      const keys = rows.shift();
      const patients = rows.map(row => {
        let obj = {};
        keys.forEach((key, i) => obj[key] = row[i]);
        return obj;
      });
      return ContentService.createTextOutput(JSON.stringify(patients)).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'addPatient') {
      const sheet = ss.getSheetByName(PATIENTS_SHEET);
      const keys = sheet.getDataRange().getValues()[0];
      
      data.serialNo = 'PT-' + Date.now().toString().slice(-6);
      data.createdAt = new Date().toISOString();
      
      const newRow = keys.map(key => data[key] || '');
      sheet.appendRow(newRow);
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, patient: data }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'deletePatient') {
      const sheet = ss.getSheetByName(PATIENTS_SHEET);
      const rows = sheet.getDataRange().getValues();
      const headers = rows[0];
      const serialIndex = headers.indexOf('serialNo');
      
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][serialIndex] === data.serialNo) {
          sheet.deleteRow(i + 1); // +1 because array is 0-indexed and rows are 1-indexed
          return ContentService.createTextOutput(JSON.stringify({ success: true }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    if (action === 'updatePatient') {
      const sheet = ss.getSheetByName(PATIENTS_SHEET);
      const rows = sheet.getDataRange().getValues();
      const headers = rows[0];
      const serialIndex = headers.indexOf('serialNo');
      
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][serialIndex] === data.serialNo) {
          const newRow = headers.map(key => data.data[key] !== undefined ? data.data[key] : rows[i][headers.indexOf(key)]);
          sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
          return ContentService.createTextOutput(JSON.stringify({ success: true }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  // Respond to CORS preflight requests
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}
