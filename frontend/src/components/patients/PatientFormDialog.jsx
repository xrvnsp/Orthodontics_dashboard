import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, Typography, Divider, Box } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatient } from '../../services/patientService';

const CLASSIFICATIONS = ['FAS', 'FAC', 'FAI', 'RAC', 'RAI', 'RAS'];
const STATUSES = ['New Case', 'Active Treatment', 'Retention', 'Completed', 'Cancelled'];
const GENDERS = ['Male', 'Female', 'Other'];

const PatientFormDialog = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  
  const initialFormState = {
    name: '', age: '', gender: '', phone: '', address: '', referredBy: '',
    opdNo: '', orthoNo: '', classifications: [], diagnosis: '', treatmentPlan: '',
    procedureDone: '', notes: '', status: 'New Case'
  };

  const [formData, setFormData] = useState(initialFormState);

  React.useEffect(() => {
    if (open) {
      setFormData(initialFormState);
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      onClose();
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClassificationChange = (event) => {
    const { target: { value } } = event;
    setFormData({ ...formData, classifications: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { overflow: 'hidden' } }}>
      <Box sx={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)', px: 3, py: 2 }}>
        <DialogTitle sx={{ p: 0, fontWeight: 800, color: '#1e293b', fontSize: '1.5rem' }}>✨ New Patient Registration</DialogTitle>
      </Box>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4 }}>
          
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
            Personal Details
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ minWidth: 150 }}>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select labelId="gender-label" name="gender" value={formData.gender} onChange={handleChange} label="Gender">
                  {GENDERS.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} /></Grid>
          </Grid>

          <Divider sx={{ mb: 4, opacity: 0.5 }} />

          <Typography variant="subtitle2" sx={{ mb: 2, color: 'secondary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', mr: 1 }} />
            Clinical Information
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="OPD Number" name="opdNo" value={formData.opdNo} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Ortho Number" name="orthoNo" value={formData.orthoNo} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ minWidth: 150 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select labelId="status-label" name="status" value={formData.status} onChange={handleChange} label="Status">
                  {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ minWidth: 150 }}>
                <InputLabel id="class-label">Classifications</InputLabel>
                <Select
                  labelId="class-label"
                  multiple
                  value={formData.classifications}
                  onChange={handleClassificationChange}
                  input={<OutlinedInput label="Classifications" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {CLASSIFICATIONS.map((c) => (
                    <MenuItem key={c} value={c}>
                      <Checkbox checked={formData.classifications.indexOf(c) > -1} />
                      <ListItemText primary={c} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Referred By" name="referredBy" value={formData.referredBy} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} multiline rows={2} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Treatment Plan" name="treatmentPlan" value={formData.treatmentPlan} onChange={handleChange} multiline rows={3} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Procedure Done" name="procedureDone" value={formData.procedureDone} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Notes" name="notes" value={formData.notes} onChange={handleChange} multiline rows={3} /></Grid>
          </Grid>

        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, pt: 0 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '12px' }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending} sx={{ borderRadius: '12px', px: 4 }}>
            {mutation.isPending ? 'Saving...' : 'Save Patient'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PatientFormDialog;
