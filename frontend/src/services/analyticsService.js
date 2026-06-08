import { gasRequest } from './api';

export const getDashboardData = async () => {
  const patients = await gasRequest('getPatients');
  
  if (!Array.isArray(patients)) return {
    totalPatients: 0,
    activeTreatments: 0,
    completed: 0,
    newPatientsThisMonth: 0,
    monthlyRegistrations: []
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const totalPatients = patients.length;
  const activeTreatments = patients.filter(p => p.status === 'Active Treatment').length;
  const completed = patients.filter(p => p.status === 'Completed').length;
  
  const newPatientsThisMonth = patients.filter(p => {
    if(!p.createdAt) return false;
    const d = new Date(p.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const monthlyMap = {};
  patients.forEach(p => {
    if(!p.createdAt) return;
    const d = new Date(p.createdAt);
    const month = d.toLocaleString('default', { month: 'short' });
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  const monthlyRegistrations = Object.keys(monthlyMap).map(k => ({
    name: k,
    Patients: monthlyMap[k]
  }));

  return {
    totalPatients,
    activeTreatments,
    completed,
    newPatientsThisMonth,
    monthlyRegistrations
  };
};
