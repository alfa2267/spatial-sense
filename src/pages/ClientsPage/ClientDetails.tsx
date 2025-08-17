import React from 'react';
import { Client } from '../../types/domains/client.types';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Chip, 
  Divider, 
  Tabs, 
  Tab, 
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  NoteAdd as NoteAddIcon,
  Event as EventIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

interface StatusChipProps {
  statusvalue: 'active' | 'inactive' | 'lead';
}

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'statusvalue',
})<StatusChipProps>(({ theme, statusvalue }) => ({
  textTransform: 'capitalize',
  backgroundColor: statusvalue === 'active' 
    ? theme.palette.success.light 
    : statusvalue === 'lead' 
      ? theme.palette.warning.light 
      : theme.palette.error.light,
  color: theme.palette.getContrastText(
    statusvalue === 'active' 
      ? theme.palette.success.light 
      : statusvalue === 'lead' 
        ? theme.palette.warning.light 
        : theme.palette.error.light
  ),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface ClientDetailsProps {
  client: Client | null;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (note: string) => void;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({
  client,
  onEdit,
  onDelete,
  onAddNote,
}) => {
  const [tabValue, setTabValue] = React.useState(0);
  const [newNote, setNewNote] = React.useState('');

  if (!client) {
    return (
      <StyledPaper elevation={3}>
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Select a client to view details
          </Typography>
        </Box>
      </StyledPaper>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote('');
    }
  };

  return (
    <StyledPaper elevation={3}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ width: 64, height: 64, mr: 2, fontSize: '2rem' }}>
            {client.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h5" component="h2" mr={2}>
                {client.name}
              </Typography>
              <StatusChip 
                label={client.status} 
                size="small" 
                statusvalue={client.status}
              />
            </Box>
            <Typography variant="body2" color="textSecondary">
              {client.company || 'No company specified'}
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton onClick={onEdit} color="primary" sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="client tabs">
        <Tab label="Overview" />
        <Tab label="Notes" />
        <Tab label="Activity" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={client.email || 'Not provided'} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <PhoneIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="Phone" secondary={client.phone || 'Not provided'} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <BusinessIcon color="action" />
              </ListItemIcon>
              <ListItemText 
                primary="Company" 
                secondary={client.company || 'Not provided'} 
              />
            </ListItem>
            {client.address && (
              <>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Address" 
                    secondary={
                      typeof client.address === 'string' 
                        ? client.address || 'Not provided'
                        : `${client.address.street || ''}${client.address.city ? `, ${client.address.city}` : ''}${client.address.state ? `, ${client.address.state}` : ''}${client.address.postalCode ? `, ${client.address.postalCode}` : ''}${client.address.country ? `, ${client.address.country}` : ''}` || 'Not provided'
                    } 
                  />
                </ListItem>
              </>
            )}
          </List>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {client.notes || 'No additional information available.'}
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Add a Note
          </Typography>
          <Box display="flex" mb={3}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Add a note about this client..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              sx={{ mr: 2 }}
            />
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleAddNote}
              startIcon={<NoteAddIcon />}
              disabled={!newNote.trim()}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Note
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Recent Notes
          </Typography>
          <List>
            {/* Sample note - in a real app, this would come from the client data */}
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <PersonIcon color="action" />
              </ListItemIcon>
              <ListItemText
                primary="Initial consultation completed"
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      display="block"
                      mb={1}
                    >
                      John Doe - May 25, 2025
                    </Typography>
                    Discussed project requirements and timeline. Client is interested in a full property analysis.
                  </>
                }
              />
            </ListItem>
          </List>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List>
          {/* Sample activity - in a real app, this would come from the client data */}
          <ListItem>
            <ListItemIcon>
              <EventIcon color="action" />
            </ListItemIcon>
            <ListItemText
              primary="Client created"
              secondary="May 20, 2025"
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <EventIcon color="action" />
            </ListItemIcon>
            <ListItemText
              primary="Initial contact made"
              secondary="May 21, 2025"
            />
          </ListItem>
        </List>
      </TabPanel>
    </StyledPaper>
  );
};
