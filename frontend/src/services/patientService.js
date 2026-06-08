import { gasRequest } from './api';

export const getPatients = async () => {
  const result = await gasRequest('getPatients');
  return Array.isArray(result) ? result : [];
};

export const createPatient = async (patientData) => {
  return await gasRequest('addPatient', patientData);
};

export const updatePatient = async (serialNo, patientData) => {
  return await gasRequest('updatePatient', { serialNo, data: patientData });
};

export const deletePatient = async (serialNo) => {
  return await gasRequest('deletePatient', { serialNo });
};
