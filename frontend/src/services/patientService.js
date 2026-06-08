import api from './api';

export const getPatients = async () => {
  const response = await api.get('/patients');
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await api.post('/patients', patientData);
  return response.data;
};

export const updatePatient = async (serialNo, patientData) => {
  const response = await api.put(`/patients/${serialNo}`, patientData);
  return response.data;
};

export const deletePatient = async (serialNo) => {
  const response = await api.delete(`/patients/${serialNo}`);
  return response.data;
};
