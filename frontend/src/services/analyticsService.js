import api from './api';

export const getDashboardData = async () => {
  const response = await api.get('/analytics/dashboard');
  return response.data;
};
