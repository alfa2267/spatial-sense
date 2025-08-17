import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DeviceFormData {
  name: string;
  quantity: number;
  unitCost: number;
  description: string;
  category: string;
  manufacturer: string;
  model: string;
  specifications: string;
}

interface StrategyDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeviceFormData) => void;
  initialData?: Partial<DeviceFormData>;
}

export const StrategyDeviceModal: React.FC<StrategyDeviceModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    quantity: 1,
    unitCost: 0,
    description: '',
    category: '',
    manufacturer: '',
    model: '',
    specifications: '',
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: name === 'quantity' || name === 'unitCost' 
        ? parseFloat(value as string) || 0 
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {initialData.name ? 'Edit Device' : 'Add New Device'}
            <IconButton edge="end" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Device Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Unit Cost (£)"
                name="unitCost"
                type="number"
                value={formData.unitCost}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ step: '0.01', min: 0 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                  label="Category"
                >
                  <MenuItem value="sensor">Sensor</MenuItem>
                  <MenuItem value="gateway">Gateway</MenuItem>
                  <MenuItem value="controller">Controller</MenuItem>
                  <MenuItem value="display">Display</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Specifications"
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
                placeholder="Enter technical specifications, requirements, or notes..."
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box mt={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Cost: £{(formData.quantity * formData.unitCost).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData.name ? 'Update' : 'Add'} Device
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StrategyDeviceModal;
