import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../services/analyticsService';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const KPICard = ({ title, value, icon, color }) => (
  <Paper elevation={2} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box>
      <Typography color="text.secondary" variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color }}>
        {value}
      </Typography>
    </Box>
    <Box sx={{ bgcolor: `${color}15`, p: 1.5, borderRadius: '50%', display: 'flex' }}>
      {icon}
    </Box>
  </Paper>
);

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: getDashboardData
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">Error loading dashboard data</Typography>;

  const chartData = data?.monthlyRegistrations || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <KPICard 
            title="Total Patients" 
            value={data?.totalPatients || 0} 
            icon={<PeopleIcon sx={{ color: '#1976d2' }} />} 
            color="#1976d2" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <KPICard 
            title="New This Month" 
            value={data?.newPatientsThisMonth || 0} 
            icon={<CalendarMonthIcon sx={{ color: '#9c27b0' }} />} 
            color="#9c27b0" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <KPICard 
            title="Active Treatments" 
            value={data?.activeTreatments || 0} 
            icon={<LocalHospitalIcon sx={{ color: '#ed6c02' }} />} 
            color="#ed6c02" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <KPICard 
            title="Completed Cases" 
            value={data?.completed || 0} 
            icon={<CheckCircleIcon sx={{ color: '#0288d1' }} />} 
            color="#0288d1" 
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Patient Registrations
            </Typography>
            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="Patients" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
