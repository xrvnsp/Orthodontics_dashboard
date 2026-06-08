import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatient } from '../../services/patientService';

const CLASSIFICATIONS = ['FAS', 'FAC', 'FAI', 'RAC', 'RAI', 'RAS'];
const STATUSES = ['New Case', 'Active Treatment', 'Retention', 'Completed', 'Cancelled'];
const GENDERS = ['Male', 'Female', 'Other'];

const PatientFormDialog = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', phone: '', address: '', referredBy: '',
    opdNo: '', orthoNo: '', classifications: [], diagnosis: '', treatmentPlan: '',
    procedureDone: '', notes: '', status: 'New Case'
  });

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Patient</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
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
            <Grid item xs={12}><TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} /></Grid>

            <Grid item xs={12}><TextField fullWidth label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} multiline rows={2} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Treatment Plan" name="treatmentPlan" value={formData.treatmentPlan} onChange={handleChange} multiline rows={2} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Procedure Done" name="procedureDone" value={formData.procedureDone} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Notes" name="notes" value={formData.notes} onChange={handleChange} multiline rows={2} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save Patient'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PatientFormDialog;
