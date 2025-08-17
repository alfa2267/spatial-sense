import { useState, useEffect } from 'react';
import { 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  IconButton,
  Chip,
  Avatar,
  FormControlLabel,
  Switch,
  TextFieldProps,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Close as CloseIcon } from '@mui/icons-material';
import { isBefore, isValid } from 'date-fns';
import { 
  TimelineEvent, 
  TeamMember,
  TimelineStatus,
  TimelinePriority,
  TimelineProject
} from '../../types/domains/timeline.types';

// Type guard for TimelineStatus
function isTimelineStatus(status: any): status is TimelineStatus {
  return ['planned', 'in-progress', 'completed', 'delayed', 'cancelled'].includes(status);
}

// Type guard for TimelinePriority
function isTimelinePriority(priority: any): priority is TimelinePriority {
  return ['low', 'medium', 'high', 'critical'].includes(priority);
}

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: Partial<TimelineEvent>) => void;
  projects: TimelineProject[];
  teamMembers: TeamMember[];
  initialData?: Partial<TimelineEvent>;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  projects,
  teamMembers,
  initialData = {},
}) => {
  // Define the form data type with consistent field names
  interface FormData {
    title: string;
    description: string;
    status: TimelineStatus;
    priority: TimelinePriority;
    startDate: Date | null;
    endDate: Date | null;
    projectId: string;
    assignee: string; // This is a string ID representing the assignee
    isAllDay: boolean;
    color?: string;
  }

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: 'planned' as TimelineStatus,
    priority: 'medium' as TimelinePriority,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    projectId: '',
    assignee: '',
    isAllDay: false,
    color: '#1976d2'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      // Ensure status and priority are valid TimelineStatus and TimelinePriority values
      const defaultStatus: TimelineStatus = 'planned';
      const defaultPriority: TimelinePriority = 'medium';
      
      // Safely extract the project ID
      let projectId = '';
      if (initialData?.project) {
        if (typeof initialData.project === 'string') {
          projectId = initialData.project;
        } else if (typeof initialData.project === 'object' && 'id' in initialData.project) {
          projectId = (initialData.project as { id: string }).id;
        }
      }
      
      // Safely handle the assignee
      let assignee = '';
      if (initialData?.assignee) {
        if (typeof initialData.assignee === 'string') {
          assignee = initialData.assignee;
        } else if (typeof initialData.assignee === 'object' && 'id' in initialData.assignee) {
          assignee = (initialData.assignee as { id: string }).id;
        }
      }
      
      setFormData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status && isTimelineStatus(initialData.status) 
          ? initialData.status 
          : defaultStatus,
        priority: initialData?.priority && isTimelinePriority(initialData.priority)
          ? initialData.priority
          : defaultPriority,
        startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
        endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(Date.now() + 60 * 60 * 1000),
        projectId,
        assignee,
        isAllDay: initialData?.isAllDay ?? false,
        color: initialData?.color || '#1976d2'
      });
      setErrors({});
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate && isBefore(formData.endDate, formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate() && formData.startDate && formData.endDate && formData.projectId) {
      const eventData: Partial<TimelineEvent> = {
        ...formData,
        startDate: formData.startDate,
        endDate: formData.endDate,
        project: formData.projectId, // Just use the project ID as a string
        assignee: formData.assignee,
        status: formData.status,
        priority: formData.priority,
        isAllDay: formData.isAllDay
      };
      onSubmit(eventData);
      onClose();
    }
  };

  const handleChange = <K extends keyof FormData>(
    field: K, 
    value: FormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
    if (date && isValid(date)) {
      handleChange(field, date);
    }
  };

  const handleTimeChange = (field: 'startDate' | 'endDate', time: Date | null) => {
    if (!time || !isValid(time)) return;
    const currentDate = formData[field] ? new Date(formData[field] as Date) : new Date();
    currentDate.setHours(time.getHours(), time.getMinutes());
    handleChange(field, currentDate);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="event-form-dialog-title"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="event-form-dialog-title">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div">
              {initialData?.id ? 'Edit Event' : 'Create New Event'}
            </Typography>
            <IconButton onClick={onClose} size="small" aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 2 }}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                margin="normal"
                required
                error={!!errors.title}
                helperText={errors.title}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                margin="normal"
                multiline
                rows={4}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ display: 'flex', gap: 2, mt: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <DatePicker
                      label="Start Date"
                      value={formData.startDate}
                      onChange={(date: Date | null) => handleDateChange('startDate', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal' as const,
                          required: true,
                          error: !!errors.startDate,
                          helperText: errors.startDate
                        } as TextFieldProps
                      }}
                    />
                  </Box>
                  {!formData.isAllDay && (
                    <Box sx={{ flex: 1 }}>
                      <TimePicker
                        label="Start Time"
                        value={formData.startDate}
                        onChange={(time: Date | null) => handleTimeChange('startDate', time)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: 'normal' as const
                          } as TextFieldProps
                        }}
                      />
                    </Box>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <DatePicker
                      label="End Date"
                      value={formData.endDate}
                      onChange={(date: Date | null) => handleDateChange('endDate', date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal' as const,
                          required: true,
                          error: !!errors.endDate,
                          helperText: errors.endDate
                        } as TextFieldProps
                      }}
                    />
                  </Box>
                  {!formData.isAllDay && (
                    <Box sx={{ flex: 1 }}>
                      <TimePicker
                        label="End Time"
                        value={formData.endDate}
                        onChange={(time: Date | null) => handleTimeChange('endDate', time)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: 'normal' as const
                          } as TextFieldProps
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </LocalizationProvider>
            </Box>
            <Box sx={{ flex: 1, minWidth: '300px' }}>
              <FormControl fullWidth margin="normal" error={!!errors.projectId}>
                <InputLabel id="project-label">Project</InputLabel>
                <Select
                  labelId="project-label"
                  name="project"
                  value={formData.projectId}
                  label="Project"
                  onChange={(e) => {
                    const projectId = e.target.value as string;
                    handleChange('projectId', projectId);
                    // Update color when project changes
                    const selectedProject = projects.find((p: TimelineProject) => p.id === projectId);
                    if (selectedProject?.color) {
                      handleChange('color', selectedProject.color);
                    }
                  }}
                  required
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      <Box display="flex" alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: project.color || '#1976d2',
                            mr: 1,
                          }}
                        />
                        {project.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.projectId && (
                  <FormHelperText>{errors.projectId}</FormHelperText>
                )}
              </FormControl>
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="assignee-label">Assignee</InputLabel>
                <Select
                  labelId="assignee-label"
                  name="assignee"
                  value={formData.assignee}
                  label="Assignee"
                  onChange={(e) => handleChange('assignee', e.target.value as string)}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {teamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      <Box display="flex" alignItems="center">
                        {member.avatar ? (
                          <Avatar 
                            src={member.avatar} 
                            alt={member.name}
                            sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}
                          />
                        ) : (
                          <Avatar 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              mr: 1, 
                              bgcolor: 'primary.main',
                              fontSize: '0.75rem',
                            }}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </Avatar>
                        )}
                        {member.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleChange('status', e.target.value as any)}
                >
                  <MenuItem value="planned">
                    <Chip 
                      label="Planned" 
                      size="small" 
                      color="default"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </MenuItem>
                  <MenuItem value="in-progress">
                    <Chip 
                      label="In Progress" 
                      size="small" 
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </MenuItem>
                  <MenuItem value="completed">
                    <Chip 
                      label="Completed" 
                      size="small" 
                      color="success"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </MenuItem>
                  <MenuItem value="delayed">
                    <Chip 
                      label="Delayed" 
                      size="small" 
                      color="warning"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </MenuItem>
                  <MenuItem value="cancelled">
                    <Chip 
                      label="Cancelled" 
                      size="small" 
                      color="error"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => handleChange('priority', e.target.value as any)}
                >
                  <MenuItem value="low">
                    <Chip 
                      label="Low" 
                      size="small" 
                      color="success"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </MenuItem>
                  <MenuItem value="medium">
                    <Chip 
                      label="Medium" 
                      size="small" 
                      color="warning"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </MenuItem>
                  <MenuItem value="high">
                    <Chip 
                      label="High" 
                      size="small" 
                      color="error"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </MenuItem>
                  <MenuItem value="critical">
                    <Chip 
                      label="Critical" 
                      size="small" 
                      color="error"
                      sx={{ 
                        mr: 1,
                        fontWeight: 'bold',
                        '& .MuiChip-label': {
                          px: 1,
                        },
                      }}
                    />
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAllDay}
                    onChange={(e) => handleChange('isAllDay', e.target.checked)}
                    name="isAllDay"
                    color="primary"
                  />
                }
                label="All day event"
                sx={{ mt: 1, display: 'block' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData?.id ? 'Update' : 'Create'} Event
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventFormModal;