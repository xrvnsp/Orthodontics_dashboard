const API_URL = 'https://script.google.com/macros/s/AKfycbyDqA8ozjni9a6lxWrDDBXu1BlQxn65TpYI5vyRrZwmE8KXBZXXfUSpecVmgIUe6j5W/exec';

export const gasRequest = async (action, data = {}) => {
  try {
    const response = await fetch(`${API_URL}?action=${action}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Google Apps Script API Error:', error);
    throw error;
  }
};
