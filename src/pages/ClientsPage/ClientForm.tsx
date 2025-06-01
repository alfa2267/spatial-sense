import React from 'react';
import { Client } from '../../types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Client | null;
  loading?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = React.useState<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>(
    initialData || {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'active',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'active',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {initialData ? 'Edit Client' : 'Add New Client'}
          </Typography>
          <IconButton onClick={onClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Basic Information
              </Typography>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                margin="normal"
                disabled={loading}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    status: e.target.value as 'active' | 'inactive' | 'pending'
                  }))}
                  label="Status"
                  disabled={loading}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Address
              </Typography>
              <TextField
                fullWidth
                label="Street Address"
                name="address.street"
                value={formData.address?.street || ''}
                onChange={handleChange}
                margin="normal"
                disabled={loading}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="address.city"
                    value={formData.address?.city || ''}
                    onChange={handleChange}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    name="address.state"
                    value={formData.address?.state || ''}
                    onChange={handleChange}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    name="address.postalCode"
                    value={formData.address?.postalCode || ''}
                    onChange={handleChange}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="address.country"
                    value={formData.address?.country || ''}
                    onChange={handleChange}
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading || !formData.name || !formData.email}
          >
            {loading ? 'Saving...' : 'Save Client'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
