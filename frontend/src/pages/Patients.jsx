import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatients, deletePatient, updatePatient } from '../services/patientService';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Drawer, IconButton, Divider, Chip, CircularProgress, MenuItem, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PatientFormDialog from '../components/patients/PatientFormDialog';

const Patients = () => {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  // Sorting state
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'procedure'

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients
  });

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      if (drawerOpen) setDrawerOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ serialNo, data }) => updatePatient(serialNo, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    }
  });

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (e, serialNo) => {
    e.stopPropagation(); // prevent row click
    setPatientToDelete(serialNo);
    setDeleteDialogOpen(true);
  };

  const handleCompleteClick = (e, row) => {
    e.stopPropagation();
    updateMutation.mutate({ serialNo: row.serialNo, data: { ...row, status: 'Completed' } });
  };

  const handleDeleteConfirm = () => {
    if (patientToDelete !== null) {
      deleteMutation.mutate(patientToDelete);
    }
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'Active Treatment': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'primary';
    }
  };

  const sortedPatients = useMemo(() => {
    if (!patients) return [];
    let sorted = [...patients];
    
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === 'procedure') {
      sorted.sort((a, b) => (a.procedureDone || '').localeCompare(b.procedureDone || ''));
    }
    return sorted;
  }, [patients, sortBy]);

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">Error loading patients</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Patient Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="procedure">Procedure (A-Z)</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
            New Patient
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell><strong>Serial No</strong></TableCell>
              <TableCell><strong>OPD No</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Procedure</strong></TableCell>
              <TableCell><strong>Registration Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No patients found</TableCell>
              </TableRow>
            ) : (
              sortedPatients.map((row) => (
                <TableRow 
                  key={row.serialNo} 
                  hover 
                  onClick={() => handleRowClick(row)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{row.serialNo}</TableCell>
                  <TableCell>{row.opdNo}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.procedureDone || '-'}</TableCell>
                  <TableCell>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Chip label={row.status || 'Unknown'} color={getStatusColor(row.status)} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    {row.status !== 'Completed' && (
                      <IconButton color="success" onClick={(e) => handleCompleteClick(e, row)} title="Mark as Completed">
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                    <IconButton color="error" onClick={(e) => handleDeleteClick(e, row.serialNo)} title="Delete Patient">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Patient Detail Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: { xs: 300, sm: 400, md: 500 }, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Patient Details</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {selectedPatient && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Basic Information</Typography>
              <Typography variant="body1"><strong>Name:</strong> {selectedPatient.name}</Typography>
              <Typography variant="body1"><strong>Age / Gender:</strong> {selectedPatient.age} / {selectedPatient.gender}</Typography>
              <Typography variant="body1"><strong>Phone:</strong> {selectedPatient.phone}</Typography>
              <Typography variant="body1"><strong>OPD No:</strong> {selectedPatient.opdNo}</Typography>
              <Typography variant="body1"><strong>Ortho No:</strong> {selectedPatient.orthoNo}</Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" color="text.secondary">Clinical Information</Typography>
              <Typography variant="body1"><strong>Status:</strong> <Chip label={selectedPatient.status} color={getStatusColor(selectedPatient.status)} size="small" /></Typography>
              <Typography variant="body1"><strong>Diagnosis:</strong> {selectedPatient.diagnosis}</Typography>
              <Typography variant="body1"><strong>Treatment Plan:</strong> {selectedPatient.treatmentPlan}</Typography>
              <Typography variant="body1"><strong>Procedure Done:</strong> {selectedPatient.procedureDone}</Typography>
              <Typography variant="body1"><strong>Classifications:</strong> {selectedPatient.classifications}</Typography>
              <Typography variant="body1"><strong>Notes:</strong> {selectedPatient.notes}</Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this patient? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <PatientFormDialog open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  );
};

export default Patients;
